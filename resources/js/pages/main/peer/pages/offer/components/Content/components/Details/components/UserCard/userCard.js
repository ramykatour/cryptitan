import React, {useContext} from "react";
import {Stack, Typography} from "@mui/material";
import UserAvatar from "components/UserAvatar";
import PeerOfferContext from "contexts/PeerOfferContext";
import ProfileLink from "components/ProfileLink";
import FlagIcon from "components/FlagIcon";
import {formatDateFromNow} from "utils/formatter";
import {FormattedMessage} from "react-intl";
import {useIntervalResult} from "hooks/useIntervalResult";

const UserCard = () => {
    const {offer} = useContext(PeerOfferContext);

    const lastSeen = useIntervalResult(() => {
        return formatDateFromNow(offer.owner.last_seen_at);
    });

    return (
        <Stack
            direction="row"
            sx={{minWidth: 0, p: 3}}
            alignItems="center"
            spacing={2}>
            <UserAvatar user={offer.owner} />

            <Stack flexGrow={1} sx={{minWidth: 0}}>
                <Stack
                    direction="row"
                    sx={{minWidth: 0}}
                    alignItems="center"
                    spacing={1}>
                    <Typography
                        user={offer.owner}
                        component={ProfileLink}
                        variant="subtitle2"
                        noWrap>
                        {offer.owner.name}
                    </Typography>

                    {offer.owner.country && (
                        <FlagIcon code={offer.owner.country} />
                    )}
                </Stack>

                <Typography
                    variant="caption"
                    sx={{color: "text.secondary"}}
                    noWrap>
                    <FormattedMessage
                        defaultMessage="Seen {date}"
                        values={{date: lastSeen}}
                    />
                </Typography>
            </Stack>
        </Stack>
    );
};

export default UserCard;
