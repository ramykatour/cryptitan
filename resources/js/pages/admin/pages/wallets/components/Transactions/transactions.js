import React, {useMemo} from "react";
import {route} from "services/Http";
import {defineMessages, useIntl} from "react-intl";
import {Card, Stack, Tooltip, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import RecordDelete from "./components/RecordDelete";
import DateTableCell from "components/TableCells/DateTableCell";
import UserInfoTableCell from "components/TableCells/UserInfoTableCell";
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

const Transactions = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "wallet_account",
                width: 200,
                renderHeader: () => <span />,
                renderCell: ({value}) => (
                    <UserInfoTableCell user={value?.user} />
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
                field: "coin",
                width: 50,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({value}) => <CoinTableCell value={value} />
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
                field: "balance",
                headerName: intl.formatMessage(messages.balance),
                type: "number",
                minWidth: 100,
                flex: 0.5,
                filterable: true,
                renderCell: ({row}) => {
                    return (
                        <Tooltip title={row.balance}>
                            <Stack alignItems="flex-end" sx={{width: "100%"}}>
                                <Typography
                                    sx={{whiteSpace: "nowrap"}}
                                    variant="body2">
                                    {row.balance}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: "text.secondary",
                                        whiteSpace: "nowrap"
                                    }}
                                    variant="caption">
                                    {row.formatted_balance_price}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    );
                }
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.date),
                width: 150,
                renderCell: ({value}) => <DateTableCell value={value} />
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: record}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <RecordDelete record={record} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.wallet.transfer-record.paginate");

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
