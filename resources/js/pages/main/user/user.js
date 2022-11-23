import React from "react";
import router from "router";
import Account from "./pages/account";
import {Navigate, Route, Routes} from "react-router-dom";
import Purchases from "./pages/purchases";
import Result404 from "components/Result404";

const User = () => {
    const indexRoute = router.getRoutePath("main.user.account");

    return (
        <Routes>
            <Route index element={<Navigate to={indexRoute} />} />

            <Route
                path={router.getRoutePath("main.user.account")}
                element={<Account />}
            />

            <Route
                path={router.getRoutePath("main.user.purchases")}
                element={<Purchases />}
            />

            <Route path="*" element={<Result404 />} />
        </Routes>
    );
};

export default User;
