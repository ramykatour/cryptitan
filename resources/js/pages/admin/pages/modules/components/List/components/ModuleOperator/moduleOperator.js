import React, {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import {IconButton, MenuItem} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import Form, {TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import Spin from "components/Spin";
import ModalContent from "components/ModalContent";
import {LoadingButton} from "@mui/lab";
import ModalActions from "components/ModalActions";
import {notify} from "utils/index";
import TableContext from "contexts/TableContext";

const messages = defineMessages({
    setOperator: {defaultMessage: "Set Operator"},
    success: {defaultMessage: "Module was updated."},
    operator: {defaultMessage: "Operator"}
});

const ModuleOperator = ({module}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const setOperator = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.setOperator),
            content: <EditOperator module={module} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, module]);

    return (
        <Fragment>
            <IconButton onClick={setOperator}>
                <ManageAccountsIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const EditOperator = ({module, closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [operators, setOperators] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const {reload: reloadTable} = useContext(TableContext);
    const [request, loading] = useRequest();

    const fetchOperators = useCallback(() => {
        request
            .get(route("admin.module.get-operators"))
            .then((data) => setOperators(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchOperators();
    }, [fetchOperators]);

    const submitForm = useCallback(
        (values) => {
            const url = route("admin.module.set-operator", {
                module: module.name
            });

            formRequest
                .post(url, values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [formRequest, module, intl, closeModal, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <ModalContent>
                    <Form.Item
                        name="operator"
                        initialValue={module.operator?.id}
                        label={intl.formatMessage(messages.operator)}
                        rules={[{required: true}]}>
                        <TextField select fullWidth>
                            {operators.map((operator) => (
                                <MenuItem value={operator.id} key={operator.id}>
                                    {`${operator.name} (${operator.email})`}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Form.Item>
                </ModalContent>

                <ModalActions>
                    <LoadingButton
                        variant="contained"
                        loading={formLoading}
                        type="submit"
                        disabled={loading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </ModalActions>
            </Spin>
        </Form>
    );
};

export default ModuleOperator;
