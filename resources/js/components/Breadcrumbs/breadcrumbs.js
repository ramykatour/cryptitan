import React from "react";
import {last} from "lodash";
import PropTypes from "prop-types";
import {Link as RouterLink} from "react-router-dom";
import {Breadcrumbs as BaseBreadcrumbs, Link, Typography} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

function Breadcrumbs({links, ...other}) {
    const lastKey = last(links).key;

    return (
        <BaseBreadcrumbs maxItems={2} separator={<Separator />} {...other}>
            {links.map((link) => (
                <LinkItem key={link.key} link={link} lastKey={lastKey} />
            ))}
        </BaseBreadcrumbs>
    );
}

const LinkItem = ({link, lastKey}) => {
    switch (link.key) {
        case lastKey:
            return (
                <Typography
                    variant="body2"
                    color="text.disabled"
                    sx={{maxWidth: 200}}
                    noWrap>
                    {link.name}
                </Typography>
            );
        default:
            return (
                <Link
                    variant="body2"
                    component={RouterLink}
                    to={link.href}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "text.primary",
                        lineHeight: 2
                    }}>
                    {link.name}
                </Link>
            );
    }
};

const Separator = () => {
    return <ArrowRightIcon color="text.disabled" fontSize="small" />;
};

Breadcrumbs.propTypes = {
    links: PropTypes.array.isRequired,
    activeLast: PropTypes.bool
};

export default Breadcrumbs;
