import React, {useContext, useMemo, useRef} from "react";
import {Card, CardHeader} from "@mui/material";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import PriceTableCell from "components/TableCells/PeerOfferTable/PriceTableCell";
import LimitTableCell from "components/TableCells/PeerOfferTable/LimitTableCell";
import PaymentTableCell from "components/TableCells/PeerOfferTable/PaymentTableCell";
import ActionButton from "./components/ActionButton";
import CoinTableCell from "components/TableCells/CoinTableCell";
import {route} from "services/Http";
import PropTypes from "prop-types";
import UserContext from "contexts/UserContext";
import {useAuth} from "models/Auth";
import StatusTableCell from "components/TableCells/PeerOfferTable/StatusTableCell";

const messages = defineMessages({
    price: {defaultMessage: "Price"},
    limit: {defaultMessage: "Limit"},
    payment: {defaultMessage: "Payment"},
    status: {defaultMessage: "Status"}
});

const PeerOffers = ({type}) => {
    const intl = useIntl();
    const auth = useAuth();
    const {user} = useContext(UserContext);
    const tableRef = useRef();

    const title = useMemo(() => {
        return type === "sell" ? (
            <FormattedMessage defaultMessage="Sell Offers" />
        ) : (
            <FormattedMessage defaultMessage="Buy Offers" />
        );
    }, [type]);

    const isManager = useMemo(() => {
        return auth.user.id === user.id || auth.user.can("manage_peer_trades");
    }, [auth, user]);

    const columns = useMemo(() => {
        const columns = [
            {
                field: "coin",
                width: 50,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({value}) => <CoinTableCell value={value} />
            },
            {
                field: "price",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.price),
                renderCell: ({row: data}) => <PriceTableCell offer={data} />
            },
            {
                field: "limit",
                minWidth: 130,
                flex: 1,
                headerName: intl.formatMessage(messages.limit),
                renderCell: ({row: data}) => <LimitTableCell offer={data} />
            },
            {
                field: "payment",
                minWidth: 130,
                flex: 1,
                headerName: intl.formatMessage(messages.payment),
                renderCell: ({row: data}) => <PaymentTableCell offer={data} />
            }
        ];

        if (isManager) {
            columns.push({
                field: "status",
                minWidth: 100,
                flex: 0.5,
                headerName: intl.formatMessage(messages.status),
                align: "center",
                renderCell: ({row: data}) => <StatusTableCell offer={data} />
            });
        }

        columns.push({
            field: "action",
            minWidth: 120,
            flex: 0.5,
            renderHeader: () => <span />,
            align: "right",
            renderCell: ({row: data}) => <ActionButton offer={data} />
        });

        return columns;
    }, [isManager, intl]);

    const url = useMemo(() => {
        const params = {user: user.name, type};
        return route("user.profile.peer-offer.paginate", params);
    }, [type, user]);

    return (
        <Card>
            <CardHeader title={title} />

            <TrapScrollBox>
                <AsyncTable ref={tableRef} columns={columns} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

PeerOffers.propTypes = {
    type: PropTypes.oneOf(["buy", "sell"])
};

export default PeerOffers;
