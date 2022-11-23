import React, {useCallback, useEffect, useMemo, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import Label from "components/Label";
import Table from "./components/Table";
import {Card} from "@mui/material";
import Spin from "components/Spin";
import CardTabs from "components/CardTabs";

const messages = defineMessages({
    all: {defaultMessage: "All"},
    active: {defaultMessage: "Active"},
    completed: {defaultMessage: "Completed"},
    canceled: {defaultMessage: "Canceled"},
    disputed: {defaultMessage: "Disputed"}
});

const Trades = () => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const [statistics, setStatistics] = useState({
        active: 0,
        canceled: 0,
        completed: 0,
        disputed: 0,
        all: 0
    });

    const fetchStatistics = useCallback(() => {
        request
            .get(route("admin.peer-trade.get-statistics"))
            .then((data) => setStatistics(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    const tabs = useMemo(
        () => [
            {
                label: intl.formatMessage(messages.all),
                icon: <Label color="default">{statistics.all}</Label>,
                component: <Table />
            },
            {
                label: intl.formatMessage(messages.active),
                icon: <Label color="info">{statistics.active}</Label>,
                component: <Table status="active" />
            },
            {
                label: intl.formatMessage(messages.completed),
                icon: <Label color="success">{statistics.completed}</Label>,
                component: <Table status="completed" />
            },
            {
                label: intl.formatMessage(messages.canceled),
                icon: <Label color="error">{statistics.canceled}</Label>,
                component: <Table status="canceled" />
            },
            {
                label: intl.formatMessage(messages.disputed),
                icon: <Label color="warning">{statistics.disputed}</Label>,
                component: <Table status="disputed" />
            }
        ],
        [intl, statistics]
    );

    return (
        <Card>
            <Spin spinning={loading}>
                <CardTabs
                    variant="scrollable"
                    allowScrollButtonsMobile
                    scrollButtons="auto"
                    tabs={tabs}
                />
            </Spin>
        </Card>
    );
};

export default Trades;
