import React, {useCallback, useContext, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {StyledToolbar} from "styles/toolbar.style";
import {Button, MenuItem} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import {LoadingButton} from "@mui/lab";
import Spin from "components/Spin";
import SearchTable from "components/SearchTable";
import TableContext from "contexts/TableContext";
import ModalActions from "components/ModalActions";
import ModalContent from "components/ModalContent";

const messages = defineMessages({
    addCountry: {defaultMessage: "Add Country"},
    success: {defaultMessage: "Country was added."},
    search: {defaultMessage: "Search country..."},
    auto: {defaultMessage: "Auto"},
    manual: {defaultMessage: "Manual"},
    rate: {defaultMessage: "Rate"},
    country: {defaultMessage: "Country"}
});

const ActionBar = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const addCountry = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.addCountry),
            content: <CreateForm />,
            rootProps: {fullWidth: true}
        });
    }, [intl, modal]);

    return (
        <StyledToolbar>
            <SearchTable
                sx={{mr: 2}}
                placeholder={intl.formatMessage(messages.search)}
                field="name"
            />

            {modalElements}

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addCountry}>
                <FormattedMessage defaultMessage="Add Country" />
            </Button>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [countries, setCountries] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const fetchCountries = useCallback(() => {
        request
            .get(route("admin.bank.get-available-countries"))
            .then((data) => setCountries(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.bank.operating-country.create"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <ModalContent>
                    <Form.Item
                        name="code"
                        label={intl.formatMessage(messages.country)}
                        rules={[{required: true}]}>
                        <TextField fullWidth select>
                            {countries.map((country, key) => (
                                <MenuItem value={country.code} key={key}>
                                    {`${country.name} (${country.code})`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Form.Item>
                </ModalContent>

                <ModalActions>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </ModalActions>
            </Spin>
        </Form>
    );
};

export default ActionBar;
