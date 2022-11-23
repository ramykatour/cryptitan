<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin IdeHelperPeerPaymentMethod
 */
class PeerPaymentMethod extends Model
{
    use HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['category'];

    /**
     * Related Category
     *
     * @return BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(PeerPaymentCategory::class, 'category_id', 'id');
    }
}
