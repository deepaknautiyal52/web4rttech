<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use Auditable;

    protected $fillable = [
        'client_id',
        'name',
        'service_id',
        'status',
        'start_date',
        'deadline',
        'budget',
        'other_costs',
        'currency',
        'employee_id',
        'description',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'other_costs' => 'decimal:2',
        'start_date' => 'date:Y-m-d',
        'deadline' => 'date:Y-m-d',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function timesheets()
    {
        return $this->hasMany(Timesheet::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    /**
     * Adds hours_logged, labour_cost (hours x employee hourly cost) and
     * revenue (payments received on this project's invoices) columns.
     */
    public function scopeWithFinancials($query)
    {
        return $query
            ->addSelect('projects.*')
            ->selectSub(
                Timesheet::selectRaw('COALESCE(SUM(hours), 0)')->whereColumn('timesheets.project_id', 'projects.id'),
                'hours_logged'
            )
            ->selectSub(
                Timesheet::join('employees', 'employees.id', '=', 'timesheets.employee_id')
                    ->selectRaw('COALESCE(SUM(timesheets.hours * COALESCE(employees.hourly_cost, 0)), 0)')
                    ->whereColumn('timesheets.project_id', 'projects.id'),
                'labour_cost'
            )
            ->selectSub(
                Invoice::selectRaw('COALESCE(SUM(amount_paid), 0)')->whereColumn('invoices.project_id', 'projects.id'),
                'revenue'
            );
    }
}
