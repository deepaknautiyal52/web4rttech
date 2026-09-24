<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;

/**
 * Sends admin notification emails. Recipients come from ADMIN_NOTIFY_EMAIL
 * (comma separated) if set, otherwise every user with one of the given
 * roles. Mail failures are logged and never break the calling request.
 */
class AdminNotifier
{
    public static function send(Mailable $mail, array $roles = ['admin']): void
    {
        $recipients = self::recipients($roles);
        if (! $recipients) {
            return;
        }

        try {
            Mail::to($recipients)->send($mail);
        } catch (\Throwable $e) {
            report($e);
        }
    }

    public static function recipients(array $roles): array
    {
        $configured = array_filter(array_map('trim', explode(',', (string) config('mail.admin_notify'))));
        if ($configured) {
            return array_values($configured);
        }

        return User::whereIn('role', $roles)->pluck('email')->all();
    }
}
