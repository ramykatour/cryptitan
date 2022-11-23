import React, {Fragment, useCallback, useContext, useMemo} from "react";
import {useModal} from "utils/modal";
import {Box, Grid, IconButton, Paper, Stack, Typography} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import Copyable from "components/Copyable";
import {experimentalStyled as styled} from "@mui/material/styles";
import {LoadingButton} from "@mui/lab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Form from "components/Form";
import TwoFactorField from "components/TwoFactorField";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    confirmTransfer: {defaultMessage: "Confirm Transfer"},
    confirmWithdrawal: {defaultMessage: "Confirm Withdrawal"},
    confirmDeposit: {defaultMessage: "Confirm Deposit"},
    approved: {defaultMessage: "Transaction was approved."},
    rejected: {defaultMessage: "Transaction was rejected."},
    token: {defaultMessage: "Token"},
    password: {defaultMessage: "Password"}
});

const TransferView = ({transaction}) => {
    const [modal, modalElements] = useModal();

    const showTransfer = useCallback(() => {
        modal.confirm({
            content: <ViewCard transaction={transaction} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, transaction]);

    return (
        <Fragment>
            <IconButton onClick={showTransfer}>
                <VisibilityIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const ViewCard = ({closeModal, transaction}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();
    const {reload: reloadTable} = useContext(TableContext);
    const [form] = Form.useForm();

    const action = useCallback(
        (routeName, message) => {
            form.validateFields()
                .then((values) => {
                    const url = route(routeName, {transaction: transaction.id});

                    request
                        .post(url, values)
                        .then(() => {
                            notify.success(intl.formatMessage(message));
                            closeModal();
                            reloadTable();
                        })
                        .catch(errorHandler());
                })
                .catch(() => null);
        },
        [reloadTable, closeModal, intl, form, request, transaction]
    );

    const approve = useCallback(() => {
        return action(
            "admin.payment.transaction.complete-transfer",
            messages.approved
        );
    }, [action]);

    const reject = useCallback(() => {
        return action(
            "admin.payment.transaction.cancel-transfer",
            messages.rejected
        );
    }, [action]);

    const titleMessage = useMemo(() => {
        switch (transaction.type) {
            case "send":
                return <FormattedMessage defaultMessage="Confirm Withdrawal" />;
            case "receive":
                return <FormattedMessage defaultMessage="Confirm Deposit" />;
            default:
                return <FormattedMessage defaultMessage="Confirm Transfer" />;
        }
    }, [transaction]);

    return (
        <ContainerBox>
            <Form form={form}>
                <Stack sx={{p: 2, textAlign: "center"}}>
                    <Typography color="text.secondary" variant="subtitle2">
                        {titleMessage}
                    </Typography>

                    <Typography variant="h2">
                        {transaction.formatted_value}
                    </Typography>
                </Stack>

                <Grid container spacing={2} sx={{mb: 3}}>
                    <Grid item xs={12} sm={6}>
                        <BankInfo
                            title={
                                <FormattedMessage defaultMessage="Transfer Bank" />
                            }
                            content={transaction.transfer_bank}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <BankInfo
                            title={
                                <FormattedMessage defaultMessage="Transfer Beneficiary" />
                            }
                            content={transaction.transfer_beneficiary}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <BankInfo
                            title={
                                <FormattedMessage defaultMessage="Transfer Number" />
                            }
                            content={transaction.transfer_number}
                        />
                    </Grid>

                    {transaction.type === "receive" ? (
                        <Grid item xs={12} sm={6}>
                            <BankInfo
                                title={
                                    <FormattedMessage defaultMessage="Reference" />
                                }
                                content={transaction.account?.reference}
                            />
                        </Grid>
                    ) : (
                        <Grid item xs={12} sm={6}>
                            <BankInfo
                                title={
                                    <FormattedMessage defaultMessage="Transfer Note" />
                                }
                                content={transaction.transfer_note}
                            />
                        </Grid>
                    )}
                </Grid>

                <TwoFactorField />

                <ModalActions spacing={2}>
                    <LoadingButton
                        variant="contained"
                        onClick={reject}
                        startIcon={<CancelIcon />}
                        disabled={loading}
                        color="error">
                        <FormattedMessage defaultMessage="Reject" />
                    </LoadingButton>

                    <LoadingButton
                        variant="contained"
                        onClick={approve}
                        startIcon={<CheckCircleIcon />}
                        disabled={loading}>
                        <FormattedMessage defaultMessage="Approve" />
                    </LoadingButton>
                </ModalActions>
            </Form>
        </ContainerBox>
    );
};

const BankInfo = ({title, content}) => {
    return (
        <Paper variant="outlined" sx={{px: 2, py: 1}}>
            <Typography sx={{color: "text.secondary"}} variant="caption">
                {title}
            </Typography>

            <Copyable variant="body2" ellipsis>
                {content}
            </Copyable>
        </Paper>
    );
};

const ContainerBox = styled(Box)({
    position: "relative"
});

export default TransferView;
