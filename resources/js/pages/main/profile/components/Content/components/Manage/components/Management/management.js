import React, {useContext, useMemo} from "react";
import {FormattedMessage} from "react-intl";
import {Card, CardContent, CardHeader, Grid, Stack} from "@mui/material";
import UserContext from "contexts/UserContext";
import Iconify from "components/Iconify";
import userAdd from "@iconify-icons/ri/user-add-fill";
import moneyDollar from "@iconify-icons/ri/money-dollar-circle-fill";
import loginBox from "@iconify-icons/ri/login-box-fill";
import flag from "@iconify-icons/ri/flag-fill";
import {parseDate} from "utils/form";
import FlagIcon from "components/FlagIcon";
import time from "@iconify-icons/ri/time-fill";
import UpdateUser from "./components/UpdateUser";
import Deactivate from "./components/Deactivate";
import AlertDeactivated from "./components/AlertDeactivated";
import ContactInfo from "./components/ContactInfo";
import ContentInfo from "./components/ContentInfo";
import {formatDateFromNow} from "utils/formatter";
import {useIntervalResult} from "hooks/useIntervalResult";

const Management = () => {
    const {user} = useContext(UserContext);

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Management" />}
                action={
                    <Stack direction="row" spacing={1}>
                        <UpdateUser />
                        <Deactivate />
                    </Stack>
                }
            />

            <CardContent>
                <AlertDeactivated />

                <Grid container spacing={2} mb={3}>
                    <Grid item xs={6} md={3}>
                        <Registered />
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <LastLogin />
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Country />
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Currency />
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <LastSeen />
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <IPAddress />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <ContactInfo
                            title={
                                <FormattedMessage defaultMessage="Phone Number" />
                            }
                            verified={user.hasVerifiedPhone()}
                            content={user.phone}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <ContactInfo
                            title={
                                <FormattedMessage defaultMessage="Email Address" />
                            }
                            verified={user.hasVerifiedEmail()}
                            content={user.email}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const Registered = () => {
    const {user} = useContext(UserContext);

    const registered = useMemo(() => {
        return parseDate(user.created_at);
    }, [user]);

    return (
        <ContentInfo
            title={<FormattedMessage defaultMessage="Registered" />}
            content={registered.isValid() && registered.format("ll")}
            icon={<ItemIcon icon={userAdd} />}
        />
    );
};

const LastLogin = () => {
    const {user} = useContext(UserContext);

    const lastLogin = useIntervalResult(() => {
        return formatDateFromNow(user.last_login_at);
    });

    return (
        <ContentInfo
            title={<FormattedMessage defaultMessage="Last Login" />}
            content={lastLogin}
            icon={<ItemIcon icon={loginBox} />}
        />
    );
};

const LastSeen = () => {
    const {user} = useContext(UserContext);

    const lastSeen = useIntervalResult(() => {
        return formatDateFromNow(user.last_seen_at);
    });

    return (
        <ContentInfo
            title={<FormattedMessage defaultMessage="Last Seen" />}
            content={lastSeen}
            icon={<ItemIcon icon={time} />}
        />
    );
};

const Currency = () => {
    const {user} = useContext(UserContext);

    return (
        <ContentInfo
            title={<FormattedMessage defaultMessage="Currency" />}
            content={user.currency_name}
            icon={<ItemIcon icon={moneyDollar} />}
        />
    );
};

const Country = () => {
    const {user} = useContext(UserContext);

    return (
        <ContentInfo
            title={<FormattedMessage defaultMessage="Country" />}
            content={user.country_name}
            icon={<ItemFlagIcon code={user.country} />}
        />
    );
};

const IPAddress = () => {
    const {user} = useContext(UserContext);

    const format = (location) => {
        return `${location.ip} (${location.iso_code})`;
    };

    return (
        <ContentInfo
            title={<FormattedMessage defaultMessage="IP Address" />}
            content={user.location && format(user.location)}
            icon={<ItemFlagIcon code={user.location?.iso_code} />}
        />
    );
};

const ItemIcon = ({icon}) => {
    return <Iconify icon={icon} width={20} height={20} />;
};

const ItemFlagIcon = ({code}) => {
    return code ? (
        <FlagIcon code={code} sx={{width: 20, height: 20}} />
    ) : (
        <ItemIcon icon={flag} />
    );
};

export default Management;
