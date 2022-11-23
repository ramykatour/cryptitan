import React from "react";
import {alpha, experimentalStyled as styled} from "@mui/material/styles";
import {CircularProgress} from "@mui/material";

const BaseStyle = styled(({spinning, ...others}) => {
    return <div {...others} />;
})(({theme, spinning}) => ({
    position: "relative",
    transition: "opacity 0.3s",
    clear: "both",
    "& .spinner": {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        minHeight: "100%",
        minWidth: "100%",
        transition: "all 0.3s",
        display: spinning ? "flex" : "none",
        background: alpha(theme.palette.background.paper, 0.48),
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1)
    }
}));

const Spin = ({spinning, size, children, sx}) => {
    return (
        <BaseStyle spinning={spinning} sx={sx}>
            {children}
            <div className="spinner">
                <CircularProgress size={size} />
            </div>
        </BaseStyle>
    );
};

export default Spin;
