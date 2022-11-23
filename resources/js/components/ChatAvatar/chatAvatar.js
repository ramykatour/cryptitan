import React, {useEffect, useMemo, useState} from "react";
import {styled} from "@mui/material/styles";
import {Avatar, Badge} from "@mui/material";
import {isString, toLower} from "lodash";
import {useBroadcast} from "services/Broadcast";
import PersonIcon from "@mui/icons-material/Person";
import PropTypes from "prop-types";

const ChatAvatar = (props) => {
    const {participant, showPresence = true, ...otherProps} = props;
    const broadcast = useBroadcast(`Public.User.${participant?.id}`);
    const [presence, setPresence] = useState(participant?.presence);

    useEffect(() => {
        setPresence(participant?.presence);
    }, [participant]);

    useEffect(() => {
        if (participant?.id) {
            const channel = "UserPresenceChanged";
            const handler = (e) => setPresence(e.presence);

            broadcast.listen(channel, handler);

            return () => {
                broadcast.stopListening(channel, handler);
            };
        }
    }, [broadcast, participant]);

    const color = useMemo(() => {
        switch (presence) {
            case "away":
                return "warning";
            case "online":
                return "success";
            default:
                return "error";
        }
    }, [presence]);

    if (!participant?.id) {
        return (
            <Avatar alt="avatar" {...otherProps}>
                <PersonIcon fontSize="inherit" />
            </Avatar>
        );
    }

    if (!isString(participant?.picture)) {
        otherProps.children = toLower(participant.name.charAt(0));
    } else {
        otherProps.src = participant.picture;
    }

    if (!showPresence) {
        return <Avatar {...otherProps} />;
    }

    return (
        <StyledBadge
            overlap="circular"
            color={color}
            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
            invisible={presence === "offline"}
            variant="dot">
            <Avatar {...otherProps} />
        </StyledBadge>
    );
};

const StyledBadge = styled(Badge)(({theme, color}) => ({
    "& .MuiBadge-badge": {
        color: theme.palette[color].main,
        width: "20%",
        height: "20%"
    }
}));

ChatAvatar.propTypes = {
    participant: PropTypes.object,
    showPresence: PropTypes.bool
};

export default ChatAvatar;
