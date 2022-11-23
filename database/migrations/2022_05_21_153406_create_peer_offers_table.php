<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('peer_offers', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->enum('type', ['buy', 'sell']);

            $table->string('currency');
            $table->string('country');
            $table->decimal('min_amount', 18, 0)->unsigned();
            $table->decimal('max_amount', 18, 0)->unsigned();

            $table->enum('price_type', ['fixed', 'percent']);
            $table->decimal('fixed_price', 36, 18)->unsigned()->nullable();
            $table->integer('percent_price')->unsigned()->nullable();

            $table->integer('time_limit');
            $table->text('instruction')->nullable();
            $table->text('auto_reply')->nullable();

            $table->boolean('require_long_term')->default(false);
            $table->boolean('require_verification')->default(false);
            $table->boolean('require_following')->default(false);

            $table->boolean('display')->default(false);
            $table->boolean('status')->default(true);

            $table->dateTime('closed_at')->nullable();

            $table->enum('payment', ['payment_method', 'bank_account']);

            $table->foreignId('wallet_account_id')
                ->constrained('wallet_accounts')
                ->onDelete('cascade');

            $table->foreignId('payment_method_id')->nullable()
                ->constrained('peer_payment_methods')
                ->onDelete('cascade');

            $table->foreignId('bank_account_id')->nullable()
                ->constrained('bank_accounts')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('peer_offers');
    }
};
