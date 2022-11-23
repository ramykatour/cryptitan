import React, {useEffect, useState} from "react";
import Form, {AutoComplete} from "components/Form";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";

const messages = defineMessages({
    paymentMethod: {defaultMessage: "Payment Method"}
});

const PaymentField = () => {
    const isPaymentMethod = (form) => {
        return form.getFieldValue("payment") === "payment_method";
    };

    const shouldUpdate = (previous, current) =>
        current.payment !== previous.payment;

    return (
        <Form.Item shouldUpdate={shouldUpdate}>
            {(form) => isPaymentMethod(form) && <PaymentMethod />}
        </Form.Item>
    );
};

const PaymentMethod = () => {
    const intl = useIntl();
    const [methods, setMethods] = useState([]);
    const [request, loading] = useRequest();

    useEffect(() => {
        request
            .get(route("peer-payment.methods"))
            .then((data) => setMethods(data))
            .catch(errorHandler());
    }, [request]);

    return (
        <Form.Item
            name="payment_method"
            label={intl.formatMessage(messages.paymentMethod)}>
            <AutoComplete
                options={methods}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                groupBy={(option) => option.category.name}
                loading={loading}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.name}
                    </li>
                )}
            />
        </Form.Item>
    );
};

export default PaymentField;
