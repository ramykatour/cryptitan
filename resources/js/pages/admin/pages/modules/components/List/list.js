import React, {useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {isEmpty} from "lodash";
import UserInfoTableCell from "components/TableCells/UserInfoTableCell";
import Label from "components/Label";
import {Card, Stack} from "@mui/material";
import ModuleOperator from "./components/ModuleOperator";
import ModuleSwitch from "./components/ModuleSwitch";
import {route} from "services/Http";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import ActionBar from "./components/ActionBar";

const messages = defineMessages({
    title: {defaultMessage: "Modules"},
    name: {defaultMessage: "Name"},
    module: {defaultMessage: "Module"},
    operator: {defaultMessage: "Operator"},
    status: {defaultMessage: "Status"}
});

const List = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "title",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.module)
            },
            {
                field: "operator",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.operator),
                renderCell: ({value: operator}) => {
                    return isEmpty(operator) ? (
                        <FormattedMessage defaultMessage="Unavailable" />
                    ) : (
                        <UserInfoTableCell user={operator} />
                    );
                }
            },
            {
                field: "status",
                minWidth: 100,
                flex: 0.5,
                headerName: intl.formatMessage(messages.status),
                renderCell: ({value: status}) => {
                    return status ? (
                        <Label variant="ghost" color="success">
                            <FormattedMessage defaultMessage="Enabled" />
                        </Label>
                    ) : (
                        <Label variant="ghost" color="error">
                            <FormattedMessage defaultMessage="Disabled" />
                        </Label>
                    );
                }
            },
            {
                field: "action",
                width: 150,
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: module}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <ModuleOperator module={module} />
                            <ModuleSwitch module={module} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.module.paginate");

    return (
        <Card>
            <TrapScrollBox>
                <AsyncTable
                    columns={columns}
                    components={{Toolbar: ActionBar}}
                    getRowId={(row) => row.name}
                    url={url}
                />
            </TrapScrollBox>
        </Card>
    );
};

export default List;
