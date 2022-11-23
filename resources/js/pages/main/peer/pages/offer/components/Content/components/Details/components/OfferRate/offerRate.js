import React, {useContext} from "react";
import PeerOfferContext from "contexts/PeerOfferContext";
import ItemDetail from "../ItemDetail";
import {FormattedMessage} from "react-intl";

const OfferRate = ({inverse = false}) => {
    const {offer} = useContext(PeerOfferContext);

    return (
        <ItemDetail
            inverse={inverse}
            title={<FormattedMessage defaultMessage="Offer Rate" />}
            content={offer.formatted_price}
        />
    );
};

export default OfferRate;
