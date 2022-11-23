import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import Form, {Checkbox} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {notify} from "utils/index";
import {isUndefined} from "lodash";
import {fetchUser} from "redux/slices/auth";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Tooltip,
    Typography
} from "@mui/material";
import emailIcon from "@iconify/icons-ic/round-email";
import notificationIcon from "@iconify/icons-ic/round-notification-important";
import smsIcon from "@iconify/icons-ic/round-textsms";
import {Icon} from "@iconify/react";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import {experimentalStyled as styled} from "@mui/material/styles";

const messages = defineMessages({
    currency: {defaultMessage: "Currency"},
    profileUpdated: {defaultMessage: "Your profile was updated."}
});

const NotificationForm = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const intl = useIntl();
    const [settings, setSettings] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchSettings = useCallback(() => {
        request
            .get(route("user.notification-settings"))
            .then((data) => setSettings(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("user.update-notification-settings"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.profileUpdated));
                    dispatch(fetchUser());
                })
                .catch(errorHandler());
        },
        [intl, formRequest, dispatch]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Card>
                <CardHeader
                    title={<FormattedMessage defaultMessage="Notifications" />}
                />

                <CardContent>
                    <Spin spinning={loading}>
                        <Grid container spacing={3} sx={{mb: 2}}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" noWrap>
                                    <FormattedMessage defaultMessage="Type" />
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Container>
                                    <EmailHeader />
                                    <DatabaseHeader />
                                    <PhoneHeader />
                                </Container>
                            </Grid>
                        </Grid>

                        {settings.map((setting) => (
                            <Grid key={setting.id} container spacing={3}>
                                <Grid item xs={6}>
                                    <Tooltip title={setting.title}>
                                        <Typography variant="body2" noWrap>
                                            {setting.title}
                                        </Typography>
                                    </Tooltip>
                                </Grid>

                                <Grid item xs={6}>
                                    <Container>
                                        <EmailSelect setting={setting} />
                                        <DatabaseSelect setting={setting} />
                                        <PhoneSelect setting={setting} />
                                    </Container>
                                </Grid>
                            </Grid>
                        ))}
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

const EmailHeader = () => {
    return (
        <Box
            component={Icon}
            sx={{color: "primary.dark"}}
            icon={emailIcon}
            width={20}
            height={20}
        />
    );
};

const EmailSelect = ({setting}) => {
    return (
        <Form.Item
            initialValue={setting.email}
            name={["notification", setting.name, "email"]}
            valuePropName="checked">
            <Checkbox disabled={isUndefined(setting.email)} />
        </Form.Item>
    );
};

const DatabaseHeader = () => {
    return (
        <Box
            component={Icon}
            sx={{color: "primary.dark"}}
            icon={notificationIcon}
            width={20}
            height={20}
        />
    );
};

const DatabaseSelect = ({setting}) => {
    return (
        <Form.Item
            initialValue={setting.database}
            name={["notification", setting.name, "database"]}
            valuePropName="checked">
            <Checkbox disabled={isUndefined(setting.database)} />
        </Form.Item>
    );
};

const PhoneHeader = () => {
    return (
        <Box
            component={Icon}
            sx={{color: "primary.dark"}}
            icon={smsIcon}
            width={20}
            height={20}
        />
    );
};

const PhoneSelect = ({setting}) => {
    return (
        <Form.Item
            initialValue={setting.sms}
            name={["notification", setting.name, "sms"]}
            valuePropName="checked">
            <Checkbox disabled={isUndefined(setting.sms)} />
        </Form.Item>
    );
};

const Container = styled(Box)({
    display: "flex",
    justifyContent: "space-around"
});

export default NotificationForm;
