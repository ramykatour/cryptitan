import React, {useContext} from "react";
import PeerOfferContext from "contexts/PeerOfferContext";
import {FormattedMessage} from "react-intl";
import ItemDetail from "../ItemDetail";

const TimeLimit = ({inverse = false}) => {
    const {offer} = useContext(PeerOfferContext);

    return (
        <ItemDetail
            inverse={inverse}
            title={<FormattedMessage defaultMessage="Time Limit" />}
            content={
                <FormattedMessage
                    defaultMessage="{time} minutes"
                    values={{time: offer.time_limit}}
                />
            }
        />
    );
};

export default TimeLimit;
