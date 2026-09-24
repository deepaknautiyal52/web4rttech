<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Usage: ->middleware('area:invoices'). Rejects users whose role is not
 * allowed into that area (see User::AREA_ROLES).
 */
class EnsureAreaAccess
{
    public function handle(Request $request, Closure $next, string $area)
    {
        $user = $request->user();

        if (! $user || ! $user->canAccess($area)) {
            return response()->json(['message' => 'You do not have access to this area.'], 403);
        }

        return $next($request);
    }
}
