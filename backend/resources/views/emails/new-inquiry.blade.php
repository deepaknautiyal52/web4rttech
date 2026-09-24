<div style="font-family: Arial, sans-serif; color: #1a1a2e; max-width: 600px;">
    <h2 style="color: #4F46E5;">New inquiry from {{ $contact->name }}</h2>
    <table cellpadding="6" style="border-collapse: collapse; font-size: 14px;">
        <tr><td><strong>Email</strong></td><td>{{ $contact->email }}</td></tr>
        <tr><td><strong>Phone</strong></td><td>{{ $contact->phone ?: '—' }}</td></tr>
        <tr><td><strong>Company</strong></td><td>{{ $contact->company ?: '—' }}</td></tr>
        <tr><td><strong>Service</strong></td><td>{{ $contact->service_interested ?: '—' }}</td></tr>
        <tr><td><strong>Budget</strong></td><td>{{ $contact->budget_range ?: '—' }}</td></tr>
        <tr><td><strong>Timeline</strong></td><td>{{ $contact->timeline ?: '—' }}</td></tr>
        <tr><td><strong>Subject</strong></td><td>{{ $contact->subject }}</td></tr>
    </table>
    <p style="white-space: pre-wrap; background: #f4f5fa; padding: 14px; border-radius: 6px;">{{ $contact->message }}</p>
    <p style="font-size: 12px; color: #888;">Reply to this email to answer {{ $contact->name }} directly.</p>
</div>
