import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import {route} from "services/Http";
import {Card, Stack} from "@mui/material";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import GiftcardThumbnail from "components/GiftcardThumbnail";
import GiftcardDelete from "./components/GiftcardDelete";
import GiftcardEdit from "./components/GiftcardEdit";
import GiftcardMenu from "./components/GiftcardMenu";

const messages = defineMessages({
    name: {defaultMessage: "Giftcard"},
    brand: {defaultMessage: "Brand"},
    title: {defaultMessage: "Title"},
    label: {defaultMessage: "Label"},
    description: {defaultMessage: "Description"},
    price: {defaultMessage: "Price"},
    value: {defaultMessage: "Value"},
    stock: {defaultMessage: "Stock"},
    giftcards: {defaultMessage: "Giftcards"}
});

const Giftcards = () => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "thumbnail",
                width: 70,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({value}) => <GiftcardThumbnail src={value} />
            },
            {
                field: "title",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.title)
            },
            {
                field: "brand",
                minWidth: 100,
                flex: 0.5,
                headerName: intl.formatMessage(messages.brand),
                renderCell: ({value}) => value.name
            },
            {
                field: "description",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.description)
            },
            {
                field: "label",
                width: 100,
                headerName: intl.formatMessage(messages.label)
            },
            {
                field: "formatted_value",
                width: 100,
                headerName: intl.formatMessage(messages.value)
            },
            {
                field: "stock",
                width: 100,
                headerName: intl.formatMessage(messages.stock)
            },
            {
                field: "action",
                minWidth: 150,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: giftcard}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <GiftcardDelete giftcard={giftcard} />
                            <GiftcardEdit giftcard={giftcard} />
                            <GiftcardMenu giftcard={giftcard} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.giftcard.paginate");

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

export default Giftcards;
