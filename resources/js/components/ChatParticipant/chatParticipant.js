import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ChatAvatar from "components/ChatAvatar";
import {Box, Skeleton, Stack, Typography} from "@mui/material";
import {useBroadcast} from "services/Broadcast";
import {formatDateFromNow} from "utils/formatter";
import {useIntervalResult} from "hooks/useIntervalResult";

const ChatParticipant = ({participant}) => {
    const broadcast = useBroadcast(`Public.User.${participant.id}`);
    const [lastSeen, setLastSeen] = useState(participant.last_seen_at);

    useEffect(() => {
        setLastSeen(participant.last_seen_at);
    }, [participant]);

    useEffect(() => {
        const channel = "UserPresenceChanged";
        const handler = (e) => setLastSeen(e.lastSeen);

        broadcast.listen(channel, handler);

        return () => {
            broadcast.stopListening(channel, handler);
        };
    }, [broadcast, participant]);

    const lastSeenFormat = useIntervalResult(() => {
        return formatDateFromNow(lastSeen);
    });

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{minWidth: 0}}
            spacing={2}>
            <ChatAvatar participant={participant} />

            <Box sx={{minWidth: 0}}>
                <Typography variant="subtitle2" noWrap>
                    {participant.name}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{color: "text.secondary"}}
                    noWrap>
                    {lastSeenFormat}
                </Typography>
            </Box>
        </Stack>
    );
};

const ChatParticipantLoader = () => {
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Skeleton variant="circular" width={40} height={40} />

            <Stack spacing={0.5}>
                <Typography variant="subtitle2">
                    <Skeleton width={100} />
                </Typography>

                <Typography variant="body2">
                    <Skeleton width={100} />
                </Typography>
            </Stack>
        </Stack>
    );
};

ChatParticipant.propTypes = {
    participant: PropTypes.object
};

export {ChatParticipantLoader};
export default ChatParticipant;
