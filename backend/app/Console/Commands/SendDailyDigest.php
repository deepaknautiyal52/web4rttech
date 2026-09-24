<?php

namespace App\Console\Commands;

use App\Mail\DailyDigestMail;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\Renewal;
use App\Models\Ticket;
use App\Support\AdminNotifier;
use Illuminate\Console\Command;

class SendDailyDigest extends Command
{
    protected $signature = 'admin:daily-digest';

    protected $description = 'Email admins about due follow-ups, stale leads, overdue invoices, upcoming renewals and SLA breaches';

    public function handle()
    {
        $followUps = Contact::whereNotIn('status', ['won', 'lost'])
            ->whereDate('next_follow_up_at', '<=', today())
            ->orderBy('next_follow_up_at')
            ->get();

        $staleLeads = Contact::where('status', 'new')
            ->where('created_at', '<=', now()->subHours(48))
            ->oldest()
            ->get();

        $invoices = Invoice::with('client')
            ->whereIn('status', ['sent', 'partially_paid'])
            ->whereDate('due_date', '<', today())
            ->orderBy('due_date')
            ->get();

        $renewals = Renewal::with('client')
            ->whereDate('expiry_date', '<=', today()->addDays(30))
            ->orderBy('expiry_date')
            ->get();

        $tickets = Ticket::with('client')
            ->whereNotIn('status', ['resolved', 'closed'])
            ->where('due_at', '<', now())
            ->get();

        $total = $followUps->count() + $staleLeads->count() + $invoices->count() + $renewals->count() + $tickets->count();

        if ($total === 0) {
            $this->info('Nothing needs attention today; no email sent.');

            return self::SUCCESS;
        }

        AdminNotifier::send(new DailyDigestMail($renewals, $invoices, $followUps, $staleLeads, $tickets), ['admin']);
        $this->info("Digest sent with {$total} item(s).");

        return self::SUCCESS;
    }
}
