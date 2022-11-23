import React, {useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {isEmpty} from "lodash";
import {route} from "services/Http";
import {Card, Stack, Tooltip, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import WalletDelete from "./components/WalletDelete";
import WalletMenu from "./components/WalletMenu";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import Coin from "models/Coin";
import CoinTableCell from "components/TableCells/CoinTableCell";

const messages = defineMessages({
    name: {defaultMessage: "Name"},
    accounts: {defaultMessage: "Accounts"},
    confirmations: {defaultMessage: "Confirmations"},
    balance: {defaultMessage: "Balance"},
    onTrade: {defaultMessage: "On Trade"}
});

const List = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "id",
                minWidth: 150,
                flex: 1,
                renderHeader: () => <span />,
                renderCell: ({row}) => {
                    const coin = Coin.use(row.coin);
                    return (
                        <Stack direction="row" sx={{minWidth: 0}} spacing={2}>
                            <CoinTableCell value={row.coin} />

                            <Stack sx={{minWidth: 0}}>
                                <Typography variant="body2" noWrap>
                                    {coin.name}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{color: "text.secondary"}}
                                    noWrap>
                                    {coin.formatted_price}
                                </Typography>
                            </Stack>
                        </Stack>
                    );
                }
            },
            {
                field: "accounts_count",
                width: 100,
                headerName: intl.formatMessage(messages.accounts)
            },
            {
                field: "min_conf",
                width: 100,
                headerName: intl.formatMessage(messages.confirmations)
            },
            {
                field: "balance",
                minWidth: 150,
                flex: 0.5,
                headerName: intl.formatMessage(messages.balance),
                renderCell: ({row}) => {
                    const statistic = row.statistic;

                    return isEmpty(statistic) ? (
                        <Typography variant="caption">
                            <FormattedMessage defaultMessage="Unavailable" />
                        </Typography>
                    ) : (
                        <Tooltip title={statistic.balance}>
                            <Stack>
                                <Typography variant="body2">
                                    {statistic.balance}
                                </Typography>

                                <Typography
                                    sx={{color: "text.secondary"}}
                                    variant="caption">
                                    {statistic.formatted_balance_price}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    );
                }
            },
            {
                field: "balance_on_trade",
                minWidth: 150,
                flex: 0.5,
                headerName: intl.formatMessage(messages.onTrade),
                renderCell: ({row}) => {
                    const statistic = row.statistic;

                    return isEmpty(statistic) ? (
                        <Typography variant="caption">
                            <FormattedMessage defaultMessage="Unavailable" />
                        </Typography>
                    ) : (
                        <Tooltip title={statistic.balance}>
                            <Stack>
                                <Typography variant="body2">
                                    {statistic.balance_on_trade}
                                </Typography>

                                <Typography
                                    sx={{color: "text.secondary"}}
                                    variant="caption">
                                    {statistic.formatted_balance_on_trade_price}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    );
                }
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: wallet}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <WalletDelete wallet={wallet} />
                            <WalletMenu wallet={wallet} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.wallet.paginate");

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

export default List;
