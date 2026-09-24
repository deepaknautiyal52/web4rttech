<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Contact;
use App\Models\FinanceEntry;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Renewal;
use App\Models\Ticket;
use App\Models\Timesheet;
use Illuminate\Http\Request;

/**
 * CSV downloads for the accountant / spreadsheets. Each type is gated by
 * the same area permission as its admin page.
 */
class ExportController extends Controller
{
    public function __invoke(Request $request, string $type)
    {
        $exports = $this->exports();
        abort_unless(isset($exports[$type]), 404);

        [$area, $headers, $rows] = $exports[$type];
        abort_unless($request->user()->canAccess($area), 403);

        $filename = $type.'-'.today()->toDateString().'.csv';

        return response()->streamDownload(function () use ($headers, $rows) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF"); // UTF-8 BOM so Excel shows ₹ correctly
            fputcsv($out, $headers);
            foreach ($rows() as $row) {
                fputcsv($out, $row);
            }
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function exports(): array
    {
        $party = fn ($client) => $client ? ($client->company ?: $client->name) : '';

        return [
            'leads' => ['leads',
                ['ID', 'Received', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Timeline', 'Subject', 'Status', 'Deal value', 'Won at', 'Lost reason', 'Next follow-up'],
                fn () => Contact::orderBy('id')->cursor()->map(fn ($c) => [
                    $c->id, $c->created_at, $c->name, $c->email, $c->phone, $c->company, $c->service_interested,
                    $c->budget_range, $c->timeline, $c->subject, $c->status, $c->deal_value, $c->won_at,
                    $c->lost_reason, optional($c->next_follow_up_at)->toDateString(),
                ]),
            ],
            'clients' => ['clients',
                ['ID', 'Name', 'Company', 'Email', 'Phone', 'Website', 'GST number', 'Billing address', 'Status', 'Created'],
                fn () => Client::orderBy('id')->cursor()->map(fn ($c) => [
                    $c->id, $c->name, $c->company, $c->email, $c->phone, $c->website, $c->gst_number,
                    $c->billing_address, $c->status, $c->created_at,
                ]),
            ],
            'projects' => ['projects',
                ['ID', 'Project', 'Client', 'Service', 'Status', 'Start', 'Deadline', 'Currency', 'Budget', 'Hours logged', 'Labour cost', 'Other costs', 'Revenue received'],
                fn () => Project::withFinancials()->with('client')->orderBy('id')->get()->map(fn ($p) => [
                    $p->id, $p->name, $party($p->client), $p->service_id, $p->status,
                    optional($p->start_date)->toDateString(), optional($p->deadline)->toDateString(), $p->currency,
                    $p->budget, $p->hours_logged, round((float) $p->labour_cost, 2), $p->other_costs, $p->revenue,
                ]),
            ],
            'invoices' => ['invoices',
                ['Number', 'Client', 'GST number', 'Issue date', 'Due date', 'Status', 'Currency', 'Subtotal', 'Tax rate %', 'Tax', 'Total', 'Paid', 'Balance'],
                fn () => Invoice::with('client')->orderBy('issue_date')->get()->map(fn ($i) => [
                    $i->number, $party($i->client), optional($i->client)->gst_number,
                    $i->issue_date->toDateString(), optional($i->due_date)->toDateString(), $i->display_status,
                    $i->currency, $i->subtotal, $i->tax_rate, $i->tax_amount, $i->total, $i->amount_paid, $i->balance,
                ]),
            ],
            'finances' => ['finances',
                ['ID', 'Type', 'Category', 'Title', 'Party', 'Currency', 'Amount', 'Period start', 'Period end', 'Recurrence', 'Notes'],
                fn () => FinanceEntry::orderBy('period_start')->cursor()->map(fn ($e) => [
                    $e->id, $e->type, $e->category, $e->title, $e->party_name, $e->currency, $e->amount,
                    optional($e->period_start)->toDateString(), optional($e->period_end)->toDateString(), $e->recurrence, $e->notes,
                ]),
            ],
            'renewals' => ['renewals',
                ['Type', 'Name', 'Client', 'Provider', 'Billing cycle', 'Expiry', 'Days left', 'Currency', 'Our cost', 'Client price', 'Auto-renew'],
                fn () => Renewal::with('client')->orderBy('expiry_date')->get()->map(fn ($r) => [
                    $r->type, $r->name, $party($r->client) ?: 'Web4rtTech', $r->provider, $r->billing_cycle,
                    $r->expiry_date->toDateString(), $r->days_left, $r->currency, $r->cost, $r->price, $r->auto_renew ? 'yes' : 'no',
                ]),
            ],
            'timesheets' => ['timesheets',
                ['Date', 'Employee', 'Project', 'Client', 'Hours', 'Description'],
                fn () => Timesheet::with(['employee', 'project.client'])->orderBy('work_date')->get()->map(fn ($t) => [
                    $t->work_date->toDateString(), optional($t->employee)->name, optional($t->project)->name,
                    $party(optional($t->project)->client), $t->hours, $t->description,
                ]),
            ],
            'tickets' => ['tickets',
                ['ID', 'Title', 'Client', 'Priority', 'Status', 'Created', 'SLA due', 'Resolved', 'SLA breached'],
                fn () => Ticket::with('client')->orderBy('id')->get()->map(fn ($t) => [
                    $t->id, $t->title, $party($t->client), $t->priority, $t->status, $t->created_at,
                    $t->due_at, $t->resolved_at, $t->sla_breached ? 'yes' : 'no',
                ]),
            ],
        ];
    }
}
