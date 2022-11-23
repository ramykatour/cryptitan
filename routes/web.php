<?php

use App\Http\Controllers\Admin\BankController as AdminBankController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\ExchangeTradeController as AdminExchangeTradeController;
use App\Http\Controllers\Admin\FeatureLimitController as AdminFeatureLimitController;
use App\Http\Controllers\Admin\GiftcardController as AdminGiftcardController;
use App\Http\Controllers\Admin\LocaleController as AdminLocaleController;
use App\Http\Controllers\Admin\ModuleController as AdminModuleController;
use App\Http\Controllers\Admin\GridController as AdminGridController;
use App\Http\Controllers\Admin\Payment\TransactionController as AdminPaymentTransactionController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\PeerPaymentCategoryController as AdminPeerPaymentCategoryController;
use App\Http\Controllers\Admin\PeerPaymentMethodController as AdminPeerPaymentMethodController;
use App\Http\Controllers\Admin\PeerTradeController as AdminPeerTradeController;
use App\Http\Controllers\Admin\RequiredDocumentController as AdminRequiredDocumentController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\Admin\SystemLogController as AdminSystemLogController;
use App\Http\Controllers\Admin\ThemeController as AdminThemeController;
use App\Http\Controllers\Admin\User\VerificationController as AdminVerificationController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\WalletController as AdminWalletController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\ExchangeTradeController;
use App\Http\Controllers\FeatureLimitController;
use App\Http\Controllers\GatewayController;
use App\Http\Controllers\GiftcardController;
use App\Http\Controllers\GlobalController;
use App\Http\Controllers\GridController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\InstallerController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PeerOfferController;
use App\Http\Controllers\PeerPaymentController;
use App\Http\Controllers\PeerTradeController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\VerificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Wallet\AccountController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WebHook\CoinController;
use Illuminate\Support\Facades\Route;
use Spatie\Csp\AddCspHeaders;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('login', [LoginController::class, 'login'])->name('login');
    Route::post('register', [RegisterController::class, 'register'])->name('register')->block();
    Route::post('logout', [LoginController::class, 'logout'])->name('logout');

    Route::prefix('reset-password')->name('reset-password.')->group(function () {
        Route::post('reset', [ResetPasswordController::class, 'reset'])->name('reset')->block();
        Route::post('send-email-code', [ResetPasswordController::class, 'sendEmailCode'])->name('send-email-code')->block();
        Route::post('request-token', [ResetPasswordController::class, 'requestToken'])->name('request-token')->block();
    });
});

