import React from "react";
import {defineMessages, useIntl} from "react-intl";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTable from "components/SearchTable";

const messages = defineMessages({
    search: {defaultMessage: "Search grid..."}
});

const ActionBar = () => {
    const intl = useIntl();

    return (
        <StyledToolbar>
            <SearchTable
                sx={{mr: 2}}
                placeholder={intl.formatMessage(messages.search)}
                field="name"
            />
        </StyledToolbar>
    );
};

export default ActionBar;
