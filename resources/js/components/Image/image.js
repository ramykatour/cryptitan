import React from "react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import PropTypes from "prop-types";
import placeholder from "static/placeholder.svg";
import {Box} from "@mui/material";

const Image = ({
    ratio,
    disabledEffect = false,
    effect = "blur",
    className,
    sx,
    ...otherProps
}) => {
    if (ratio) {
        return (
            <Box
                component="span"
                className={className}
                sx={{
                    display: "block",
                    position: "relative",
                    overflow: "hidden",
                    lineHeight: 0,
                    pt: getRatio(ratio),
                    width: 1,
                    "& .wrapper": {
                        lineHeight: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        backgroundSize: "cover !important",
                        position: "absolute"
                    },
                    ...sx
                }}>
                <Box
                    component={LazyLoadImage}
                    wrapperClassName="wrapper"
                    effect={disabledEffect ? undefined : effect}
                    sx={{width: 1, height: 1, objectFit: "cover"}}
                    placeholderSrc={placeholder}
                    {...otherProps}
                />
            </Box>
        );
    }

    return (
        <Box
            component="span"
            className={className}
            sx={{
                display: "block",
                overflow: "hidden",
                lineHeight: 0,
                "& .wrapper": {
                    height: 1,
                    width: 1,
                    backgroundSize: "cover !important"
                },
                ...sx
            }}>
            <Box
                component={LazyLoadImage}
                wrapperClassName="wrapper"
                effect={disabledEffect ? undefined : effect}
                sx={{width: 1, height: 1, objectFit: "cover"}}
                placeholderSrc={placeholder}
                {...otherProps}
            />
        </Box>
    );
};

Image.propTypes = {
    ratio: PropTypes.oneOf([
        "4/3",
        "3/4",
        "6/4",
        "4/6",
        "16/9",
        "9/16",
        "21/9",
        "9/21",
        "1/1"
    ]),
    sx: PropTypes.object,
    disabledEffect: PropTypes.bool,
    effect: PropTypes.string
};

function getRatio(ratio = "1/1") {
    return {
        "4/3": "calc(100% / 4 * 3)",
        "3/4": "calc(100% / 3 * 4)",
        "6/4": "calc(100% / 6 * 4)",
        "4/6": "calc(100% / 4 * 6)",
        "16/9": "calc(100% / 16 * 9)",
        "9/16": "calc(100% / 9 * 16)",
        "21/9": "calc(100% / 21 * 9)",
        "9/21": "calc(100% / 9 * 21)",
        "1/1": "100%"
    }[ratio];
}

export default Image;
