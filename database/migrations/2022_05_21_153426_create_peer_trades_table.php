<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Musonza\Chat\ConfigurationManager;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('peer_trades', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('currency');
            $table->decimal('price', 36, 18)->unsigned();
            $table->decimal('amount', 18, 0)->unsigned();

            $table->enum('status', ['active', 'completed', 'canceled', 'disputed'])->default('active');

            $table->text('instruction')->nullable();

            $table->decimal('value', 36, 0)->unsigned();
            $table->decimal('total_value', 36, 0)->unsigned();
            $table->decimal('fee_value', 36, 0)->unsigned();

            $table->integer('time_limit');

            $table->dateTime('canceled_at')->nullable();
            $table->dateTime('confirmed_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->dateTime('disputed_at')->nullable();

            $table->enum('disputed_by', ['seller', 'buyer'])->nullable();
            $table->enum('payment', ['payment_method', 'bank_account']);

            $table->foreignId('buyer_wallet_account_id')
                ->constrained('wallet_accounts')
                ->onDelete('cascade');

            $table->foreignId('seller_wallet_account_id')
                ->constrained('wallet_accounts')
                ->onDelete('cascade');

            $table->foreignId('chat_conversation_id')
                ->constrained(ConfigurationManager::CONVERSATIONS_TABLE)
                ->onDelete('cascade');

            $table->foreignUuid('offer_id')->nullable()
                ->constrained('peer_offers')
                ->nullOnDelete();

            $table->foreignId('payment_method_id')->nullable()
                ->constrained('peer_payment_methods')
                ->nullOnDelete();

            $table->foreignId('bank_account_id')->nullable()
                ->constrained('bank_accounts')
                ->nullOnDelete();

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
        Schema::dropIfExists('peer_trades');
    }
};
