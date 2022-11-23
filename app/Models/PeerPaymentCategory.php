<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @mixin IdeHelperPeerPaymentCategory
 */
class PeerPaymentCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Related payment methods
     *
     * @return HasMany
     */
    public function methods()
    {
        return $this->hasMany(PeerPaymentMethod::class, 'category_id', 'id');
    }
}
