<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use Auditable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'designation',
        'monthly_salary',
        'hourly_cost',
        'currency',
        'joined_on',
        'status',
    ];

    protected $casts = [
        'monthly_salary' => 'decimal:2',
        'hourly_cost' => 'decimal:2',
        'joined_on' => 'date:Y-m-d',
    ];

    public function timesheets()
    {
        return $this->hasMany(Timesheet::class);
    }
}
