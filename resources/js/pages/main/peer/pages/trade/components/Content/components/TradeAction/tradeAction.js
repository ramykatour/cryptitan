import React, {useCallback, useEffect, useState} from "react";
import {Box, Divider, Drawer, IconButton, useMediaQuery} from "@mui/material";
import Iconify from "components/Iconify";
import arrowForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowBackFill from "@iconify/icons-eva/arrow-ios-back-fill";
import {styled, useTheme} from "@mui/material/styles";
import Participant from "./components/Participant";
import Information from "./components/Information";
import Confirmation from "./components/Confirmation";

const SIDEBAR_WIDTH = 260;

const TradeAction = () => {
    const theme = useTheme();
    const [openSidebar, setOpenSidebar] = useState(true);
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

    const toggleSidebar = useCallback(() => {
        setOpenSidebar((prev) => !prev);
    }, []);

    useEffect(() => {
        if (!isDesktop) {
            setOpenSidebar(false);
        } else {
            setOpenSidebar(true);
        }
    }, [isDesktop]);

    return (
        <Box sx={{position: "relative"}}>
            <StyledToggleButton
                openSidebar={openSidebar}
                onClick={toggleSidebar}>
                <Iconify
                    icon={openSidebar ? arrowForwardFill : arrowBackFill}
                    width={30}
                    height={30}
                />
            </StyledToggleButton>

            {isDesktop ? (
                <Drawer
                    variant="persistent"
                    anchor="right"
                    open={openSidebar}
                    sx={{
                        height: "100%",
                        transition: theme.transitions.create("width"),
                        width: openSidebar ? SIDEBAR_WIDTH : 0,
                        "& .MuiDrawer-paper": {
                            position: "static",
                            width: SIDEBAR_WIDTH
                        }
                    }}>
                    <Participant />
                    <Divider />
                    <Information />
                    <Divider />
                    <Confirmation />
                </Drawer>
            ) : (
                <Drawer
                    anchor="right"
                    open={openSidebar}
                    onClose={() => setOpenSidebar(false)}
                    ModalProps={{keepMounted: true}}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: SIDEBAR_WIDTH
                        }
                    }}>
                    <Participant />
                    <Divider />
                    <Information />
                    <Divider />
                    <Confirmation />
                </Drawer>
            )}
        </Box>
    );
};

const StyledToggleButton = styled(({openSidebar, ...otherProps}) => (
    <IconButton disableRipple {...otherProps} />
))(({theme, openSidebar}) => ({
    borderRadius: `12px 0 0 12px`,
    border: `solid 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.primary.dark,
    "&:hover": {backgroundColor: theme.palette.background.neutral},
    color: theme.palette.text.primary,
    boxShadow: theme.customShadows.z8,
    transition: theme.transitions.create("all"),
    position: "absolute",
    borderRight: 0,
    zIndex: 9,
    width: 40,
    height: 40,
    right: 0,
    top: theme.spacing(1),
    [theme.breakpoints.up("lg")]: {
        ...(openSidebar && {right: SIDEBAR_WIDTH})
    }
}));

export default TradeAction;
