import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import {Card, Chip, Grid, Stack} from "@mui/material";
import StatisticCard from "./components/StatisticCard";
import {errorHandler, route, useRequest} from "services/Http";
import {defineMessages, useIntl} from "react-intl";
import ActionBar from "./components/ActionBar";
import TrapScrollBox from "components/TrapScrollBox";
import AsyncTable from "components/AsyncTable";
import LogMarkAsSeen from "./components/LogMarkAsSeen";
import Copyable from "components/Copyable";
import DateTableCell from "components/TableCells/DateTableCell";

const messages = defineMessages({
    date: {defaultMessage: "Date"},
    message: {defaultMessage: "Message"},
    level: {defaultMessage: "Level"}
});

const SystemLogs = () => {
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [data, setData] = useState({});

    const fetchData = useCallback(() => {
        request
            .get(route("admin.statistics.system-status"))
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = useMemo(
        () => [
            {
                field: "level",
                width: 100,
                headerName: intl.formatMessage(messages.level),
                renderCell: ({value}) => {
                    return <Chip color={value} size="small" label={value} />;
                }
            },
            {
                field: "message",
                minWidth: 200,
                flex: 1,
                headerName: intl.formatMessage(messages.message),
                renderCell: ({row}) => {
                    return (
                        <Stack direction="row" sx={{minWidth: 0}}>
                            <Copyable ellipsis>{row.message}</Copyable>
                        </Stack>
                    );
                }
            },
            {
                field: "created_at",
                headerName: intl.formatMessage(messages.date),
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
                renderCell: ({row: log}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <LogMarkAsSeen log={log} />
                        </Stack>
                    );
                }
            }
        ],
        [intl]
    );

    const url = route("admin.system-logs.paginate");

    return (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <StatisticCard
                        loading={loading}
                        type="info"
                        value={data.info}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <StatisticCard
                        loading={loading}
                        type="warning"
                        value={data.warning}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <StatisticCard
                        loading={loading}
                        type="error"
                        value={data.error}
                    />
                </Grid>
            </Grid>

            <Card sx={{mt: 2}}>
                <TrapScrollBox>
                    <AsyncTable
                        columns={columns}
                        components={{Toolbar: ActionBar}}
                        url={url}
                    />
                </TrapScrollBox>
            </Card>
        </Fragment>
    );
};

export default SystemLogs;
