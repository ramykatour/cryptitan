import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {
    Button,
    Card,
    CardHeader,
    MenuItem,
    Stack,
    Switch,
    TextField
} from "@mui/material";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Table from "components/Table";
import FlagIcon from "components/FlagIcon";
import {notify} from "utils/index";
import EditIcon from "@mui/icons-material/Edit";
import {defaultTo, lowerCase} from "lodash";
import Form, {ControlLabel} from "components/Form";
import {LoadingButton} from "@mui/lab";
import Action from "./components/Action";
import LocaleDelete from "./components/LocaleDelete";
import TrapScrollBox from "components/TrapScrollBox";
import LocaleContext from "contexts/LocaleContext";

const messages = defineMessages({
    title: {defaultMessage: "Manage Locales"},
    name: {defaultMessage: "Name"},
    native: {defaultMessage: "Native"},
    code: {defaultMessage: "ISO-2 Code"},
    region: {defaultMessage: "Region"},
    addSuccess: {defaultMessage: "Locale was added."},
    importSuccess: {defaultMessage: "Import was successful."},
    removeSuccess: {defaultMessage: "Locale was removed."},
    addLocale: {defaultMessage: "Add Locale"},
    confirm: {defaultMessage: "Are you sure?"},
    selectGroup: {defaultMessage: "Select Group"},
    overwrite: {defaultMessage: "Overwrite"}
});

const ManageLocales = () => {
    const intl = useIntl();
    const [groups, setGroups] = useState([]);
    const [locales, setLocales] = useState([]);
    const [request, loading] = useRequest();

    const fetchLocales = useCallback(() => {
        request
            .get(route("admin.locale.get"))
            .then((data) => {
                setGroups(data.groups);
                setLocales(data.locales);
            })
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchLocales();
    }, [fetchLocales]);

    const columns = useMemo(
        () => [
            {
                field: "locale",
                width: 70,
                renderHeader: () => <span />
            },
            {
                field: "region",
                width: 50,
                renderHeader: () => <span />,
                renderCell: ({value}) => <FlagIcon code={value} />
            },
            {
                field: "name",
                minWidth: 100,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "native",
                minWidth: 100,
                flex: 1,
                headerName: intl.formatMessage(messages.native)
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: locale}) => (
                    <LocaleDelete reloadTable={fetchLocales} locale={locale} />
                )
            }
        ],
        [intl, fetchLocales]
    );

    return (
        <Stack spacing={2}>
            <Card>
                <CardHeader
                    title={intl.formatMessage(messages.title)}
                    action={<Action reloadTable={fetchLocales} />}
                />

                <TrapScrollBox>
                    <Table
                        columns={columns}
                        getRowId={(row) => row.locale}
                        rows={locales}
                        loading={loading}
                    />
                </TrapScrollBox>
            </Card>

            <Card>
                <Stack
                    spacing={3}
                    direction={{xs: "column", sm: "row"}}
                    justifyContent="space-between"
                    sx={{p: 4}}>
                    <ImportGroup fetchLocales={fetchLocales} />
                    <SelectGroup groups={groups} />
                </Stack>
            </Card>
        </Stack>
    );
};

const ImportGroup = ({fetchLocales}) => {
    const [form] = Form.useForm();
    const [formRequest, formLoading] = useFormRequest(form);
    const intl = useIntl();

    const importGroups = useCallback(
        (values) => {
            formRequest
                .post(route("admin.locale.import"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.importSuccess));
                    fetchLocales();
                })
                .catch(errorHandler());
        },
        [formRequest, intl, fetchLocales]
    );

    return (
        <Form form={form} onFinish={importGroups}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}>
                <Form.Item
                    name="replace"
                    initialValue={false}
                    label={intl.formatMessage(messages.overwrite)}
                    valuePropName="checked">
                    <ControlLabel>
                        <Switch />
                    </ControlLabel>
                </Form.Item>

                <LoadingButton
                    variant="contained"
                    type="submit"
                    sx={{boxShadow: 0}}
                    color="inherit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Import" />
                </LoadingButton>
            </Stack>
        </Form>
    );
};

const SelectGroup = ({groups}) => {
    const intl = useIntl();
    const {setGroup} = useContext(LocaleContext);
    const [selected, setSelected] = useState();

    const handleGroupSelect = useCallback((e) => {
        setSelected(e.target.value);
    }, []);

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}>
            <TextField
                size="small"
                onChange={handleGroupSelect}
                label={intl.formatMessage(messages.selectGroup)}
                value={defaultTo(selected, "")}
                sx={{minWidth: 150}}
                select>
                {groups.map((group, key) => (
                    <MenuItem value={group.name} key={key}>
                        {`${lowerCase(group.name)} (${group.total})`}
                    </MenuItem>
                ))}
            </TextField>

            <Button
                variant="contained"
                onClick={() => setGroup(selected)}
                sx={{boxShadow: 0, whiteSpace: "nowrap"}}
                startIcon={<EditIcon />}
                color="inherit">
                <FormattedMessage defaultMessage="Edit" />
            </Button>
        </Stack>
    );
};

export default ManageLocales;
