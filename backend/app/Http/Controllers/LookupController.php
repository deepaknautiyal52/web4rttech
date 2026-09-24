<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Contact;
use App\Models\Employee;
use App\Models\Project;

/**
 * Id/name lists for the admin panel's dropdowns. Available to every admin
 * role and deliberately free of sensitive fields (no salaries, no money).
 */
class LookupController extends Controller
{
    public function __invoke()
    {
        return response()->json(['data' => [
            'clients' => Client::orderByRaw('COALESCE(company, name)')->get(['id', 'name', 'company', 'status']),
            'projects' => Project::orderBy('name')->get(['id', 'name', 'client_id', 'status', 'currency']),
            'employees' => Employee::orderBy('name')->get(['id', 'name', 'status']),
            'contacts' => Contact::whereNotIn('status', ['lost'])->latest()->limit(300)
                ->get(['id', 'name', 'company', 'email', 'status', 'client_id']),
        ]]);
    }
}
