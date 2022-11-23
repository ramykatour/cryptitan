import React, {useCallback, useContext, useRef, useState} from "react";
import Scrollbar from "components/Scrollbar";
import InfiniteLoader from "components/InfiniteLoader";
import {route} from "services/Http";
import PeerTradeContext from "contexts/PeerTradeContext";
import ChatBubble, {ChatLoader} from "components/ChatBubble";
import {Stack} from "@mui/material";
import ChatContext from "contexts/ChatContext";

const ChatMessages = () => {
    const [pageSize] = useState(20);
    const {messagesRef} = useContext(ChatContext);
    const {trade} = useContext(PeerTradeContext);
    const lastPositionHeight = useRef();
    const scrollRef = useRef();

    const onScroll = useCallback(() => {
        if (scrollRef.current) {
            const scrollHeight = scrollRef.current.scrollHeight;
            const scrollTop = scrollRef.current.scrollTop;
            lastPositionHeight.current = scrollHeight - scrollTop;
        }
    }, []);

    const scrollToBottom = useCallback(
        (items) => {
            if (scrollRef.current && items.length) {
                const scrollHeight = scrollRef.current.scrollHeight;
                const offset = lastPositionHeight.current ?? 0;

                if (items.length > pageSize) {
                    scrollRef.current.scrollTop = scrollHeight - offset;
                } else {
                    scrollRef.current.scrollTop = scrollHeight;
                }
            }
        },
        [pageSize]
    );

    const downloadFile = useCallback(
        (message) => {
            window.location.href = route("peer-trade.download-file", {
                id: message.id,
                trade: trade.id
            });
        },
        [trade]
    );

    const url = route("peer-trade.message-paginate", {trade: trade.id});

    return (
        <Scrollbar scrollableNodeProps={{onScroll, ref: scrollRef}}>
            <Stack spacing={3} sx={{p: 3}}>
                <InfiniteLoader
                    ref={messagesRef}
                    initialPageSize={pageSize}
                    url={url}
                    renderSkeleton={(ref) => {
                        return <ChatLoader ref={ref} />;
                    }}
                    renderItem={(item) => {
                        return (
                            <ChatBubble
                                key={item.id}
                                downloadFile={() => downloadFile(item)}
                                message={item}
                            />
                        );
                    }}
                    onItemsChange={scrollToBottom}
                    reverse={true}
                />
            </Stack>
        </Scrollbar>
    );
};

export default ChatMessages;
