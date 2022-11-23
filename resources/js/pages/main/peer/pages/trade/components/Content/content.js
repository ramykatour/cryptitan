import React, {useCallback, useContext, useEffect, useRef} from "react";
import PeerTradeContext from "contexts/PeerTradeContext";
import {useIntl} from "react-intl";
import {Card, Container, Divider, Stack} from "@mui/material";
import Page from "components/Page";
import {styled} from "@mui/material/styles";
import ChatHeader from "./components/ChatHeader";
import {useChatParticipants} from "./hooks";
import {ChatProvider} from "contexts/ChatContext";
import ChatMessages from "./components/ChatMessages";
import SendMessage from "./components/SendMessage";
import {usePresenceBroadcast, usePrivateBroadcast} from "services/Broadcast";
import audioFile from "static/audio/message.mp3";
import {mountHandler} from "utils/helpers";
import TradeAction from "./components/TradeAction";
import {errorHandler, route, useRequest} from "services/Http";
import TradeRating from "./components/TradeRating";

const Content = () => {
    const intl = useIntl();
    const participants = useChatParticipants();
    const {trade, fetchTrade} = useContext(PeerTradeContext);
    const [request] = useRequest();
    const messagesRef = useRef();

    const chatBroadcast = usePresenceBroadcast(trade.conversationChannel());
    const broadcast = usePrivateBroadcast(trade.channel());

    const reloadMessages = useCallback(() => {
        messagesRef.current?.resetPage();
    }, []);

    const markAsRead = useCallback(() => {
        request
            .post(route("peer-trade.mark-read", {trade: trade.id}))
            .catch(errorHandler());
    }, [request, trade]);

    useEffect(() => {
        const handler = mountHandler();
        const {fetchParticipants} = participants;

        chatBroadcast
            .joining(() => {
                handler.execute(fetchParticipants);
            })
            .leaving(() => {
                handler.execute(fetchParticipants);
            });

        return () => handler.unmount();
    }, [chatBroadcast, participants]);

    useEffect(() => {
        const channel = "ChatMessageSent";
        const handler = (e) => {
            reloadMessages();
            markAsRead();
            alertAudio.play();
        };

        chatBroadcast.listen(channel, handler);

        return () => {
            chatBroadcast.stopListening(channel, handler);
        };
    }, [chatBroadcast, reloadMessages, markAsRead]);

    useEffect(() => {
        const channel = ".PeerTradeUpdated";
        const handler = () => fetchTrade();

        broadcast.listen(channel, handler);

        return () => {
            broadcast.stopListening(channel, handler);
        };
    }, [broadcast, fetchTrade]);

    useEffect(() => {
        markAsRead();
    }, [markAsRead]);

    return (
        <ChatProvider
            {...participants}
            reloadMessages={reloadMessages}
            messagesRef={messagesRef}>
            <Page title={trade.title(intl)}>
                <Container maxWidth="xl">
                    <StyledCard>
                        <ChatHeader />
                        <Divider />

                        <Stack
                            direction="row"
                            sx={{overflow: "hidden"}}
                            flexGrow={1}>
                            <ChatContent />
                            <TradeAction />
                        </Stack>
                    </StyledCard>
                </Container>
            </Page>
        </ChatProvider>
    );
};

const ChatContent = () => {
    const {trade} = useContext(PeerTradeContext);

    return trade.ratable() ? (
        <TradeRating />
    ) : (
        <Stack flexGrow={1}>
            <ChatMessages />
            <Divider />
            <SendMessage />
        </Stack>
    );
};

const alertAudio = new Audio(audioFile);

const StyledCard = styled(Card)(({theme}) => ({
    display: "flex",
    height: "calc(100vh - 176px)",
    flexDirection: "column",
    flexGrow: 1,
    [theme.breakpoints.up("lg")]: {
        height: "calc(100vh - 232px)"
    }
}));

export default Content;
