import React, {useContext, useMemo} from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import mapPin from "@iconify-icons/ri/map-pin-fill";
import userAdd from "@iconify-icons/ri/user-add-fill";
import time from "@iconify-icons/ri/time-fill";
import Iconify from "components/Iconify";
import UserContext from "contexts/UserContext";
import {styled} from "@mui/material/styles";
import {truncate} from "lodash";
import {FormattedMessage} from "react-intl";
import {parseDate} from "utils/form";
import {useIntervalResult} from "hooks/useIntervalResult";
import {formatDateFromNow} from "utils/formatter";

const UserDetails = () => {
    return (
        <Card>
            <CardHeader title="About" />

            <CardContent>
                <Biography />

                <Stack spacing={1}>
                    <LastSeen />
                    <Registration />
                    <Country />
                </Stack>
            </CardContent>
        </Card>
    );
};

const Biography = () => {
    const {user} = useContext(UserContext);

    return !user.profile.bio ? (
        <Typography variant="body2" mb={3}>
            <FormattedMessage defaultMessage="No Biography." />
        </Typography>
    ) : (
        <Tooltip title={user.profile.bio}>
            <Typography variant="body2" mb={3}>
                {truncate(user.profile.bio, {length: 200})}
            </Typography>
        </Tooltip>
    );
};

const Registration = () => {
    const {user} = useContext(UserContext);

    const registered = useMemo(() => {
        return parseDate(user.created_at);
    }, [user]);

    if (!registered.isValid()) {
        return null;
    }

    return (
        <Stack direction="row">
            <StyledIconify icon={userAdd} />

            <Typography variant="body2">
                <FormattedMessage
                    defaultMessage="Registered {date}"
                    values={{
                        date: <Bold>{registered.format("ll")}</Bold>
                    }}
                />
            </Typography>
        </Stack>
    );
};

const LastSeen = () => {
    const {user} = useContext(UserContext);

    const lastSeen = useIntervalResult(() => {
        return formatDateFromNow(user.last_seen_at);
    });

    if (!lastSeen) {
        return null;
    }

    return (
        <Stack direction="row">
            <StyledIconify icon={time} />

            <Typography variant="body2">
                <FormattedMessage
                    defaultMessage="Last seen {date}"
                    values={{
                        date: <Bold>{lastSeen}</Bold>
                    }}
                />
            </Typography>
        </Stack>
    );
};

const Country = () => {
    const {user} = useContext(UserContext);

    if (!user.country) {
        return null;
    }

    return (
        <Stack direction="row">
            <StyledIconify icon={mapPin} />

            <Typography variant="body2" mr={1}>
                <FormattedMessage
                    defaultMessage="Lives in {country}"
                    values={{
                        country: <Bold>{user.country_name}</Bold>
                    }}
                />
            </Typography>
        </Stack>
    );
};

const Bold = (props) => {
    return (
        <Typography
            component="span"
            color="text.primary"
            variant="subtitle2"
            {...props}
        />
    );
};

const StyledIconify = styled(Iconify)(({theme}) => ({
    height: 20,
    width: 20,
    flexShrink: 0,
    marginTop: 1,
    marginRight: theme.spacing(2)
}));

export default UserDetails;
