<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\FinanceEntry;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Renewal;
use App\Models\Ticket;
use Illuminate\Http\Request;

/**
 * "Needs attention" data for the Overview page. Each section is only
 * included when the user's role can access that area.
 */
class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();
        $data = [];

        if ($user->canAccess('leads')) {
            $data['follow_ups'] = Contact::whereNotIn('status', ['won', 'lost'])
                ->whereDate('next_follow_up_at', '<=', today())
                ->orderBy('next_follow_up_at')
                ->limit(8)
                ->get(['id', 'name', 'company', 'subject', 'status', 'next_follow_up_at']);

            $data['stale_leads'] = Contact::where('status', 'new')
                ->where('created_at', '<=', now()->subHours(48))
                ->oldest()
                ->limit(8)
                ->get(['id', 'name', 'company', 'subject', 'created_at']);
        }

        if ($user->canAccess('projects')) {
            $projects = Project::withFinancials()
                ->with('client:id,name,company')
                ->whereIn('status', ['planning', 'in_progress', 'review'])
                ->get();

            $data['projects'] = [
                'active' => $projects->count(),
                'overdue' => $projects->filter(fn ($p) => $p->deadline && $p->deadline->lt(today()))->values()
                    ->map->only(['id', 'name', 'deadline', 'status', 'client']),
                'over_budget' => $projects->filter(fn ($p) => $p->budget > 0
                    && ((float) $p->labour_cost + (float) $p->other_costs) > (float) $p->budget)->values()
                    ->map(fn ($p) => $p->only(['id', 'name', 'budget', 'currency', 'client']) + [
                        'cost' => round((float) $p->labour_cost + (float) $p->other_costs, 2),
                    ]),
            ];
        }

        if ($user->canAccess('invoices')) {
            $unpaid = Invoice::with('client:id,name,company')->whereIn('status', ['sent', 'partially_paid'])->get();
            $overdue = $unpaid->filter(fn ($i) => $i->display_status === 'overdue')->sortBy('due_date')->values();

            $data['receivables'] = [
                'outstanding' => round($unpaid->sum('balance'), 2),
                'outstanding_count' => $unpaid->count(),
                'overdue_total' => round($overdue->sum('balance'), 2),
                'overdue' => $overdue->take(8)->map->only(['id', 'number', 'due_date', 'balance', 'currency', 'client']),
            ];
        }

        if ($user->canAccess('renewals')) {
            $data['renewals'] = Renewal::with('client:id,name,company')
                ->whereDate('expiry_date', '<=', today()->addDays(30))
                ->orderBy('expiry_date')
                ->limit(10)
                ->get();
        }

        if ($user->canAccess('tickets')) {
            $open = Ticket::whereNotIn('status', ['resolved', 'closed']);
            $data['tickets'] = [
                'open' => (clone $open)->count(),
                'breached' => (clone $open)->where('due_at', '<', now())->count(),
                'urgent' => (clone $open)->whereIn('priority', ['urgent', 'high'])->count(),
            ];
        }

        if ($user->canAccess('finances')) {
            $perMonth = ['monthly' => 1, 'quarterly' => 1 / 3, 'yearly' => 1 / 12];
            $data['monthly_burn'] = round(FinanceEntry::where('type', 'expense')->whereNotNull('recurrence')->get()
                ->sum(fn ($e) => (float) $e->amount * ($perMonth[$e->recurrence] ?? 0)), 2);
        }

        return response()->json(['data' => $data]);
    }
}