Route::middleware('auth')->group(function () {
    Route::prefix('wallet')->name('wallet.')->group(function () {
        Route::get('unused', [WalletController::class, 'unused'])->name('unused');

        Route::post('transfer-record-paginate', [
            WalletController::class, 'transferRecordPaginate',
        ])->name('transfer-record-paginate');

        Route::prefix('{wallet}')->group(function () {
            Route::post('create-account', [WalletController::class, 'createAccount'])->name('create-account')->block();
            Route::get('price', [WalletController::class, 'price'])->name('price');
            Route::post('market-chart', [WalletController::class, 'marketChart'])->name('market-chart');
        });

        Route::prefix('account')->name('account.')->group(function () {
            Route::get('all', [AccountController::class, 'all'])->name('all');

            Route::prefix('{id}')->group(function () {
                Route::post('send', [AccountController::class, 'send'])->name('send')->block();
                Route::get('latest-address', [AccountController::class, 'latestAddress'])->name('latest-address');
                Route::post('estimate-fee', [AccountController::class, 'estimateFee'])->name('estimate-fee');
                Route::post('generate-address', [
                    AccountController::class, 'generateAddress',
                ])->name('generate-address')->block();
            });

            Route::get('total-available-price', [
                AccountController::class, 'totalAvailablePrice',
            ])->name('total-available-price');

            Route::get('aggregate-price', [
                AccountController::class, 'aggregatePrice',
            ])->name('aggregate-price');
        });
    });

    Route::prefix('bank')->name('bank.')->group(function () {
        Route::get('get', [BankController::class, 'get'])->name('get');
        Route::post('create-account', [BankController::class, 'createAccount'])->name('create-account')->block();
        Route::get('get-accounts', [BankController::class, 'getAccounts'])->name('get-accounts');

        Route::prefix('account/{id}')->name('account.')->group(function () {
            Route::delete('delete', [BankController::class, 'deleteAccount'])->name('delete')->block();
        });
    });

    Route::prefix('payment')->name('payment.')->group(function () {
        Route::get('account', [PaymentController::class, 'getAccount'])->name('account');
        Route::get('deposit-methods', [PaymentController::class, 'getDepositMethods'])->name('deposit-methods');
        Route::get('daily-chart', [PaymentController::class, 'getDailyChart'])->name('daily-chart');
        Route::post('deposit', [PaymentController::class, 'deposit'])->name('deposit')->block();
        Route::post('withdraw', [PaymentController::class, 'withdraw'])->name('withdraw')->block();

        Route::post('transaction-paginate', [
            PaymentController::class, 'transactionPaginate',
        ])->name('transaction-paginate');
    });

    Route::prefix('user')->name('user.')->group(function () {
        Route::get('auth', [UserController::class, 'auth'])->name('auth');
        Route::get('notification-settings', [UserController::class, 'getNotificationSettings'])->name('notification-settings');
        Route::post('update-notification-settings', [UserController::class, 'updateNotificationSettings'])->name('update-notification-settings');
        Route::post('upload-picture', [UserController::class, 'uploadPicture'])->name('upload-picture')->block();
        Route::post('update', [UserController::class, 'update'])->name('update')->block();
        Route::post('change-password', [UserController::class, 'changePassword'])->name('change-password')->block();
        Route::post('get-two-factor', [UserController::class, 'getTwoFactor'])->name('get-two-factor');
        Route::post('reset-two-factor', [UserController::class, 'resetTwoFactor'])->name('reset-two-factor')->block();
        Route::post('set-two-factor', [UserController::class, 'setTwoFactor'])->name('set-two-factor')->block();
        Route::post('verify-phone-with-token', [UserController::class, 'verifyPhoneWithToken'])->name('verify-phone-with-token');
        Route::post('verify-email-with-token', [UserController::class, 'verifyEmailWithToken'])->name('verify-email-with-token');
        Route::post('set-online', [UserController::class, 'setOnline'])->name('set-online');
        Route::post('set-away', [UserController::class, 'setAway'])->name('set-away');
        Route::post('set-offline', [UserController::class, 'setOffline'])->name('set-offline');
        Route::post('activity-paginate', [UserController::class, 'activityPaginate'])->name('activity-paginate');

        Route::prefix('profile/{user:name}')->name('profile.')->group(function () {
            Route::get('get', [ProfileController::class, 'get'])->name('get');
            Route::post('unfollow', [ProfileController::class, 'unfollow'])->name('unfollow')->block();
            Route::post('follow', [ProfileController::class, 'follow'])->name('follow')->block();
            Route::post('followers-paginate', [ProfileController::class, 'followersPaginate'])->name('followers-paginate');
            Route::post('following-paginate', [ProfileController::class, 'followingPaginate'])->name('following-paginate');
            Route::post('reviews-paginate', [ProfileController::class, 'reviewsPaginate'])->name('reviews-paginate');

            Route::prefix('peer-offer')->name('peer-offer.')->group(function () {
                Route::post('paginate/{type}', [ProfileController::class, 'peerOfferPaginate'])->whereIn('type', ['buy', 'sell'])->name('paginate');
            });
        });

        Route::prefix('verification')->name('verification.')->group(function () {
            Route::get('get', [VerificationController::class, 'get'])->name('get');
            Route::get('get-documents', [VerificationController::class, 'getDocuments'])->name('get-documents');
            Route::post('upload-document', [VerificationController::class, 'uploadDocument'])->name('upload-document')->block();
            Route::get('get-address', [VerificationController::class, 'getAddress'])->name('get-address');
            Route::post('update-address', [VerificationController::class, 'updateAddress'])->name('update-address')->block();
        });

        Route::prefix('notification')->name('notification.')->group(function () {
            Route::get('total-unread', [NotificationController::class, 'totalUnread'])->name('total-unread');
            Route::post('paginate', [NotificationController::class, 'paginate'])->name('paginate');
            Route::post('mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('mark-all-as-read')->block();
            Route::post('clear', [NotificationController::class, 'clear'])->name('clear')->block();

            Route::prefix('{id}')->group(function () {
                Route::patch('mark-as-read', [NotificationController::class, 'markAsRead'])->name('mark-as-read')->block();
            });
        });
    });

    Route::prefix('exchange-trade')->name('exchange-trade.')->group(function () {
        Route::post('calculate-buy', [ExchangeTradeController::class, 'calculateBuy'])->name('calculate-buy');
        Route::post('buy', [ExchangeTradeController::class, 'buy'])->name('buy')->block();
        Route::post('calculate-sell', [ExchangeTradeController::class, 'calculateSell'])->name('calculate-sell');
        Route::post('sell', [ExchangeTradeController::class, 'sell'])->name('sell')->block();
        Route::post('paginate', [ExchangeTradeController::class, 'paginate'])->name('paginate');
    });

    Route::prefix('giftcard')->name('giftcard.')->group(function () {
        Route::get('get', [GiftcardController::class, 'get'])->name('get');
        Route::post('purchase', [GiftcardController::class, 'purchase'])->name('purchase')->block();
        Route::post('paginate', [GiftcardController::class, 'paginate'])->name('paginate');

        Route::prefix('content')->name('content.')->group(function () {
            Route::post('paginate', [GiftcardController::class, 'contentPaginate'])->name('paginate');
        });

        Route::prefix('brand')->name('brand.')->group(function () {
            Route::get('all', [GiftcardController::class, 'getBrands'])->name('all');
        });
    });

    Route::prefix('feature-limit')->name('feature-limit.')->group(function () {
        Route::get('all', [FeatureLimitController::class, 'all'])->name('all');
    });

    Route::name('email-verification.')->group(function () {
        Route::middleware(['signed'])
            ->get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->name('verify');

        Route::middleware(['throttle:6,60'])
            ->post('email/verification-notification', [EmailVerificationController::class, 'sendEmail'])
            ->name('send');
    });

    Route::prefix('token')->name('token.')->group(function () {
        Route::post('send-phone', [TokenController::class, 'sendPhone'])->name('send-phone')->block();
        Route::post('send-email', [TokenController::class, 'sendEmail'])->name('send-email')->block();
    });

    Route::prefix('gateway/{order}')->name('gateway.')->group(function () {
        Route::get('callback', [GatewayController::class, 'handleCallback'])->name('callback');
    });

    Route::prefix('grid')->name('grid.')->group(function () {
        Route::middleware('permission:access_control_panel')->group(function () {
            Route::post('set-dimensions', [GridController::class, 'setDimensions'])->name('set-dimensions');
        });

        Route::post('all', [GridController::class, 'all'])->name('all');
    });

    Route::prefix('peer-offer')->name('peer-offer.')->group(function () {
        Route::post('create', [PeerOfferController::class, 'create'])->name('create')->block();
        Route::post('paginate/{type}', [PeerOfferController::class, 'paginate'])->whereIn('type', ['buy', 'sell'])->name('paginate');

        Route::prefix('{offer}')->group(function () {
            Route::get('get', [PeerOfferController::class, 'get'])->name('get');
            Route::post('start-trade', [PeerOfferController::class, 'startTrade'])->name('start-trade')->block();
            Route::get('get-bank-accounts', [PeerOfferController::class, 'getBankAccounts'])->name('get-bank-accounts');
            Route::patch('enable', [PeerOfferController::class, 'enable'])->name('enable')->block();
            Route::patch('disable', [PeerOfferController::class, 'disable'])->name('disable')->block();
            Route::patch('close', [PeerOfferController::class, 'close'])->name('close')->block();
        });
    });

    Route::prefix('peer-trade')->name('peer-trade.')->group(function () {
        Route::post('sell-paginate', [PeerTradeController::class, 'sellPaginate'])->name('sell-paginate');
        Route::get('get-sell-statistics', [PeerTradeController::class, 'getSellStatistics'])->name('get-sell-statistics');
        Route::post('buy-paginate', [PeerTradeController::class, 'buyPaginate'])->name('buy-paginate');
        Route::get('get-buy-statistics', [PeerTradeController::class, 'getBuyStatistics'])->name('get-buy-statistics');

        Route::prefix('{trade}')->middleware('can:view,trade')->group(function () {
            Route::get('get', [PeerTradeController::class, 'get'])->name('get');
            Route::get('get-participants', [PeerTradeController::class, 'getParticipants'])->name('get-participants');
            Route::post('upload-file', [PeerTradeController::class, 'uploadFile'])->name('upload-file')->block();
            Route::get('download-file/{id}', [PeerTradeController::class, 'downloadFile'])->name('download-file');
            Route::post('mark-read', [PeerTradeController::class, 'markRead'])->name('mark-read')->block();
            Route::post('send-message', [PeerTradeController::class, 'sendMessage'])->name('send-message')->block();
            Route::post('message-paginate', [PeerTradeController::class, 'messagePaginate'])->name('message-paginate');
            Route::patch('complete', [PeerTradeController::class, 'complete'])->name('complete')->middleware("two-factor")->block();
            Route::patch('cancel', [PeerTradeController::class, 'cancel'])->name('cancel')->block();
            Route::patch('confirm', [PeerTradeController::class, 'confirm'])->name('confirm')->block();
            Route::patch('dispute', [PeerTradeController::class, 'dispute'])->name('dispute')->block();
            Route::post('rate-seller', [PeerTradeController::class, 'rateSeller'])->name('rate-seller')->block();
            Route::post('rate-buyer', [PeerTradeController::class, 'rateBuyer'])->name('rate-buyer')->block();
        });
    });

    Route::prefix('peer-payment')->name('peer-payment.')->group(function () {
        Route::get('methods', [PeerPaymentController::class, 'getMethods'])->name('methods');
    });

    // *** CONTROL PANEL (admin) ***
    Route::prefix('admin')->middleware('permission:access_control_panel')->name('admin.')->group(function () {
        Route::prefix('statistics')->name('statistics.')->group(function () {
            Route::get('total-users', [StatisticsController::class, 'totalUsers'])->name('total-users');
            Route::get('total-earnings', [StatisticsController::class, 'totalEarnings'])->name('total-earnings');
            Route::get('pending-verification', [StatisticsController::class, 'pendingVerification'])->name('pending-verification');
            Route::get('pending-deposit', [StatisticsController::class, 'pendingDeposit'])->name('pending-deposit');
            Route::get('pending-withdrawal', [StatisticsController::class, 'pendingWithdrawal'])->name('pending-withdrawal');
            Route::get('registration-chart', [StatisticsController::class, 'registrationChart'])->name('registration-chart');
            Route::get('system-status', [StatisticsController::class, 'systemStatus'])->name('system-status');
            Route::get('latest-users', [StatisticsController::class, 'latestUsers'])->name('latest-users');
        });

        Route::prefix('user')->name('user.')->group(function () {
            Route::post('paginate', [AdminUserController::class, 'paginate'])->name('paginate');
            Route::post('batch-deactivate', [AdminUserController::class, 'batchDeactivate'])->name('batch-deactivate')->block();
            Route::post('batch-activate', [AdminUserController::class, 'batchActivate'])->name('batch-activate')->block();

            Route::prefix('{user}')->middleware('permission:manage_users')->group(function () {
                Route::post('activity-paginate', [AdminUserController::class, 'activityPaginate'])->name('activity-paginate');
                Route::post('update', [AdminUserController::class, 'update'])->name('update')->block();
                Route::post('reset-password', [AdminUserController::class, 'resetPassword'])->name('reset-password')->block();
                Route::post('disable-two-factor', [AdminUserController::class, 'disableTwoFactor'])->name('disable-two-factor')->block();
                Route::post('reset-two-factor', [AdminUserController::class, 'resetTwoFactor'])->name('reset-two-factor')->block();
                Route::post('activate', [AdminUserController::class, 'activate'])->name('activate')->block();
                Route::post('deactivate', [AdminUserController::class, 'deactivate'])->name('deactivate')->block();
            });

            Route::prefix('verification')->name('verification.')->group(function () {
                Route::post('address-paginate', [AdminVerificationController::class, 'addressPaginate'])->name('address-paginate');
                Route::post('document-paginate', [AdminVerificationController::class, 'documentPaginate'])->name('document-paginate');

                Route::prefix('{document}')->group(function () {
                    Route::post('approve-document', [AdminVerificationController::class, 'approveDocument'])->name('approve-document')->block();
                    Route::post('reject-document', [AdminVerificationController::class, 'rejectDocument'])->name('reject-document')->block();
                    Route::get('download-document', [AdminVerificationController::class, 'downloadDocument'])->name('download-document');
                });

                Route::prefix('{address}')->group(function () {
                    Route::post('approve-address', [AdminVerificationController::class, 'approveAddress'])->name('approve-address')->block();
                    Route::post('reject-address', [AdminVerificationController::class, 'rejectAddress'])->name('reject-address')->block();
                });
            });
        });

        Route::prefix('role')->name('role.')->group(function () {
            Route::post('paginate', [RoleController::class, 'paginate'])->name('paginate');
            Route::post('create', [RoleController::class, 'create'])->name('create')->block();
            Route::delete('{role}/delete', [RoleController::class, 'delete'])->name('delete')->block();
            Route::put('{role}/update', [RoleController::class, 'update'])->name('update')->block();
            Route::get('get-permissions', [RoleController::class, 'getPermissions'])->name('get-permissions');
            Route::get('all', [RoleController::class, 'all'])->name('all');
            Route::post('assign/{user}', [RoleController::class, 'assign'])->name('assign')->block();
        });

        Route::prefix('wallet')->name('wallet.')->group(function () {
            Route::post('create', [AdminWalletController::class, 'create'])->name('create')->block();

            Route::prefix('{identifier}')->group(function () {
                Route::delete('delete', [AdminWalletController::class, 'delete'])->name('delete')->block();
                Route::post('consolidate', [AdminWalletController::class, 'consolidate'])->name('consolidate')->block();
                Route::post('relay-transaction', [AdminWalletController::class, 'relayTransaction'])->name('relay-transaction')->block();
                Route::post('reset-webhook', [AdminWalletController::class, 'resetWebhook'])->name('reset-webhook')->block();
            });

            Route::get('get-adapters', [AdminWalletController::class, 'getAdapters'])->name('get-adapters');
            Route::post('paginate', [AdminWalletController::class, 'paginate'])->name('paginate');

            Route::get('get-withdrawal-fees', [AdminWalletController::class, 'getWithdrawalFees'])->name('get-withdrawal-fees');
            Route::post('update-withdrawal-fees', [AdminWalletController::class, 'updateWithdrawalFees'])->name('update-withdrawal-fees')->block();

            Route::get('get-exchange-fees', [AdminWalletController::class, 'getExchangeFees'])->name('get-exchange-fees');
            Route::post('update-exchange-fees', [AdminWalletController::class, 'updateExchangeFees'])->name('update-exchange-fees')->block();

            Route::get('get-peer-fees', [AdminWalletController::class, 'getPeerFees'])->name('get-peer-fees');
            Route::post('update-peer-fees', [AdminWalletController::class, 'updatePeerFees'])->name('update-peer-fees')->block();

            Route::prefix('transfer-record')->name('transfer-record.')->group(function () {
                Route::post('paginate', [AdminWalletController::class, 'transferRecordPaginate'])->name('paginate');
                Route::post('{record}/remove', [AdminWalletController::class, 'transferRecordRemove'])->name('remove')->block();
            });
        });

        Route::prefix('payment')->name('payment.')->group(function () {
            Route::get('get-currencies', [AdminPaymentController::class, 'getCurrencies'])->name('get-currencies');

            Route::prefix('supported-currency')->name('supported-currency.')->group(function () {
                Route::post('paginate', [AdminPaymentController::class, 'supportedCurrencyPaginate'])->name('paginate');
                Route::post('create', [AdminPaymentController::class, 'createSupportedCurrency'])->name('create')->block();

                Route::prefix('{currency}')->group(function () {
                    Route::post('update', [AdminPaymentController::class, 'updateSupportedCurrency'])->name('update')->block();
                    Route::post('make-default', [AdminPaymentController::class, 'makeSupportedCurrencyDefault'])->name('make-default')->block();
                    Route::delete('delete', [AdminPaymentController::class, 'deleteSupportedCurrency'])->name('delete')->block();
                });
            });

            Route::prefix('transaction')->name('transaction.')->group(function () {
                Route::post('paginate', [AdminPaymentTransactionController::class, 'paginate'])->name('paginate');

                Route::post('pending-transfer-receive-paginate', [
                    AdminPaymentTransactionController::class, 'pendingTransferReceivePaginate',
                ])->name('pending-transfer-receive-paginate');

                Route::post('pending-transfer-send-paginate', [
                    AdminPaymentTransactionController::class, 'pendingTransferSendPaginate',
                ])->name('pending-transfer-send-paginate');

                Route::prefix('{transaction}')->group(function () {
                    Route::post('complete-transfer', [AdminPaymentTransactionController::class, 'completeTransfer'])->name('complete-transfer')->block();
                    Route::post('cancel-transfer', [AdminPaymentTransactionController::class, 'cancelTransfer'])->name('cancel-transfer')->block();
                });
            });
        });

        Route::prefix('bank')->name('bank.')->group(function () {
            Route::post('create', [AdminBankController::class, 'create'])->name('create')->block();
            Route::get('get-available-countries', [AdminBankController::class, 'getAvailableCountries'])->name('get-available-countries');
            Route::get('get-operating-banks', [AdminBankController::class, 'getOperatingBanks'])->name('get-operating-banks');
            Route::post('paginate', [AdminBankController::class, 'paginate'])->name('paginate');

            Route::prefix('{bank}')->group(function () {
                Route::put('update', [AdminBankController::class, 'update'])->name('update')->block();
                Route::post('set-logo', [AdminBankController::class, 'setLogo'])->name('set-logo')->block();
                Route::delete('delete', [AdminBankController::class, 'delete'])->name('delete')->block();
            });

            Route::prefix('operating-country')->name('operating-country.')->group(function () {
                Route::post('paginate', [AdminBankController::class, 'operatingCountryPaginate'])->name('paginate');
                Route::post('create', [AdminBankController::class, 'createOperatingCountry'])->name('create')->block();

                Route::prefix('{country}')->group(function () {
                    Route::delete('delete', [AdminBankController::class, 'deleteOperatingCountry'])->name('delete')->block();
                });
            });

            Route::prefix('account')->name('account.')->group(function () {
                Route::post('paginate', [AdminBankController::class, 'accountPaginate'])->name('paginate');
                Route::post('create', [AdminBankController::class, 'createAccount'])->name('create')->block();

                Route::prefix('{account}')->group(function () {
                    Route::delete('delete', [AdminBankController::class, 'deleteAccount'])->name('delete')->block();
                });
            });
        });

        Route::prefix('exchange-trade')->name('exchange-trade.')->group(function () {
            Route::post('paginate', [AdminExchangeTradeController::class, 'paginate'])->name('paginate');

            Route::prefix('{trade}')->group(function () {
                Route::patch('complete-pending-buy', [AdminExchangeTradeController::class, 'completePendingBuy'])->name('complete-pending-buy')->block();
                Route::patch('cancel-pending', [AdminExchangeTradeController::class, 'cancelPending'])->name('cancel-pending')->block();
            });
        });

        Route::prefix('peer-payment-category')->name('peer-payment-category.')->group(function () {
            Route::get('all', [AdminPeerPaymentCategoryController::class, 'get'])->name('all');
            Route::post('paginate', [AdminPeerPaymentCategoryController::class, 'paginate'])->name('paginate');
            Route::post('create', [AdminPeerPaymentCategoryController::class, 'create'])->name('create')->block();

            Route::prefix('{category}')->group(function () {
                Route::delete('delete', [AdminPeerPaymentCategoryController::class, 'delete'])->name('delete')->block();
                Route::put('update', [AdminPeerPaymentCategoryController::class, 'update'])->name('update')->block();
            });
        });

        Route::prefix('peer-payment-method')->name('peer-payment-method.')->group(function () {
            Route::post('paginate', [AdminPeerPaymentMethodController::class, 'paginate'])->name('paginate');
            Route::post('create', [AdminPeerPaymentMethodController::class, 'create'])->name('create')->block();

            Route::prefix('{method}')->group(function () {
                Route::delete('delete', [AdminPeerPaymentMethodController::class, 'delete'])->name('delete')->block();
                Route::put('update', [AdminPeerPaymentMethodController::class, 'update'])->name('update')->block();
            });
        });

        Route::prefix('peer-trade')->name('peer-trade.')->group(function () {
            Route::get('get-statistics', [AdminPeerTradeController::class, 'getStatistics'])->name('get-statistics');
            Route::post('paginate', [AdminPeerTradeController::class, 'paginate'])->name('paginate');

            Route::prefix('{trade}')->group(function () {
                Route::post('join', [AdminPeerTradeController::class, 'join'])->name('join')->block();
            });
        });

        Route::prefix('giftcard')->name('giftcard.')->group(function () {
            Route::post('paginate', [AdminGiftcardController::class, 'paginate'])->name('paginate');
            Route::post('create', [AdminGiftcardController::class, 'create'])->name('create')->block();

            Route::prefix('{giftcard}')->group(function () {
                Route::put('update', [AdminGiftcardController::class, 'update'])->name('update')->block();
                Route::post('upload-thumbnail', [AdminGiftcardController::class, 'uploadThumbnail'])->name('upload-thumbnail')->block();
                Route::delete('delete', [AdminGiftcardController::class, 'delete'])->name('delete')->block();

                Route::prefix('content')->name('content.')->group(function () {
                    Route::post('paginate', [AdminGiftcardController::class, 'contentPaginate'])->name('paginate');
                    Route::post('create', [AdminGiftcardController::class, 'createContent'])->name('create')->block();

                    Route::prefix('{content}')->group(function () {
                        Route::delete('delete', [AdminGiftcardController::class, 'deleteContent'])->name('delete')->block();
                    });
                });
            });

            Route::prefix('content')->name('content.')->group(function () {
                Route::post('purchased-paginate', [AdminGiftcardController::class, 'purchasedContentPaginate'])->name('purchased-paginate');
            });

            Route::prefix('brand')->name('brand.')->group(function () {
                Route::get('all', [AdminGiftcardController::class, 'getBrands'])->name('all');
                Route::post('paginate', [AdminGiftcardController::class, 'brandPaginate'])->name('paginate');
                Route::post('create', [AdminGiftcardController::class, 'createBrand'])->name('create')->block();

                Route::prefix('{brand}')->group(function () {
                    Route::delete('delete', [AdminGiftcardController::class, 'deleteBrand'])->name('delete')->block();
                    Route::put('update', [AdminGiftcardController::class, 'updateBrand'])->name('update')->block();
                });
            });
        });

        Route::prefix('locale')->name('locale.')->group(function () {
            Route::get('get', [AdminLocaleController::class, 'get'])->name('get');
            Route::post('remove', [AdminLocaleController::class, 'remove'])->name('remove')->block();
            Route::post('add', [AdminLocaleController::class, 'add'])->name('add')->block();
            Route::post('import', [AdminLocaleController::class, 'import'])->name('import')->block();

            Route::prefix('group/{group}')->name('group.')->group(function () {
                Route::get('get', [AdminLocaleController::class, 'getGroup'])->name('get');
                Route::patch('update', [AdminLocaleController::class, 'updateGroup'])->name('update')->middleware('restrict.demo')->block();
                Route::post('export', [AdminLocaleController::class, 'exportGroup'])->name('export')->middleware('restrict.demo')->block();
            });
        });

        Route::prefix('theme')->name('theme.')->group(function () {
            Route::post('set-mode', [AdminThemeController::class, 'setMode'])->name('set-mode')->block();
            Route::post('set-direction', [AdminThemeController::class, 'setDirection'])->name('set-direction')->middleware('restrict.demo')->block();
            Route::post('set-color', [AdminThemeController::class, 'setColor'])->name('set-color')->block();
        });

        Route::prefix('brand')->name('brand.')->group(function () {
            Route::post('upload-favicon', [AdminBrandController::class, 'uploadFavicon'])->name('upload-favicon')->middleware('restrict.demo')->block();
            Route::post('update-social-links', [AdminBrandController::class, 'updateSocialLinks'])->name('update-social-links')->middleware('restrict.demo')->block();
            Route::post('upload-logo', [AdminBrandController::class, 'uploadLogo'])->name('upload-logo')->middleware('restrict.demo')->block();
        });

        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('get-general', [AdminSettingsController::class, 'getGeneral'])->name('get-general');
            Route::post('update-general', [AdminSettingsController::class, 'updateGeneral'])->name('update-general')->middleware('restrict.demo')->block();

            Route::get('get-service', [AdminSettingsController::class, 'getService'])->name('get-service');
            Route::post('update-service', [AdminSettingsController::class, 'updateService'])->name('update-service')->middleware('restrict.demo')->block();
        });

        Route::prefix('module')->name('module.')->group(function () {
            Route::post('paginate', [AdminModuleController::class, 'paginate'])->name('paginate');
            Route::get('get-operators', [AdminModuleController::class, 'getOperators'])->name('get-operators');

            Route::prefix('{module}')->group(function () {
                Route::patch('disable', [AdminModuleController::class, 'disable'])->name('disable')->block();
                Route::post('set-operator', [AdminModuleController::class, 'setOperator'])->name('set-operator')->block();
                Route::patch('enable', [AdminModuleController::class, 'enable'])->name('enable')->block();
            });
        });

        Route::prefix('grid')->name('grid.')->group(function () {
            Route::post('paginate', [AdminGridController::class, 'paginate'])->name('paginate');

            Route::prefix('{grid}')->group(function () {
                Route::patch('disable', [AdminGridController::class, 'disable'])->name('disable')->block();
                Route::patch('enable', [AdminGridController::class, 'enable'])->name('enable')->block();
            });
        });

        Route::prefix('feature-limit')->name('feature-limit.')->group(function () {
            Route::get('get', [AdminFeatureLimitController::class, 'get'])->name('get');
            Route::post('update', [AdminFeatureLimitController::class, 'update'])->name('update')->block();

            Route::get('get-settings', [AdminFeatureLimitController::class, 'getSettings'])->name('get-settings');
            Route::post('update-settings', [AdminFeatureLimitController::class, 'updateSettings'])->name('update-settings')->block();
        });

        Route::prefix('required-document')->name('required-document.')->group(function () {
            Route::post('paginate', [AdminRequiredDocumentController::class, 'paginate'])->name('paginate');
            Route::post('create', [AdminRequiredDocumentController::class, 'create'])->name('create')->block();

            Route::prefix('{document}')->group(function () {
                Route::delete('delete', [AdminRequiredDocumentController::class, 'delete'])->name('delete')->block();
                Route::put('update', [AdminRequiredDocumentController::class, 'update'])->name('update')->block();
            });
        });

        Route::prefix('system-logs')->name('system-logs.')->group(function () {
            Route::post('paginate', [AdminSystemLogController::class, 'paginate'])->name('paginate');
            Route::post('mark-all-as-seen', [AdminSystemLogController::class, 'markAllAsSeen'])->name('mark-all-as-seen')->block();

            Route::prefix('{log}')->group(function () {
                Route::post('mark-as-seen', [AdminSystemLogController::class, 'markAsSeen'])->name('mark-as-seen')->block();
            });
        });
    });
});

