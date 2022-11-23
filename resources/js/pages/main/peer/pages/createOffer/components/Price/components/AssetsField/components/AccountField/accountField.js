import React from "react";
import {defineMessages, useIntl} from "react-intl";
import Form from "components/Form";
import BaseSelect from "components/AccountSelect";

const messages = defineMessages({
    account: {defaultMessage: "Account"}
});

const AccountField = () => {
    const intl = useIntl();

    return (
        <Form.Item
            name="account"
            label={intl.formatMessage(messages.account)}
            rules={[{required: true}]}>
            <BaseSelect />
        </Form.Item>
    );
};

export default AccountField;
