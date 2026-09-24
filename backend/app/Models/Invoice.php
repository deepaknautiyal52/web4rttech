<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasLineItems;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use Auditable, HasLineItems;

    protected $fillable = [
        'number',
        'client_id',
        'project_id',
        'status',
        'currency',
        'items',
        'tax_rate',
        'issue_date',
        'due_date',
        'notes',
    ];

    protected $casts = [
        'items' => 'array',
        'tax_rate' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'issue_date' => 'date:Y-m-d',
        'due_date' => 'date:Y-m-d',
    ];

    protected $appends = ['display_status', 'balance'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class)->orderBy('paid_on');
    }

    /**
     * Overdue is not stored: it is any sent or partially paid invoice
     * whose due date has passed.
     */
    public function getDisplayStatusAttribute(): string
    {
        if (in_array($this->status, ['sent', 'partially_paid'], true)
            && $this->due_date && $this->due_date->lt(today())) {
            return 'overdue';
        }

        return $this->status;
    }

    public function getBalanceAttribute(): float
    {
        return round((float) $this->total - (float) $this->amount_paid, 2);
    }

    /**
     * Sum payments into amount_paid and move the status between
     * sent / partially_paid / paid accordingly.
     */
    public function syncPayments(): void
    {
        $paid = round((float) $this->payments()->sum('amount'), 2);
        $this->amount_paid = $paid;

        if ($this->status !== 'cancelled') {
            if ($paid <= 0) {
                $this->status = $this->status === 'draft' ? 'draft' : 'sent';
            } elseif ($paid + 0.009 >= (float) $this->total) {
                $this->status = 'paid';
            } else {
                $this->status = 'partially_paid';
            }
        }

        $this->save();
    }
}
