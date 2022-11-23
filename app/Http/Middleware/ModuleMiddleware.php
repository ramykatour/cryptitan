<?php

namespace App\Http\Middleware;

use App\Models\Module;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ModuleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @param $name
     * @return Response|RedirectResponse
     */
    public function handle(Request $request, Closure $next, $name)
    {
        if (!$this->getModule($name)?->isEnabled()) {
            return abort(403, trans('auth.action_forbidden'));
        }

        return $next($request);
    }

    /**
     * Get module object
     *
     * @param $name
     * @return Module|null
     */
    protected function getModule($name)
    {
        return Module::find($name);
    }
}
