import React, {useCallback} from "react";
import {FormattedMessage} from "react-intl";
import {useActiveWalletAccount} from "hooks/account";
import Form from "components/Form";
import {Divider, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import TwoFactorField from "components/TwoFactorField";

const Confirm = ({
    tokenField,
    title,
    action,
    symbol,
    deductible,
    fee,
    closeModal
}) => {
    const account = useActiveWalletAccount();

    const submit = useCallback(
        (form) => {
            form.validateFields([tokenField])
                .then(() => {
                    form.submit();
                    closeModal?.();
                })
                .catch(() => null);
        },
        [closeModal, tokenField]
    );

    return (
        <Form.Item shouldUpdate>
            {(form) => {
                const amount = Number(form.getFieldValue("amount"));

                return (
                    <Stack sx={{mt: 2}}>
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                textTransform: "uppercase",
                                fontWeight: "normal"
                            }}>
                            {title}
                        </Typography>

                        <Typography variant="h3" sx={{lineHeight: 1}}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                spacing={1}>
                                <span>{amount}</span>
                                <span>{account.wallet.coin.symbol}</span>
                            </Stack>
                        </Typography>

                        <Typography variant="h6" sx={{fontWeight: "normal"}}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                divider={<span>/</span>}
                                spacing={1}>
                                <span>{account.formatted_price}</span>
                                <span>{account.wallet.coin.symbol}</span>
                            </Stack>
                        </Typography>

                        <Divider sx={{my: 2}} />

                        <Stack
                            sx={{mb: 1}}
                            justifyContent="space-between"
                            direction="row">
                            <Typography variant="caption">
                                <FormattedMessage defaultMessage="Fee" />
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{textAlign: "right"}}>
                                <FormattedMessage
                                    defaultMessage="{fee} ({symbol})"
                                    values={{fee, symbol}}
                                />
                            </Typography>
                        </Stack>

                        <Stack
                            sx={{mb: 3}}
                            justifyContent="space-between"
                            direction="row">
                            <Typography variant="caption">
                                <FormattedMessage defaultMessage="Total" />
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{textAlign: "right"}}>
                                <FormattedMessage
                                    defaultMessage="{deductible} ({symbol})"
                                    values={{deductible, symbol}}
                                />
                            </Typography>
                        </Stack>

                        <TwoFactorField />

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            sx={{my: 2}}>
                            <LoadingButton
                                onClick={() => submit(form)}
                                variant="contained">
                                {action}
                            </LoadingButton>
                        </Stack>
                    </Stack>
                );
            }}
        </Form.Item>
    );
};

export default Confirm;
