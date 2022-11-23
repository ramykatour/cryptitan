import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import AmountTableCell from "components/TableCells/PeerTradeTable/AmountTableCell";
import CoinTableCell from "components/TableCells/CoinTableCell";
import PriceTableCell from "components/TableCells/PeerTradeTable/PriceTableCell";
import PaymentTableCell from "components/TableCells/PeerTradeTable/PaymentTableCell";
import TraderTableCell from "components/TableCells/PeerTradeTable/TraderTableCell";
import StatusTableCell from "components/TableCells/PeerTradeTable/StatusTableCell";
import AsyncTable from "components/AsyncTable";
import TrapScrollBox from "components/TrapScrollBox";
import {route} from "services/Http";
import PropTypes from "prop-types";
import ActionButton from "./components/ActionButton";

const messages = defineMessages({
    buyer: {defaultMessage: "Buyer"},
    seller: {defaultMessage: "Seller"},
    status: {defaultMessage: "Status"},
    amount: {defaultMessage: "Amount"},
    payment: {defaultMessage: "Payment"},
    price: {defaultMessage: "Price"}
});

const Table = ({status}) => {
    const intl = useIntl();

    const columns = useMemo(() => {
        return [
            {
                field: "buyer",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.buyer),
                renderCell: ({value}) => <TraderTableCell user={value} />
            },
            {
                field: "seller",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.seller),
                renderCell: ({value}) => <TraderTableCell user={value} />
            },
            {
                field: "amount",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.amount),
                renderCell: ({row: data}) => <AmountTableCell trade={data} />
            },
            {
                field: "coin",
                width: 50,
                align: "center",
                renderHeader: () => <span />,
                renderCell: ({value}) => <CoinTableCell value={value} />
            },
            {
                field: "price",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.price),
                renderCell: ({row: data}) => <PriceTableCell trade={data} />
            },
            {
                field: "payment",
                minWidth: 130,
                flex: 1,
                headerName: intl.formatMessage(messages.payment),
                renderCell: ({row: data}) => <PaymentTableCell trade={data} />
            },
            {
                field: "status",
                minWidth: 100,
                flex: 0.5,
                align: "center",
                headerName: intl.formatMessage(messages.status),
                renderCell: ({value}) => <StatusTableCell status={value} />
            },
            {
                field: "action",
                minWidth: 120,
                flex: 0.5,
                align: "right",
                renderHeader: () => <span />,
                renderCell: ({row: data}) => <ActionButton trade={data} />
            }
        ];
    }, [intl]);

    const url = useMemo(() => {
        return route("admin.peer-trade.paginate", {status});
    }, [status]);

    return (
        <TrapScrollBox>
            <AsyncTable columns={columns} url={url} />
        </TrapScrollBox>
    );
};

Table.propTypes = {
    status: PropTypes.oneOf(["active", "completed", "canceled", "disputed"])
};

export default Table;
