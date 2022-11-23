<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\SystemLogResource;
use App\Models\SystemLog;

class SystemLogController extends Controller
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
     * Get paginated system logs
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function paginate()
    {
        $records = paginate(SystemLog::latest()->oldest('seen_at'));

        return SystemLogResource::collection($records);
    }

    /**
     * Mark logs as seen
     *
     * @param SystemLog $log
     */
    public function markAsSeen(SystemLog $log)
    {
        $log->markAsSeen();
    }

    /**
     * Mark all logs as seen
     *
     * @return void
     */
    public function markAllAsSeen()
    {
        SystemLog::unseen()->update(['seen_at' => now()]);
    }
}
