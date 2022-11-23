import React, {useMemo} from "react";
import {Box, Stack, Typography} from "@mui/material";
import PropTypes from "prop-types";
import router, {splitNestedKeys} from "router";
import {useLocation, useParams} from "react-router-dom";
import {isEmpty, defaultTo} from "lodash";
import Breadcrumbs from "components/Breadcrumbs";

const HeaderBreadcrumbs = ({action, title, sx, ...otherProps}) => {
    const params = useParams();
    const {pathname} = useLocation();

    const key = useMemo(() => {
        return router.getKeyByUrl(pathname);
    }, [pathname]);

    const links = useMemo(() => {
        return splitNestedKeys(key).map((k) => ({
            name: router.getName(k),
            href: router.generatePath(k, params),
            icon: router.getIcon(k),
            ...{key: k}
        }));
    }, [key, params]);

    return (
        <Stack sx={sx} mb={5} spacing={2}>
            <Stack direction="row" alignItems="center">
                <Box sx={{flexGrow: 1, minWidth: 0}}>
                    <Typography variant="h4" gutterBottom noWrap>
                        {defaultTo(title, router.getName(key))}
                    </Typography>

                    {!isEmpty(links) && (
                        <Breadcrumbs links={links} {...otherProps} />
                    )}
                </Box>

                {action && <Box>{action}</Box>}
            </Stack>
        </Stack>
    );
};

HeaderBreadcrumbs.propTypes = {
    action: PropTypes.node,
    sx: PropTypes.object
};

export default HeaderBreadcrumbs;
