import React from "react";
import router from "router";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgotPassword";
import Result404 from "components/Result404";

const Auth = () => {
    const indexRoute = router.getRoutePath("auth.login");

    return (
        <Routes>
            <Route index element={<Navigate to={indexRoute} />} />

            <Route
                path={router.getRoutePath("auth.login")}
                element={<Login />}
            />

            <Route
                path={router.getRoutePath("auth.forgot-password")}
                element={<ForgotPassword />}
            />

            <Route
                path={router.getRoutePath("auth.register")}
                element={<Register />}
            />

            <Route path="*" element={<Result404 />} />
        </Routes>
    );
};

export default Auth;
