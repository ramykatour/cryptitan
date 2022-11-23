<?php

namespace App\Providers;

use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\Console\Input\ArgvInput;

class DebugServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->shouldDebug()) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Detect debug environment
     *
     * @return bool
     */
    protected function shouldDebug()
    {
        return $this->app->environment('local') && (!$this->app->runningInConsole() || $this->runningDebugCommand());
    }

    /**
     * Detect if running debug command
     *
     * @return bool
     */
    protected function runningDebugCommand()
    {
        $command = new ArgvInput();

        $namespace = Arr::first(explode(':', $command->getFirstArgument()));

        return $namespace === 'telescope';
    }
}
