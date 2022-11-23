import React, {useMemo} from "react";
import {defineMessages, useIntl} from "react-intl";
import stack from "@iconify-icons/ri/stack-fill.js";
import layoutGrid from "@iconify-icons/ri/layout-grid-fill.js";
import PageTabs from "components/PageTabs";
import List from "./components/List";
import Grid from "./components/Grid";

const messages = defineMessages({
    title: {defaultMessage: "Modules"},
    list: {defaultMessage: "List"},
    grid: {defaultMessage: "Grid"}
});

const Modules = () => {
    const intl = useIntl();

    const tabs = useMemo(
        () => [
            {
                value: "list",
                label: intl.formatMessage(messages.list),
                icon: stack,
                component: <List />
            },
            {
                value: "grid",
                label: intl.formatMessage(messages.grid),
                icon: layoutGrid,
                component: <Grid />
            }
        ],
        [intl]
    );

    return (
        <PageTabs
            initial="list"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Modules;
