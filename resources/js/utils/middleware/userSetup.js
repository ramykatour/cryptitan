import React from "react";
import {Navigate} from "react-router-dom";
import router from "router";

export function requireUserSetup() {
    return function (next) {
        return function (node, auth) {
            if (auth.isUserSetupRequired()) {
                return (
                    <Navigate
                        to={router.generatePath("main.user-setup")}
                        replace
                    />
                );
            }

            return next(node, auth);
        };
    };
}

export function withoutUserSetup() {
    return function (next) {
        return function (node, auth) {
            if (!auth.isUserSetupRequired()) {
                return (
                    <Navigate to={router.generatePath("main.home")} replace />
                );
            }

            return next(node, auth);
        };
    };
}
