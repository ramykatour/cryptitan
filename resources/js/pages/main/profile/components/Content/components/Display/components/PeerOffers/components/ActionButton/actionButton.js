import React, {useCallback, useContext, useMemo} from "react";
import PropTypes from "prop-types";
import {IconButton, Stack} from "@mui/material";
import {defineMessages, useIntl} from "react-intl";
import BlockIcon from "@mui/icons-material/Block";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PopConfirm from "components/PopConfirm";
import LoadingIcon from "components/LoadingIcon";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import TableContext from "contexts/TableContext";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import router from "router/router";
import ActionTableCell from "components/TableCells/PeerOfferTable/ActionTableCell";
import {Link as RouterLink} from "react-router-dom";

const messages = defineMessages({
    confirmClose: {defaultMessage: "Close this offer?"},
    confirmDisable: {defaultMessage: "Disable this offer?"},
    confirmEnable: {defaultMessage: "Enable this offer?"},
    success: {defaultMessage: "Offer was updated."}
});

const ActionButton = ({offer}) => {
    const intl = useIntl();
    const {reload} = useContext(TableContext);
    const [request, loading] = useRequest();

    const link = useMemo(() => {
        return router.generatePath("main.peer.offer", {id: offer.id});
    }, [offer]);

    const closeOffer = useCallback(() => {
        request
            .patch(route("peer-offer.close", {offer: offer.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reload();
            })
            .catch(errorHandler());
    }, [request, offer, intl, reload]);

    if (offer.closed_at) {
        return null;
    }

    if (!offer.updatable) {
        return <ActionTableCell offer={offer} />;
    }

    return (
        <Stack direction="row" spacing={1}>
            <IconButton
                size="small"
                component={RouterLink}
                color="primary"
                to={link}>
                <VisibilityIcon fontSize="inherit" />
            </IconButton>

            <StatusToggle offer={offer} />

            <PopConfirm
                size="small"
                component={IconButton}
                content={intl.formatMessage(messages.confirmClose)}
                onClick={closeOffer}
                color="error">
                <LoadingIcon
                    loading={loading}
                    component={BlockIcon}
                    fontSize="inherit"
                />
            </PopConfirm>
        </Stack>
    );
};

const StatusToggle = ({offer}) => {
    const intl = useIntl();
    const {reload} = useContext(TableContext);
    const [request, loading] = useRequest();

    const disableOffer = useCallback(() => {
        request
            .patch(route("peer-offer.disable", {offer: offer.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reload();
            })
            .catch(errorHandler());
    }, [request, offer, intl, reload]);

    const enableOffer = useCallback(() => {
        request
            .patch(route("peer-offer.enable", {offer: offer.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reload();
            })
            .catch(errorHandler());
    }, [request, offer, intl, reload]);

    return offer.status ? (
        <PopConfirm
            size="small"
            component={IconButton}
            content={intl.formatMessage(messages.confirmDisable)}
            onClick={disableOffer}
            color="warning">
            <LoadingIcon
                loading={loading}
                component={PauseCircleIcon}
                fontSize="inherit"
            />
        </PopConfirm>
    ) : (
        <PopConfirm
            size="small"
            component={IconButton}
            content={intl.formatMessage(messages.confirmEnable)}
            onClick={enableOffer}
            color="success">
            <LoadingIcon
                loading={loading}
                component={PlayCircleIcon}
                fontSize="inherit"
            />
        </PopConfirm>
    );
};

ActionButton.propTypes = {
    offer: PropTypes.object
};

export default ActionButton;
