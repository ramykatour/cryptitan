import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import {route} from "services/Http";
import {Card, Stack} from "@mui/material";
import ActionBar from "./components/ActionBar";
import RoleDelete from "./components/RoleDelete";
import RoleEdit from "./components/RoleEdit";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";

const messages = defineMessages({
    name: {defaultMessage: "Name"},
    permissions: {defaultMessage: "Permissions"},
    rank: {defaultMessage: "Rank"},
    users: {defaultMessage: "Users"}
});

const Roles = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "name",
                minWidth: 100,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "permissions",
                width: 100,
                headerName: intl.formatMessage(messages.permissions),
                renderCell: ({value: permissions}) => {
                    return permissions.length;
                }
            },
            {
                field: "rank",
                width: 100,
                headerName: intl.formatMessage(messages.rank)
            },
            {
                field: "users_count",
                width: 100,
                headerName: intl.formatMessage(messages.users)
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: role}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <RoleDelete role={role} />
                            <RoleEdit role={role} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.role.paginate");

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

export default Roles;
