import {useEffect} from "react";
import {useLocation} from "react-router-dom";

const PageRefresh = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        window.location.href = pathname;
    }, [pathname]);

    return null;
};

export default PageRefresh;
