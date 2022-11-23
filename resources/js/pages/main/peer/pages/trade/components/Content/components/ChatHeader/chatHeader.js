import React, {useContext, useMemo} from "react";
import {styled} from "@mui/material/styles";
import {AvatarGroup, Box, Typography} from "@mui/material";
import ChatContext from "contexts/ChatContext";
import {useAuth} from "models/Auth";
import ChatAvatar from "components/ChatAvatar";
import ChatParticipant, {
    ChatParticipantLoader
} from "components/ChatParticipant";
import {FormattedMessage} from "react-intl";
import TradeStatus from "./components/TradeStatus";

const ChatHeader = () => {
    const auth = useAuth();
    const {participants: records, loadingParticipants} =
        useContext(ChatContext);

    const participants = useMemo(() => {
        return records.filter((record) => record.id !== auth.user.id);
    }, [records, auth]);

    return (
        <BaseStyle>
            {!loadingParticipants ? (
                participants.length > 1 ? (
                    <AvatarGroup spacing="small" max={3}>
                        {participants.map((participant) => (
                            <ChatAvatar
                                key={participant.id}
                                participant={participant}
                                showPresence={false}
                            />
                        ))}
                    </AvatarGroup>
                ) : !participants.length ? (
                    <Typography variant="h5" color="text.secondary">
                        <FormattedMessage defaultMessage="No Recipients" />
                    </Typography>
                ) : (
                    <ChatParticipant participant={participants[0]} />
                )
            ) : (
                <ChatParticipantLoader />
            )}

            <Box sx={{flexGrow: 1}} />

            <TradeStatus />
        </BaseStyle>
    );
};

const BaseStyle = styled("div")(({theme}) => ({
    flexShrink: 0,
    padding: theme.spacing(0, 3),
    minHeight: 92,
    alignItems: "center",
    display: "flex"
}));

export default ChatHeader;
