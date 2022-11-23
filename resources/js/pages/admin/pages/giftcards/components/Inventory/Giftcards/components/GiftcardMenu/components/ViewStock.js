import React, {useCallback, useContext, useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton, Stack} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import DateTableCell from "components/TableCells/DateTableCell";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    serial: {defaultMessage: "Serial"},
    success: {defaultMessage: "Content was removed."},
    confirm: {defaultMessage: "Are you sure?"},
    added: {defaultMessage: "Added"}
});

const ViewStock = ({giftcard}) => {
    const intl = useIntl();

    const columns = useMemo(
        () => [
            {
                field: "serial",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.serial)
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.added),
                width: 150,
                renderCell: ({value}) => <DateTableCell value={value} />
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: content}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <ContentDelete
                                giftcard={giftcard}
                                content={content}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, giftcard]
    );

    const url = route("admin.giftcard.content.paginate", {
        giftcard: giftcard.id
    });

    return (
        <TrapScrollBox sx={{mx: -3}}>
            <AsyncTable columns={columns} url={url} />
        </TrapScrollBox>
    );
};

const ContentDelete = ({giftcard, content}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const deleteContent = useCallback(() => {
        const url = route("admin.giftcard.content.delete", {
            content: content.id,
            giftcard: giftcard.id
        });

        request
            .delete(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, giftcard, content, intl, reloadTable]);

    return (
        <PopConfirm component={IconButton} onClick={deleteContent}>
            <LoadingIcon
                color="error"
                component={DeleteIcon}
                loading={loading}
            />
        </PopConfirm>
    );
};

export default ViewStock;