Route::prefix('global')->name('global.')->group(function () {
    Route::get('wallets', [GlobalController::class, 'wallets'])->name('wallets');
    Route::get('supported-currencies', [GlobalController::class, 'supportedCurrencies'])->name('supported-currencies');
    Route::get('countries', [GlobalController::class, 'countries'])->name('countries');
    Route::get('operating-countries', [GlobalController::class, 'operatingCountries'])->name('operating-countries');
});

// Webhook
Route::prefix('webhook')->name('webhook.')->group(function () {
    Route::prefix('coin')->name('coin.')->group(function () {
        Route::prefix('{identifier}')->group(function () {
            Route::post('pending-approval', [CoinController::class, 'handlePendingApprovalWebhook'])->name('pending-approval');
            Route::post('transaction', [CoinController::class, 'handleTransactionWebhook'])->name('transaction');
        });
    });
});

// IP Address Data
Route::prefix('ip')->name('ip.')->group(function () {
    Route::post('info', [AppController::class, 'ipInfo'])->name('info');
});

// Locale Routes
Route::prefix('locale')->name('locale.')->group(function () {
    Route::post('set', [LocaleController::class, 'set'])->name('set');
    Route::post('get', [LocaleController::class, 'get'])->name('get');
});

Route::name('installer.')->group(function () {
    Route::get('installer', [InstallerController::class, 'view']);
    Route::post('installer/register', [InstallerController::class, 'register'])->name('register');
    Route::post('installer/install', [InstallerController::class, 'install'])->name('install');
});

Route::middleware([AddCspHeaders::class, 'installer.redirect'])->group(function () {
    Route::get('admin/{any?}', [AppController::class, 'admin'])->where('any', '.*')->name('admin');
    Route::get('{any?}', [AppController::class, 'main'])->where('any', '.*')->name('main');
});
