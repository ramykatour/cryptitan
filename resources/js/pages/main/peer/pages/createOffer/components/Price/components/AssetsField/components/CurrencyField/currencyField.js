import React from "react";
import {defineMessages, useIntl} from "react-intl";
import {useSupportedCurrencies} from "hooks/global";
import Form, {TextField} from "components/Form";
import {MenuItem} from "@mui/material";
import {isEmpty} from "lodash";

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
                label={intl.formatMessage(messages.currency)}
                rules={[{required: true}]}>
                <TextField fullWidth disabled />
            </Form.Item>
        );
    }

    return (
        <Form.Item
            name="currency"
            label={intl.formatMessage(messages.currency)}
            rules={[{required: true}]}>
            <TextField fullWidth disabled select>
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
