<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // This backend is API-only (no Blade "login" route exists), so
        // never attempt a redirect — always let the request fall through
        // to a JSON 401 response.
        return null;
    }
}
