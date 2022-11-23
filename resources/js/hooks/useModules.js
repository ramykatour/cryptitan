import {useSelector} from "react-redux";
import {get} from "lodash";

export default function useModules() {
    return useSelector((state) => {
        return get(state, "settings.modules");
    });
}
