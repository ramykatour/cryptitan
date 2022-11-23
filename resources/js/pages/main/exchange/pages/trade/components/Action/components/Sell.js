import React, {useCallback, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Form from "components/Form";
import {useModal} from "utils/modal";
import {useFormRequest} from "services/Http";
import {useActiveWalletAccount} from "hooks/account";
import Value from "utils/classes/Value";
import {isNumber} from "lodash";
import Alerts from "./Alerts";
import {CardContent} from "@mui/material";
import InputValue from "./InputValue";
import InputDivider from "./InputDivider";
import InputPrice from "./InputPrice";
import HiddenFields from "./HiddenFields";
import {LoadingButton} from "@mui/lab";
import {
    useAccountEffect,
    useInitialAmount,
    useSubmitRequest,
    useSummaryRequest,
    useValuesChangeHandler
} from "./hooks";
import Confirm from "./Confirm";
import {useTokenField} from "hooks/user";

const messages = defineMessages({
    price: {defaultMessage: "Price"},
    fee: {defaultMessage: "Fee"},
    confirm: {defaultMessage: "You are selling"},
    action: {defaultMessage: "Sell Now"},
    success: {defaultMessage: "Sell order was created."},
    value: {defaultMessage: "Value"}
});

const Sell = () => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [modal, modalElements] = useModal();
    const [formRequest, formLoading] = useFormRequest(form);
    const [summary, setSummary] = useState({});
    const walletAccount = useActiveWalletAccount();
    const handleValuesChange = useValuesChangeHandler(setSummary);
    const initialAmount = useInitialAmount("unit");
    const tokenField = useTokenField();

    useAccountEffect(form);

    const calculate = useSummaryRequest(
        "exchange-trade.calculate-sell",
        form,
        formRequest,
        setSummary
    );

    const confirm = useCallback(() => {
        form.resetFields([tokenField]);

        form.validateFields()
            .then(() => {
                modal.confirm({
                    content: (
                        <Confirm
                            tokenField={tokenField}
                            symbol={walletAccount.wallet.coin.symbol}
                            title={intl.formatMessage(messages.confirm)}
                            action={intl.formatMessage(messages.action)}
                            deductible={summary.deductible}
                            fee={summary.fee}
                        />
                    )
                });
            })
            .catch(() => null);
    }, [modal, form, summary, walletAccount, tokenField, intl]);

    const submitForm = useSubmitRequest(
        "exchange-trade.sell",
        form,
        formRequest,
        setSummary
    );

    const insufficient = useCallback(
        (form) => {
            return (
                walletAccount.isNotEmpty() &&
                Number(form.getFieldValue("amount")) > 0 &&
                isNumber(summary.deductible) &&
                walletAccount.available < summary.deductible
            );
        },
        [summary, walletAccount]
    );

    const canSubmit = useCallback(
        (form) => {
            return (
                walletAccount.isNotEmpty() &&
                Number(form.getFieldValue("amount")) > 0 &&
                isNumber(summary.deductible) &&
                walletAccount.available >= summary.deductible
            );
        },
        [summary, walletAccount]
    );

    return (
        <CardContent>
            <Form
                form={form}
                onValuesChange={handleValuesChange}
                initialValues={{amount: initialAmount}}
                onFinish={submitForm}>
                <Alerts insufficient={insufficient} />

                <Form.Item
                    name="amount"
                    label={intl.formatMessage(messages.value)}
                    rules={[Value.validate(intl), {required: true}]}>
                    <InputValue onBlur={calculate} fee={summary.fee} />
                </Form.Item>

                <InputDivider />

                <Form.Item
                    name="amount"
                    label={intl.formatMessage(messages.price)}
                    rules={[Value.validate(intl), {required: true}]}>
                    <InputPrice onBlur={calculate} />
                </Form.Item>

                {modalElements}

                <HiddenFields />

                <Form.Item shouldUpdate>
                    {(form) => (
                        <LoadingButton
                            variant="contained"
                            onClick={confirm}
                            disabled={!canSubmit(form)}
                            sx={{mt: 3}}
                            loading={formLoading}
                            fullWidth>
                            <FormattedMessage defaultMessage="Confirm" />
                        </LoadingButton>
                    )}
                </Form.Item>
            </Form>
        </CardContent>
    );
};

export default Sell;
