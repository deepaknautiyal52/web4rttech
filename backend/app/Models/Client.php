<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use Auditable;

    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'website',
        'gst_number',
        'billing_address',
        'status',
        'notes',
    ];

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function renewals()
    {
        return $this->hasMany(Renewal::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function quotations()
    {
        return $this->hasMany(Quotation::class);
    }

    public function auditLabel(): string
    {
        return $this->company ?: $this->name;
    }
}
