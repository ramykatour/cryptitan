<?php

namespace App\Http\Controllers;

use App\Events\ChatMessageSent;
use App\Helpers\FileVault;
use App\Http\Resources\ChatMessageResource;
use App\Http\Resources\ChatParticipantResource;
use App\Http\Resources\PeerTradeResource;
use App\Models\PeerTrade;
use App\Models\Rating;
use App\Models\Traits\Rateable;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Musonza\Chat\Chat;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PeerTradeController extends Controller
{
    /**
     * Get trade
     *
     * @param PeerTrade $trade
     * @return PeerTradeResource
     */
    public function get(PeerTrade $trade)
    {
        return PeerTradeResource::make($trade);
    }

    /**
     * Get participants
     *
     * @param PeerTrade $trade
     * @return AnonymousResourceCollection
     */
    public function getParticipants(PeerTrade $trade)
    {
        return ChatParticipantResource::collection($trade->conversation->getParticipants());
    }

    /**
     * Mark conversation as read
     *
     * @param PeerTrade $trade
     * @return void
     */
    public function markRead(PeerTrade $trade)
    {
        app(Chat::class)
            ->conversation($trade->conversation)
            ->setParticipant(Auth::user())
            ->readAll();
    }

    /**
     * Send message to trade conversation
     *
     * @throws AuthorizationException
     * @throws ValidationException
     * @throws Exception
     */
    public function sendMessage(PeerTrade $trade, Request $request)
    {
        $this->authorize('sendMessage', $trade);

        $this->validate($request, [
            'message' => 'required|string|min:1|max:2000'
        ]);

        $message = app(Chat::class)
            ->message($request->input('message'))
            ->from(Auth::user())
            ->to($trade->conversation)
            ->send();

        broadcast(new ChatMessageSent($message))->toOthers();

        return ChatMessageResource::make($message);
    }

    /**
     * Upload file
     *
     * @throws AuthorizationException
     * @throws ValidationException|FileNotFoundException
     */
    public function uploadFile(PeerTrade $trade, Request $request)
    {
        $this->authorize('sendMessage', $trade);

        $this->validate($request, [
            'file' => [
                'required', 'file', 'max:5120',
                'mimes:png,jpeg,doc,docx,pdf',
            ]
        ]);

        $file = $request->file('file');

        $data = collect([
            'extension' => $file->clientExtension(),
            'name'      => substr($file->getClientOriginalName(), 0, 100),
            'path'      => FileVault::encrypt($file->get()),
            'mimeType'  => $file->getMimeType(),
        ]);

        $message = app(Chat::class)
            ->message($file->getMimeType())
            ->type('attachment')
            ->data($data->toArray())
            ->from(Auth::user())
            ->to($trade->conversation)
            ->send();

        broadcast(new ChatMessageSent($message))->toOthers();

        return ChatMessageResource::make($message);
    }

    /**
     * Download File
     *
     * @param PeerTrade $trade
     * @param $id
     * @return StreamedResponse
     */
    public function downloadFile(PeerTrade $trade, $id)
    {
        $message = $trade->conversation
            ->messages()->where("type", "attachment")
            ->findOrFail($id);

        $data = collect($message->data);
        $name = pathinfo($path = $data->get('path'), PATHINFO_FILENAME);

        return response()->streamDownload(function () use ($path) {
            echo FileVault::decrypt($path);
        }, "$name.{$data->get('extension')}", [
            'Content-Type' => $data->get('mimeType'),
        ]);
    }

    /**
     * Cancel PeerTrade
     *
     * @param PeerTrade $trade
     * @return void
     */
    public function cancel(PeerTrade $trade)
    {
        $trade->acquireLockOrAbort(function (PeerTrade $trade) {
            $this->authorize("cancel", $trade);
            $trade->cancel();
        });
    }

    /**
     * Confirm PeerTrade
     *
     * @param PeerTrade $trade
     * @return void
     */
    public function confirm(PeerTrade $trade)
    {
        $trade->acquireLockOrAbort(function (PeerTrade $trade) {
            $this->authorize("confirm", $trade);
            $trade->confirm();
        });
    }

    /**
     * Dispute trade
     *
     * @param PeerTrade $trade
     * @return void
     */
    public function dispute(PeerTrade $trade)
    {
        $trade->acquireLockOrAbort(function (PeerTrade $trade) {
            $this->authorize("dispute", $trade);
            $trade->dispute(Auth::user());
        });
    }

    /**
     * Complete trade
     *
     * @param PeerTrade $trade
     * @return void
     */
    public function complete(PeerTrade $trade)
    {
        $trade->acquireLockOrAbort(function (PeerTrade $trade) {
            $this->authorize("complete", $trade);
            $trade->complete();
        });
    }

    /**
     * Rate seller
     *
     * @param Request $request
     * @param PeerTrade $trade
     * @return void
     */
    public function rateSeller(Request $request, PeerTrade $trade)
    {
        $trade->acquireLockOrAbort(function (PeerTrade $trade) use ($request) {
            $this->authorize("rateSeller", $trade);

            $this->rate($trade->seller, $trade->sellerRating(), $request);
        });
    }

    /**
     * Rate buyer
     *
     * @param Request $request
     * @param PeerTrade $trade
     * @return void
     */
    public function rateBuyer(Request $request, PeerTrade $trade)
    {
        $trade->acquireLockOrAbort(function (PeerTrade $trade) use ($request) {
            $this->authorize("rateBuyer", $trade);

            $this->rate($trade->buyer, $trade->buyerRating(), $request);
        });
    }

    /**
     * Rate participant of trade
     *
     * @param Request $request
     * @param BelongsTo $relation
     * @param Rateable $subject
     * @return Rating
     * @throws ValidationException
     */
    protected function rate(Rateable $subject, BelongsTo $relation, Request $request)
    {
        $validated = $this->validate($request, [
            'value'   => 'required|numeric|min:1|max:5',
            'comment' => 'required|string|max:1000'
        ]);

        if (!$rating = $relation->first()) {
            $rating = Auth::user()->rate($subject, $validated['value'], $validated['comment']);

            return tap($rating, function ($rating) use ($relation) {
                $relation->associate($rating)->save();
            });
        } else {
            return tap($rating)->update($validated);
        }
    }

    /**
     * Paginate Messages
     *
     * @param PeerTrade $trade
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function messagePaginate(PeerTrade $trade, Request $request)
    {
        $messages = app(Chat::class)
            ->conversation($trade->conversation)
            ->setParticipant(Auth::user())
            ->setPaginationParams([
                'page'    => $request->input('page'),
                'perPage' => $request->input('itemPerPage'),
                'sorting' => 'desc',
            ])
            ->getMessages();

        return ChatMessageResource::collection($messages);
    }

    /**
     * Get buy statistics
     *
     * @return array
     */
    public function getBuyStatistics()
    {
        $query = Auth::user()->buyPeerTrades();

        return $this->getStatistics($query);
    }

    /**
     * Get sell statistics
     *
     * @return array
     */
    public function getSellStatistics()
    {
        $query = Auth::user()->sellPeerTrades();

        return $this->getStatistics($query);
    }

    /**
     * Get statistics
     *
     * @param Builder $query
     * @return array
     */
    protected function getStatistics(Builder $query)
    {
        return [
            "active"    => $query->clone()->whereStatus("active")->count(),
            "completed" => $query->clone()->whereStatus("completed")->count(),
            "canceled"  => $query->clone()->whereStatus("canceled")->count(),
            "disputed"  => $query->clone()->whereStatus("disputed")->count(),
            "all"       => $query->clone()->count(),
        ];
    }

    /**
     * Paginate "buy" trades
     *
     * @return AnonymousResourceCollection
     */
    public function buyPaginate(Request $request)
    {
        $query = Auth::user()->buyPeerTrades()->latest();

        $this->applyFilters($query, $request);

        return PeerTradeResource::collection(paginate($query));
    }

    /**
     * Paginate "sell" trades
     *
     * @return AnonymousResourceCollection
     */
    public function sellPaginate(Request $request)
    {
        $query = Auth::user()->sellPeerTrades()->latest();

        $this->applyFilters($query, $request);

        return PeerTradeResource::collection(paginate($query));
    }

    /**
     * Apply query filters
     *
     * @param $query
     * @param Request $request
     * @return void
     */
    protected function applyFilters($query, Request $request)
    {
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
    }
}
