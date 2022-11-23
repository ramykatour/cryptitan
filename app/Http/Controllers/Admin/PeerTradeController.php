<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PeerTradeResource;
use App\Models\PeerTrade;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Musonza\Chat\Chat;

class PeerTradeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:manage_peer_trades');
    }

    /**
     * Join disputed trade
     *
     * @param PeerTrade $trade
     * @return void
     */
    public function join(PeerTrade $trade)
    {
        $trade->acquireLockOrAbort(function (PeerTrade $trade) {
            $this->authorize("join", $trade);

            app(Chat::class)
                ->conversation($trade->conversation)
                ->addParticipants([Auth::user()]);
        });
    }

    /**
     * Get statistics
     *
     * @return array
     */
    public function getStatistics()
    {
        $query = PeerTrade::query();

        return [
            "active"    => $query->clone()->whereStatus("active")->count(),
            "completed" => $query->clone()->whereStatus("completed")->count(),
            "canceled"  => $query->clone()->whereStatus("canceled")->count(),
            "disputed"  => $query->clone()->whereStatus("disputed")->count(),
            "all"       => $query->clone()->count(),
        ];
    }

    /**
     * Paginate trades
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function paginate(Request $request)
    {
        $query = PeerTrade::latest();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $records = paginate($query);

        return PeerTradeResource::collection($records);
    }
}
