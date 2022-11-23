import React, {useEffect} from "react";
import router from "router";
import Trade from "./pages/trade";
import {Navigate, Route, Routes} from "react-router-dom";
import Swap from "./pages/swap";
import {useWalletAccountSelector} from "hooks/account";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {fetchPaymentAccount} from "redux/slices/payment";
import {useDispatch} from "react-redux";
import Result404 from "components/Result404";

const Exchange = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchWalletAccounts());
        dispatch(fetchPaymentAccount());
    }, [dispatch]);

    useWalletAccountSelector();

    const indexRoute = router.getRoutePath("main.exchange.trade");

    return (
        <Routes>
            <Route index element={<Navigate to={indexRoute} />} />

            <Route
                path={router.getRoutePath("main.exchange.trade")}
                element={<Trade />}
            />

            <Route
                path={router.getRoutePath("main.exchange.swap")}
                element={<Swap />}
            />

            <Route path="*" element={<Result404 />} />
        </Routes>
    );
};

export default Exchange;
