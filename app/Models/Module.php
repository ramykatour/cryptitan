<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin IdeHelperModule
 */
class Module extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'name';

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

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
    protected $with = ['operator'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'status' => 'boolean',
    ];

    /**
     * Check if module is enabled
     *
     * @return boolean
     */
    public function isEnabled()
    {
        return $this->status;
    }

    /**
     * Get operator's account.
     *
     * @return BelongsTo
     */
    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id', 'id')->role(Role::operator());
    }

    /**
     * Get exchange module
     *
     * @return self
     */
    public static function exchange()
    {
        return self::findOrFail('exchange');
    }

    /**
     * Get peer module
     *
     * @return self
     */
    public static function peer()
    {
        return self::findOrFail('peer');
    }

    /**
     * Get giftcard module
     *
     * @return self
     */
    public static function giftcard()
    {
        return self::findOrFail('giftcard');
    }

    /**
     * Get wallet module
     *
     * @return self
     */
    public static function wallet()
    {
        return self::findOrFail('wallet');
    }
}
