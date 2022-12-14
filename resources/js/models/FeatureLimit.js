import Model from "models/Model";
import coinsFill from "@iconify-icons/ri/coins-fill";
import giftFill from "@iconify-icons/ri/gift-fill";
import bankCardFill from "@iconify-icons/ri/bank-card-fill";
import bankFill from "@iconify-icons/ri/bank-fill";
import databaseFill from "@iconify-icons/ri/database-fill";
import {formatNumber} from "utils/formatter";

export default class FeatureLimit extends Model {
    icon() {
        switch (this.get("name")) {
            case "wallet_exchange":
                return coinsFill;
            case "giftcard_trade":
                return giftFill;
            case "payments_withdrawal":
                return bankFill;
            case "payments_deposit":
                return bankCardFill;
            default:
                return databaseFill;
        }
    }

    unit() {
        switch (this.get("type")) {
            case "amount":
                return "USD";
            default:
                return "times";
        }
    }

    format(value) {
        const formatted = formatNumber(value);

        switch (this.get("type")) {
            case "count":
                return `${formatted} times`;
            case "amount":
                return `${formatted} USD`;
            default:
                return formatted;
        }
    }
}
