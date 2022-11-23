import React, {useCallback, useEffect, useMemo, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {Card} from "@mui/material";
import CardTabs from "components/CardTabs";
import Table from "./components/Table";
import PropTypes from "prop-types";
import Label from "components/Label";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "components/Spin";

const messages = defineMessages({
    all: {defaultMessage: "All"},
    active: {defaultMessage: "Active"},
    completed: {defaultMessage: "Completed"},
    canceled: {defaultMessage: "Canceled"},
    disputed: {defaultMessage: "Disputed"}
});

const Content = ({type}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const [statistics, setStatistics] = useState({
        active: 0,
        canceled: 0,
        completed: 0,
        disputed: 0,
        all: 0
    });

    const url = useMemo(() => {
        if (type === "sell") {
            return route("peer-trade.get-sell-statistics");
        } else {
            return route("peer-trade.get-buy-statistics");
        }
    }, [type]);

    const fetchStatistics = useCallback(() => {
        request
            .get(url)
            .then((data) => setStatistics(data))
            .catch(errorHandler());
    }, [request, url]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    const tabs = useMemo(
        () => [
            {
                label: intl.formatMessage(messages.all),
                icon: <Label color="default">{statistics.all}</Label>,
                component: <Table type={type} />
            },
            {
                label: intl.formatMessage(messages.active),
                icon: <Label color="info">{statistics.active}</Label>,
                component: <Table type={type} status="active" />
            },
            {
                label: intl.formatMessage(messages.completed),
                icon: <Label color="success">{statistics.completed}</Label>,
                component: <Table type={type} status="completed" />
            },
            {
                label: intl.formatMessage(messages.canceled),
                icon: <Label color="error">{statistics.canceled}</Label>,
                component: <Table type={type} status="canceled" />
            },
            {
                label: intl.formatMessage(messages.disputed),
                icon: <Label color="warning">{statistics.disputed}</Label>,
                component: <Table type={type} status="disputed" />
            }
        ],
        [intl, type, statistics]
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

Content.propTypes = {
    type: PropTypes.oneOf(["buy", "sell"])
};

export default Content;
