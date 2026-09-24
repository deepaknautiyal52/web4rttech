<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use Auditable;

    /**
     * Hours allowed to resolve a ticket, by priority.
     */
    const SLA_HOURS = [
        'urgent' => 4,
        'high' => 24,
        'medium' => 72,
        'low' => 168,
    ];

    protected $fillable = [
        'client_id',
        'project_id',
        'employee_id',
        'title',
        'description',
        'priority',
        'status',
    ];

    protected $casts = [
        'due_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    protected $appends = ['sla_breached'];

    protected static function booted()
    {
        static::saving(function (Ticket $ticket) {
            if (! $ticket->due_at || $ticket->isDirty('priority')) {
                $from = $ticket->created_at ?? now();
                $ticket->due_at = $from->copy()->addHours(self::SLA_HOURS[$ticket->priority] ?? 72);
            }

            $closed = in_array($ticket->status, ['resolved', 'closed'], true);
            if ($closed && ! $ticket->resolved_at) {
                $ticket->resolved_at = now();
            } elseif (! $closed) {
                $ticket->resolved_at = null;
            }
        });
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function getSlaBreachedAttribute(): bool
    {
        if (! $this->due_at) {
            return false;
        }

        return ($this->resolved_at ?? now())->gt($this->due_at);
    }
}
