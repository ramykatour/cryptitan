import React, {createContext} from "react";
import PropTypes from "prop-types";

const initialState = {
    fetchOffer: () => {}
};

const PeerOfferContext = createContext(initialState);

const PeerOfferProvider = ({offer, fetchOffer, children}) => {
    return (
        <PeerOfferContext.Provider value={{offer, fetchOffer}}>
            {children}
        </PeerOfferContext.Provider>
    );
};

PeerOfferProvider.propTypes = {
    offer: PropTypes.object,
    fetchOffer: PropTypes.func
};

export {PeerOfferProvider};
export default PeerOfferContext;
