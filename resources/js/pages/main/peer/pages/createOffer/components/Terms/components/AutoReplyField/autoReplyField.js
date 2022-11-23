import React from "react";
import Form, {TextField} from "components/Form";
import {defineMessages, useIntl} from "react-intl";

// prettier-ignore
const messages = defineMessages({
    autoReply: {defaultMessage: "Auto Reply (optional)"},
    placeholder: {defaultMessage: "This message will be sent to the counterparty once the trade has started."}
});

const AutoReplyField = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="auto_reply"
            label={intl.formatMessage(messages.autoReply)}>
            <TextField
                placeholder={intl.formatMessage(messages.placeholder)}
                InputLabelProps={{shrink: true}}
                multiline
                rows={3}
                fullWidth
            />
        </Form.Item>
    );
};

export default AutoReplyField;
