import React, {useContext} from "react";
import {FormattedMessage} from "react-intl";
import UserRating from "components/UserRating";
import PeerOfferContext from "contexts/PeerOfferContext";
import ItemDetail from "../ItemDetail";

const Reviews = ({inverse = false}) => {
    const {offer} = useContext(PeerOfferContext);

    return (
        <ItemDetail
            inverse={inverse}
            title={<FormattedMessage defaultMessage="Reviews" />}
            content={
                <UserRating
                    variant="body2"
                    user={offer.owner}
                    color="inherit"
                    size="medium"
                />
            }
        />
    );
};

export default Reviews;
