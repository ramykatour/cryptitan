import React, {useEffect, useMemo, useRef} from "react";
import {defineMessages, useIntl} from "react-intl";
import AsyncTable from "components/AsyncTable";
import {route} from "services/Http";
import {useActiveWalletAccount} from "hooks/account";
import {usePrivateBroadcast} from "services/Broadcast";
import {fetchWalletAccounts} from "redux/slices/wallet";
import {useDispatch} from "react-redux";
import {useAuth} from "models/Auth";
import {Card, CardHeader} from "@mui/material";
import TrapScrollBox from "components/TrapScrollBox";
import CompactDateTableCell from "components/TableCells/CompactDateTableCell";
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

const Transaction = () => {
    const tableRef = useRef();
    const dispatch = useDispatch();
    const auth = useAuth();
    const broadcast = usePrivateBroadcast("App.Models.User." + auth.user.id);
    const intl = useIntl();
    const account = useActiveWalletAccount();

    useEffect(() => {
        const channel = "TransferRecordSaved";
        const handler = (e) => {
            dispatch(fetchWalletAccounts());
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
            }
        ];
    }, [intl]);

    const url = useMemo(() => {
        return account.isNotEmpty()
            ? route("wallet.transfer-record-paginate", {
                  account: account.get("id")
              })
            : route("wallet.transfer-record-paginate");
    }, [account]);

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
