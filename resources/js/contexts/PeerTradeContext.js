import React, {createContext} from "react";
import PropTypes from "prop-types";

const initialState = {
    fetchTrade: () => {}
};

const PeerTradeContext = createContext(initialState);

const PeerTradeProvider = ({trade, fetchTrade, children}) => {
    return (
        <PeerTradeContext.Provider value={{trade, fetchTrade}}>
            {children}
        </PeerTradeContext.Provider>
    );
};

PeerTradeProvider.propTypes = {
    trade: PropTypes.object,
    fetchTrade: PropTypes.func
};

export {PeerTradeProvider};
export default PeerTradeContext;
