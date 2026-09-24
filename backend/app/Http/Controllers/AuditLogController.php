<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        return AuditLog::with('user:id,name,email')
            ->when($request->query('model_type'), fn ($q, $type) => $q->where('model_type', $type))
            ->when($request->query('action'), fn ($q, $action) => $q->where('action', $action))
            ->when($request->query('user_id'), fn ($q, $userId) => $q->where('user_id', $userId))
            ->when(trim((string) $request->query('search')), fn ($q, $search) => $q->where('summary', 'like', "%{$search}%"))
            ->latest('id')
            ->paginate(40)
            ->withQueryString();
    }
}
