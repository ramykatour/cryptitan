import React, {useMemo} from "react";
import {Card, Stack} from "@mui/material";
import UserMenu from "./components/UserMenu";
import ActionBar from "./components/ActionBar";
import UserView from "./components/UserView";
import AsyncTable from "components/AsyncTable";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {route} from "services/Http";
import User from "models/User";
import TrapScrollBox from "components/TrapScrollBox";
import CurrencyCell from "components/CurrencyCell";
import Label from "components/Label";
import UserInfoTableCell from "components/TableCells/UserInfoTableCell";
import DateTableCell from "components/TableCells/DateTableCell";

const messages = defineMessages({
    status: {defaultMessage: "Status"},
    registered: {defaultMessage: "Joined"},
    location: {defaultMessage: "Location"},
    active: {defaultMessage: "Active"},
    suspended: {defaultMessage: "Deactivated"},
    payment: {defaultMessage: "Payment"},
    currency: {defaultMessage: "Currency"}
});

const List = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "name",
                minWidth: 200,
                flex: 1,
                renderHeader: () => <span />,
                renderCell: ({row: user}) => <UserInfoTableCell user={user} />
            },
            {
                field: "deactivated_until",
                headerName: intl.formatMessage(messages.status),
                flex: 1,
                minWidth: 140,
                headerAlign: "center",
                align: "center",
                renderCell: ({row: data}) => {
                    const user = User.use(data);

                    return !user.isActive() ? (
                        <Label variant="ghost" color="warning">
                            <FormattedMessage defaultMessage="Deactivated" />
                        </Label>
                    ) : (
                        <Label variant="ghost" color="success">
                            <FormattedMessage defaultMessage="Active" />
                        </Label>
                    );
                }
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.registered),
                flex: 1,
                minWidth: 150,
                renderCell: ({value}) => <DateTableCell value={value} />
            },
            {
                field: "currency",
                headerName: intl.formatMessage(messages.currency),
                flex: 1,
                minWidth: 170,
                renderCell: ({row}) => (
                    <CurrencyCell
                        currency={row.currency}
                        currencyName={row.currency_name}
                        country={row.country}
                        countryName={row.country_name}
                    />
                )
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                renderHeader: () => <span />,
                align: "right",
                headerAlign: "right",
                renderCell: ({row: user}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <UserMenu user={user} />
                            <UserView user={user} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.user.paginate");

    return (
        <Card>
            <TrapScrollBox>
                <AsyncTable
                    columns={columns}
                    components={{Toolbar: ActionBar}}
                    checkboxSelection
                    url={url}
                />
            </TrapScrollBox>
        </Card>
    );
};

export default List;
