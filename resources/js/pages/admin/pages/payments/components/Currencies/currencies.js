import React, {useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {isEmpty, toUpper} from "lodash";
import {route} from "services/Http";
import {Card, Stack, Tooltip, Typography} from "@mui/material";
import ActionBar from "./components/ActionBar";
import CurrencyDelete from "./components/CurrencyDelete";
import CurrencyMenu from "./components/CurrencyMenu";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import starSFill from "@iconify-icons/ri/star-s-fill";
import {useExchangeBaseCurrency} from "hooks/settings";
import Iconify from "components/Iconify";

const messages = defineMessages({
    code: {defaultMessage: "Code"},
    name: {defaultMessage: "Name"},
    accounts: {defaultMessage: "Accounts"},
    balance: {defaultMessage: "Balance"},
    onTrade: {defaultMessage: "On Trade"},
    exchangeRate: {defaultMessage: "Exchange Rate"},
    rate: {defaultMessage: "Rate"}
});

const Currencies = () => {
    const intl = useIntl();
    const baseCurrency = useExchangeBaseCurrency();

    const columns = useMemo(
        () => [
            {
                field: "code",
                width: 70,
                renderHeader: () => <span />,
                renderCell: ({row}) => (
                    <Stack direction="row" alignItems="center">
                        <Typography variant="body2">
                            {toUpper(row.code)}
                        </Typography>

                        {row.default && (
                            <Iconify icon={starSFill} sx={{ml: 1}} />
                        )}
                    </Stack>
                )
            },
            {
                field: "name",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "payment_accounts_count",
                width: 100,
                headerName: intl.formatMessage(messages.accounts)
            },
            {
                field: "exchange_rate",
                minWidth: 150,
                flex: 1,
                renderHeader: () => {
                    const text = intl.formatMessage(messages.rate);
                    return `${text} (${baseCurrency})`;
                },
                renderCell: ({value, row}) => (
                    <Stack>
                        <Typography variant="body2">{value}</Typography>

                        <Typography color="text.secondary" variant="caption">
                            {toUpper(row.exchange_type)}
                        </Typography>
                    </Stack>
                )
            },
            {
                field: "balance",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.balance),
                renderCell: ({row}) => {
                    const statistic = row.statistic;

                    return isEmpty(statistic) ? (
                        <Typography variant="body2">
                            <FormattedMessage defaultMessage="Unavailable" />
                        </Typography>
                    ) : (
                        <Tooltip title={statistic.balance}>
                            <Stack>
                                <Typography variant="body2">
                                    {statistic.balance}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    variant="caption">
                                    {statistic.formatted_balance}
                                </Typography>
                            </Stack>
                        </Tooltip>
                    );
                }
            },
            {
                field: "balance_on_trade",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.onTrade),
                renderCell: ({row}) => {
                    const statistic = row.statistic;

                    return isEmpty(statistic) ? (
                        <Typography variant="body2">
                            <FormattedMessage defaultMessage="Unavailable" />
                        </Typography>
                    ) : (
                        <Tooltip title={statistic.balance_on_trade}>
                            <Stack>
                                <Typography variant="body2">
                                    {statistic.balance_on_trade}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    variant="caption">
                                    {statistic.formatted_balance_on_trade}
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
                renderCell: ({row: currency}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <CurrencyDelete currency={currency} />
                            <CurrencyMenu currency={currency} />
                        </Stack>
                    );
                }
            }
        ],
        [intl, baseCurrency]
    );

    const url = route("admin.payment.supported-currency.paginate");

    return (
        <Card>
            <TrapScrollBox>
                <AsyncTable
                    columns={columns}
                    components={{Toolbar: ActionBar}}
                    getRowId={(row) => row.code}
                    url={url}
                />
            </TrapScrollBox>
        </Card>
    );
};

export default Currencies;
