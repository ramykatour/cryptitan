import PriceChart from "components/PriceChart";
import PaymentAccountChart from "components/PaymentAccountChart";
import WalletAccountChart from "components/WalletAccountChart";
import FeatureLimits from "components/FeatureLimits";
import RecentTransaction from "components/RecentTransaction";
import ActivePeerTradeSell from "components/ActivePeerTradeSell";
import ActivePeerTradeBuy from "components/ActivePeerTradeBuy";

export default [
    {
        name: "price_chart",
        dimensions: PriceChart.dimensions,
        component: PriceChart
    },
    {
        name: "payment_account_chart",
        dimensions: PaymentAccountChart.dimensions,
        component: PaymentAccountChart
    },
    {
        name: "wallet_account_chart",
        dimensions: WalletAccountChart.dimensions,
        component: WalletAccountChart
    },
    {
        name: "recent_activity",
        dimensions: RecentTransaction.dimensions,
        component: RecentTransaction
    },
    {
        name: "feature_limits",
        dimensions: FeatureLimits.dimensions,
        component: FeatureLimits
    },
    {
        name: "active_peer_trade_buy",
        dimensions: ActivePeerTradeBuy.dimensions,
        component: ActivePeerTradeBuy
    },
    {
        name: "active_peer_trade_sell",
        dimensions: ActivePeerTradeSell.dimensions,
        component: ActivePeerTradeSell
    }
];
