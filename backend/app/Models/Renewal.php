<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class Renewal extends Model
{
    use Auditable;

    protected $fillable = [
        'client_id',
        'type',
        'name',
        'provider',
        'cost',
        'price',
        'currency',
        'billing_cycle',
        'expiry_date',
        'auto_renew',
        'notes',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'price' => 'decimal:2',
        'expiry_date' => 'date:Y-m-d',
        'auto_renew' => 'boolean',
    ];

    protected $appends = ['days_left'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function getDaysLeftAttribute(): ?int
    {
        return $this->expiry_date ? (int) today()->diffInDays($this->expiry_date, false) : null;
    }
}
