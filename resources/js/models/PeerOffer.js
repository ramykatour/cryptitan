import Model from "models/Model";
import {defineMessages} from "react-intl";
import {upperFirst} from "lodash";

const messages = defineMessages({
    bankAccount: {defaultMessage: "Bank Transfer"},
    sell: {defaultMessage: "Sell {coin} to {user} with {payment}"},
    buy: {defaultMessage: "Buy {coin} from {user} with {payment}"}
});

class PeerOffer extends Model {
    isSellOffer() {
        return this.get("type") === "sell";
    }

    isBuyOffer() {
        return this.get("type") === "buy";
    }

    isAvailable() {
        return this.isOpened() && this.get("display") && this.get("status");
    }

    isOpened() {
        return !this.isClosed();
    }

    isClosed() {
        return Boolean(this.get("closed_at"));
    }

    title(intl) {
        const params = this.titleParams(intl);

        if (this.isBuyOffer()) {
            return intl?.formatMessage(messages.sell, params);
        } else {
            return intl?.formatMessage(messages.buy, params);
        }
    }

    getPaymentTitle(intl) {
        switch (this.get("payment")) {
            case "bank_account":
                return intl?.formatMessage(messages.bankAccount);
            case "payment_method":
                return this.get("payment_method.name");
        }
    }

    titleParams(intl) {
        return {
            coin: this.get("coin.symbol"),
            user: upperFirst(this.get("owner.name")),
            payment: this.getPaymentTitle(intl)
        };
    }
}

export default PeerOffer;
