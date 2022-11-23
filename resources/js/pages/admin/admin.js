import React from "react";
import {lazy} from "utils/index";
import router from "router";
import {Navigate, Route, Routes} from "react-router-dom";
import {can} from "utils/middleware";
import Middleware from "components/Middleware";
import Result404 from "components/Result404";

const Home = lazy(() =>
    import(/* webpackChunkName: 'admin.home' */ "./pages/home")
);

const Wallets = lazy(() =>
    import(/* webpackChunkName: 'admin.wallets' */ "./pages/wallets")
);

const Payments = lazy(() =>
    import(/* webpackChunkName: 'admin.payments' */ "./pages/payments")
);

const Users = lazy(() =>
    import(/* webpackChunkName: 'admin.users' */ "./pages/users")
);

const Giftcards = lazy(() =>
    import(/* webpackChunkName: 'admin.giftcards' */ "./pages/giftcards")
);

const Exchange = lazy(() =>
    import(/* webpackChunkName: 'admin.exchange' */ "./pages/exchange")
);

const Peer = lazy(() =>
    import(/* webpackChunkName: 'admin.peer' */ "./pages/peer")
);

const Settings = lazy(() =>
    import(/* webpackChunkName: 'admin.settings' */ "./pages/settings")
);

const Modules = lazy(() =>
    import(/* webpackChunkName: 'admin.modules' */ "./pages/modules")
);

const Localization = lazy(() =>
    import(/* webpackChunkName: 'admin.localization' */ "./pages/localization")
);

const Customize = lazy(() =>
    import(/* webpackChunkName: 'admin.customize' */ "./pages/customize")
);

const Admin = () => {
    const indexRoute = router.getRoutePath("admin.home");

    return (
        <Routes>
            <Route index element={<Navigate to={indexRoute} />} />

            <Route
                path={router.getRoutePath("admin.home")}
                element={<Home />}
            />

            <Route
                path={router.getRoutePath("admin.wallets")}
                element={
                    <Middleware rules={can("manage_wallets")}>
                        <Wallets />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("admin.users")}
                element={<Users />}
            />

            <Route
                path={router.getRoutePath("admin.payments")}
                element={
                    <Middleware rules={can("manage_payments")}>
                        <Payments />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("admin.giftcards")}
                element={
                    <Middleware rules={can("manage_giftcards")}>
                        <Giftcards />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("admin.exchange")}
                element={
                    <Middleware rules={can("manage_exchange")}>
                        <Exchange />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("admin.peer")}
                element={
                    <Middleware rules={can("manage_peer_trades")}>
                        <Peer />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("admin.settings")}
                element={
                    <Middleware rules={can("manage_settings")}>
                        <Settings />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("admin.modules")}
                element={
                    <Middleware rules={can("manage_modules")}>
                        <Modules />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("admin.localization")}
                element={
                    <Middleware rules={can("manage_localization")}>
                        <Localization />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("admin.customize")}
                element={
                    <Middleware rules={can("manage_customization")}>
                        <Customize />
                    </Middleware>
                }
            />

            <Route path="*" element={<Result404 />} />
        </Routes>
    );
};

export default Admin;
