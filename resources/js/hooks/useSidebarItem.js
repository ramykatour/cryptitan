import {useCallback} from "react";
import router from "router/router";
import {useAuth} from "models/Auth";
import useModules from "hooks/useModules";
import {isString} from "lodash";

/**
 * @returns {(function({key: *, params: *, permission: *, module: *, children: *}): ({path: *, children: *, icon: *, title: *, key: *}))}
 */
const useSidebarItem = () => {
    const auth = useAuth();
    const modules = useModules();

    return useCallback(
        ({key, params, permission, module, children}) => {
            if (isString(module) && !modules[module]) {
                return null;
            }

            if (permission && !auth.can(permission)) {
                return null;
            }

            return {
                title: router.getName(key),
                path: router.generatePath(key, params),
                icon: router.getIcon(key),
                ...{key, children}
            };
        },
        [auth, modules]
    );
};

export default useSidebarItem;
