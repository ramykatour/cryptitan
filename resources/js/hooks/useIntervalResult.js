import {useCallback, useEffect, useRef, useState} from "react";

export const useIntervalResult = (callback, delay = 30000) => {
    const action = useRef(callback);
    const [result, setResult] = useState();

    const runAction = useCallback(() => {
        setResult(action.current());
    }, []);

    useEffect(() => {
        runAction();
    }, [runAction]);

    useEffect(() => {
        const interval = setInterval(runAction, delay);
        return () => clearInterval(interval);
    }, [runAction, delay]);

    useEffect(() => {
        action.current = callback;
    }, [callback]);

    return result;
};
