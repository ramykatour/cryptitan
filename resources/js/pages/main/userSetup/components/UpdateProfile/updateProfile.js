import React, {useCallback, useEffect, useMemo} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {defaultTo} from "lodash";
import {notify} from "utils/index";
import UploadPhoto from "components/UploadPhoto";
import {errorHandler, route, useFormRequest} from "services/Http";
import {fetchUser} from "redux/slices/auth";
import {normalizeDates, parseDate} from "utils/form";
import {useAuth} from "models/Auth";
import {useDispatch} from "react-redux";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    MenuItem,
    Stack
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import Form, {DatePicker, TextField} from "components/Form";
import Result from "components/Result";
import {TwoFactorIllustration} from "assets/index";
import {useCountries} from "hooks/global";

const messages = defineMessages({
    lastName: {defaultMessage: "Last Name"},
    firstName: {defaultMessage: "First Name"},
    country: {defaultMessage: "Country"},
    dob: {defaultMessage: "Date of Birth"},
    bio: {defaultMessage: "Bio"},
    phone: {defaultMessage: "Phone"},
    profileUpdated: {defaultMessage: "Your profile was updated."},
    caption: {defaultMessage: "Allowed *.jpeg, *.jpg, *.png"}
});

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const intl = useIntl();

    const onUploadSuccess = useCallback(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const start = useCallback(() => {
        window.location.reload();
    }, []);

    return !auth.user.isProfileComplete() ? (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card sx={{py: 10, px: 3}}>
                    <UploadPhoto
                        action={route("user.upload-picture")}
                        caption={intl.formatMessage(messages.caption)}
                        onSuccess={onUploadSuccess}
                        preview={auth.user.getProfilePicture()}
                    />
                </Card>
            </Grid>

            <Grid item xs={12} md={8}>
                <UpdateForm />
            </Grid>
        </Grid>
    ) : (
        <Card>
            <CardHeader title={<FormattedMessage defaultMessage="Profile" />} />

            <CardContent>
                <Result
                    title={
                        <FormattedMessage defaultMessage="Profile Updated." />
                    }
                    description={
                        <FormattedMessage defaultMessage="You have updated your profile." />
                    }
                    icon={TwoFactorIllustration}
                    extra={
                        <LoadingButton variant="contained" onClick={start}>
                            <FormattedMessage defaultMessage="Start" />
                        </LoadingButton>
                    }
                />
            </CardContent>
        </Card>
    );
};

const UpdateForm = () => {
    const [form] = Form.useForm();
    const [request, loading] = useFormRequest(form);
    const {countries} = useCountries();
    const dispatch = useDispatch();
    const auth = useAuth();
    const intl = useIntl();

    useEffect(() => {
        if (auth.check()) {
            form.resetFields();
        }
    }, [auth, form]);

    const submitForm = useCallback(
        (values) => {
            normalizeDates(values, ["dob"]);

            request
                .post(route("user.update"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.profileUpdated));
                    dispatch(fetchUser());
                })
                .catch(errorHandler());
        },
        [intl, request, dispatch]
    );

    const initialValues = useMemo(() => {
        return {
            last_name: auth.user.profile?.last_name,
            first_name: auth.user.profile?.first_name,
            dob: parseDate(auth.user.profile?.dob),
            bio: auth.user.profile?.bio,
            country: defaultTo(auth.user.country, "")
        };
    }, [auth]);

    return (
        <Form form={form} initialValues={initialValues} onFinish={submitForm}>
            <Card>
                <CardContent>
                    <Stack spacing={3}>
                        <Stack
                            direction={{xs: "column", sm: "row"}}
                            spacing={{xs: 3, sm: 2}}>
                            <Form.Item
                                name="first_name"
                                label={intl.formatMessage(messages.firstName)}
                                rules={[{required: true}]}>
                                <TextField
                                    fullWidth
                                    disabled={Boolean(
                                        initialValues["first_name"]
                                    )}
                                />
                            </Form.Item>

                            <Form.Item
                                name="last_name"
                                label={intl.formatMessage(messages.lastName)}
                                rules={[{required: true}]}>
                                <TextField
                                    fullWidth
                                    disabled={Boolean(
                                        initialValues["last_name"]
                                    )}
                                />
                            </Form.Item>
                        </Stack>

                        <Stack
                            direction={{xs: "column", sm: "row"}}
                            spacing={{xs: 3, sm: 2}}>
                            <Form.Item
                                name="dob"
                                label={intl.formatMessage(messages.dob)}
                                rules={[{required: true}]}>
                                <DatePicker fullWidth />
                            </Form.Item>

                            <Form.Item
                                name="country"
                                label={intl.formatMessage(messages.country)}
                                rules={[{required: true}]}>
                                <TextField
                                    fullWidth
                                    disabled={Boolean(initialValues["country"])}
                                    select>
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

                        <Form.Item
                            name="bio"
                            label={intl.formatMessage(messages.bio)}
                            rules={[{required: false}]}>
                            <TextField
                                multiline
                                minRows={3}
                                maxRows={6}
                                fullWidth
                            />
                        </Form.Item>
                    </Stack>
                </CardContent>

                <CardActions sx={{justifyContent: "flex-end"}}>
                    <LoadingButton
                        variant="contained"
                        type="submit"
                        loading={loading}>
                        <FormattedMessage defaultMessage="Save Changes" />
                    </LoadingButton>
                </CardActions>
            </Card>
        </Form>
    );
};

export default UpdateProfile;
