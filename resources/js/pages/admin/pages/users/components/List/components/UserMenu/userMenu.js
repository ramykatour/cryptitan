import React, {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {IconButton, MenuItem} from "@mui/material";
import Dropdown from "components/Dropdown";
import {intersection, isEmpty, map} from "lodash";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useAuth} from "models/Auth";
import User from "models/User";
import {useModal} from "utils/modal";
import Form, {AutoComplete, DateTimePicker} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import {notify} from "utils/index";
import {normalizeDate} from "utils/form";
import GavelIcon from "@mui/icons-material/Gavel";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LoadingIcon from "components/LoadingIcon";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";

const messages = defineMessages({
    assignRole: {defaultMessage: "Assign Role"},
    deactivateUser: {defaultMessage: "Deactivate User"},
    roles: {defaultMessage: "Roles"},
    until: {defaultMessage: "Until"},
    activated: {defaultMessage: "User was activated."},
    deactivated: {defaultMessage: "User was deactivated."},
    success: {defaultMessage: "User was updated."}
});

const UserMenu = ({user}) => {
    const auth = useAuth();
    const [modal, modalElements] = useModal();
    const [request, loading] = useRequest();
    const {reload: reloadTable} = useContext(TableContext);
    const intl = useIntl();

    const assignRole = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.assignRole),
            content: <AssignRole user={user} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, user, intl]);

    const deactivateUser = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.deactivateUser),
            content: <DeactivateUser user={user} />
        });
    }, [modal, user, intl]);

    const activateUser = useCallback(() => {
        request
            .post(route("admin.user.activate", {user: user.id}))
            .then(() => {
                notify.success(intl.formatMessage(messages.activated));
                reloadTable();
            })
            .catch(errorHandler());
    }, [request, user, intl, reloadTable]);

    const menuItems = useMemo(() => {
        const items = [];

        if (user.updatable && auth.user.isSuperAdmin()) {
            items.push(
                <MenuItem key={0} onClick={assignRole}>
                    <AdminPanelSettingsIcon sx={{mr: 2}} />
                    <FormattedMessage defaultMessage="Assign Role" />
                </MenuItem>
            );
        }

        if (user.updatable) {
            const data = User.use(user);

            if (data.isActive()) {
                items.push(
                    <MenuItem key={1} onClick={deactivateUser}>
                        <GavelIcon sx={{mr: 2}} />
                        <FormattedMessage defaultMessage="Deactivate" />
                    </MenuItem>
                );
            } else {
                items.push(
                    <MenuItem key={1} onClick={activateUser}>
                        <SettingsBackupRestoreIcon sx={{mr: 2}} />
                        <FormattedMessage defaultMessage="Activate" />
                    </MenuItem>
                );
            }
        }

        return items;
    }, [user, auth, assignRole, deactivateUser, activateUser]);

    if (isEmpty(menuItems)) {
        return null;
    }

    return (
        <Fragment>
            <Dropdown menuItems={menuItems} component={IconButton}>
                <LoadingIcon component={MoreVertIcon} loading={loading} />
            </Dropdown>

            {modalElements}
        </Fragment>
    );
};

const AssignRole = ({closeModal, user}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const {reload: reloadTable} = useContext(TableContext);
    const [roles, setRoles] = useState([]);

    const fetchRoles = useCallback(() => {
        request
            .get(route("admin.role.all"))
            .then((data) => setRoles(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.role.assign", {user: user.id}), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, user, reloadTable]
    );

    useEffect(() => {
        if (!isEmpty(roles)) {
            form.resetFields();
        }
    }, [form, roles]);

    const initialRoles = useMemo(() => {
        return intersection(user.all_roles, map(roles, "name"));
    }, [user, roles]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <ModalContent>
                    <Form.Item
                        name="roles"
                        label={intl.formatMessage(messages.roles)}
                        initialValue={initialRoles}>
                        <AutoComplete multiple options={map(roles, "name")} />
                    </Form.Item>
                </ModalContent>

                <ModalActions>
                    <LoadingButton
                        variant="contained"
                        disabled={loading || isEmpty(roles)}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </ModalActions>
            </Spin>
        </Form>
    );
};

const DeactivateUser = ({closeModal, user}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const {reload: reloadTable} = useContext(TableContext);

    const submitForm = useCallback(
        (values) => {
            normalizeDate(values, "date");

            formRequest
                .post(route("admin.user.deactivate", {user: user.id}), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.deactivated));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, user, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent>
                <Form.Item
                    name="date"
                    label={intl.formatMessage(messages.until)}
                    rules={[{required: true}]}>
                    <DateTimePicker fullWidth />
                </Form.Item>
            </ModalContent>

            <ModalActions>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Submit" />
                </LoadingButton>
            </ModalActions>
        </Form>
    );
};

export default UserMenu;
