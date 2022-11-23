import React, {Fragment, useCallback, useContext} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {Box, Grid, IconButton, Paper, Typography} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {experimentalStyled as styled} from "@mui/material/styles";
import {LoadingButton} from "@mui/lab";
import Copyable from "components/Copyable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    approved: {defaultMessage: "Address was approved."},
    rejected: {defaultMessage: "Address was rejected."},
    verifyAddress: {defaultMessage: "Verify Address"}
});

const AddressView = ({address}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const showAddress = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.verifyAddress),
            content: <ViewCard address={address} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, address, intl]);

    return (
        <Fragment>
            <IconButton onClick={showAddress}>
                <VisibilityIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const ViewCard = ({closeModal, address}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const action = useCallback(
        (routeName, message) => {
            request
                .post(route(routeName, {address: address.id}))
                .then(() => {
                    notify.success(intl.formatMessage(message));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [reloadTable, closeModal, intl, request, address]
    );

    const approve = useCallback(() => {
        return action(
            "admin.user.verification.approve-address",
            messages.approved
        );
    }, [action]);

    const reject = useCallback(() => {
        return action(
            "admin.user.verification.reject-address",
            messages.rejected
        );
    }, [action]);

    return (
        <ContainerBox>
            <Grid container spacing={2} sx={{mb: 1}}>
                <Grid item xs={12}>
                    <AddressInfo
                        title={<FormattedMessage defaultMessage="Address" />}
                        content={address.address}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <AddressInfo
                        title={<FormattedMessage defaultMessage="Unit" />}
                        content={address.unit}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <AddressInfo
                        title={<FormattedMessage defaultMessage="City" />}
                        content={address.city}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <AddressInfo
                        title={<FormattedMessage defaultMessage="State" />}
                        content={address.state}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <AddressInfo
                        title={<FormattedMessage defaultMessage="Postcode" />}
                        content={address.postcode}
                    />
                </Grid>
            </Grid>

            {address.status !== "rejected" && (
                <ModalActions spacing={2}>
                    {["pending", "approved"].includes(address.status) && (
                        <LoadingButton
                            variant="contained"
                            color="error"
                            onClick={reject}
                            startIcon={<CancelIcon />}
                            disabled={loading}>
                            <FormattedMessage defaultMessage="Reject" />
                        </LoadingButton>
                    )}

                    {["pending"].includes(address.status) && (
                        <LoadingButton
                            variant="contained"
                            onClick={approve}
                            startIcon={<CheckCircleIcon />}
                            disabled={loading}>
                            <FormattedMessage defaultMessage="Approve" />
                        </LoadingButton>
                    )}
                </ModalActions>
            )}
        </ContainerBox>
    );
};

const AddressInfo = ({title, content}) => {
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

const ContainerBox = styled(Box)(() => ({
    position: "relative"
}));

export default AddressView;
