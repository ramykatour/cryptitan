import React, {useMemo} from "react";
import {BaseStyle, MainStyle} from "../layout.style";
import Navbar from "../components/Navbar";
import Language from "../components/Language";
import Notifications from "../components/Notifications";
import UserArea from "./components/UserArea";
import Sidebar from "../components/Sidebar";
import {defineMessages, useIntl} from "react-intl";
import {Chip} from "@mui/material";
import AdminPages from "pages/admin";
import {useSidebarToggle} from "hooks/useSidebarToggle";
import {first} from "lodash";
import {useAuth} from "models/Auth";
import {usePrivateBroadcast} from "services/Broadcast";
import useSidebarItem from "hooks/useSidebarItem";
import PresenceTimer from "components/PresenceTimer";

const messages = defineMessages({
    dashboard: {defaultMessage: "Dashboard"},
    configuration: {defaultMessage: "Configuration"},
    marketplace: {defaultMessage: "Marketplace"}
});

const Admin = () => {
    const intl = useIntl();
    const getSidebarItem = useSidebarItem();
    const auth = useAuth();

    usePrivateBroadcast("App.Models.User." + auth.user.id);

    const links = useMemo(() => {
        return [
            {
                key: "dashboard",
                title: intl.formatMessage(messages.dashboard),
                items: [
                    getSidebarItem({
                        key: "admin.home",
                        permission: "access_control_panel"
                    }),
                    getSidebarItem({
                        key: "admin.users",
                        permission: "manage_users"
                    }),
                    getSidebarItem({
                        key: "admin.payments",
                        permission: "manage_payments"
                    }),
                    getSidebarItem({
                        key: "admin.wallets",
                        permission: "manage_wallets"
                    })
                ]
            },
            {
                key: "marketplace",
                title: intl.formatMessage(messages.marketplace),
                items: [
                    getSidebarItem({
                        key: "admin.exchange",
                        permission: "manage_exchange"
                    }),
                    getSidebarItem({
                        key: "admin.peer",
                        permission: "manage_peer_trades"
                    }),
                    getSidebarItem({
                        key: "admin.giftcards",
                        permission: "manage_giftcards"
                    })
                ]
            },
            {
                key: "configuration",
                title: intl.formatMessage(messages.configuration),
                items: [
                    getSidebarItem({
                        key: "admin.settings",
                        permission: "manage_settings"
                    }),
                    getSidebarItem({
                        key: "admin.modules",
                        permission: "manage_modules"
                    }),
                    getSidebarItem({
                        key: "admin.localization",
                        permission: "manage_localization"
                    }),
                    getSidebarItem({
                        key: "admin.customize",
                        permission: "manage_customization"
                    })
                ]
            }
        ];
    }, [intl, getSidebarItem]);

    const [sidebarState, openSidebar, closeSidebar] = useSidebarToggle();

    return (
        <BaseStyle>
            <PresenceTimer />

            <Navbar
                onOpenSidebar={openSidebar}
                actions={[
                    <Language key={0} />,
                    <Notifications key={1} />,
                    <UserArea key={2} />
                ]}
            />

            <Sidebar
                sidebarOpen={sidebarState}
                onCloseSidebar={closeSidebar}
                links={links}
                action={
                    <Chip
                        variant="outlined"
                        label={first(auth.user.all_roles)}
                        size="small"
                        sx={{mt: 0.5}}
                    />
                }
            />

            <MainStyle>
                <AdminPages />
            </MainStyle>
        </BaseStyle>
    );
};

export default Admin;
