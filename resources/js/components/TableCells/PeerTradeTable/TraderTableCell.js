import React from "react";
import {Stack, Tooltip, Typography} from "@mui/material";
import UserAvatar from "components/UserAvatar";
import ProfileLink from "components/ProfileLink";
import FlagIcon from "components/FlagIcon";
import UserRating from "components/UserRating";
import {FormattedMessage} from "react-intl";
import {useIntervalResult} from "hooks/useIntervalResult";
import {formatDateFromNow} from "utils/formatter";

const TraderTableCell = ({user}) => {
    return (
        <Tooltip title={<UserTooltip user={user} />}>
            <Stack
                direction="row"
                sx={{minWidth: 0}}
                alignItems="center"
                spacing={2}>
                <UserAvatar user={user} />

                <Stack flexGrow={1} sx={{minWidth: 0}}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{minWidth: 0}}
                        spacing={1}>
                        <Typography
                            user={user}
                            component={ProfileLink}
                            variant="subtitle2"
                            noWrap>
                            {user.name}
                        </Typography>

                        {user.country && <FlagIcon code={user.country} />}
                    </Stack>

                    <UserRating user={user} />
                </Stack>
            </Stack>
        </Tooltip>
    );
};

const UserTooltip = ({user}) => {
    const lastSeen = useIntervalResult(() => {
        return formatDateFromNow(user.last_seen_at);
    });

    return (
        <Typography variant="caption">
            <FormattedMessage
                defaultMessage="Seen: {date}"
                values={{date: lastSeen}}
            />
        </Typography>
    );
};

export default TraderTableCell;
