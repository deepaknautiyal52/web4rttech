<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceEntry extends Model
{
    use Auditable, HasFactory;

    protected $fillable = [
        'type',
        'category',
        'title',
        'party_name',
        'amount',
        'currency',
        'period_start',
        'period_end',
        'notes',
        'recurrence',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'period_start' => 'date:Y-m-d',
        'period_end' => 'date:Y-m-d',
    ];
}
