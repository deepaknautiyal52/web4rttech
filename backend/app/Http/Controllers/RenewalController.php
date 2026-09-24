<?php

namespace App\Http\Controllers;

use App\Models\Renewal;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class RenewalController extends ResourceController
{
    protected string $model = Renewal::class;

    protected array $with = ['client:id,name,company'];

    protected array $searchable = ['name', 'provider'];

    protected array $filterable = ['type', 'client_id'];

    protected string $orderBy = 'expiry_date';

    protected string $orderDirection = 'asc';

    protected string $label = 'Renewal';

    protected function applyFilters(Builder $query, Request $request): void
    {
        if ($days = (int) $request->query('due_within')) {
            $query->whereDate('expiry_date', '<=', today()->addDays($days));
        }
    }

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'client_id' => ['nullable', 'exists:clients,id'],
            'type' => ['required', 'in:domain,hosting,ssl,amc,other'],
            'name' => ['required', 'string', 'max:255'],
            'provider' => ['nullable', 'string', 'max:255'],
            'cost' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'currency' => ['required', 'in:INR,USD'],
            'billing_cycle' => ['required', 'in:monthly,quarterly,yearly'],
            'expiry_date' => ['required', 'date'],
            'auto_renew' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Mark as renewed: push the expiry date forward by one billing cycle.
     */
    public function renew($id)
    {
        $renewal = Renewal::findOrFail($id);
        $months = ['monthly' => 1, 'quarterly' => 3, 'yearly' => 12][$renewal->billing_cycle] ?? 12;
        $renewal->update(['expiry_date' => $renewal->expiry_date->copy()->addMonthsNoOverflow($months)]);

        return response()->json([
            'message' => 'Renewed until '.$renewal->expiry_date->toDateString().'.',
            'data' => $this->find($id),
        ]);
    }
}
