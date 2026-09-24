<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use Auditable, HasFactory;

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
        'client_id',
        'next_follow_up_at',
        'lost_reason',
    ];

    protected $casts = [
        'deal_value' => 'decimal:2',
        'won_at' => 'datetime',
        'next_follow_up_at' => 'date:Y-m-d',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function activities()
    {
        return $this->hasMany(ContactActivity::class)->latest();
    }

    public function quotations()
    {
        return $this->hasMany(Quotation::class);
    }
}
