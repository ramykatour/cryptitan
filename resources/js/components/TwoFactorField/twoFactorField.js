import React from "react";
import Form, {TextField} from "components/Form";
import {InputAdornment} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PasswordIcon from "@mui/icons-material/Password";
import {defineMessages, useIntl} from "react-intl";
import {useAuth} from "models/Auth";

const messages = defineMessages({
    password: {defaultMessage: "Password"},
    token: {defaultMessage: "Token"}
});

const TwoFactorField = () => {
    const intl = useIntl();
    const auth = useAuth();

    return auth.requireTwoFactor() ? (
        <Form.Item
            name="token"
            label={intl.formatMessage(messages.token)}
            rules={[{required: true}]}>
            <TextField
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockIcon />
                        </InputAdornment>
                    )
                }}
            />
        </Form.Item>
    ) : (
        <Form.Item
            name="password"
            label={intl.formatMessage(messages.password)}
            rules={[{required: true}]}>
            <TextField
                fullWidth
                type="password"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <PasswordIcon />
                        </InputAdornment>
                    )
                }}
            />
        </Form.Item>
    );
};

export default TwoFactorField;
