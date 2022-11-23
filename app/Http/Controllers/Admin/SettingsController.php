<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SettingsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_settings');
    }

    /**
     * Get general settings
     *
     * @return array
     */
    public function getGeneral()
    {
        return $this->getSettings([
            'min_payment',
            'max_payment',
            'price_cache',
        ]);
    }

    /**
     * Update general settings
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function updateGeneral(Request $request)
    {
        $validated = $this->validate($request, [
            'min_payment' => 'required|integer|min:5',
            'max_payment' => 'required|integer|gt:min_payment|max:999999',
            'price_cache' => 'required|integer|min:5|max:120',
        ]);

        $this->setSettings($validated);
    }

    /**
     * Get service settings
     *
     * @return array
     */
    public function getService()
    {
        return $this->getSettings([
            'user_setup',
            'enable_mail',
            'enable_database',
            'enable_sms',
        ]);
    }

    /**
     * Update service settings
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function updateService(Request $request)
    {
        $validated = $this->validate($request, [
            'user_setup'      => 'required|boolean',
            'enable_mail'     => 'required|boolean',
            'enable_database' => 'required|boolean',
            'enable_sms'      => 'required|boolean',
        ]);

        $this->setSettings($validated);
    }

    /**
     * Get settings
     *
     * @param array $keys
     * @return array
     */
    protected function getSettings(array $keys)
    {
        return collect($keys)->mapWithKeys(function ($key) {
            return [$key => settings()->get($key)];
        })->toArray();
    }

    /**
     * Set settings
     *
     * @param array $data
     * @return void
     */
    protected function setSettings(array $data)
    {
        foreach ($data as $key => $value) {
            settings()->put($key, $value);
        }
    }
}
