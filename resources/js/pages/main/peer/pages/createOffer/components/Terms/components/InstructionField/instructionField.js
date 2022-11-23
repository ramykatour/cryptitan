import React from "react";
import Form, {TextField} from "components/Form";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    instruction: {defaultMessage: "Instruction"},
    placeholder: {defaultMessage: "This will be displayed to the counterparty."}
});

const InstructionField = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="instruction"
            label={intl.formatMessage(messages.instruction)}
            rules={[{required: true}]}>
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

export default InstructionField;
