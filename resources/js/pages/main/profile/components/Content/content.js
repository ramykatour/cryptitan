import React, {useContext, useMemo, useState} from "react";
import {styled, useTheme} from "@mui/material/styles";
import heart from "@iconify/icons-eva/heart-fill";
import shield from "@iconify/icons-eva/shield-fill";
import account from "@iconify/icons-ic/round-account-box";
import people from "@iconify/icons-eva/people-fill";
import {defineMessages, useIntl} from "react-intl";
import Iconify from "components/Iconify";
import {Box, Card, Container, Tab, Tabs, useMediaQuery} from "@mui/material";
import Display from "./components/Display";
import UserContext from "contexts/UserContext";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import Page from "components/Page";
import SwipeableViews from "react-swipeable-views";
import Background from "./components/Background";
import Followers from "./components/Followers";
import Following from "./components/Following";
import Manage from "./components/Manage";

const messages = defineMessages({
    title: {defaultMessage: "{name}'s profile"},
    display: {defaultMessage: "Display"},
    followers: {defaultMessage: "Followers"},
    following: {defaultMessage: "Following"},
    manage: {defaultMessage: "Manage"}
});

const Content = () => {
    const theme = useTheme();
    const {user} = useContext(UserContext);
    const [value, setValue] = useState(0);
    const upSm = useMediaQuery(theme.breakpoints.up("sm"));
    const intl = useIntl();
    const xSpacing = upSm ? 3 : 2;
    const ySpacing = 4;

    const tabs = useMemo(() => {
        const stack = [
            {
                label: intl.formatMessage(messages.display),
                icon: <Iconify icon={account} width={20} height={20} />,
                component: <Display />
            },
            {
                label: intl.formatMessage(messages.followers),
                icon: <Iconify icon={people} width={20} height={20} />,
                component: <Followers />
            },
            {
                label: intl.formatMessage(messages.following),
                icon: <Iconify icon={heart} width={20} height={20} />,
                component: <Following />
            }
        ];

        if (user.updatable) {
            stack.push({
                label: intl.formatMessage(messages.manage),
                icon: <Iconify icon={shield} width={20} height={20} />,
                component: <Manage />
            });
        }

        return stack;
    }, [intl, user]);

    const tabHeader = useMemo(
        () =>
            tabs.map((tab, i) => (
                <Tab icon={tab.icon} label={tab.label} disableRipple key={i} />
            )),
        [tabs]
    );

    const tabContent = useMemo(
        () =>
            tabs.map((tab, i) => (
                <Box component="div" sx={{px: xSpacing, py: ySpacing}} key={i}>
                    {value === i && tab.component}
                </Box>
            )),
        [tabs, value, xSpacing, ySpacing]
    );

    return (
        <Page title={intl.formatMessage(messages.title, {name: user.name})}>
            <Container>
                <HeaderBreadcrumbs />

                <StyledCard sx={{mb: 3}}>
                    <Background />

                    <TabsContainer>
                        <Tabs
                            variant="scrollable"
                            onChange={(e, v) => setValue(v)}
                            allowScrollButtonsMobile
                            scrollButtons="auto"
                            sx={{zIndex: 999}}
                            value={value}>
                            {tabHeader}
                        </Tabs>
                    </TabsContainer>
                </StyledCard>

                <SwipeableViews
                    disabled={true}
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    style={{margin: theme.spacing(-ySpacing, -xSpacing)}}
                    onChangeIndex={(v) => setValue(v)}
                    index={value}>
                    {tabContent}
                </SwipeableViews>
            </Container>
        </Page>
    );
};

const StyledCard = styled(Card)({
    height: 280,
    position: "relative"
});

const TabsContainer = styled("div")(({theme}) => ({
    display: "flex",
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    width: "100%",
    bottom: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
        justifyContent: "center"
    },
    [theme.breakpoints.up("md")]: {
        justifyContent: "flex-end"
    }
}));

export default Content;
