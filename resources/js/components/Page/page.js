import React, {forwardRef, useMemo} from "react";
import PropTypes from "prop-types";
import {Helmet} from "react-helmet-async";
import {Box} from "@mui/material";
import {useMatch} from "react-router-dom";
import context from "context";
import router from "router";

const Page = forwardRef(({children, title, ...other}, ref) => {
    const isAdminPath = useMatch(`${router.getPath("admin")}/*`);

    const template = useMemo(() => {
        const content = isAdminPath ? "%s (Control Panel)" : "%s";
        return `${content} | ${context.name}`;
    }, [isAdminPath]);

    return (
        <Box ref={ref} {...other}>
            {title && (
                <Helmet titleTemplate={template}>
                    <title>{title}</title>
                </Helmet>
            )}
            {children}
        </Box>
    );
});

Page.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string
};

export default Page;
