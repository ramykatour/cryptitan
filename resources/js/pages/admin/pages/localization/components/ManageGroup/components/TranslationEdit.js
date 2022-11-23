import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import React, {Fragment, useCallback, useContext, useEffect} from "react";
import {IconButton, InputAdornment} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest} from "services/Http";
import {notify} from "utils/index";
import {castArray, isEmpty} from "lodash";
import FlagIcon from "components/FlagIcon";
import {LoadingButton} from "@mui/lab";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";
import LocaleContext from "contexts/LocaleContext";

const messages = defineMessages({
    key: {defaultMessage: "Key"},
    searchPlaceholder: {defaultMessage: "Search text..."},
    publishSuccess: {defaultMessage: "Publish was successful."},
    updateSuccess: {defaultMessage: "Translation was updated."},
    editTranslation: {defaultMessage: "Edit Translation"},
    locales: {defaultMessage: "Locales"}
});

const TranslationEdit = ({locales, translation, reloadTable}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const editTranslation = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.editTranslation),
            content: (
                <EditForm
                    translation={translation}
                    reloadTable={reloadTable}
                    locales={locales}
                />
            ),
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, translation, reloadTable, locales]);

    return (
        <Fragment>
            <IconButton onClick={editTranslation}>
                <EditIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const EditForm = ({closeModal, translation, locales, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [formRequest, formLoading] = useFormRequest(form);
    const {group} = useContext(LocaleContext);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .patch(route("admin.locale.group.update", {group}), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.updateSuccess));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, group, reloadTable]
    );

    const getValue = useCallback(
        (code) => translation[code]?.[0]?.value,
        [translation]
    );

    useEffect(() => {
        if (!isEmpty(translation)) {
            form.resetFields();
        }
    }, [translation, form]);

    return (
        <Form form={form} onFinish={submitForm}>
            <ModalContent spacing={2}>
                <Form.Item
                    name="key"
                    initialValue={translation.key}
                    label={intl.formatMessage(messages.key)}
                    rules={[{required: true}]}>
                    <TextField fullWidth disabled />
                </Form.Item>

                {castArray(locales).map((locale) => (
                    <Form.Item
                        key={locale.locale}
                        name={["locales", locale.locale]}
                        initialValue={getValue(locale.locale)}
                        label={locale.locale}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FlagIcon code={locale.region} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                ))}
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

export default TranslationEdit;
