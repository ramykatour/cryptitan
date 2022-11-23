import React from "react";
import SearchTable from "components/SearchTable";
import {defineMessages, useIntl} from "react-intl";
import {StyledToolbar} from "styles/toolbar.style";

const messages = defineMessages({
    search: {defaultMessage: "Search module..."}
});

const ActionBar = () => {
    const intl = useIntl();

    return (
        <StyledToolbar>
            <SearchTable
                sx={{mr: 2}}
                placeholder={intl.formatMessage(messages.search)}
                field="title"
            />
        </StyledToolbar>
    );
};

export default ActionBar;
