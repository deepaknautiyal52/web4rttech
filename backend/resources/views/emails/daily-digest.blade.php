<div style="font-family: Arial, sans-serif; color: #1a1a2e; max-width: 640px; font-size: 14px;">
    <h2 style="color: #4F46E5;">Daily digest for {{ today()->format('d M Y') }}</h2>

    @if ($followUps->isNotEmpty())
        <h3>Follow-ups due ({{ $followUps->count() }})</h3>
        <ul>
            @foreach ($followUps as $c)
                <li>{{ $c->name }} ({{ $c->company ?: $c->email }}): {{ $c->subject }}, due {{ $c->next_follow_up_at->format('d M') }}</li>
            @endforeach
        </ul>
    @endif

    @if ($staleLeads->isNotEmpty())
        <h3>New leads waiting more than 48 hours ({{ $staleLeads->count() }})</h3>
        <ul>
            @foreach ($staleLeads as $c)
                <li>{{ $c->name }}: {{ $c->subject }} (received {{ $c->created_at->format('d M') }})</li>
            @endforeach
        </ul>
    @endif

    @if ($invoices->isNotEmpty())
        <h3>Overdue invoices ({{ $invoices->count() }})</h3>
        <ul>
            @foreach ($invoices as $inv)
                <li>{{ $inv->number }}, {{ $inv->client->company ?: $inv->client->name }}: {{ $inv->currency }} {{ number_format($inv->balance, 2) }} due {{ $inv->due_date->format('d M') }}</li>
            @endforeach
        </ul>
    @endif

    @if ($renewals->isNotEmpty())
        <h3>Renewals in the next 30 days ({{ $renewals->count() }})</h3>
        <ul>
            @foreach ($renewals as $r)
                <li>{{ strtoupper($r->type) }} {{ $r->name }}{{ $r->client ? ' for '.($r->client->company ?: $r->client->name) : '' }}: expires {{ $r->expiry_date->format('d M Y') }} ({{ $r->days_left }} days)</li>
            @endforeach
        </ul>
    @endif

    @if ($tickets->isNotEmpty())
        <h3>Tickets past their SLA ({{ $tickets->count() }})</h3>
        <ul>
            @foreach ($tickets as $t)
                <li>[{{ ucfirst($t->priority) }}] {{ $t->title }}{{ $t->client ? ' for '.($t->client->company ?: $t->client->name) : '' }}</li>
            @endforeach
        </ul>
    @endif
</div>
