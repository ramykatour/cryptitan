import React, {isValidElement} from "react";
import PropTypes from "prop-types";
import {alpha, styled} from "@mui/material/styles";
import {Box} from "@mui/material";
import {assign} from "lodash";

const Label = ({
    children,
    color = "default",
    variant = "ghost",
    startIcon,
    endIcon,
    sx
}) => {
    return (
        <Container
            color={color}
            variant={variant}
            sx={{
                ...(isValidElement(startIcon) && {pl: 0.75}),
                ...(isValidElement(endIcon) && {pr: 0.75}),
                ...sx
            }}>
            {isValidElement(startIcon) && (
                <IconWrapper sx={{mr: 0.75}}>{startIcon}</IconWrapper>
            )}

            {children}

            {isValidElement(endIcon) && (
                <IconWrapper sx={{ml: 0.75}}>{endIcon}</IconWrapper>
            )}
        </Container>
    );
};

Label.propTypes = {
    children: PropTypes.node,
    startIcon: PropTypes.node,
    endIcon: PropTypes.node,
    color: PropTypes.oneOf([
        "default",
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error"
    ]),
    variant: PropTypes.oneOf(["filled", "outlined", "ghost"]),
    sx: PropTypes.object
};

const Container = styled(({color, variant, ...otherProps}) => {
    return <span {...otherProps} />;
})(({theme, color, variant}) => {
    const isLight = theme.palette.mode === "light";

    const styleFilled = (color) => ({
        color: theme.palette[color].contrastText,
        backgroundColor: theme.palette[color].main
    });

    const styleGhost = (color) => ({
        color: theme.palette[color][isLight ? "dark" : "light"],
        backgroundColor: alpha(theme.palette[color].main, 0.16)
    });

    const styleOutlined = (color) => ({
        color: theme.palette[color].main,
        border: `1px solid ${theme.palette[color].main}`,
        backgroundColor: "transparent"
    });

    const baseStyle = {
        minWidth: 22,
        height: 22,
        borderRadius: 6,
        lineHeight: 0,
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "default",
        whiteSpace: "nowrap",
        fontFamily: theme.typography.fontFamily,
        padding: theme.spacing(0, 1),
        fontSize: theme.typography.pxToRem(12),
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightBold
    };

    if (color === "default") {
        switch (variant) {
            case "outlined":
                assign(baseStyle, {
                    backgroundColor: "transparent",
                    border: `1px solid ${theme.palette.grey[500_32]}`,
                    color: theme.palette.text.primary
                });
                break;
            case "ghost":
                assign(baseStyle, {
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.grey[500_16]
                });
                break;
        }
    } else {
        switch (variant) {
            case "filled":
                assign(baseStyle, styleFilled(color));
                break;
            case "outlined":
                assign(baseStyle, styleOutlined(color));
                break;
            case "ghost":
                assign(baseStyle, styleGhost(color));
        }
    }

    return baseStyle;
});

const IconWrapper = styled(Box)({
    height: 16,
    width: 16,
    "& svg, img": {width: 1, height: 1, objectFit: "cover"}
});

export default Label;
