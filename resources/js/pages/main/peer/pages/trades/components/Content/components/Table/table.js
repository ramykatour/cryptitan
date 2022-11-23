import React, {useMemo, useRef} from "react";
import PropTypes from "prop-types";
import AsyncTable from "components/AsyncTable";
import TrapScrollBox from "components/TrapScrollBox";
import {defineMessages, useIntl} from "react-intl";
import TraderTableCell from "components/TableCells/PeerTradeTable/TraderTableCell";
import StatusTableCell from "components/TableCells/PeerTradeTable/StatusTableCell";
import AmountTableCell from "components/TableCells/PeerTradeTable/AmountTableCell";
import PriceTableCell from "components/TableCells/PeerTradeTable/PriceTableCell";
import PaymentTableCell from "components/TableCells/PeerTradeTable/PaymentTableCell";
import ActionTableCell from "components/TableCells/PeerTradeTable/ActionTableCell";
import CoinTableCell from "components/TableCells/CoinTableCell";
import {route} from "services/Http";

const messages = defineMessages({
    buyer: {defaultMessage: "Buyer"},
    seller: {defaultMessage: "Seller"},
    status: {defaultMessage: "Status"},
    amount: {defaultMessage: "Amount"},
    payment: {defaultMessage: "Payment"},
    price: {defaultMessage: "Price"}
});

const Table = ({type, status}) => {
    const intl = useIntl();
    const tableRef = useRef();

    const columns = useMemo(() => {
        const columns = [
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
            }
        ];

        if (type === "sell") {
            columns.push({
                field: "buyer",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.buyer),
                renderCell: ({value}) => <TraderTableCell user={value} />
            });
        } else {
            columns.push({
                field: "seller",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.seller),
                renderCell: ({value}) => <TraderTableCell user={value} />
            });
        }

        return columns.concat([
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
                renderCell: ({row: data}) => <ActionTableCell trade={data} />
            }
        ]);
    }, [intl, type]);

    const url = useMemo(() => {
        if (type === "sell") {
            return route("peer-trade.sell-paginate", {status});
        } else {
            return route("peer-trade.buy-paginate", {status});
        }
    }, [type, status]);

    return (
        <TrapScrollBox>
            <AsyncTable ref={tableRef} columns={columns} url={url} />
        </TrapScrollBox>
    );
};

Table.propTypes = {
    status: PropTypes.oneOf(["active", "completed", "canceled", "disputed"]),
    type: PropTypes.oneOf(["buy", "sell"])
};

export default Table;
