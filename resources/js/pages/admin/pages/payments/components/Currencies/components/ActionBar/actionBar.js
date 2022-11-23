import React, {useCallback, useContext, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {Box, Button, Grid, MenuItem, Switch, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {StyledToolbar} from "styles/toolbar.style";
import Form, {ControlLabel, TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";
import Spin from "components/Spin";
import {toUpper} from "lodash";
import {useExchangeBaseCurrency} from "hooks/settings";
import SearchTable from "components/SearchTable";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";
import {FormContext} from "components/Form/contexts";

const messages = defineMessages({
    success: {defaultMessage: "Currency was added."},
    search: {defaultMessage: "Search currency..."},
    addCurrency: {defaultMessage: "Add Currency"},
    auto: {defaultMessage: "Auto"},
    manual: {defaultMessage: "Manual"},
    rate: {defaultMessage: "Rate"},
    currency: {defaultMessage: "Currency"}
});

const ActionBar = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addCurrency = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addCurrency),
            content: <CreateForm />,
            rootProps: {fullWidth: true}
        });
    }, [intl, modal]);

    return (
        <StyledToolbar>
            <SearchTable
                sx={{mr: 2}}
                placeholder={intl.formatMessage(messages.search)}
                field="name"
            />

            {modalElements}

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addCurrency}>
                <FormattedMessage defaultMessage="Add Currency" />
            </Button>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const {reload: reloadTable} = useContext(TableContext);

    const [currencies, setCurrencies] = useState([]);

    const fetchCurrencies = useCallback(() => {
        request
            .get(route("admin.payment.get-currencies"))
            .then((data) => setCurrencies(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchCurrencies();
    }, [fetchCurrencies]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.payment.supported-currency.create"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable]
    );

    const handleValuesChange = useCallback(
        (values) => {
            if (values.code) {
                const selected = currencies.find((currency) => {
                    return currency.code === values.code;
                });

                form.setFieldsValue({
                    exchange_rate: selected?.exchange_rate,
                    manual: selected?.type === "manual"
                });
            }
        },
        [form, currencies]
    );

    return (
        <Form
            form={form}
            onValuesChange={handleValuesChange}
            onFinish={submitForm}>
            <Spin spinning={loading}>
                <ModalContent spacing={3}>
                    <Form.Item
                        name="code"
                        label={intl.formatMessage(messages.currency)}
                        rules={[{required: true}]}>
                        <TextField fullWidth select>
                            {currencies.map((currency, key) => (
                                <MenuItem value={currency.code} key={key}>
                                    {`${currency.name} (${currency.code})`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Form.Item>

                    <ExchangeRate />
                </ModalContent>

                <ModalActions>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </ModalActions>
            </Spin>
        </Form>
    );
};

const ExchangeRate = () => {
    const intl = useIntl();
    const baseCurrency = useExchangeBaseCurrency();
    const {form} = useContext(FormContext);

    const getManualProps = (checked) => {
        const code = form.getFieldValue("code");
        const disabled = toUpper(baseCurrency) === code;
        return {checked, disabled};
    };

    const getRateProps = (value) => {
        const disabled = !form.getFieldValue("manual");
        return {value, disabled};
    };

    return (
        <Box component="div">
            <Typography
                color="text.secondary"
                sx={{display: "block", mb: 1}}
                variant="overline">
                <FormattedMessage defaultMessage="Exchange Rate" />
            </Typography>

            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={6} sm={4}>
                    <Form.Item
                        name="manual"
                        getValueProps={getManualProps}
                        label={intl.formatMessage(messages.manual)}
                        valuePropName="checked">
                        <ControlLabel>
                            <Switch />
                        </ControlLabel>
                    </Form.Item>
                </Grid>

                <Grid item xs={6} sm={8}>
                    <Form.Item
                        name="exchange_rate"
                        getValueProps={getRateProps}
                        label={intl.formatMessage(messages.rate)}
                        dependencies={["manual"]}
                        rules={[{required: true}]}>
                        <TextField type="number" fullWidth />
                    </Form.Item>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ActionBar;
