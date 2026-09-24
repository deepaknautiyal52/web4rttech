<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ClientController extends ResourceController
{
    protected string $model = Client::class;

    protected array $searchable = ['name', 'company', 'email', 'phone', 'gst_number'];

    protected array $filterable = ['status'];

    protected string $orderBy = 'created_at';

    protected string $label = 'Client';

    protected function query(): Builder
    {
        return Client::query()
            ->withCount(['projects', 'invoices'])
            ->withSum('invoices as total_invoiced', 'total')
            ->withSum('invoices as total_paid', 'amount_paid');
    }

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'website' => ['nullable', 'string', 'max:255'],
            'gst_number' => ['nullable', 'string', 'max:30'],
            'billing_address' => ['nullable', 'string', 'max:2000'],
            'status' => ['required', 'in:active,inactive'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * The client page: profile plus everything linked to the client.
     */
    public function show($id)
    {
        $client = $this->find($id);

        $client->setRelation('projects', Project::withFinancials()->where('client_id', $client->id)->latest()->get());
        $client->load([
            'invoices' => fn ($q) => $q->latest('issue_date'),
            'renewals' => fn ($q) => $q->orderBy('expiry_date'),
            'tickets' => fn ($q) => $q->latest(),
            'quotations' => fn ($q) => $q->latest('issue_date'),
            'contacts:id,client_id,name,subject,status,deal_value,created_at',
        ]);

        return $client;
    }
}
