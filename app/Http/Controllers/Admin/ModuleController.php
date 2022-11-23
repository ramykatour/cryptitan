<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\UserResource;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ModuleController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_modules');
    }

    /**
     * Paginate module records
     *
     * @return AnonymousResourceCollection
     */
    public function paginate()
    {
        $records = paginate(Module::query());

        return ModuleResource::collection($records);
    }

    /**
     * Get operators
     *
     * @return AnonymousResourceCollection
     */
    public function getOperators()
    {
        $records = User::operator()->latest()->get();

        return UserResource::collection($records);
    }

    /**
     * Enable module
     *
     * @param Module $module
     * @return void
     */
    public function enable(Module $module)
    {
        $module->update(['status' => true]);
    }

    /**
     * Set operator
     *
     * @param Request $request
     * @param Module $module
     * @return void
     */
    public function setOperator(Request $request, Module $module)
    {
        $operator = User::operator()->findOrFail((int) $request->get('operator'));

        $module->operator()->associate($operator)->save();
    }

    /**
     * Disable module
     *
     * @param Module $module
     * @return void
     */
    public function disable(Module $module)
    {
        $module->update(['status' => false]);
    }
}
