import React, {useCallback, useEffect, useState} from "react";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {ControlLabel} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import {isEmpty} from "lodash";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    title: {defaultMessage: "Service Settings"},
    sms: {defaultMessage: "Enable SMS"},
    database: {defaultMessage: "Enable Database"},
    email: {defaultMessage: "Enable Email"},
    userSetup: {defaultMessage: "Require user setup"},
    success: {defaultMessage: "Settings was updated."}
});

const UpdateService = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [settings, setSettings] = useState({});

    const fetchSettings = useCallback(() => {
        request
            .get(route("admin.settings.get-service"))
            .then((data) => setSettings(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.settings.update-service"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    fetchSettings();
                })
                .catch(errorHandler());
        },
        [formRequest, intl, fetchSettings]
    );

    useEffect(() => {
        if (!isEmpty(settings)) {
            form.resetFields();
        }
    }, [settings, form]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Card>
                <CardHeader
                    title={
                        <FormattedMessage defaultMessage="Service Settings" />
                    }
                />

                <CardContent>
                    <Spin spinning={loading}>
                        <Stack>
                            <Typography variant="overline">
                                <FormattedMessage defaultMessage="Notifications" />
                            </Typography>

                            <Form.Item
                                name="enable_sms"
                                initialValue={settings.enable_sms}
                                label={intl.formatMessage(messages.sms)}
                                valuePropName="checked">
                                <ControlLabel>
                                    <Switch />
                                </ControlLabel>
                            </Form.Item>

                            <Form.Item
                                name="enable_database"
                                initialValue={settings.enable_database}
                                label={intl.formatMessage(messages.database)}
                                valuePropName="checked">
                                <ControlLabel>
                                    <Switch />
                                </ControlLabel>
                            </Form.Item>

                            <Form.Item
                                name="enable_mail"
                                initialValue={settings.enable_mail}
                                label={intl.formatMessage(messages.email)}
                                valuePropName="checked">
                                <ControlLabel>
                                    <Switch />
                                </ControlLabel>
                            </Form.Item>
                        </Stack>

                        <Stack sx={{mt: 3}}>
                            <Typography variant="overline">
                                <FormattedMessage defaultMessage="Other Settings" />
                            </Typography>

                            <Form.Item
                                name="user_setup"
                                initialValue={settings.user_setup}
                                label={intl.formatMessage(messages.userSetup)}
                                valuePropName="checked">
                                <ControlLabel>
                                    <Switch />
                                </ControlLabel>
                            </Form.Item>
                        </Stack>
                    </Spin>
                </CardContent>

                <CardActions sx={{justifyContent: "flex-end"}}>
                    <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Save Changes" />
                    </LoadingButton>
                </CardActions>
            </Card>
        </Form>
    );
};

export default UpdateService;
