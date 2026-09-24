<?php

namespace App\Http\Controllers;

use App\Models\FinanceEntry;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends ResourceController
{
    protected string $model = Invoice::class;

    protected array $with = ['client:id,name,company,email,phone,gst_number,billing_address', 'project:id,name'];

    protected array $searchable = ['number', 'notes'];

    protected array $filterable = ['client_id', 'project_id'];

    protected string $orderBy = 'issue_date';

    protected string $label = 'Invoice';

    protected function applyFilters(Builder $query, Request $request): void
    {
        $status = $request->query('status');
        if ($status === 'overdue') {
            $query->whereIn('status', ['sent', 'partially_paid'])->whereDate('due_date', '<', today());
        } elseif ($status === 'unpaid') {
            $query->whereIn('status', ['sent', 'partially_paid']);
        } elseif ($status) {
            $query->where('status', $status);
        }
    }

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            // paid / partially_paid are driven by recorded payments.
            'status' => ['required', 'in:draft,sent,partially_paid,paid,cancelled'],
            'currency' => ['required', 'in:INR,USD'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:500'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'issue_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    protected function prepare(array $data, ?Model $record, Request $request): array
    {
        if (! $record) {
            $data['number'] = Invoice::nextNumber('INV');
        }

        return $data;
    }

    public function update(Request $request, $id)
    {
        $response = parent::update($request, $id);

        // Totals may have changed, so re-derive paid / partially paid.
        $invoice = Invoice::findOrFail($id);
        if ($invoice->status !== 'draft' && $invoice->status !== 'cancelled') {
            $invoice->syncPayments();
        }

        return $response->setData([
            'message' => 'Invoice updated successfully.',
            'data' => $this->find($id),
        ]);
    }

    public function show($id)
    {
        return $this->find($id)->load('payments');
    }

    /**
     * Record a payment against an invoice. Each payment also creates an
     * income finance entry so the Finances page stays in sync by itself.
     */
    public function addPayment(Request $request, $id)
    {
        $invoice = Invoice::with('client')->findOrFail($id);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01', 'max:'.max(0.01, $invoice->balance)],
            'paid_on' => ['required', 'date'],
            'method' => ['nullable', 'string', 'max:50'],
            'reference' => ['nullable', 'string', 'max:255'],
        ], [
            'amount.max' => 'Amount cannot be more than the outstanding balance ('.number_format($invoice->balance, 2).').',
        ]);

        DB::transaction(function () use ($invoice, $validated) {
            $entry = FinanceEntry::create([
                'type' => 'income',
                'category' => 'sale',
                'title' => 'Payment for '.$invoice->number,
                'party_name' => $invoice->client->company ?: $invoice->client->name,
                'amount' => $validated['amount'],
                'currency' => $invoice->currency,
                'period_start' => $validated['paid_on'],
                'notes' => trim(($validated['method'] ?? '').' '.($validated['reference'] ?? '')) ?: null,
            ]);

            $invoice->payments()->create($validated + ['finance_entry_id' => $entry->id]);

            if ($invoice->status === 'draft') {
                $invoice->status = 'sent';
            }
            $invoice->syncPayments();
        });

        return response()->json([
            'message' => 'Payment recorded.',
            'data' => $this->find($id)->load('payments'),
        ], 201);
    }

    public function deletePayment($paymentId)
    {
        $payment = Payment::findOrFail($paymentId);
        $invoice = $payment->invoice;

        DB::transaction(function () use ($payment, $invoice) {
            $entry = $payment->financeEntry;
            $payment->delete();
            if ($entry) {
                $entry->delete();
            }
            $invoice->syncPayments();
        });

        return response()->json([
            'message' => 'Payment removed.',
            'data' => $this->find($invoice->id)->load('payments'),
        ]);
    }
}
