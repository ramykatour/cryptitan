import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import {route} from "services/Http";
import {Card, Stack} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import BrandDelete from "./components/BrandDelete";
import BrandEdit from "./components/BrandEdit";

const messages = defineMessages({
    name: {defaultMessage: "Brand"},
    description: {defaultMessage: "Description"},
    giftcards: {defaultMessage: "Giftcards"}
});

const Brands = () => {
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
                field: "giftcards_count",
                width: 100,
                headerName: intl.formatMessage(messages.giftcards)
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: brand}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <BrandDelete brand={brand} />
                            <BrandEdit brand={brand} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.giftcard.brand.paginate");

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

export default Brands;
