import React from "react";
import {useAuth} from "models/Auth";
import {FormattedMessage} from "react-intl";
import Scrollbar from "components/Scrollbar";
import {Box, Drawer, Stack, Typography} from "@mui/material";
import Logo from "components/Logo";
import router from "router";
import UserAvatar from "components/UserAvatar";
import NavSection from "components/NavSection";
import PropTypes from "prop-types";
import {experimentalStyled as styled} from "@mui/material/styles";
import useSidebarAutoClose from "hooks/useSidebarAutoClose";
import ProfileLink from "components/ProfileLink";

const DRAWER_WIDTH = 280;

const Sidebar = ({sidebarOpen, onCloseSidebar, links, action, extras}) => {
    useSidebarAutoClose(sidebarOpen, onCloseSidebar);

    return (
        <BaseStyle>
            <Drawer
                onClose={onCloseSidebar}
                sx={{display: {xs: "flex", lg: "none"}}}
                PaperProps={{sx: {width: DRAWER_WIDTH}}}
                open={sidebarOpen}>
                <SidebarContent action={action} links={links} extras={extras} />
            </Drawer>

            <Drawer
                variant="persistent"
                sx={{display: {xs: "none", lg: "flex"}}}
                PaperProps={{
                    sx: {
                        width: DRAWER_WIDTH,
                        bgcolor: "background.default",
                        borderRightStyle: "dashed"
                    }
                }}
                open={true}>
                <SidebarContent action={action} links={links} extras={extras} />
            </Drawer>
        </BaseStyle>
    );
};

const SidebarContent = ({links, action, extras}) => {
    const auth = useAuth();

    return (
        <StyledScrollbar>
            <Stack spacing={3} sx={{p: 2.5}}>
                <Logo to={router.generatePath("main.home")} />

                <AccountStyle>
                    <UserAvatar user={auth.user} />

                    <Box sx={{ml: 2}}>
                        <Typography
                            variant="body2"
                            sx={{width: "130px"}}
                            noWrap>
                            <FormattedMessage
                                defaultMessage="Hi, {name}"
                                values={{
                                    name: (
                                        <ProfileLink user={auth.user}>
                                            <b>{auth.user.name}</b>
                                        </ProfileLink>
                                    )
                                }}
                            />
                        </Typography>

                        {action}
                    </Box>
                </AccountStyle>
            </Stack>

            <NavSection config={links} sx={{flexGrow: 1}} />

            {extras}
        </StyledScrollbar>
    );
};

const StyledScrollbar = styled(Scrollbar)({
    "& .simplebar-content": {
        display: "flex",
        flexDirection: "column",
        height: "100%"
    }
});

const AccountStyle = styled("div")(({theme}) => ({
    display: "flex",
    padding: theme.spacing(2, 2.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[500_12],
    alignItems: "center"
}));

const BaseStyle = styled("div")(({theme}) => ({
    [theme.breakpoints.up("lg")]: {
        flexShrink: 0,
        width: DRAWER_WIDTH
    }
}));

Sidebar.propTypes = {
    sidebarOpen: PropTypes.bool,
    onCloseSidebar: PropTypes.func
};

export default Sidebar;
