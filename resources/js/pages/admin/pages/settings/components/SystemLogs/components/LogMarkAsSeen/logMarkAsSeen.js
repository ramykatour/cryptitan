import React, {useCallback, useContext} from "react";
import BeenHereIcon from "@mui/icons-material/Beenhere";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    success: {defaultMessage: "Operation was successful."}
});

const LogMarkAsSeen = ({log}) => {
    const intl = useIntl();
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const markAsSeen = useCallback(() => {
        const url = route("admin.system-logs.mark-as-seen", {log: log.id});

        request
            .post(url)
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, log, intl, reloadTable]);

    if (log.seen_at) {
        return null;
    }

    return (
        <IconButton onClick={markAsSeen}>
            <LoadingIcon component={BeenHereIcon} loading={loading} />
        </IconButton>
    );
};

export default LogMarkAsSeen;
