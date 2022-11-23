import React, {useCallback} from "react";
import IdleTimer from "react-idle-timer";
import {errorHandler, route, useRequest} from "services/Http";
import {useAuth} from "models/Auth";

const PresenceTimer = () => {
    const [request] = useRequest();
    const auth = useAuth();

    const onIdle = useCallback(() => {
        request.post(route("user.set-away")).catch(errorHandler());
    }, [request]);

    const onActive = useCallback(() => {
        request.post(route("user.set-online")).catch(errorHandler());
    }, [request]);

    if (!auth.check()) {
        return null;
    }

    return (
        <IdleTimer
            onIdle={onIdle}
            onActive={onActive}
            timeout={1000 * 60}
            debounce={250}
        />
    );
};

export default PresenceTimer;
