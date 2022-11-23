<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Barryvdh\TranslationManager\Manager;
use Barryvdh\TranslationManager\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LocaleController extends Controller
{
    /**
     * @var Manager
     */
    protected Manager $manager;

    /**
     * GeneralController constructor.
     *
     * @param Manager $manager
     * @throws \Exception
     */
    public function __construct(Manager $manager)
    {
        $this->middleware('permission:manage_localization');
        $this->manager = $manager;
    }

    /**
     * Get translation data
     *
     * @return array
     */
    public function get()
    {
        return [
            'locales' => $this->availableLocales()->values(),
            'groups'  => $this->availableGroups()->values(),
        ];
    }

    /**
     * Add locale
     *
     * @param Request $request
     * @return void
     * @throws ValidationException
     */
    public function add(Request $request)
    {
        $supported = array_keys(config('locales'));

        $validated = $this->validate($request, [
            'locale' => ['required', Rule::in($supported)],
        ]);

        $locale = $validated['locale'];

        if (!$this->availableLocales()->has($locale)) {
            $this->manager->addLocale($locale);
        }
    }

    /**
     * Remove locale
     *
     * @param Request $request
     * @return void
     * @throws ValidationException
     */
    public function remove(Request $request)
    {
        $validated = $this->validate($request, [
            'locale' => ['required', Rule::notIn(['en'])],
        ]);

        $locale = $validated['locale'];

        $this->manager->removeLocale($locale);
    }

    /**
     * Import translation keys
     *
     * @param Request $request
     * @return void
     * @throws ValidationException
     */
    public function import(Request $request)
    {
        $validated = $this->validate($request, [
            'replace' => 'required|boolean',
        ]);

        $replace = $validated['replace'];

        $this->manager->importTranslations($replace);
    }

    /**
     * Get group data
     *
     * @param Request $request
     * @param $group
     * @return array
     */
    public function getGroup(Request $request, $group)
    {
        return [
            'locales'      => $this->availableLocales()->values(),
            'translations' => $this->getGroupTranslations($request, $group),
            'changed'      => $this->countChangedGroupKeys($group),
        ];
    }

    /**
     * Get group translations
     *
     * @param Request $request
     * @param $group
     * @return Collection
     */
    protected function getGroupTranslations(Request $request, $group)
    {
        $query = Translation::query()
            ->where('group', $group)->orderBy('key');

        if ($search = $request->query('search')) {
            $keys = $query->clone()
                ->where('value', 'like', "%{$search}%")
                ->pluck('key');

            $query->whereIn('key', $keys);
        }

        return collect($query->get())
            ->groupBy(['key', 'locale'])
            ->map(fn($data, $key) => $data->put('key', $key))
            ->values();
    }

    /**
     * Count changed group keys
     *
     * @param null $group
     * @return mixed
     */
    protected function countChangedGroupKeys($group)
    {
        return Translation::where('group', $group)
            ->where('status', 1)->count();
    }

    /**
     * Export group keys
     *
     * @param $group
     */
    public function exportGroup($group)
    {
        $this->manager->exportTranslations($group, $group === '_json');
    }

    /**
     * Update group translation
     *
     * @param Request $request
     * @param $group
     * @return void
     * @throws ValidationException
     */
    public function updateGroup(Request $request, $group)
    {
        $locales = collect($this->manager->getLocales());

        $validated = $this->validate($request, [
            'key'       => ['required', 'string'],
            'locales'   => ['required', 'array:' . $locales->implode(',')],
            'locales.*' => ['required', 'string'],
        ]);

        foreach ($validated['locales'] as $locale => $value) {
            Translation::updateOrCreate([
                'group'  => $group,
                'key'    => $validated['key'],
                'locale' => $locale,
            ], [
                'status' => Translation::STATUS_CHANGED,
                'value'  => $value,
            ]);
        }
    }

    /**
     * Get available groups
     *
     * @return Collection
     */
    protected function availableGroups()
    {
        $query = Translation::query()
            ->selectRaw("count(*) as total")
            ->addSelect("group as name");

        if ($excluded = $this->manager->getConfig('exclude_groups')) {
            $query->whereNotIn('group', $excluded);
        }

        return $query->groupBy('name')
            ->orderBy('name')->get();
    }

    /**
     * Get available locales data
     *
     * @return Collection
     */
    protected function availableLocales()
    {
        $locales = $this->manager->getLocales();

        return getLocales()->only($locales);
    }
}
