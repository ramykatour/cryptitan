import React from "react";
import {alpha, experimentalStyled as styled} from "@mui/material/styles";
import {
    AppBar,
    Box,
    IconButton,
    Stack,
    Toolbar,
    useMediaQuery
} from "@mui/material";
import {Icon} from "@iconify/react";
import menu2Fill from "@iconify-icons/ri/menu-2-fill";

const NAVBAR_WIDTH = 280;
const NAVBAR_DESKTOP_HEIGHT = 92;
const NAVBAR_MOBILE_HEIGHT = 64;

const Navbar = ({onOpenSidebar, content, actions}) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

    return (
        <StyledAppBar>
            <StyledToolbar>
                {isMobile && (
                    <IconButton
                        sx={{mr: 2, color: "text.primary"}}
                        onClick={onOpenSidebar}>
                        <Icon icon={menu2Fill} />
                    </IconButton>
                )}

                {content}

                <Box sx={{flexGrow: 1}} />

                {actions && (
                    <Stack
                        direction="row"
                        spacing={{xs: 0.5, sm: 1.5}}
                        alignItems="center">
                        {actions}
                    </Stack>
                )}
            </StyledToolbar>
        </StyledAppBar>
    );
};

export const StyledAppBar = styled(AppBar)(({theme}) => ({
    zIndex: theme.zIndex.appBar + 1,
    backgroundColor: alpha(theme.palette.background.default, 0.72),
    boxShadow: "none",
    WebkitBackdropFilter: "blur(6px)",
    backdropFilter: "blur(6px)",
    transition: theme.transitions.create(["width", "height"], {
        duration: theme.transitions.duration.shorter
    }),
    [theme.breakpoints.up("lg")]: {
        width: `calc(100% - ${NAVBAR_WIDTH + 1}px)`
    }
}));

export const StyledToolbar = styled(Toolbar)(({theme}) => ({
    minHeight: NAVBAR_MOBILE_HEIGHT,
    [theme.breakpoints.up("lg")]: {
        padding: theme.spacing(0, 5),
        minHeight: NAVBAR_DESKTOP_HEIGHT
    }
}));

export default Navbar;
