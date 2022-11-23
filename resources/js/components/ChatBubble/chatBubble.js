import React, {forwardRef, useMemo} from "react";
import {
    Box,
    CircularProgress,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import ChatAvatar from "components/ChatAvatar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/ArrowCircleDown";
import {useIntervalResult} from "hooks/useIntervalResult";
import {formatDateFromNow} from "utils/formatter";
import {darken, styled} from "@mui/material/styles";
import {truncate} from "lodash";

const ChatBubble = ({message, downloadFile}) => {
    const participant = message.participation.participant;
    const isSender = message.is_sender;

    const date = useIntervalResult(() => {
        return formatDateFromNow(message.created_at);
    });

    const content = useMemo(() => {
        switch (message.type) {
            case "attachment":
                return (
                    <Attachment
                        direction="row"
                        isSender={isSender}
                        alignItems="center"
                        spacing={1}>
                        <AttachFileIcon fontSize="small" />

                        <Typography variant="body2" noWrap>
                            {truncate(message.data?.name, {length: 20})}
                        </Typography>

                        <IconButton
                            color="inherit"
                            onClick={downloadFile}
                            size="small">
                            <DownloadIcon fontSize="medium" />
                        </IconButton>
                    </Attachment>
                );
            default:
                return (
                    <Typography variant="body2" p={1}>
                        {message.body}
                    </Typography>
                );
        }
    }, [message, isSender, downloadFile]);

    return (
        <Stack direction="row">
            <Stack
                direction="row"
                sx={{...(isSender && {ml: "auto"})}}
                spacing={2}>
                {!isSender && (
                    <ChatAvatar
                        participant={participant}
                        showPresence={false}
                    />
                )}

                <Wrapper isSender={isSender} spacing={0.8}>
                    <Typography variant="caption" color="text.secondary" noWrap>
                        {!isSender ? `${participant.name}, ${date}` : date}
                    </Typography>

                    <Content isSender={isSender}>{content}</Content>
                </Wrapper>
            </Stack>
        </Stack>
    );
};

const ChatLoader = forwardRef((props, ref) => {
    return (
        <Stack ref={ref} justifyContent="center" alignItems="center">
            <CircularProgress />
        </Stack>
    );
});

const Wrapper = styled(({isSender, ...otherProps}) => {
    return <Stack {...otherProps} />;
})(({isSender}) => ({
    alignItems: isSender ? "flex-end" : "flex-start"
}));

const Attachment = styled(({isSender, ...otherProps}) => {
    return <Stack {...otherProps} />;
})(({theme, isSender}) => ({
    ...theme.typography.body2,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    backgroundColor: !isSender
        ? darken(theme.palette.background.neutral, 0.2)
        : darken(theme.palette.primary.lighter, 0.2)
}));

const Content = styled(({isSender, ...otherProps}) => {
    return <Box {...otherProps} />;
})(({theme, isSender}) => ({
    maxWidth: 300,
    overflowWrap: "anywhere",
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    whiteSpace: "pre-wrap",
    color: !isSender ? theme.palette.text.primary : theme.palette.grey[800],
    backgroundColor: !isSender
        ? theme.palette.background.neutral
        : theme.palette.primary.lighter
}));

export {ChatLoader};
export default ChatBubble;
