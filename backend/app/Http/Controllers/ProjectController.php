<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ProjectController extends ResourceController
{
    protected string $model = Project::class;

    protected array $with = ['client:id,name,company', 'employee:id,name'];

    protected array $searchable = ['projects.name', 'projects.description'];

    protected array $filterable = ['status', 'client_id', 'employee_id'];

    protected string $orderBy = 'created_at';

    protected string $label = 'Project';

    const STATUSES = ['planning', 'in_progress', 'review', 'delivered', 'maintenance', 'on_hold'];

    protected function query(): Builder
    {
        return Project::query()->with($this->with)->withFinancials();
    }

    protected function applyFilters(Builder $query, Request $request): void
    {
        // Active = anything still being worked on.
        if ($request->boolean('active')) {
            $query->whereIn('projects.status', ['planning', 'in_progress', 'review']);
        }
    }

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'],
            'name' => ['required', 'string', 'max:255'],
            'service_id' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:'.implode(',', self::STATUSES)],
            'start_date' => ['nullable', 'date'],
            'deadline' => ['nullable', 'date'],
            'budget' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'other_costs' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'currency' => ['required', 'in:INR,USD'],
            'employee_id' => ['nullable', 'exists:employees,id'],
            'description' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function show($id)
    {
        $project = $this->find($id);
        $project->load([
            'invoices' => fn ($q) => $q->latest('issue_date'),
            'timesheets' => fn ($q) => $q->with('employee:id,name')->latest('work_date'),
            'tickets' => fn ($q) => $q->latest(),
        ]);

        return $project;
    }
}
