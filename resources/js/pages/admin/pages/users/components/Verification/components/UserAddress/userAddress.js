import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import {route} from "services/Http";
import ActionBar from "../ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import {Card, Stack, Typography} from "@mui/material";
import AddressView from "./components/AddressView";
import UserInfoTableCell from "components/TableCells/UserInfoTableCell";
import {formatDateFromNow} from "utils/formatter";
import StatusTableCell from "components/TableCells/StatusTableCell";

const messages = defineMessages({
    status: {defaultMessage: "Status"},
    user: {defaultMessage: "User"},
    address: {defaultMessage: "Address"},
    city: {defaultMessage: "City"},
    state: {defaultMessage: "State"},
    submitted: {defaultMessage: "Submitted"},
    pending: {defaultMessage: "Pending"},
    approved: {defaultMessage: "Approved"},
    rejected: {defaultMessage: "Rejected"}
});

const UserAddress = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "user",
                width: 200,
                headerName: intl.formatMessage(messages.user),
                renderCell: ({value: user}) => <UserInfoTableCell user={user} />
            },
            {
                field: "address",
                minWidth: 200,
                headerName: intl.formatMessage(messages.address),
                flex: 1
            },
            {
                field: "state",
                minWidth: 150,
                headerName: intl.formatMessage(messages.state),
                flex: 0.5
            },
            {
                field: "status",
                headerName: intl.formatMessage(messages.status),
                width: 140,
                type: "singleSelect",
                valueOptions: ["pending", "approved", "rejected"],
                filterable: true,
                renderCell: ({value: status}) => (
                    <StatusTableCell status={status} />
                )
            },
            {
                field: "updated_at",
                headerName: intl.formatMessage(messages.submitted),
                width: 150,
                renderCell: ({row}) => (
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {formatDateFromNow(row.updated_at)}
                    </Typography>
                )
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                renderHeader: () => <span />,
                align: "right",
                headerAlign: "right",
                renderCell: ({row: address}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <AddressView address={address} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.user.verification.address-paginate");

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

export default UserAddress;
