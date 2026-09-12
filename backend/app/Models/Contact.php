<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'service_interested',
        'budget_range',
        'timeline',
        'subject',
        'message',
        'status',
        'deal_value',
        'won_at',
    ];

    protected $casts = [
        'deal_value' => 'decimal:2',
        'won_at' => 'datetime',
    ];
}
