import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Stack,
    Typography
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Spin from "components/Spin";

const messages = defineMessages({
    unit: {defaultMessage: "Unit"},
    address: {defaultMessage: "Address"},
    post: {defaultMessage: "Postcode"},
    city: {defaultMessage: "City"},
    state: {defaultMessage: "State"},
    addressUpdated: {defaultMessage: "Your address was updated."},
    required: {defaultMessage: "Required"},
    pending: {defaultMessage: "Pending"},
    approved: {defaultMessage: "Approved"},
    rejected: {defaultMessage: "Rejected"},
    data: {defaultMessage: "Data"}
});

const UpdateAddress = ({expanded, expandedHandler, onChange}) => {
    const [form] = Form.useForm();
    const [address, setAddress] = useState();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const intl = useIntl();

    const fetchAddress = useCallback(() => {
        request
            .get(route("user.verification.get-address"))
            .then((data) => setAddress(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchAddress();
    }, [fetchAddress]);

    const disabled = useMemo(() => {
        return ["pending", "approved"].includes(address?.status);
    }, [address]);

    const statusChip = useMemo(() => {
        switch (address?.status) {
            case "approved":
                return (
                    <Chip
                        size="small"
                        label={intl.formatMessage(messages.approved)}
                        color="primary"
                    />
                );
            case "pending":
                return (
                    <Chip
                        size="small"
                        label={intl.formatMessage(messages.pending)}
                        color="info"
                    />
                );
            case "rejected":
                return (
                    <Chip
                        size="small"
                        label={intl.formatMessage(messages.rejected)}
                        color="error"
                    />
                );
            default:
                return (
                    <Chip
                        label={intl.formatMessage(messages.required)}
                        size="small"
                    />
                );
        }
    }, [intl, address]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("user.verification.update-address"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.addressUpdated));
                    onChange?.();
                    fetchAddress();
                })
                .catch(errorHandler());
        },
        [formRequest, intl, onChange, fetchAddress]
    );

    const initialValues = useMemo(
        () => ({
            address: address?.address,
            unit: address?.unit,
            city: address?.city,
            postcode: address?.postcode,
            state: address?.state
        }),
        [address]
    );

    return (
        <Form form={form} initialValues={initialValues} onFinish={submitForm}>
            <Spin spinning={loading}>
                <Accordion
                    expanded={!disabled && expanded === "verified_address"}
                    disabled={disabled}
                    onChange={expandedHandler("verified_address")}
                    className="no-border">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" spacing={3}>
                            {statusChip}
                            <span>
                                <FormattedMessage defaultMessage="Submit Address" />
                            </span>
                        </Stack>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Stack spacing={2}>
                            <Typography
                                variant="overline"
                                sx={{color: "text.secondary"}}>
                                <FormattedMessage defaultMessage="Address" />
                            </Typography>

                            <Form.Item
                                name="address"
                                label={intl.formatMessage(messages.address)}
                                rules={[{required: true}]}>
                                <TextField fullWidth />
                            </Form.Item>

                            <Stack
                                direction={{xs: "column", sm: "row"}}
                                spacing={{xs: 3, sm: 2}}>
                                <Form.Item
                                    name="unit"
                                    label={intl.formatMessage(messages.unit)}
                                    rules={[{required: true}]}>
                                    <TextField fullWidth />
                                </Form.Item>

                                <Form.Item
                                    name="city"
                                    label={intl.formatMessage(messages.city)}
                                    rules={[{required: true}]}>
                                    <TextField fullWidth />
                                </Form.Item>
                            </Stack>

                            <Stack
                                direction={{xs: "column", sm: "row"}}
                                spacing={{xs: 3, sm: 2}}>
                                <Form.Item
                                    name="state"
                                    label={intl.formatMessage(messages.state)}
                                    rules={[{required: true}]}>
                                    <TextField fullWidth />
                                </Form.Item>

                                <Form.Item
                                    name="postcode"
                                    label={intl.formatMessage(messages.post)}
                                    rules={[{required: true}]}>
                                    <TextField fullWidth />
                                </Form.Item>
                            </Stack>
                        </Stack>
                    </AccordionDetails>

                    <AccordionActions sx={{justifyContent: "flex-end"}}>
                        <LoadingButton
                            variant="contained"
                            type="submit"
                            loading={formLoading}>
                            <FormattedMessage defaultMessage="Save Changes" />
                        </LoadingButton>
                    </AccordionActions>
                </Accordion>
            </Spin>
        </Form>
    );
};

export default UpdateAddress;
