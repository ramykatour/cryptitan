import React, {useEffect, useMemo, useRef} from "react";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {CardHeader} from "@mui/material";
import {useDispatch} from "react-redux";
import {useAuth} from "models/Auth";
import {usePrivateBroadcast} from "services/Broadcast";
import {route} from "services/Http";
import AsyncTable from "../AsyncTable";
import TrapScrollBox from "../TrapScrollBox";
import DateTableCell from "components/TableCells/DateTableCell";
import DescriptionTableCell from "components/TableCells/WalletTable/DescriptionTableCell";
import StatusTableCell from "components/TableCells/WalletTable/StatusTableCell";
import ValueTableCell from "components/TableCells/WalletTable/ValueTableCell";
import CoinTableCell from "components/TableCells/CoinTableCell";

const messages = defineMessages({
    transactions: {defaultMessage: "Transactions"},
    title: {defaultMessage: "Title"},
    description: {defaultMessage: "Description"},
    date: {defaultMessage: "Date"},
    hash: {defaultMessage: "Hash"},
    transactionHash: {defaultMessage: "Transaction Hash"},
    coin: {defaultMessage: "Coin"},
    balance: {defaultMessage: "Balance"},
    available: {defaultMessage: "Available"},
    value: {defaultMessage: "Value"}
});

const RecentTransaction = () => {
    const tableRef = useRef();
    const auth = useAuth();
    const dispatch = useDispatch();
    const intl = useIntl();
    const broadcast = usePrivateBroadcast("App.Models.User." + auth.user.id);

    useEffect(() => {
        const channel = "TransferRecordSaved";
        const handler = (e) => tableRef.current.fetchData();

        broadcast.listen(channel, handler);

        return () => {
            broadcast.stopListening(channel, handler);
        };
    }, [broadcast, dispatch]);

    const columns = useMemo(() => {
        return [
            {
                field: "coin",
                width: 50,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({value}) => <CoinTableCell value={value} />
            },
            {
                field: "value",
                headerName: intl.formatMessage(messages.value),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: ({row: transaction}) => (
                    <ValueTableCell transaction={transaction} />
                )
            },
            {
                field: "type",
                width: 30,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({row: transaction}) => (
                    <StatusTableCell transaction={transaction} />
                )
            },
            {
                field: "description",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.description),
                filterable: true,
                renderCell: ({row: transaction}) => (
                    <DescriptionTableCell transaction={transaction} />
                )
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.date),
                width: 150,
                type: "dateTime",
                filterable: true,
                renderCell: ({value}) => <DateTableCell value={value} />
            }
        ];
    }, [intl]);

    const url = route("wallet.transfer-record-paginate");

    return (
        <ResponsiveCard>
            <CardHeader
                title={<FormattedMessage defaultMessage="Recent Transaction" />}
            />

            <TrapScrollBox sx={{flexGrow: 1}}>
                <AsyncTable
                    ref={tableRef}
                    columns={columns}
                    autoHeight={false}
                    url={url}
                />
            </TrapScrollBox>
        </ResponsiveCard>
    );
};

RecentTransaction.dimensions = {
    lg: {w: 6, h: 3, isResizable: false},
    md: {w: 4, h: 3, isResizable: false},
    sm: {w: 2, h: 3, isResizable: false},
    xs: {w: 1, h: 3, isResizable: false}
};

export default RecentTransaction;
