<?php

namespace App\Http\Controllers;

use App\Mail\NewInquiryMail;
use App\Models\Client;
use App\Models\Contact;
use App\Support\AdminNotifier;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    const STATUSES = ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $contacts = Contact::query()
            ->with('client:id,name,company')
            ->withCount('activities')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('company', 'like', "%{$search}%")
                        ->orWhere('subject', 'like', "%{$search}%");
                });
            })
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            // Follow-ups scheduled for today or already missed.
            ->when($request->query('follow_up') === 'due', fn ($q) => $q
                ->whereNotIn('status', ['won', 'lost'])
                ->whereDate('next_follow_up_at', '<=', today()))
            // Leads nobody has picked up within 48 hours.
            ->when($request->boolean('stale'), fn ($q) => $q
                ->where('status', 'new')
                ->where('created_at', '<=', now()->subHours(48)))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return $contacts;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'company' => ['nullable', 'string', 'max:255'],
            'service_interested' => ['nullable', 'string', 'max:255'],
            'budget_range' => ['nullable', 'string', 'max:100'],
            'timeline' => ['nullable', 'string', 'max:100'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $contact = Contact::create($validated);

        AdminNotifier::send(new NewInquiryMail($contact), ['admin', 'sales']);

        return response()->json([
            'message' => 'Thank you for contacting us! We will get back to you soon.',
            'data' => $contact,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Contact $contact)
    {
        return $contact->load(['client:id,name,company', 'activities.user:id,name', 'quotations:id,contact_id,number,title,status,total,currency']);
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'company' => ['nullable', 'string', 'max:255'],
            'service_interested' => ['nullable', 'string', 'max:255'],
            'budget_range' => ['nullable', 'string', 'max:100'],
            'timeline' => ['nullable', 'string', 'max:100'],
            'subject' => ['sometimes', 'required', 'string', 'max:255'],
            'message' => ['sometimes', 'required', 'string', 'max:5000'],
            'status' => ['sometimes', 'required', 'in:'.implode(',', self::STATUSES)],
            'deal_value' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'next_follow_up_at' => ['nullable', 'date'],
            'lost_reason' => ['nullable', 'string', 'max:255'],
        ]);

        if (array_key_exists('status', $validated)) {
            if ($validated['status'] === 'won' && $contact->status !== 'won') {
                // Record the moment a deal actually closes, so revenue can be
                // charted by when it was won rather than when the lead first came in.
                $validated['won_at'] = now();
            } elseif ($validated['status'] !== 'won') {
                $validated['won_at'] = null;
            }

            if ($validated['status'] !== 'lost') {
                $validated['lost_reason'] = null;
            }
            if (in_array($validated['status'], ['won', 'lost'], true)) {
                $validated['next_follow_up_at'] = null;
            }
        }

        $contact->update($validated);

        return response()->json([
            'message' => 'Contact updated successfully.',
            'data' => $contact->fresh(['client:id,name,company'])->loadCount('activities'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json(['message' => 'Contact deleted successfully.']);
    }

    /**
     * Return every contact (unpaginated) with just the fields the admin
     * analytics dashboard needs to build its charts client-side.
     *
     * @return \Illuminate\Http\Response
     */
    public function analytics()
    {
        $contacts = Contact::query()
            ->select(['id', 'name', 'subject', 'service_interested', 'budget_range', 'status', 'deal_value', 'won_at', 'lost_reason', 'created_at'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['data' => $contacts]);
    }

    /**
     * Log a call, email, meeting or note against a lead.
     */
    public function addActivity(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:note,call,email,meeting'],
            'body' => ['required', 'string', 'max:5000'],
            'next_follow_up_at' => ['nullable', 'date'],
        ]);

        $contact->activities()->create([
            'type' => $validated['type'],
            'body' => $validated['body'],
            'user_id' => $request->user()->id,
        ]);

        $updates = [];
        if (array_key_exists('next_follow_up_at', $validated)) {
            $updates['next_follow_up_at'] = $validated['next_follow_up_at'];
        }
        // Any logged touchpoint means the lead has been contacted.
        if ($contact->status === 'new') {
            $updates['status'] = 'contacted';
        }
        if ($updates) {
            $contact->update($updates);
        }

        return response()->json([
            'message' => 'Activity logged.',
            'data' => $this->show($contact->fresh()),
        ], 201);
    }

    public function deleteActivity(Contact $contact, $activityId)
    {
        $contact->activities()->whereKey($activityId)->firstOrFail()->delete();

        return response()->json(['message' => 'Activity deleted.', 'data' => $this->show($contact->fresh())]);
    }

    /**
     * Create (or reuse) a client record for a won lead.
     */
    public function convert(Contact $contact)
    {
        $client = self::convertToClient($contact);

        return response()->json([
            'message' => 'Client created.',
            'data' => $client,
        ], 201);
    }

    public static function convertToClient(Contact $contact): Client
    {
        if ($contact->client_id && $contact->client) {
            return $contact->client;
        }

        // Reuse an existing client with the same email so repeat customers
        // are not duplicated.
        $client = Client::where('email', $contact->email)->first() ?? Client::create([
            'name' => $contact->name,
            'company' => $contact->company,
            'email' => $contact->email,
            'phone' => $contact->phone,
            'status' => 'active',
            'notes' => 'Converted from inquiry: '.$contact->subject,
        ]);

        $contact->update(['client_id' => $client->id]);

        return $client;
    }
}
