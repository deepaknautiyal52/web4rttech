<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasLineItems;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use Auditable, HasLineItems;

    protected $fillable = [
        'number',
        'contact_id',
        'client_id',
        'title',
        'status',
        'currency',
        'items',
        'tax_rate',
        'issue_date',
        'valid_until',
        'notes',
    ];

    protected $casts = [
        'items' => 'array',
        'tax_rate' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'issue_date' => 'date:Y-m-d',
        'valid_until' => 'date:Y-m-d',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
