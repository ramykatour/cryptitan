import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import {route} from "services/Http";
import {Card, Stack} from "@mui/material";
import ActionBar from "./components/ActionBar";
import OperatingCountryDelete from "./components/OperatingCountryDelete";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";

const messages = defineMessages({
    name: {defaultMessage: "Country"},
    code: {defaultMessage: "Code"},
    banks: {defaultMessage: "Banks"}
});

const OperatingCountries = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "code",
                width: 70,
                renderHeader: () => <span />
            },
            {
                field: "name",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "banks_count",
                width: 100,
                headerName: intl.formatMessage(messages.banks)
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: country}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <OperatingCountryDelete country={country} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.bank.operating-country.paginate");

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

export default OperatingCountries;
