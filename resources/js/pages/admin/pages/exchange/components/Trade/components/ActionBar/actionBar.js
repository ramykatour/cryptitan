import React from "react";
import SearchTable from "components/SearchTable";
import {StyledToolbar} from "styles/toolbar.style";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    search: {defaultMessage: "Search user..."}
});

const ActionBar = () => {
    const intl = useIntl();

    return (
        <StyledToolbar>
            <SearchTable
                field="searchUser"
                placeholder={intl.formatMessage(messages.search)}
                withParams={true}
            />
        </StyledToolbar>
    );
};

export default ActionBar;
