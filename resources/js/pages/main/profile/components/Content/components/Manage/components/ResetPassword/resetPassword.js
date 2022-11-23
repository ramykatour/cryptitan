import React, {useCallback, useContext} from "react";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    InputAdornment,
    Stack
} from "@mui/material";
import Form, {TextField} from "components/Form";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {LoadingButton} from "@mui/lab";
import {errorHandler, route, useFormRequest} from "services/Http";
import PasswordIcon from "@mui/icons-material/Password";
import {passwordConfirmation} from "utils/form";
import {notify} from "utils/index";
import UserContext from "contexts/UserContext";
import TwoFactorField from "components/TwoFactorField";

const messages = defineMessages({
    oldPassword: {defaultMessage: "Old Password"},
    password: {defaultMessage: "Password"},
    successful: {defaultMessage: "Password was reset."},
    confirmPassword: {defaultMessage: "Confirm Password"},
    token: {defaultMessage: "Token"}
});

const ResetPassword = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const {user} = useContext(UserContext);

    const submitForm = useCallback(
        (values) => {
            const url = route("admin.user.reset-password", {user: user.id});

            formRequest
                .post(url, values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.successful));
                    form.resetFields();
                })
                .catch(errorHandler());
        },
        [intl, formRequest, user, form]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Card>
                <CardHeader
                    title={<FormattedMessage defaultMessage="Reset Password" />}
                />

                <CardContent>
                    <Stack spacing={2}>
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

                        <Form.Item
                            name="password_confirmation"
                            label={intl.formatMessage(messages.confirmPassword)}
                            dependencies={["password"]}
                            rules={[
                                passwordConfirmation(intl, "password"),
                                {required: true}
                            ]}>
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

                        <Divider sx={{my: 2}}>
                            <FormattedMessage defaultMessage="Verification" />
                        </Divider>

                        <TwoFactorField />
                    </Stack>
                </CardContent>

                <CardActions sx={{justifyContent: "flex-end"}}>
                    <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </CardActions>
            </Card>
        </Form>
    );
};

export default ResetPassword;
