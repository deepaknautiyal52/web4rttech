<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $contacts = Contact::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('company', 'like', "%{$search}%")
                        ->orWhere('subject', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return $contacts;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
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

        return response()->json([
            'message' => 'Thank you for contacting us! We will get back to you soon.',
            'data' => $contact,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Contact  $contact
     * @return \Illuminate\Http\Response
     */
    public function show(Contact $contact)
    {
        return $contact;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Contact  $contact
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
            'status' => ['sometimes', 'required', 'in:new,contacted,won,lost'],
            'deal_value' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
        ]);

        if (array_key_exists('status', $validated)) {
            if ($validated['status'] === 'won' && $contact->status !== 'won') {
                // Record the moment a deal actually closes, so revenue can be
                // charted by when it was won rather than when the lead first came in.
                $validated['won_at'] = now();
            } elseif ($validated['status'] !== 'won') {
                $validated['won_at'] = null;
            }
        }

        $contact->update($validated);

        return response()->json([
            'message' => 'Contact updated successfully.',
            'data' => $contact,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Contact  $contact
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
            ->select(['id', 'name', 'subject', 'service_interested', 'status', 'deal_value', 'won_at', 'created_at'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['data' => $contacts]);
    }
}
