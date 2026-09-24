<?php

namespace App\Http\Controllers;

use App\Models\FinanceEntry;
use Illuminate\Http\Request;

class FinanceEntryController extends Controller
{
    /**
     * Display a listing of the resource. Supports optional filtering by
     * type (expense/income) and category, newest period first.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $entries = FinanceEntry::query()
            ->when($request->query('type'), fn ($q, $type) => $q->where('type', $type))
            ->when($request->query('category'), fn ($q, $category) => $q->where('category', $category))
            ->orderByDesc('period_start')
            ->orderByDesc('id')
            ->paginate(25)
            ->withQueryString();

        return $entries;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:expense,income'],
            'category' => ['required', 'string', 'max:100'],
            'title' => ['required', 'string', 'max:255'],
            'party_name' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'currency' => ['nullable', 'string', 'max:8'],
            'period_start' => ['required', 'date'],
            'period_end' => ['nullable', 'date', 'after_or_equal:period_start'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'recurrence' => ['nullable', 'in:monthly,quarterly,yearly'],
        ]);

        $entry = FinanceEntry::create($validated);

        return response()->json([
            'message' => 'Entry added successfully.',
            'data' => $entry,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(FinanceEntry $financeEntry)
    {
        return $financeEntry;
    }

    /**
     * Update the specified resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, FinanceEntry $financeEntry)
    {
        $validated = $request->validate([
            'type' => ['sometimes', 'required', 'in:expense,income'],
            'category' => ['sometimes', 'required', 'string', 'max:100'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'party_name' => ['nullable', 'string', 'max:255'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0', 'max:99999999.99'],
            'currency' => ['nullable', 'string', 'max:8'],
            'period_start' => ['sometimes', 'required', 'date'],
            'period_end' => ['nullable', 'date', 'after_or_equal:period_start'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'recurrence' => ['nullable', 'in:monthly,quarterly,yearly'],
        ]);

        $financeEntry->update($validated);

        return response()->json([
            'message' => 'Entry updated successfully.',
            'data' => $financeEntry,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(FinanceEntry $financeEntry)
    {
        $financeEntry->delete();

        return response()->json(['message' => 'Entry deleted successfully.']);
    }

    /**
     * Return every entry (unpaginated), for the admin finances dashboard
     * to build summary stats and charts client-side.
     *
     * @return \Illuminate\Http\Response
     */
    public function analytics()
    {
        $entries = FinanceEntry::query()
            ->orderBy('period_start', 'asc')
            ->get();

        return response()->json(['data' => $entries]);
    }
}
