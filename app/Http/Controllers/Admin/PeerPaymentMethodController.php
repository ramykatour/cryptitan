<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PeerPaymentMethodResource;
use App\Models\PeerPaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class PeerPaymentMethodController extends Controller
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
     * Create Method
     *
     * @param Request $request
     * @return PeerPaymentMethodResource
     * @throws ValidationException
     */
    public function create(Request $request)
    {
        $validated = $this->validateRequest($request);

        $method = PeerPaymentMethod::create($validated);

        return PeerPaymentMethodResource::make($method);
    }

    /**
     * Update method
     *
     * @param Request $request
     * @param PeerPaymentMethod $method
     * @return PeerPaymentMethodResource
     * @throws ValidationException
     */
    public function update(Request $request, PeerPaymentMethod $method)
    {
        $validated = $this->validateRequest($request);

        $method->update($validated);

        return PeerPaymentMethodResource::make($method);
    }

    /**
     * Delete Payment Method
     *
     * @param PeerPaymentMethod $method
     * @return void
     */
    public function delete(PeerPaymentMethod $method)
    {
        $method->delete();
    }

    /**
     * Paginate payment methods
     *
     * @return AnonymousResourceCollection
     */
    public function paginate()
    {
        $records = paginate(PeerPaymentMethod::latest());

        return PeerPaymentMethodResource::collection($records);
    }

    /**
     * Validate request
     *
     * @param Request $request
     * @return array
     * @throws ValidationException
     */
    protected function validateRequest(Request $request)
    {
        return $this->validate($request, [
            'name'        => ['required', 'string', 'max:250'],
            'category_id' => ['required', 'exists:peer_payment_categories,id'],
            'description' => ['required', 'string', 'max:1000'],
        ]);
    }
}
