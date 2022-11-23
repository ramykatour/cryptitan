import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import React, {useCallback, useContext, useState} from "react";
import {notify} from "utils/index";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";
import {LoadingButton} from "@mui/lab";
import {useSearchDebounce} from "hooks/useSearchDebounce";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Button, Stack} from "@mui/material";
import LocaleContext from "contexts/LocaleContext";

const messages = defineMessages({
    key: {defaultMessage: "Key"},
    editTranslation: {defaultMessage: "Edit Translation"},
    search: {defaultMessage: "Search text..."},
    publishSuccess: {defaultMessage: "Publish was successful."},
    updateSuccess: {defaultMessage: "Translation was updated."},
    locales: {defaultMessage: "Locales"}
});

const ActionBar = ({changed, applyParams, reloadTable}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();
    const {group, setGroup} = useContext(LocaleContext);
    const [search, setSearch] = useState();

    const applySearch = useCallback(
        (search) => applyParams({search}),
        [applyParams]
    );

    const clearSearch = useCallback(
        () => applyParams({search: undefined}),
        [applyParams]
    );

    useSearchDebounce(search, applySearch, clearSearch);

    const publish = useCallback(() => {
        request
            .post(route("admin.locale.group.export", {group}))
            .then(() => {
                notify.success(intl.formatMessage(messages.publishSuccess));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, reloadTable, intl, group]);

    return (
        <StyledToolbar>
            <SearchTextField
                search={search}
                onSearchChange={setSearch}
                placeholder={intl.formatMessage(messages.search)}
                sx={{mr: 2}}
            />

            <Stack direction="row" spacing={1}>
                {changed > 0 && (
                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        onClick={publish}>
                        <FormattedMessage defaultMessage="Publish" />
                    </LoadingButton>
                )}

                <Button
                    variant="outlined"
                    onClick={() => setGroup()}
                    color="inherit">
                    <ArrowBackIcon fontSize="medium" />
                </Button>
            </Stack>
        </StyledToolbar>
    );
};

export default ActionBar;
