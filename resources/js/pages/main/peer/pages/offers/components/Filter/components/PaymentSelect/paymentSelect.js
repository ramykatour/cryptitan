import React from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {ToggleButtonGroup} from "components/Form";
import {ToggleButton} from "@mui/material";

const messages = defineMessages({
    payment: {defaultMessage: "Method"}
});

const PaymentSelect = () => {
    const intl = useIntl();

    return (
        <Form.Item name="payment" label={intl.formatMessage(messages.payment)}>
            <ToggleButtonGroup exclusive fullWidth size="small">
                <ToggleButton value="bank_account">
                    <FormattedMessage defaultMessage="Bank Account" />
                </ToggleButton>

                <ToggleButton value="payment_method">
                    <FormattedMessage defaultMessage="Other Methods" />
                </ToggleButton>
            </ToggleButtonGroup>
        </Form.Item>
    );
};

export default PaymentSelect;
