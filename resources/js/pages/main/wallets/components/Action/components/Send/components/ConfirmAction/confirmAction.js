import React, {Fragment, useCallback, useContext, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {useActiveWalletAccount} from "hooks/account";
import Form from "components/Form";
import {Divider, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import TwoFactorField from "components/TwoFactorField";
import {useTokenField} from "hooks/user";
import {styled} from "@mui/material/styles";
import ModalActions from "components/ModalActions";
import {FormContext} from "components/Form/contexts";

const ConfirmAction = ({feeEstimate, getDeductible, closeModal}) => {
    const tokenField = useTokenField();
    const account = useActiveWalletAccount();
    const {form} = useContext(FormContext);

    const submit = useCallback(
        (form) => {
            form.validateFields([tokenField])
                .then(() => {
                    form.submit();
                    closeModal();
                })
                .catch(console.warn);
        },
        [closeModal, tokenField]
    );

    useEffect(() => {
        form.resetFields([tokenField]);
    }, [form, tokenField]);

    return (
        <Form.Item shouldUpdate>
            {(form) => {
                const amount = Number(form.getFieldValue("amount"));
                const address = form.getFieldValue("address");

                return (
                    <Fragment>
                        <Heading variant="h6" sx={{pt: 2}}>
                            <FormattedMessage defaultMessage="You are sending" />
                        </Heading>

                        <Typography variant="h3" sx={{textAlign: "center"}}>
                            {`${amount} ${account.wallet.coin.symbol}`}
                        </Typography>

                        <Divider sx={{my: 2}} />

                        <Stack spacing={0.5}>
                            <Typography
                                variant="overline"
                                sx={{color: "text.secondary"}}>
                                <FormattedMessage defaultMessage="To Address" />
                            </Typography>

                            <Typography variant="subtitle2" noWrap>
                                {address}
                            </Typography>
                        </Stack>

                        <Divider sx={{my: 2}} />

                        {feeEstimate && (
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                sx={{mb: 1}}>
                                <Typography variant="caption">
                                    <FormattedMessage defaultMessage="Fee" />
                                </Typography>

                                <Typography variant="caption">
                                    {feeEstimate.value}
                                </Typography>
                            </Stack>
                        )}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{mb: 3}}>
                            <Typography variant="caption">
                                <FormattedMessage defaultMessage="Total" />
                            </Typography>

                            <Typography variant="caption">
                                {getDeductible()}
                            </Typography>
                        </Stack>

                        <TwoFactorField />

                        <ModalActions>
                            <LoadingButton
                                variant="contained"
                                onClick={() => submit(form)}>
                                <FormattedMessage defaultMessage="Send" />
                            </LoadingButton>
                        </ModalActions>
                    </Fragment>
                );
            }}
        </Form.Item>
    );
};

const Heading = styled(Typography)({
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "normal"
});

export default ConfirmAction;
