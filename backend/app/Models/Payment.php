<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use Auditable;

    protected $fillable = [
        'invoice_id',
        'amount',
        'paid_on',
        'method',
        'reference',
        'finance_entry_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_on' => 'date:Y-m-d',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function financeEntry()
    {
        return $this->belongsTo(FinanceEntry::class);
    }

    public function auditLabel(): string
    {
        return 'Payment on '.($this->invoice->number ?? 'invoice #'.$this->invoice_id);
    }
}
