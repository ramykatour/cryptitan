<?php

namespace App\Http\Controllers;

use App\Helpers\LocaleManager;
use ArrayObject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    protected $localeManager;

    /**
     * SessionController constructor.
     * @param LocaleManager $localeManager
     */
    public function __construct(LocaleManager $localeManager)
    {
        $this->localeManager = $localeManager;
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function set(Request $request)
    {
        $locales = $this->localeManager->getLocales();

        $validated = $this->validate($request, [
            'locale' => ['required', Rule::in($locales->keys())],
        ]);

        session()->put('locale', $validated['locale']);

        $messages = $this->localeManager->getJsonLines($validated['locale']);

        return response()->json([
            'locale'   => $validated['locale'],
            'messages' => new ArrayObject($messages),
        ]);
    }

    /**
     * Get locale messages
     *
     * @return JsonResponse
     */
    public function get()
    {
        $locale = session('locale', app()->getLocale());

        $messages = $this->localeManager->getJsonLines($locale);

        return response()->json([
            'messages' => new ArrayObject($messages),
            'locale'   => $locale,
        ]);
    }
}
