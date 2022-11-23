import React from "react";
import {defineMessages, useIntl} from "react-intl";
import Form, {TextField} from "components/Form";
import {InputAdornment} from "@mui/material";

const messages = defineMessages({
    amount: {defaultMessage: "Amount"}
});

const AmountField = () => {
    const intl = useIntl();

    const getCurrency = (form) => {
        return form.getFieldValue("currency");
    };

    const shouldUpdate = (previous, current) =>
        current.currency !== previous.currency;

    return (
        <Form.Item shouldUpdate={shouldUpdate}>
            {(form) =>
                getCurrency(form) && (
                    <Form.Item
                        name="amount"
                        label={intl.formatMessage(messages.amount)}
                        rules={[{type: "number", min: 1}]}
                        normalize={(v) => v && parseFloat(v)}>
                        <TextField
                            type="number"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {getCurrency(form)}
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                )
            }
        </Form.Item>
    );
};

export default AmountField;
