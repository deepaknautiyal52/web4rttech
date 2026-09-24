<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class Timesheet extends Model
{
    use Auditable;

    protected $fillable = [
        'employee_id',
        'project_id',
        'work_date',
        'hours',
        'description',
    ];

    protected $casts = [
        'hours' => 'decimal:2',
        'work_date' => 'date:Y-m-d',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function auditLabel(): string
    {
        return $this->hours.'h on '.optional($this->work_date)->toDateString();
    }
}
