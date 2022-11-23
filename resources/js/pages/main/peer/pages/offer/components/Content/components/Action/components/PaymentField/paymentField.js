import React, {useContext, useEffect, useMemo, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import Form, {AutoComplete} from "components/Form";
import PeerOfferContext from "contexts/PeerOfferContext";

const messages = defineMessages({
    bankAccount: {defaultMessage: "Bank Account"}
});

const PaymentField = () => {
    const intl = useIntl();
    const {offer} = useContext(PeerOfferContext);
    const [accounts, setAccounts] = useState([]);
    const [request, loading] = useRequest();

    useEffect(() => {
        request
            .get(route("peer-offer.get-bank-accounts", {offer: offer.id}))
            .then((data) => setAccounts(data))
            .catch(errorHandler());
    }, [request, offer]);

    const required = useMemo(() => {
        return offer.payment === "bank_account" && offer.type === "buy";
    }, [offer]);

    const getName = (option) => {
        return `${option.bank_name} (${option.number})`;
    };

    if (!required) {
        return null;
    }

    return (
        <Form.Item
            name="bank_account"
            label={intl.formatMessage(messages.bankAccount)}
            rules={[{required: true}]}>
            <AutoComplete
                options={accounts}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => getName(option)}
                loading={loading}
                disabled={!offer.tradable}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {getName(option)}
                    </li>
                )}
            />
        </Form.Item>
    );
};

export default PaymentField;
