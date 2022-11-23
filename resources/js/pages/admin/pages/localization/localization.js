import React, {useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import Page from "components/Page";
import ManageLocales from "./components/ManageLocales";
import ManageGroup from "./components/ManageGroup";
import {LocaleProvider} from "contexts/LocaleContext";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import {Container} from "@mui/material";

const messages = defineMessages({
    title: {defaultMessage: "Localization"}
});

const Localization = () => {
    const intl = useIntl();
    const [group, setGroup] = useState();

    return (
        <Page title={intl.formatMessage(messages.title)}>
            <Container>
                <HeaderBreadcrumbs />

                <LocaleProvider group={group} setGroup={setGroup}>
                    {group ? <ManageGroup /> : <ManageLocales />}
                </LocaleProvider>
            </Container>
        </Page>
    );
};

export default Localization;
