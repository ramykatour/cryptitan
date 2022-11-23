import {useSelector} from "react-redux";
import {get} from "lodash";
import {useAuth} from "models/Auth";
import {useMemo} from "react";

export function useVerification() {
    return useSelector((state) => {
        return get(state, "user.verification");
    });
}

export function useTokenField() {
    const auth = useAuth();

    return useMemo(() => {
        return auth.requireTwoFactor() ? "token" : "password";
    }, [auth]);
}
