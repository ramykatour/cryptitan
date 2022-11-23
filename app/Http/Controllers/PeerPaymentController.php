<?php

namespace App\Http\Controllers;

use App\Http\Resources\PeerPaymentMethodResource;
use App\Models\PeerPaymentMethod;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PeerPaymentController extends Controller
{
    /**
     * Get payment methods
     *
     * @return AnonymousResourceCollection
     */
    public function getMethods()
    {
        $methods = PeerPaymentMethod::query()->orderBy('category_id')->get();
        return PeerPaymentMethodResource::collection($methods);
    }
}
