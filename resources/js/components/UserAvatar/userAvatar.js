import React, {useEffect, useMemo, useState} from "react";
import {isString, toLower} from "lodash";
import {styled} from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import {Avatar, Badge} from "@mui/material";
import {useBroadcast} from "services/Broadcast";
import PropTypes from "prop-types";

const UserAvatar = (props) => {
    const {user, showPresence = true, ...otherProps} = props;
    const broadcast = useBroadcast(`Public.User.${user?.id}`);
    const [presence, setPresence] = useState(user?.presence);

    useEffect(() => {
        setPresence(user?.presence);
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            const channel = "UserPresenceChanged";
            const handler = (e) => setPresence(e.presence);

            broadcast.listen(channel, handler);

            return () => {
                broadcast.stopListening(channel, handler);
            };
        }
    }, [broadcast, user]);

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

    if (!user?.id) {
        return (
            <Avatar alt="avatar" {...otherProps}>
                <PersonIcon fontSize="inherit" />
            </Avatar>
        );
    }

    if (!isString(user.profile?.picture)) {
        otherProps.children = toLower(user.name.charAt(0));
    } else {
        otherProps.src = user.profile.picture;
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
        boxShadow: theme.customShadows.z8,
        width: "20%",
        height: "20%",
        "&::after": {
            left: 0,
            top: 0,
            position: "absolute",
            border: "1px solid currentColor",
            content: '""',
            borderRadius: "50%",
            width: "100%",
            height: "100%",
            ...(color === "success" && {
                animation: "ripple 1.2s infinite ease-in-out"
            })
        }
    },
    "@keyframes ripple": {
        "0%": {transform: "scale(.8)", opacity: 1},
        "100%": {transform: "scale(2)", opacity: 0}
    }
}));

UserAvatar.propTypes = {
    user: PropTypes.object,
    showPresence: PropTypes.bool
};

export default UserAvatar;
