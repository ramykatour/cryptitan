import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {fetchPaymentAccount} from "redux/slices/payment";
import {useWalletAccountSelector} from "hooks/account";
import router from "router/router";
import {Navigate, Route, Routes} from "react-router-dom";
import Trades from "./pages/trades";
import CreateOffer from "./pages/createOffer";
import Result404 from "components/Result404";
import Offer from "./pages/offer";
import Offers from "./pages/offers";
import Trade from "./pages/trade";

const Peer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchWalletAccounts());
        dispatch(fetchPaymentAccount());
    }, [dispatch]);

    useWalletAccountSelector();

    const indexRoute = router.getRoutePath("main.peer.buy-crypto");

    return (
        <Routes>
            <Route index element={<Navigate to={indexRoute} />} />

            <Route
                path={router.getRoutePath("main.peer.offer")}
                element={<Offer />}
            />

            <Route
                path={router.getRoutePath("main.peer.buy-crypto")}
                element={<Offers type="sell" />}
            />

            <Route
                path={router.getRoutePath("main.peer.sell-crypto")}
                element={<Offers type="buy" />}
            />

            <Route
                path={router.getRoutePath("main.peer.trade")}
                element={<Trade />}
            />

            <Route
                path={router.getRoutePath("main.peer.trades")}
                element={<Trades />}
            />

            <Route
                path={router.getRoutePath("main.peer.create-offer")}
                element={<CreateOffer />}
            />

            <Route path="*" element={<Result404 />} />
        </Routes>
    );
};

export default Peer;
