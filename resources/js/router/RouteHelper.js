import React from "react";
import {generatePath as _generatePath, matchPath} from "react-router-dom";
import {assign, findKey, forEach, isEmpty, isFunction, pick} from "lodash";
import {Icon} from "@iconify/react";
import {Box} from "@mui/material";
import {joinPath} from "utils/helpers";

class RouteHelper {
    cache = {};

    constructor(routes) {
        this._parse(routes);
    }

    _parse(dataset, keyChain = [], pathChain = []) {
        forEach(dataset, (o) => {
            const currPathChain = pathChain.concat(o.path);
            const currKeyChain = keyChain.concat(o.key);
            const route = pick(o, ["name", "icon", "path"]);

            route.fullPath = joinPath(...currPathChain).replace(/\/\*/g, "");

            this._parse(o.children, currKeyChain, currPathChain);
            this.cache[currKeyChain.join(".")] = route;
        });
    }

    getRoute(key) {
        const data = this.cache[key];

        if (isEmpty(data)) {
            throw "Route data does not exists.";
        }

        return assign({}, data, {
            getName: () => data.name,
            getIcon: () => data.icon,
            getRoutePath: () => data.path,
            getPath: () => data.fullPath,
            iconComponent: (props) => {
                return <Box {...props} component={Icon} icon={data.icon} />;
            },
            generatePath: (params) => {
                return _generatePath(data.fullPath, params);
            }
        });
    }

    getName(key) {
        return this.get(key, (d) => d.getName());
    }

    getIconComponent(key) {
        return this.get(key, (d) => d.iconComponent);
    }

    generatePath(key, params) {
        return this.get(key, (d) => d.generatePath(params));
    }

    getIcon(key) {
        return this.get(key, (d) => d.getIcon());
    }

    getPath(key) {
        return this.get(key, (d) => d.getPath());
    }

    getRoutePath(key) {
        return this.get(key, (d) => d.getRoutePath());
    }

    getKeyByUrl(url) {
        return findKey(this.cache, (o) => {
            return !isEmpty(matchPath(o.fullPath, url));
        });
    }

    get(key, predicate) {
        return isFunction(predicate)
            ? predicate(this.getRoute(key))
            : this.getRoute(key);
    }
}

export default RouteHelper;
