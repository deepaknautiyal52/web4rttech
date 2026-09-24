<?php

namespace App\Models\Concerns;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

/**
 * Writes a row to audit_logs whenever the model is created, updated or
 * deleted, attributed to the authenticated admin user (null for public
 * actions such as the contact form).
 */
trait Auditable
{
    public static function bootAuditable()
    {
        static::created(fn ($model) => $model->writeAudit('created', $model->getAttributes()));

        static::updated(function ($model) {
            $changes = collect($model->getChanges())->except('updated_at');
            if ($changes->isEmpty()) {
                return;
            }
            $diff = $changes->mapWithKeys(fn ($new, $key) => [
                $key => ['from' => $model->getOriginal($key), 'to' => $new],
            ]);
            $model->writeAudit('updated', $diff->all());
        });

        static::deleted(fn ($model) => $model->writeAudit('deleted', null));
    }

    protected function writeAudit(string $action, ?array $changes)
    {
        // Never store secrets in the log.
        if ($changes) {
            unset($changes['password'], $changes['remember_token']);
        }

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => class_basename($this),
            'model_id' => $this->getKey(),
            'summary' => $this->auditLabel(),
            'changes' => $changes,
        ]);
    }

    /**
     * Human-readable name for this record in the audit log.
     */
    public function auditLabel(): string
    {
        foreach (['number', 'title', 'name', 'email'] as $field) {
            if (! empty($this->{$field})) {
                return (string) $this->{$field};
            }
        }

        return class_basename($this).' #'.$this->getKey();
    }
}
