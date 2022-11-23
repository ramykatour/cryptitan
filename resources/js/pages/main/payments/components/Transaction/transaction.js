import React, {useEffect, useMemo, useRef} from "react";
import {defineMessages, useIntl} from "react-intl";
import {useDispatch} from "react-redux";
import {useAuth} from "models/Auth";
import {usePrivateBroadcast} from "services/Broadcast";
import {fetchPaymentAccount} from "redux/slices/payment";
import {Card, CardHeader} from "@mui/material";
import {route} from "services/Http";
import AsyncTable from "components/AsyncTable";
import TrapScrollBox from "components/TrapScrollBox";
import CompactDateTableCell from "components/TableCells/CompactDateTableCell";
import StatusTableCell from "components/TableCells/PaymentTable/StatusTableCell";
import ValueTableCell from "components/TableCells/PaymentTable/ValueTableCell";
import DescriptionTableCell from "components/TableCells/PaymentTable/DescriptionTableCell";

const messages = defineMessages({
    transactions: {defaultMessage: "Transactions"},
    title: {defaultMessage: "Title"},
    status: {defaultMessage: "Status"},
    description: {defaultMessage: "Description"},
    date: {defaultMessage: "Date"},
    balance: {defaultMessage: "Balance"},
    available: {defaultMessage: "Available"},
    value: {defaultMessage: "Value"}
});

const Transaction = () => {
    const tableRef = useRef();
    const dispatch = useDispatch();
    const auth = useAuth();
    const broadcast = usePrivateBroadcast("App.Models.User." + auth.user.id);
    const intl = useIntl();

    useEffect(() => {
        const channel = "PaymentTransactionSaved";
        const handler = (e) => {
            dispatch(fetchPaymentAccount());
            tableRef.current.fetchData();
        };

        broadcast.listen(channel, handler);

        return () => {
            broadcast.stopListening(channel, handler);
        };
    }, [broadcast, dispatch]);

    const columns = useMemo(() => {
        return [
            {
                field: "created_at",
                width: 70,
                renderHeader: () => <span />,
                type: "dateTime",
                filterable: true,
                renderCell: ({value}) => <CompactDateTableCell value={value} />
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
                field: "value",
                headerName: intl.formatMessage(messages.value),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                renderCell: ({row: transaction}) => (
                    <ValueTableCell transaction={transaction} />
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
            }
        ];
    }, [intl]);

    const url = route("payment.transaction-paginate");

    return (
        <Card>
            <CardHeader title={intl.formatMessage(messages.transactions)} />

            <TrapScrollBox>
                <AsyncTable ref={tableRef} columns={columns} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

export default Transaction;
