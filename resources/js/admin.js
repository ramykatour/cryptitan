import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Provider, useDispatch} from "react-redux";
import Bootstrap from "./bootstrap";
import Localization from "./localization";
import store from "./store";
import Middleware from "components/Middleware";
import {auth as authRule, can, guest as guestRule} from "utils/middleware";
import {lazy} from "utils/index";
import router from "router/router";
import {useAuth} from "models/Auth";
import PageRefresh from "components/PageRefresh";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {fetchPaymentAccount} from "redux/slices/payment";
import {fetchVerification} from "redux/slices/user";
import {
    fetchCountries,
    fetchOperatingCountries,
    fetchSupportedCurrencies,
    fetchWallets
} from "redux/slices/global";

import "scss/index.scss";

const AdminLayout = lazy(() =>
    import(/* webpackChunkName: 'admin' */ "layouts/Admin")
);

const AuthLayout = lazy(() =>
    import(/* webpackChunkName: 'auth' */ "layouts/Auth")
);

const Application = () => {
    const auth = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        if (auth.check()) {
            dispatch(fetchWalletAccounts());
            dispatch(fetchPaymentAccount());
            dispatch(fetchVerification());
        }
    }, [dispatch, auth]);

    useEffect(() => {
        dispatch(fetchCountries());
        dispatch(fetchSupportedCurrencies());
        dispatch(fetchOperatingCountries());
        dispatch(fetchWallets());
    }, [dispatch]);

    return (
        <Routes>
            <Route
                path={router.getRoutePath("auth")}
                element={
                    <Middleware rules={guestRule("admin.home")}>
                        <AuthLayout />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("admin")}
                element={
                    <Middleware rules={can("access_control_panel")}>
                        <AdminLayout />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("main")}
                element={
                    <Middleware rules={authRule("auth.login")}>
                        <PageRefresh />
                    </Middleware>
                }
            />
        </Routes>
    );
};

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Localization>
                <Bootstrap>
                    <Application />
                </Bootstrap>
            </Localization>
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);
