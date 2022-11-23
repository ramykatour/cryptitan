<?php

namespace App\Http\Controllers\Admin;

use App\Events\UserActivities\UpdatedProfile;
use App\Http\Controllers\Controller;
use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\UserActivityResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Rules\ProtectField;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_users');
    }

    /**
     * Paginate users
     *
     * @return AnonymousResourceCollection
     */
    public function paginate()
    {
        return UserResource::collection(paginate(User::latest()));
    }

    /**
     * Paginate activities
     *
     * @param User $user
     * @return AnonymousResourceCollection
     */
    public function activityPaginate(User $user)
    {
        $activities = paginate($user->activities()->latest());

        return UserActivityResource::collection($activities);
    }

    /**
     * Reset two factor secret
     *
     * @param User $user
     * @return void
     */
    public function resetTwoFactor(User $user): void
    {
        $user->acquireLock(function (User $user) {
            $user->resetTwoFactorToken();
        });
    }

    /**
     * Disable two factor
     *
     * @param User $user
     * @return void
     */
    public function disableTwoFactor(User $user): void
    {
        $user->acquireLock(function (User $user) {
            if ($user->isTwoFactorEnabled()) {
                $user->disableTwoFactor();
            }
        });
    }

    /**
     * Reset user's password
     *
     * @param VerifiedRequest $request
     * @param User $user
     * @return void
     * @throws ValidationException
     */
    public function resetPassword(VerifiedRequest $request, User $user)
    {
        $this->validate($request, [
            'password' => ['required', 'string', 'min:8', 'max:255', 'confirmed', Password::defaults()],
        ]);

        $user->update(['password' => Hash::make($request->get('password'))]);
    }

    /**
     * Update user's profile
     *
     * @param Request $request
     * @param User $user
     */
    public function update(Request $request, User $user)
    {
        $user->acquireLock(function (User $user) use ($request) {
            $user->fill($this->validate($request, [
                'country'  => ['required', Rule::in($this->getCountryCodes())],
            ]));

            $user->profile->fill($this->validate($request, [
                'last_name'  => ['required', 'string', 'max:100'],
                'first_name' => ['required', 'string', 'max:100'],
            ]));

            tap($user)->save()->profile->save();
            event(new UpdatedProfile($user));
        });
    }

    /**
     * Deactivate user
     *
     * @param Request $request
     * @param User $user
     * @throws \Illuminate\Validation\ValidationException
     */
    public function deactivate(Request $request, User $user)
    {
        if (!Auth::user()->canUpdateUser($user)) {
            return abort(403, trans('auth.action_forbidden'));
        }

        $validated = $this->validate($request, [
            'date' => 'required|date|after:now',
        ]);

        $user->update(['deactivated_until' => $validated['date']]);
    }

    /**
     * Activate user
     *
     * @param User $user
     * @throws \Illuminate\Validation\ValidationException
     */
    public function activate(User $user)
    {
        if (!Auth::user()->canUpdateUser($user)) {
            return abort(403, trans('auth.action_forbidden'));
        }

        $user->update(['deactivated_until' => null]);
    }

    /**
     * Batch deactivate
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function batchDeactivate(Request $request)
    {
        $validated = $this->validate($request, [
            'date'    => 'required|date|after:now',
            'users'   => 'required|array',
            'users.*' => 'required|exists:users,id',
        ]);

        Auth::user()->subordinates()->whereIn('id', $validated['users'])
            ->update(['deactivated_until' => $validated['date']]);
    }

    /**
     * Batch activate
     *
     * @param Request $request
     * @throws \Illuminate\Validation\ValidationException
     */
    public function batchActivate(Request $request)
    {
        $validated = $this->validate($request, [
            'users'   => 'required|array',
            'users.*' => 'required|exists:users,id',
        ]);

        Auth::user()->subordinates()->whereIn('id', $validated['users'])
            ->update(['deactivated_until' => null]);
    }

    /**
     * Get country codes
     *
     * @return Collection
     */
    protected function getCountryCodes(): Collection
    {
        return collect(config('countries'))->keys();
    }
}
