import React, {useContext} from "react";
import Collapsible from "../Collapsible";
import {FormattedMessage} from "react-intl";
import {Box, Stack, Typography} from "@mui/material";
import UserAvatar from "components/UserAvatar";
import PeerTradeContext from "contexts/PeerTradeContext";
import ProfileLink from "components/ProfileLink";

const Participant = () => {
    const {trade} = useContext(PeerTradeContext);

    return (
        <Collapsible
            title={<FormattedMessage defaultMessage="Participant" />}
            content={
                <Stack spacing={1}>
                    <ParticipantItem
                        content={<FormattedMessage defaultMessage="Seller" />}
                        user={trade.seller}
                    />

                    <ParticipantItem
                        content={<FormattedMessage defaultMessage="Buyer" />}
                        user={trade.buyer}
                    />
                </Stack>
            }
        />
    );
};

const ParticipantItem = ({user, content}) => {
    return (
        <Stack
            direction="row"
            sx={{minWidth: 0, py: 0.5, px: 2.5}}
            alignItems="center"
            spacing={2}>
            <UserAvatar user={user} />

            <Box sx={{minWidth: 0}}>
                <Typography
                    user={user}
                    component={ProfileLink}
                    variant="subtitle2"
                    noWrap>
                    {user.name}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{color: "text.secondary"}}
                    noWrap>
                    {content}
                </Typography>
            </Box>
        </Stack>
    );
};

export default Participant;
