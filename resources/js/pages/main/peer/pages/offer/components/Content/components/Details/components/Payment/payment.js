import React, {useContext, useMemo} from "react";
import PeerOfferContext from "contexts/PeerOfferContext";
import ItemDetail from "../ItemDetail";
import {FormattedMessage} from "react-intl";

const Payment = ({inverse = false}) => {
    const {offer} = useContext(PeerOfferContext);

    const content = useMemo(() => {
        switch (offer.payment) {
            case "bank_account":
                return <FormattedMessage defaultMessage="Bank Transfer" />;
            case "payment_method":
                return offer.payment_method?.name;
        }
    }, [offer]);

    return (
        <ItemDetail
            inverse={inverse}
            title={<FormattedMessage defaultMessage="Payment" />}
            content={content}
        />
    );
};

export default Payment;
