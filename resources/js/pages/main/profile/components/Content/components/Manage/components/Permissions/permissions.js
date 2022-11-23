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
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Stack
} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import UserContext from "contexts/UserContext";
import {intersection, isEmpty, lowerCase, map} from "lodash";
import Result from "components/Result";
import {useModal} from "utils/modal";
import Form, {AutoComplete} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    changeRole: {defaultMessage: "Change Role"},
    roles: {defaultMessage: "Roles"},
    success: {defaultMessage: "User was updated."}
});

const Permissions = () => {
    const intl = useIntl();
    const {user} = useContext(UserContext);
    const [modal, modalElements] = useModal();
    const permissions = user.permissions();

    const changeRole = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.changeRole),
            content: <ChangeRole />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl]);

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Permissions" />}
            />

            <CardContent>
                {!isEmpty(permissions) ? (
                    permissions.map((permission) => (
                        <Chip
                            key={permission}
                            label={lowerCase(permission)}
                            size="small"
                            sx={{m: 0.5}}
                        />
                    ))
                ) : (
                    <Result
                        title={
                            <FormattedMessage defaultMessage="Nothing here" />
                        }
                        description={
                            <FormattedMessage defaultMessage="There are no permissions." />
                        }
                        iconSize={150}
                        sx={{py: 0}}
                    />
                )}
            </CardContent>

            {modalElements}

            <CardActions sx={{justifyContent: "flex-end"}}>
                <Button variant="contained" onClick={changeRole}>
                    <FormattedMessage defaultMessage="Change Role" />
                </Button>
            </CardActions>
        </Card>
    );
};

const ChangeRole = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [request, loading] = useRequest();
    const {user, fetchUser} = useContext(UserContext);
    const [formRequest, formLoading] = useFormRequest(form);
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
                    fetchUser();
                    closeModal();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, user, fetchUser]
    );

    useEffect(() => {
        if (!isEmpty(roles) && !isEmpty(user)) {
            form.resetFields();
        }
    }, [user, form, roles]);

    const initial = useMemo(() => {
        return intersection(user.roles(), map(roles, "name"));
    }, [user, roles]);

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <Form.Item
                    name="roles"
                    label={intl.formatMessage(messages.roles)}
                    initialValue={initial}>
                    <AutoComplete
                        loading={loading}
                        options={map(roles, "name")}
                        multiple={true}
                    />
                </Form.Item>

                <Stack direction="row" justifyContent="flex-end" my={2}>
                    <LoadingButton
                        variant="contained"
                        disabled={isEmpty(roles)}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </Stack>
            </Spin>
        </Form>
    );
};

export default Permissions;
