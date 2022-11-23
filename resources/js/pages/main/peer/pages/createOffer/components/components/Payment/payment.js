import React from "react";
import SummaryItem from "../SummaryItem";
import {FormattedMessage} from "react-intl";
import Form from "components/Form";

const Payment = () => {
    const getContent = (form) => {
        switch (form.getFieldValue("payment")) {
            case "bank_account":
                return <FormattedMessage defaultMessage="Bank Account" />;
            case "payment_method":
                return form.getFieldValue("payment_method")?.name;
        }
    };

    return (
        <Form.Item shouldUpdate>
            {(form) => (
                <SummaryItem
                    title={<FormattedMessage defaultMessage="Payment" />}
                    content={getContent(form)}
                />
            )}
        </Form.Item>
    );
};

export default Payment;
