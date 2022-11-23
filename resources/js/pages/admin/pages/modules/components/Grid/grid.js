import React, {useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {route} from "services/Http";
import {Card, Chip, Stack} from "@mui/material";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import ActionBar from "./components/ActionBar";
import Label from "components/Label";
import GridSwitch from "./components/GridSwitch";

const messages = defineMessages({
    title: {defaultMessage: "Modules"},
    name: {defaultMessage: "Name"},
    widgets: {defaultMessage: "Widgets"},
    page: {defaultMessage: "Page"},
    status: {defaultMessage: "Status"}
});

const Grid = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "title",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.widgets)
            },
            {
                field: "page_title",
                minWidth: 150,
                flex: 0.5,
                headerName: intl.formatMessage(messages.page),
                renderCell: ({value}) => {
                    return <Chip size="small" label={value} />;
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
                renderCell: ({row: grid}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <GridSwitch grid={grid} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.grid.paginate");

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

export default Grid;
