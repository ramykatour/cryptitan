<?php

namespace App\Helpers;

use Barryvdh\TranslationManager\Manager;
use Illuminate\Contracts\Translation\Loader;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;

class LocaleManager
{
    protected $path;

    /**
     * Cache loaded locale lines
     *
     * @var array|null
     */
    protected $loadedLines;

    /**
     * @var Loader
     */
    protected $loader;

    /**
     * @var Manager
     */
    protected $manager;

    /**
     * LocaleManager constructor.
     */
    public function __construct()
    {
        $this->loader = app('translation.loader');
        $this->path = app()->langPath();
        $this->manager = app('translation-manager');
    }

    /**
     * Only those with exported json files
     *
     * @return Collection
     */
    public function getLocales()
    {
        $locales = array_intersect($this->manager->getLocales(), $this->getJsonLocales());

        return getLocales()->only($locales);
    }

    /**
     * Get array of locales based on available files
     *
     * @return array
     */
    protected function getJsonLocales()
    {
        return collect(File::files($this->path))
            ->filter(fn ($value) => preg_match('/^.*\.(json)$/i', $value))
            ->map(fn ($value) => basename($value, '.json'))
            ->values()->toArray();
    }

    /**
     * Get translation lines as array
     *
     * @param $locale
     * @return mixed
     */
    public function getJsonLines($locale)
    {
        $this->loadJsonLines($locale);

        return $this->loadedLines[$locale];
    }

    /**
     * Load json files as array
     *
     * @param $locale
     */
    protected function loadJsonLines($locale)
    {
        if (!isset($this->loadedLines[$locale])) {
            $line = $this->loader->load($locale, '*', '*');
            $this->loadedLines[$locale] = $line;
        }
    }
}
