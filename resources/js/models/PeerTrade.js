import Model from "models/Model";
import {upperFirst} from "lodash";
import {defineMessages} from "react-intl";

const messages = defineMessages({
    title: {defaultMessage: "{coin} trade between {buyer} and {seller}"},
    seller: {defaultMessage: "Sell {coin} to {buyer} with {payment}"},
    buyer: {defaultMessage: "Buy {coin} from {seller} with {payment}"},
    bankAccount: {defaultMessage: "Bank Transfer"}
});

class PeerTrade extends Model {
    channel() {
        return "App.Models.PeerTrade." + this.get("id");
    }

    ratable() {
        return this.isCompleted() && this.isPersonal();
    }

    conversationChannel() {
        return "Conversation." + this.get("chat_conversation_id");
    }

    isCompleted() {
        return this.get("status") === "completed";
    }

    isActive() {
        return this.get("status") === "active";
    }

    isDisputed() {
        return this.get("status") === "disputed";
    }

    isPersonal() {
        return this.get("role") === "buyer" || this.get("role") === "seller";
    }

    title(intl) {
        const params = this.titleParams(intl);

        switch (this.get("role")) {
            case "buyer":
                return intl?.formatMessage(messages.buyer, params);
            case "seller":
                return intl?.formatMessage(messages.seller, params);
            default:
                return intl?.formatMessage(messages.title, params);
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
            seller: upperFirst(this.get("seller.name")),
            buyer: upperFirst(this.get("buyer.name")),
            payment: this.getPaymentTitle(intl)
        };
    }
}

export default PeerTrade;
