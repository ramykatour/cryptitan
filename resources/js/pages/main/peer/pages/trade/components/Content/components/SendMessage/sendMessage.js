import React, {useCallback, useContext} from "react";
import {styled, useTheme} from "@mui/material/styles";
import {
    Box,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    useMediaQuery
} from "@mui/material";
import attachment from "@iconify/icons-eva/attach-2-fill";
import smilingFace from "@iconify/icons-eva/smiling-face-fill";
import send from "@iconify/icons-ic/round-send";
import Iconify from "components/Iconify";
import {defineMessages, useIntl} from "react-intl";
import Form, {Input} from "components/Form";
import {FormContext} from "components/Form/contexts";
import EmojiPicker from "components/EmojiPicker";
import {
    errorHandler,
    notifyError,
    route,
    useFormRequest,
    useUploadRequest
} from "services/Http";
import PeerTradeContext from "contexts/PeerTradeContext";
import LoadingContext, {LoadingProvider} from "contexts/LoadingContext";
import ChatContext from "contexts/ChatContext";
import Upload from "rc-upload";

const messages = defineMessages({
    placeholder: {defaultMessage: "Type a message..."}
});

const SendMessage = () => {
    const [form] = Form.useForm();
    const [request, loading] = useFormRequest(form);
    const {reloadMessages} = useContext(ChatContext);
    const {trade} = useContext(PeerTradeContext);

    const submitForm = useCallback(
        (values) => {
            const url = route("peer-trade.send-message", {trade: trade.id});

            request
                .post(url, values)
                .then(() => {
                    form.resetFields();
                    reloadMessages();
                })
                .catch(errorHandler());
        },
        [form, request, trade, reloadMessages]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <LoadingProvider loading={loading}>
                <Container>
                    <InputField />
                    <Divider orientation="vertical" flexItem />
                    <SendButton />
                </Container>
            </LoadingProvider>
        </Form>
    );
};

const InputField = () => {
    const theme = useTheme();
    const {form} = useContext(FormContext);
    const {trade} = useContext(PeerTradeContext);
    const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
    const loading = useContext(LoadingContext);
    const intl = useIntl();

    const onKeyDown = (e) => {
        if (isDesktop && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            return form.submit();
        }
    };

    const isEnabled = !loading && trade.in_progress;

    return (
        <Form.Item name="message">
            <Input
                fullWidth
                maxRows={3}
                multiline
                onKeyDown={onKeyDown}
                placeholder={intl.formatMessage(messages.placeholder)}
                disabled={!isEnabled}
                sx={{mr: 1.5}}
                disableUnderline
                startAdornment={
                    <InputAdornment position="start">
                        <Form.Item name="message">
                            <EmojiPicker
                                disabled={!isEnabled}
                                component={IconButton}
                                size="small">
                                <StyledIcon icon={smilingFace} />
                            </EmojiPicker>
                        </Form.Item>
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                        <FileUpload />
                    </InputAdornment>
                }
            />
        </Form.Item>
    );
};

const SendButton = () => {
    const loading = useContext(LoadingContext);
    const {trade} = useContext(PeerTradeContext);

    const isEnabled = (form) => {
        const hasMessage = form.getFieldValue("message")?.length;
        return !loading && trade.in_progress && hasMessage;
    };

    return (
        <Form.Item shouldUpdate>
            {(form) => (
                <IconButton
                    type="submit"
                    disabled={!isEnabled(form)}
                    color="primary"
                    sx={{mx: 1}}>
                    {loading ? (
                        <CircularProgress size="1rem" />
                    ) : (
                        <StyledIcon icon={send} />
                    )}
                </IconButton>
            )}
        </Form.Item>
    );
};

const FileUpload = () => {
    const [request, loading] = useUploadRequest();
    const {reloadMessages} = useContext(ChatContext);
    const {trade} = useContext(PeerTradeContext);

    const action = route("peer-trade.upload-file", {trade: trade.id});

    const isEnabled = !loading && trade.in_progress;

    return (
        <Upload
            action={action}
            disabled={!isEnabled}
            onSuccess={() => reloadMessages()}
            onError={(e) => notifyError(e)}
            customRequest={request}>
            <IconButton disabled={!isEnabled} size="small">
                {loading ? (
                    <CircularProgress size="1rem" />
                ) : (
                    <StyledIcon icon={attachment} />
                )}
            </IconButton>
        </Upload>
    );
};

const StyledIcon = styled(Iconify)({
    width: 22,
    height: 22
});

const Container = styled(Box)(({theme}) => ({
    minHeight: 56,
    position: "relative",
    alignItems: "center",
    display: "flex",
    paddingLeft: theme.spacing(2)
}));

export default SendMessage;
