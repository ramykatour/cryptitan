<?php

namespace App\Models\Traits;

trait Cache
{
    /**
     * Cache store
     *
     * @var array
     */
    protected array $cacheStore = [];

    /**
     * Cache value
     *
     * @param string $key
     * @param callable $callback
     * @return mixed
     */
    protected function remember(string $key, callable $callback)
    {
        if (!array_key_exists($key, $this->cacheStore)) {
            $this->cacheStore[$key] = $callback();
        }
        return $this->cacheStore[$key];
    }
}