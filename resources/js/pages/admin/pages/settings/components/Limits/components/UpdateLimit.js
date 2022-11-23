import React, {useCallback, useEffect, useState} from "react";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    Typography
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import Form, {TextField} from "components/Form";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import {isEmpty, upperCase} from "lodash";
import Spin from "components/Spin";

const messages = defineMessages({
    title: {defaultMessage: "Feature Limit"},
    unverified: {defaultMessage: "Unverified"},
    basic: {defaultMessage: "Basic"},
    advanced: {defaultMessage: "Advanced"},
    period: {defaultMessage: "Period"},
    success: {defaultMessage: "Limit was updated"}
});

const UpdateLimit = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [limits, setLimits] = useState([]);

    const fetchLimits = useCallback(() => {
        request
            .get(route("admin.feature-limit.get"))
            .then((data) => setLimits(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchLimits();
    }, [fetchLimits]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.feature-limit.update"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    fetchLimits();
                })
                .catch(errorHandler());
        },
        [formRequest, intl, fetchLimits]
    );

    useEffect(() => {
        if (!isEmpty(limits)) {
            form.resetFields();
        }
    }, [limits, form]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Card>
                <CardHeader
                    title={<FormattedMessage defaultMessage="Feature Limit" />}
                />

                <CardContent>
                    <Spin spinning={loading}>
                        <Stack spacing={4}>
                            {!isEmpty(limits) &&
                                limits.map((limit) => (
                                    <LimitFields
                                        key={limit.name}
                                        limit={limit}
                                    />
                                ))}
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

const LimitFields = ({limit}) => {
    return (
        <Stack spacing={2}>
            <Typography variant="overline" noWrap>
                {upperCase(limit.name)}
            </Typography>

            <Box sx={{width: "100%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <PeriodField limit={limit} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <UnverifiedField limit={limit} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <BasicField limit={limit} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <AdvancedField limit={limit} />
                    </Grid>
                </Grid>
            </Box>
        </Stack>
    );
};

const PeriodField = ({limit}) => {
    const intl = useIntl();

    return (
        <Form.Item
            initialValue={limit.period}
            name={["limits", limit.name, "period"]}
            label={intl.formatMessage(messages.period)}
            rules={[{required: true}]}>
            <TextField fullWidth select>
                <MenuItem value="day">
                    <FormattedMessage defaultMessage="Daily" />
                </MenuItem>

                <MenuItem value="month">
                    <FormattedMessage defaultMessage="Monthly" />
                </MenuItem>

                <MenuItem value="year">
                    <FormattedMessage defaultMessage="Yearly" />
                </MenuItem>
            </TextField>
        </Form.Item>
    );
};

const UnverifiedField = ({limit}) => {
    const intl = useIntl();

    return (
        <Form.Item
            initialValue={limit.unverified_limit}
            name={["limits", limit.name, "unverified_limit"]}
            label={intl.formatMessage(messages.unverified)}
            rules={[{required: true}]}>
            <InputField limit={limit} />
        </Form.Item>
    );
};

const BasicField = ({limit}) => {
    const intl = useIntl();
    return (
        <Form.Item
            initialValue={limit.basic_limit}
            name={["limits", limit.name, "basic_limit"]}
            label={intl.formatMessage(messages.basic)}
            rules={[{required: true}]}>
            <InputField limit={limit} />
        </Form.Item>
    );
};

const AdvancedField = ({limit}) => {
    const intl = useIntl();

    return (
        <Form.Item
            initialValue={limit.advanced_limit}
            name={["limits", limit.name, "advanced_limit"]}
            label={intl.formatMessage(messages.advanced)}
            rules={[{required: true}]}>
            <InputField limit={limit} />
        </Form.Item>
    );
};

const InputField = ({limit, ...otherProps}) => {
    return (
        <TextField
            type="number"
            fullWidth
            InputProps={{
                endAdornment: limit.type === "amount" && (
                    <InputAdornment position="end">USD</InputAdornment>
                )
            }}
            {...otherProps}
        />
    );
};

export default UpdateLimit;
