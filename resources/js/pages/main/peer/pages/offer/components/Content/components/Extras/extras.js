import React, {useMemo} from "react";
import {Card} from "@mui/material";
import CardTabs from "components/CardTabs";
import Instruction from "./components/Instruction";
import UserReviews from "./components/UserReviews";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    instruction: {defaultMessage: "Instructions"},
    userReviews: {defaultMessage: "User Reviews"}
});

const Extras = () => {
    const intl = useIntl();

    const tabs = useMemo(
        () => [
            {
                label: intl.formatMessage(messages.instruction),
                component: <Instruction />
            },
            {
                label: intl.formatMessage(messages.userReviews),
                component: <UserReviews />
            }
        ],
        [intl]
    );

    return (
        <Card>
            <CardTabs
                variant="scrollable"
                allowScrollButtonsMobile
                scrollButtons="auto"
                tabs={tabs}
            />
        </Card>
    );
};

export default Extras;
