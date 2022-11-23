import React, {useContext} from "react";
import PeerOfferContext from "contexts/PeerOfferContext";
import {FormattedMessage} from "react-intl";
import ItemDetail from "../ItemDetail";

const MaxAmount = ({inverse = false}) => {
    const {offer} = useContext(PeerOfferContext);

    return (
        <ItemDetail
            inverse={inverse}
            title={<FormattedMessage defaultMessage="Max Amount" />}
            content={offer.formatted_max_amount}
        />
    );
};

export default MaxAmount;
