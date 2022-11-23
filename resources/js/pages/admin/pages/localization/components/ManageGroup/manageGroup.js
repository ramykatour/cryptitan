import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {Alert, Card, Stack} from "@mui/material";
import {keys} from "lodash";
import {errorHandler, route, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Table from "components/Table";
import ActionBar from "./components/ActionBar";
import TranslationEdit from "./components/TranslationEdit";
import LocaleContext from "contexts/LocaleContext";

const messages = defineMessages({
    key: {defaultMessage: "Key"},
    searchPlaceholder: {defaultMessage: "Search text..."},
    publishSuccess: {defaultMessage: "Publish was successful."},
    updateSuccess: {defaultMessage: "Translation was updated."},
    editTranslation: {defaultMessage: "Edit Translation"},
    locales: {defaultMessage: "Locales"}
});

const ManageGroup = () => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const {group} = useContext(LocaleContext);
    const [params, setParams] = useState({group});

    const [locales, setLocales] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [changed, setChanged] = useState(0);

    const url = useMemo(() => {
        return route("admin.locale.group.get", params);
    }, [params]);

    const fetchGroup = useCallback(() => {
        request
            .get(url)
            .then((data) => {
                setLocales(data.locales);
                setTranslations(data.translations);
                setChanged(data.changed);
            })
            .catch(errorHandler());
    }, [request, url]);

    useEffect(() => {
        fetchGroup();
    }, [fetchGroup]);

    const applyParams = useCallback((params) => {
        setParams((state) => ({...state, ...params}));
    }, []);

    const columns = useMemo(
        () => [
            {
                field: "key",
                minWidth: 200,
                flex: 0.5,
                headerName: intl.formatMessage(messages.key)
            },
            {
                field: "en",
                minWidth: 200,
                flex: 1,
                renderCell: ({value}) => value[0]?.value
            },
            {
                field: "keys",
                minWidth: 200,
                flex: 0.5,
                headerName: intl.formatMessage(messages.locales),
                renderCell: ({row}) => {
                    return keys(row)
                        .filter((key) => key !== "key")
                        .join(", ");
                }
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: translation}) => {
                    return (
                        <Stack direction="row" spacing={1}>
                            <TranslationEdit
                                reloadTable={fetchGroup}
                                translation={translation}
                                locales={locales}
                            />
                        </Stack>
                    );
                }
            }
        ],
        [intl, fetchGroup, locales]
    );

    return (
        <Card>
            <ActionBar
                reloadTable={fetchGroup}
                applyParams={applyParams}
                changed={changed}
            />

            <Alert severity="warning" sx={{mx: 3, mb: 3}}>
                <FormattedMessage
                    defaultMessage="The words in the form of {one} and {two}, are placeholders and must not be changed across all locales."
                    values={{
                        one: <b>{`:word`}</b>,
                        two: <b>{`{word}`}</b>
                    }}
                />
            </Alert>

            <Table
                columns={columns}
                getRowId={(row) => row.key}
                rows={translations}
                loading={loading}
            />
        </Card>
    );
};

export default ManageGroup;
