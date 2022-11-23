import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import {Card, Stack} from "@mui/material";
import {route} from "services/Http";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import ActionBar from "./components/ActionBar";
import MethodDelete from "./components/MethodDelete";
import MethodEdit from "./components/MethodEdit";

const messages = defineMessages({
    name: {defaultMessage: "Method"},
    description: {defaultMessage: "Description"},
    category: {defaultMessage: "Category"}
});

const PaymentMethods = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "name",
                minWidth: 100,
                flex: 0.5,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "description",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.description)
            },
            {
                field: "category",
                minWidth: 100,
                flex: 0.5,
                headerName: intl.formatMessage(messages.category),
                renderCell: ({value}) => value.name
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: method}) => {
                    return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <MethodDelete method={method} />
                            <MethodEdit method={method} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.peer-payment-method.paginate");

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

export default PaymentMethods;
