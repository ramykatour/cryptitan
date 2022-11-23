import React, {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useMemo
} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {IconButton, MenuItem, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import UserContext from "contexts/UserContext";
import {useCountries} from "hooks/global";
import {notify} from "utils/index";
import {defaultTo} from "lodash";
import {LoadingButton} from "@mui/lab";

const messages = defineMessages({
    until: {defaultMessage: "Until"},
    activated: {defaultMessage: "User was activated."},
    deactivateUser: {defaultMessage: "Deactivate User"},
    updateUser: {defaultMessage: "Update User"},
    deactivated: {defaultMessage: "User was deactivated."},
    success: {defaultMessage: "User was updated."},
    lastName: {defaultMessage: "Last Name"},
    firstName: {defaultMessage: "First Name"},
    country: {defaultMessage: "Country"}
});

const UpdateUser = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const updateUser = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.updateUser),
            content: <UpdateForm />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl]);

    return (
        <Fragment>
            <IconButton size="small" onClick={updateUser}>
                <EditIcon fontSize="inherit" />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const UpdateForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const {user, fetchUser} = useContext(UserContext);
    const {countries} = useCountries();

    useEffect(() => {
        if (user.isNotEmpty()) {
            form.resetFields();
        }
    }, [user, form]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.user.update", {user: user.id}), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    fetchUser();
                    closeModal();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, user, fetchUser]
    );

    const initialValues = useMemo(() => {
        return {
            last_name: user.profile?.last_name,
            first_name: user.profile?.first_name,
            country: defaultTo(user.country, "")
        };
    }, [user]);

    return (
        <Form form={form} initialValues={initialValues} onFinish={submitForm}>
            <Stack spacing={3}>
                <Stack
                    direction={{xs: "column", sm: "row"}}
                    spacing={{xs: 3, sm: 2}}>
                    <Form.Item
                        name="first_name"
                        label={intl.formatMessage(messages.firstName)}
                        rules={[{required: true}]}>
                        <TextField fullWidth />
                    </Form.Item>

                    <Form.Item
                        name="last_name"
                        label={intl.formatMessage(messages.lastName)}
                        rules={[{required: true}]}>
                        <TextField fullWidth />
                    </Form.Item>
                </Stack>

                <Stack
                    direction={{xs: "column", sm: "row"}}
                    spacing={{xs: 3, sm: 2}}>
                    <Form.Item
                        name="country"
                        label={intl.formatMessage(messages.country)}
                        rules={[{required: true}]}>
                        <TextField fullWidth select>
                            {countries.map((country) => (
                                <MenuItem
                                    value={country.code}
                                    key={country.code}>
                                    {`${country.name}`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Form.Item>
                </Stack>
            </Stack>

            <Stack direction="row" justifyContent="flex-end" my={2}>
                <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Submit" />
                </LoadingButton>
            </Stack>
        </Form>
    );
};
export default UpdateUser;
