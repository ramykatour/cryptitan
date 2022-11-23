import React from "react";
import {Navigate} from "react-router-dom";
import router from "router";

export function auth(redirect) {
    return function (next) {
        return function (node, auth) {
            if (!auth.check()) {
                return <Navigate to={router.generatePath(redirect)} replace />;
            }

            return next(node, auth);
        };
    };
}

export function guest(redirect) {
    return function (next) {
        return function (node, auth) {
            if (auth.check()) {
                return <Navigate to={router.generatePath(redirect)} replace />;
            }

            return next(node, auth);
        };
    };
}
