<?php

namespace App\Console\Commands;

use App\Helpers\DumperFactory;
use Illuminate\Console\Command;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\DbDumper\DbDumper;

class DatabaseBackup extends Command
{
    /**
     * Backup Extension
     *
     * @var string
     */
    protected const EXTENSION = '.sql.backup.';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup database';

    /**
     * Filesystem
     *
     * @var FilesystemAdapter
     */
    protected FilesystemAdapter $filesystem;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->filesystem = Storage::disk('backup');
    }

    /**
     * Execute the console command.
     *
     * @return void
     * @throws \League\Flysystem\FilesystemException
     */
    public function handle()
    {
        $connection = config('database.default');
        $dumper = DumperFactory::createFromConnection($connection);

        $this->cleanOldBackups();

        $dumper->dumpToFile($this->filepath($dumper));
        $this->info("Dumped: {$dumper->getDbName()}");
    }

    /**
     * Remove old backups
     *
     * @return void
     * @throws \League\Flysystem\FilesystemException
     */
    protected function cleanOldBackups()
    {
        $contents = $this->filesystem->listContents('/')
            ->filter(fn ($attributes) => $attributes->lastModified() < now()->subWeek()->getTimestamp())
            ->filter(fn ($attributes) => $attributes->isFile());

        collect($contents)->each(function ($file) {
            if (Str::contains($file->path(), self::EXTENSION)) {
                $this->filesystem->delete($file->path());
            }
        });
    }

    /**
     * Get file path
     *
     * @param DbDumper $dumper
     * @return string
     */
    protected function filepath(DbDumper $dumper): string
    {
        return $this->filesystem->path($dumper->getDbName() . self::EXTENSION . now()->getTimestamp());
    }
}
