import React, {useCallback, useMemo} from "react";
import ActionTableCell from "components/TableCells/PeerTradeTable/ActionTableCell";
import {LoadingButton} from "@mui/lab";
import {FormattedMessage} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {useNavigate} from "react-router-dom";
import router from "router/router";

const ActionButton = ({trade}) => {
    const [request, loading] = useRequest();
    const navigate = useNavigate();

    const link = useMemo(() => {
        return router.generatePath("main.peer.trade", {id: trade.id});
    }, [trade]);

    const showAction = useMemo(() => {
        return trade.status === "disputed" && !trade.role;
    }, [trade]);

    const joinTrade = useCallback(() => {
        request
            .post(route("admin.peer-trade.join", {trade: trade.id}))
            .then(() => navigate(link))
            .catch(errorHandler());
    }, [request, trade, link, navigate]);

    if (!showAction) {
        return null;
    }

    if (trade.is_participant) {
        return <ActionTableCell trade={trade} />;
    }

    return (
        <LoadingButton
            color="primary"
            onClick={joinTrade}
            variant="contained"
            loading={loading}>
            <FormattedMessage defaultMessage="Join" />
        </LoadingButton>
    );
};

export default ActionButton;
