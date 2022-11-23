import React from "react";
import {defineMessages, useIntl} from "react-intl";
import {useSupportedCurrencies} from "hooks/global";
import {isEmpty} from "lodash";
import Form, {TextField} from "components/Form";
import {MenuItem} from "@mui/material";

const messages = defineMessages({
    currency: {defaultMessage: "Currency"}
});

const CurrencyField = () => {
    const intl = useIntl();
    const {currencies} = useSupportedCurrencies();

    if (isEmpty(currencies)) {
        return (
            <Form.Item
                name="currency"
                label={intl.formatMessage(messages.currency)}>
                <TextField fullWidth disabled />
            </Form.Item>
        );
    }

    return (
        <Form.Item
            name="currency"
            label={intl.formatMessage(messages.currency)}>
            <TextField fullWidth select>
                {currencies.map((currency) => (
                    <MenuItem value={currency.code} key={currency.code}>
                        {`${currency.name} (${currency.code})`}
                    </MenuItem>
                ))}
            </TextField>
        </Form.Item>
    );
};

export default CurrencyField;
