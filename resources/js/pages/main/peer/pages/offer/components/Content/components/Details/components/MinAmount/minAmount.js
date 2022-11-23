import React, {useContext} from "react";
import PeerOfferContext from "contexts/PeerOfferContext";
import {FormattedMessage} from "react-intl";
import ItemDetail from "../ItemDetail";

const MinAmount = ({inverse = false}) => {
    const {offer} = useContext(PeerOfferContext);

    return (
        <ItemDetail
            inverse={inverse}
            title={<FormattedMessage defaultMessage="Min Amount" />}
            content={offer.formatted_min_amount}
        />
    );
};

export default MinAmount;
