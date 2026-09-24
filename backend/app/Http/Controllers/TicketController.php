<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TicketController extends ResourceController
{
    protected string $model = Ticket::class;

    protected array $with = ['client:id,name,company', 'project:id,name', 'employee:id,name'];

    protected array $searchable = ['title', 'description'];

    protected array $filterable = ['priority', 'client_id', 'project_id', 'employee_id'];

    protected string $orderBy = 'created_at';

    protected string $label = 'Ticket';

    protected function applyFilters(Builder $query, Request $request): void
    {
        $status = $request->query('status');
        if ($status === 'open_all') {
            $query->whereNotIn('status', ['resolved', 'closed']);
        } elseif ($status) {
            $query->where('status', $status);
        }
    }

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'client_id' => ['nullable', 'exists:clients,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'employee_id' => ['nullable', 'exists:employees,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'priority' => ['required', 'in:'.implode(',', array_keys(Ticket::SLA_HOURS))],
            'status' => ['required', 'in:open,in_progress,waiting,resolved,closed'],
        ];
    }
}
