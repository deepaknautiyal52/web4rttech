<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Quotation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class QuotationController extends ResourceController
{
    protected string $model = Quotation::class;

    protected array $with = ['client:id,name,company,email,phone,gst_number,billing_address', 'contact:id,name,company,email,phone'];

    protected array $searchable = ['number', 'title'];

    protected array $filterable = ['status', 'client_id', 'contact_id'];

    protected string $orderBy = 'issue_date';

    protected string $label = 'Quotation';

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'contact_id' => ['nullable', 'exists:contacts,id'],
            'client_id' => ['nullable', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:draft,sent,accepted,rejected'],
            'currency' => ['required', 'in:INR,USD'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:500'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'issue_date' => ['required', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    protected function prepare(array $data, ?Model $record, Request $request): array
    {
        if (! $record) {
            $data['number'] = Quotation::nextNumber('QT');
        }

        return $data;
    }

    /**
     * Turn an accepted quotation into a draft invoice. If the quotation was
     * for a lead with no client yet, the lead is converted to a client first.
     */
    public function toInvoice($id)
    {
        $quotation = Quotation::with('contact')->findOrFail($id);

        $clientId = $quotation->client_id;
        if (! $clientId && $quotation->contact) {
            $clientId = ContactController::convertToClient($quotation->contact)->id;
            $quotation->update(['client_id' => $clientId]);
        }

        if (! $clientId) {
            throw ValidationException::withMessages([
                'client_id' => ['Link this quotation to a client or lead before invoicing it.'],
            ]);
        }

        $invoice = Invoice::create([
            'number' => Invoice::nextNumber('INV'),
            'client_id' => $clientId,
            'status' => 'draft',
            'currency' => $quotation->currency,
            'items' => $quotation->items,
            'tax_rate' => $quotation->tax_rate,
            'issue_date' => today()->toDateString(),
            'due_date' => today()->addDays(15)->toDateString(),
            'notes' => 'Based on quotation '.$quotation->number.'.',
        ]);

        if ($quotation->status !== 'accepted') {
            $quotation->update(['status' => 'accepted']);
        }

        return response()->json([
            'message' => 'Invoice '.$invoice->number.' created from quotation.',
            'data' => $invoice,
        ], 201);
    }
}
