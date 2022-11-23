<?php

namespace App\Http\Controllers;

use App\Helpers\LocaleManager;
use App\Helpers\Settings;
use App\Http\Resources\UserResource;
use App\Models\Module;
use ArrayObject;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{
    /**
     * @var LocaleManager
     */
    protected $localeManager;

    /**
     * AppController constructor.
     *
     * @param LocaleManager $localeManager
     */
    public function __construct(LocaleManager $localeManager)
    {
        $this->localeManager = $localeManager;
    }

    /**
     * Show admin dashboard.
     *
     * @param Settings $settings
     * @return View
     */
    public function admin(Settings $settings)
    {
        $data = $this->getData($settings);

        return view('admin', compact('data', 'settings'));
    }

    /**
     * Where it all begins!
     *
     * @param Settings $settings
     * @return View
     */
    public function main(Settings $settings)
    {
        $data = $this->getData($settings);

        return view('main', compact('data', 'settings'));
    }

    /**
     * Get app data
     *
     * @param Settings $settings
     * @return array
     */
    protected function getData(Settings $settings)
    {
        return [
            'name'         => config('app.name'),
            'broadcast'    => $this->getBroadcastConfig(),
            'settings'     => [
                'recaptcha' => [
                    'enable'  => config('services.recaptcha.enable'),
                    'sitekey' => config('services.recaptcha.sitekey'),
                    'size'    => config('services.recaptcha.size'),
                ],
                'locales'   => $this->getLocales(),
                'modules'   => $this->getModules(),
                'exchange'  => [
                    'baseCurrency' => app('exchanger')->config('base_currency'),
                ],
                'theme'     => [
                    'mode'      => $settings->theme->get('mode'),
                    'direction' => $settings->theme->get('direction'),
                    'color'     => $settings->theme->get('color'),
                ],
                'brand'     => [
                    'faviconUrl' => $settings->brand->get('favicon_url'),
                    'logoUrl'    => $settings->brand->get('logo_url'),
                    'supportUrl' => $settings->brand->get('support_url'),
                    'termsUrl'   => $settings->brand->get('terms_url'),
                    'policyUrl'  => $settings->brand->get('policy_url'),
                ],
            ],
            'auth'         => [
                'credential' => config('auth.credential'),
                'user'       => $this->getAuthUser(),
                'userSetup'  => $settings->get('user_setup'),
            ],
            'notification' => session('notification'),
            'csrfToken'    => csrf_token(),
        ];
    }

    /**
     * Get user object
     *
     * @return UserResource
     */
    protected function getAuthUser()
    {
        Auth::user()?->updatePresence('online');

        return UserResource::make(Auth::user());
    }

    /**
     * Get supported locales object
     *
     * @return ArrayObject
     */
    protected function getLocales()
    {
        $locales = $this->localeManager->getLocales();

        return new ArrayObject($locales->toArray());
    }

    /**
     * Get event broadcasting config
     *
     * @return array
     */
    protected function getBroadcastConfig()
    {
        $connection = new ArrayObject();
        $driver = config('broadcasting.default');

        if ($driver == 'pusher') {
            $pusher = config('broadcasting.connections')[$driver];
            $connection['key'] = $pusher['key'];
            $options = $pusher['options'];
            $connection['cluster'] = $options['cluster'];
            $connection['port'] = $options['port'];
        }

        return compact('connection', 'driver');
    }

    /**
     * Get modules
     *
     * @return Collection
     */
    protected function getModules()
    {
        return Module::all()->pluck('status', 'name');
    }

    /**
     * Get IP Info
     *
     * @param Request $request
     * @return array
     */
    public function ipInfo(Request $request)
    {
        return geoip($request->ip())->toArray();
    }
}
