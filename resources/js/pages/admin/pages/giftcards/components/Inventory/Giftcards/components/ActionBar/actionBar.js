import React, {useCallback, useContext, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {StyledToolbar} from "styles/toolbar.style";
import {Button, InputAdornment, MenuItem, Stack} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form, {SelectAdornment, TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import Spin from "components/Spin";
import {useSupportedCurrencies} from "hooks/global";
import {useAuth} from "models/Auth";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import {LoadingButton} from "@mui/lab";
import TableContext from "contexts/TableContext";
import SearchTable from "components/SearchTable";
import ModalContent from "components/ModalContent";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    success: {defaultMessage: "Giftcard was created."},
    search: {defaultMessage: "Search title..."},
    createGiftcard: {defaultMessage: "Create Giftcard"},
    name: {defaultMessage: "Giftcard"},
    brand: {defaultMessage: "Brand"},
    title: {defaultMessage: "Title"},
    label: {defaultMessage: "Label"},
    description: {defaultMessage: "Description"},
    instruction: {defaultMessage: "Instruction"},
    value: {defaultMessage: "Value"},
    currency: {defaultMessage: "Currency"},
    giftcards: {defaultMessage: "Giftcards"}
});

const ActionBar = () => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const createGiftcard = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.createGiftcard),
            content: <CreateForm />,
            rootProps: {fullWidth: true}
        });
    }, [intl, modal]);

    return (
        <StyledToolbar>
            <SearchTable
                sx={{mr: 2}}
                placeholder={intl.formatMessage(messages.search)}
                field="title"
            />

            {modalElements}

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={createGiftcard}>
                <FormattedMessage defaultMessage="Create" />
            </Button>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const auth = useAuth();
    const [brands, setBrands] = useState([]);
    const {reload: reloadTable} = useContext(TableContext);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchBrands = useCallback(() => {
        request
            .get(route("admin.giftcard.brand.all"))
            .then((data) => setBrands(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const {currencies} = useSupportedCurrencies();

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.giftcard.create"), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable]
    );

    const currencySelect = (
        <Form.Item
            name="currency"
            initialValue={auth.user.currency}
            rules={[{required: true}]}>
            <SelectAdornment>
                {currencies.map((currency) => (
                    <MenuItem value={currency.code} key={currency.code}>
                        {currency.code}
                    </MenuItem>
                ))}
            </SelectAdornment>
        </Form.Item>
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <ModalContent spacing={2}>
                    <Form.Item
                        name="brand_id"
                        label={intl.formatMessage(messages.brand)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CardGiftcardIcon />
                                    </InputAdornment>
                                )
                            }}
                            select>
                            {brands.map((brand) => (
                                <MenuItem value={brand.id} key={brand.id}>
                                    {brand.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label={intl.formatMessage(messages.title)}
                        rules={[{required: true}]}>
                        <TextField fullWidth />
                    </Form.Item>

                    <Stack direction="row" spacing={2}>
                        <Form.Item
                            name="label"
                            label={intl.formatMessage(messages.label)}
                            rules={[{required: true}]}>
                            <TextField fullWidth />
                        </Form.Item>

                        <Form.Item
                            name="value"
                            label={intl.formatMessage(messages.value)}
                            rules={[{required: true}]}>
                            <TextField
                                type="number"
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {currencySelect}
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Form.Item>
                    </Stack>

                    <Form.Item
                        name="description"
                        label={intl.formatMessage(messages.description)}>
                        <TextField fullWidth multiline rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="instruction"
                        label={intl.formatMessage(messages.instruction)}>
                        <TextField fullWidth multiline rows={3} />
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
