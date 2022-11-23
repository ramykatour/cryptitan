import React from "react";
import {lazy} from "utils/index";
import router from "router";
import {Navigate, Route, Routes} from "react-router-dom";
import {requireUserSetup, withoutUserSetup} from "utils/middleware";
import Middleware from "components/Middleware";
import Result404 from "components/Result404";
import Module from "components/Module";

const Home = lazy(() => import(/* webpackChunkName: 'home' */ "./home"));

const UserSetup = lazy(() =>
    import(/* webpackChunkName: 'userSetup' */ "./userSetup")
);

const Payments = lazy(() =>
    import(/* webpackChunkName: 'payments' */ "./payments")
);

const User = lazy(() => import(/* webpackChunkName: 'user' */ "./user"));

const Wallets = lazy(() =>
    import(/* webpackChunkName: 'wallets' */ "./wallets")
);

const Exchange = lazy(() =>
    import(/* webpackChunkName: 'exchange' */ "./exchange")
);

const Peer = lazy(() => import(/* webpackChunkName: 'peer' */ "./peer"));

const Giftcards = lazy(() =>
    import(/* webpackChunkName: 'giftcards' */ "./giftcards")
);

const Profile = lazy(() =>
    import(/* webpackChunkName: 'profile' */ "./profile")
);

const Main = () => {
    const indexRoute = router.getRoutePath("main.home");

    return (
        <Routes>
            <Route index element={<Navigate to={indexRoute} />} />

            <Route
                path={router.getRoutePath("main.home")}
                element={
                    <Middleware rules={requireUserSetup()}>
                        <Home />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("main.user-setup")}
                element={
                    <Middleware rules={withoutUserSetup()}>
                        <UserSetup />
                    </Middleware>
                }
            />

            <Route
                path={router.getRoutePath("main.payments")}
                element={
                    <Middleware rules={requireUserSetup()}>
                        <Payments />
                    </Middleware>
                }
            />

            <Route path={router.getRoutePath("main.user")} element={<User />} />

            <Route
                path={router.getRoutePath("main.wallets")}
                element={
                    <Module module="wallet">
                        <Middleware rules={requireUserSetup()}>
                            <Wallets />
                        </Middleware>
                    </Module>
                }
            />

            <Route
                path={router.getRoutePath("main.exchange")}
                element={
                    <Module module="exchange">
                        <Middleware rules={requireUserSetup()}>
                            <Exchange />
                        </Middleware>
                    </Module>
                }
            />

            <Route
                path={router.getRoutePath("main.peer")}
                element={
                    <Module module="peer">
                        <Middleware rules={requireUserSetup()}>
                            <Peer />
                        </Middleware>
                    </Module>
                }
            />

            <Route
                path={router.getRoutePath("main.profile")}
                element={<Profile />}
            />

            <Route
                path={router.getRoutePath("main.giftcards")}
                element={
                    <Module module="giftcard">
                        <Middleware rules={requireUserSetup()}>
                            <Giftcards />
                        </Middleware>
                    </Module>
                }
            />

            <Route path="*" element={<Result404 />} />
        </Routes>
    );
};

export default Main;
