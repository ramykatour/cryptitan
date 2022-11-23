import React, {Fragment, useCallback, useContext} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import PeerTradeContext from "contexts/PeerTradeContext";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {LoadingButton} from "@mui/lab";
import {useModal} from "utils/modal";
import Form from "components/Form";
import {Alert} from "@mui/material";
import TwoFactorField from "components/TwoFactorField";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";

const messages = defineMessages({
    success: {defaultMessage: "Trade was completed."},
    release: {defaultMessage: "Release Coin"},
    confirm: {defaultMessage: "Release coin to Buyer?"}
});

const Release = () => {
    const intl = useIntl();
    const {trade} = useContext(PeerTradeContext);
    const [modal, modalElements] = useModal();

    const release = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.release),
            content: <ReleaseCoin />
        });
    }, [modal, intl]);

    return (
        <Fragment>
            <PopConfirm
                color="primary"
                component={LoadingButton}
                content={intl.formatMessage(messages.confirm)}
                disabled={!trade.completable}
                variant="contained"
                onClick={release}
                fullWidth>
                <FormattedMessage defaultMessage="Release" />
            </PopConfirm>

            {modalElements}
        </Fragment>
    );
};

const ReleaseCoin = ({closeModal}) => {
    const intl = useIntl();
    const {trade} = useContext(PeerTradeContext);
    const [request, loading] = useRequest();
    const [form] = Form.useForm();

    const submitForm = useCallback(
        (values) => {
            request
                .patch(route("peer-trade.complete", {trade: trade.id}), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                })
                .catch(errorHandler());
        },
        [request, intl, trade, closeModal]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent spacing={3}>
                <Alert severity="error">
                    <FormattedMessage defaultMessage="Make sure you verify the Buyer's payment before releasing the coin." />
                </Alert>

                <TwoFactorField />
            </ModalContent>

            <ModalActions>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={loading}>
                    <FormattedMessage defaultMessage="Release Coin" />
                </LoadingButton>
            </ModalActions>
        </Form>
    );
};

export default Release;
