<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Timesheet;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TimesheetController extends ResourceController
{
    protected string $model = Timesheet::class;

    protected array $with = ['employee:id,name,hourly_cost', 'project:id,name,client_id', 'project.client:id,name,company'];

    protected array $searchable = ['description'];

    protected array $filterable = ['employee_id', 'project_id'];

    protected string $orderBy = 'work_date';

    protected string $label = 'Time entry';

    protected function applyFilters(Builder $query, Request $request): void
    {
        if ($from = $request->query('from')) {
            $query->whereDate('work_date', '>=', $from);
        }
        if ($to = $request->query('to')) {
            $query->whereDate('work_date', '<=', $to);
        }
    }

    protected function rules(Request $request, ?Model $record): array
    {
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'project_id' => ['required', 'exists:projects,id'],
            'work_date' => ['required', 'date'],
            'hours' => ['required', 'numeric', 'min:0.25', 'max:24'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Hours per active employee over the last N days against a capacity
     * of 8 hours per weekday.
     */
    public function utilization(Request $request)
    {
        $days = max(1, min(365, (int) $request->query('days', 30)));
        $from = today()->subDays($days - 1);

        $capacity = 0;
        for ($d = $from->copy(); $d->lte(today()); $d->addDay()) {
            if (! $d->isWeekend()) {
                $capacity += 8;
            }
        }

        $hours = Timesheet::whereDate('work_date', '>=', $from)
            ->selectRaw('employee_id, SUM(hours) as hours')
            ->groupBy('employee_id')
            ->pluck('hours', 'employee_id');

        $rows = Employee::where('status', 'active')->orderBy('name')->get(['id', 'name', 'designation'])
            ->map(fn ($e) => [
                'id' => $e->id,
                'name' => $e->name,
                'designation' => $e->designation,
                'hours' => round((float) ($hours[$e->id] ?? 0), 2),
                'capacity' => $capacity,
                'utilization' => $capacity ? round(((float) ($hours[$e->id] ?? 0)) / $capacity * 100) : 0,
            ]);

        return response()->json(['data' => $rows, 'days' => $days, 'capacity' => $capacity]);
    }
}
