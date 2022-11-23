import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import {route} from "services/Http";
import {Card} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import DateTableCell from "components/TableCells/DateTableCell";
import StatusTableCell from "components/TableCells/PaymentTable/StatusTableCell";
import ValueTableCell from "components/TableCells/PaymentTable/ValueTableCell";
import DescriptionTableCell from "components/TableCells/PaymentTable/DescriptionTableCell";
import UserInfoTableCell from "components/TableCells/UserInfoTableCell";

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

const Transactions = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "account",
                width: 200,
                renderHeader: () => <span />,
                renderCell: ({value}) => <UserInfoTableCell user={value.user} />
            },
            {
                field: "type",
                width: 30,
                align: "center",
                renderHeader: () => <span />,
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
            },
            {
                field: "formatted_balance",
                minWidth: 100,
                flex: 0.5,
                headerName: intl.formatMessage(messages.balance)
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.date),
                width: 150,
                renderCell: ({value}) => <DateTableCell value={value} />
            }
        ],
        [intl]
    );

    const url = route("admin.payment.transaction.paginate");

    return (
        <Card>
            <TrapScrollBox>
                <AsyncTable
                    columns={columns}
                    components={{Toolbar: ActionBar}}
                    url={url}
                />
            </TrapScrollBox>
        </Card>
    );
};

export default Transactions;
