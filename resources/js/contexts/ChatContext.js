import React, {createContext} from "react";
import PropTypes from "prop-types";

const initialState = {
    participants: [],
    loadingParticipants: false,
    fetchParticipants: () => {},
    reloadMessages: () => {}
};

const ChatContext = createContext(initialState);

const ChatProvider = ({
    participants,
    loadingParticipants,
    fetchParticipants,
    messagesRef,
    reloadMessages,
    children
}) => {
    return (
        <ChatContext.Provider
            value={{
                participants,
                loadingParticipants,
                fetchParticipants,
                messagesRef,
                reloadMessages
            }}>
            {children}
        </ChatContext.Provider>
    );
};

ChatProvider.propTypes = {
    participants: PropTypes.array,
    loadingParticipants: PropTypes.bool,
    fetchParticipants: PropTypes.func,
    reloadMessages: PropTypes.func
};

export {ChatProvider};
export default ChatContext;
