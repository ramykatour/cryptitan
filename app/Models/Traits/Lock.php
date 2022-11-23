<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\Cache;
use InvalidArgumentException;
use ReflectionException;
use ReflectionFunction;

trait Lock
{
    /**
     * Get cache lock name
     *
     * @return string
     */
    protected function getLockName(): string
    {
        return 'lock.' . $this->getTable() . '.' . $this->getKey();
    }

    /**
     * Attempts to acquire lock
     *
     * @param callable|null $callback
     * @return mixed
     */
    public function acquireLock(callable $callback = null): mixed
    {
        try {
            $reflection = new ReflectionFunction($callback);

            return Cache::store('redis')->lock($this->getLockName())->get(function () use ($reflection) {
                return match ($reflection->getNumberOfParameters()) {
                    1 => $reflection->invoke($this->fresh()),
                    0 => $reflection->invoke(),
                    default => throw new InvalidArgumentException(),
                };
            });
        } catch (ReflectionException $e) {
            throw new InvalidArgumentException($e->getMessage());
        }
    }

    /**
     * Acquire Lock or abort
     *
     * @param callable|null $callback
     * @return mixed
     */
    public function acquireLockOrAbort(callable $callback = null): mixed
    {
        return tap($this->acquireLock($callback), function ($result) {
            if ($result === false) {
                return abort(403, trans('common.in_use'));
            }
        });
    }
}
