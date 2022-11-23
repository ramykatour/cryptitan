import React, {useContext, useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Card, CardHeader} from "@mui/material";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import {route} from "services/Http";
import UserContext from "contexts/UserContext";
import {formatDateFromNow} from "utils/formatter";

const messages = defineMessages({
    action: {defaultMessage: "Action"},
    date: {defaultMessage: "Date"},
    source: {defaultMessage: "Source"},
    ip: {defaultMessage: "IP"},
    location: {defaultMessage: "Location"},
    agent: {defaultMessage: "Agent"}
});

const Activity = () => {
    const intl = useIntl();
    const {user} = useContext(UserContext);

    const columns = useMemo(() => {
        return [
            {
                field: "action",
                width: 180,
                headerName: intl.formatMessage(messages.action),
                filterable: true
            },
            {
                field: "created_at",
                width: 100,
                headerName: intl.formatMessage(messages.date),
                type: "dateTime",
                filterable: true,
                renderCell: ({value}) => formatDateFromNow(value)
            },
            {
                field: "source",
                width: 80,
                headerName: intl.formatMessage(messages.source),
                type: "singleSelect",
                filterable: true,
                valueOptions: ["api", "web"]
            },
            {
                field: "ip",
                width: 100,
                headerName: intl.formatMessage(messages.ip),
                filterable: true
            },
            {
                field: "parsed_agent",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.agent)
            },
            {
                field: "location",
                minWidth: 180,
                flex: 0.5,
                headerName: intl.formatMessage(messages.location),
                renderCell: ({row}) => row.location?.country
            }
        ];
    }, [intl]);

    const url = useMemo(() => {
        return route("admin.user.activity-paginate", {user: user.id});
    }, [user]);

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="User Activity" />}
            />

            <TrapScrollBox sx={{width: "100%"}}>
                <AsyncTable url={url} columns={columns} />
            </TrapScrollBox>
        </Card>
    );
};

export default Activity;
