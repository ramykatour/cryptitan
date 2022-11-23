import React from "react";
import PropTypes from "prop-types";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Typography} from "@mui/material";
import Logo from "components/Logo";
import router from "router";

const HeaderStyle = styled("header")(({theme}) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    lineHeight: 0,
    width: "100%",
    zIndex: 9,
    padding: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
        alignItems: "flex-start",
        padding: theme.spacing(7, 5, 0, 7)
    }
}));

function HintLayout({children}) {
    return (
        <HeaderStyle>
            <Logo to={router.generatePath("main")} />

            <Typography
                variant="body2"
                sx={{display: {xs: "none", sm: "block"}, mt: {md: -2}}}>
                {children}
            </Typography>
        </HeaderStyle>
    );
}

HintLayout.propTypes = {children: PropTypes.node};

export default HintLayout;
