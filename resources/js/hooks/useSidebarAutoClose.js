import {useLocation} from "react-router-dom";
import {usePrevious} from "utils/helpers";
import {useEffect} from "react";

export default function useSidebarAutoClose(sidebarOpen, onCloseSidebar) {
    const {pathname} = useLocation();
    const prevPathname = usePrevious(pathname);
    const changed = pathname !== prevPathname;

    useEffect(() => {
        if (changed && sidebarOpen) {
            onCloseSidebar();
        }
    }, [changed, sidebarOpen, onCloseSidebar]);
}
