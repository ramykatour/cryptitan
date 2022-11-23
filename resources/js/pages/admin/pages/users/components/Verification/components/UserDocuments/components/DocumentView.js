import React, {Fragment, useCallback, useContext} from "react";
import {useModal} from "utils/modal";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {defaultStyles as iconStyles, FileIcon} from "react-file-icon";
import {experimentalStyled as styled} from "@mui/material/styles";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {errorHandler, route, useRequest} from "services/Http";
import {LoadingButton} from "@mui/lab";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {notify} from "utils/index";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TableContext from "contexts/TableContext";
import ModalContent from "components/ModalContent";
import ModalActions from "components/ModalActions";

const messages = defineMessages({
    approved: {defaultMessage: "Document was approved."},
    rejected: {defaultMessage: "Document was rejected."},
    verifyDocuments: {defaultMessage: "Verify Documents"}
});

const DocumentView = ({document}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const showDocument = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.verifyDocuments),
            content: <ViewCard document={document} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, document, intl]);

    return (
        <Fragment>
            <IconButton onClick={showDocument}>
                <VisibilityIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const ViewCard = ({closeModal, document}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();
    const {reload: reloadTable} = useContext(TableContext);
    const requirement = document.requirement;
    const data = document.data;

    const download = useCallback(() => {
        window.location.href = route(
            "admin.user.verification.download-document",
            {document: document.id}
        );
    }, [document]);

    const action = useCallback(
        (routeName, message) => {
            request
                .post(route(routeName, {document: document.id}))
                .then(() => {
                    notify.success(intl.formatMessage(message));
                    closeModal();
                    reloadTable();
                })
                .catch(errorHandler());
        },
        [reloadTable, closeModal, intl, request, document]
    );

    const approve = useCallback(() => {
        return action(
            "admin.user.verification.approve-document",
            messages.approved
        );
    }, [action]);

    const reject = useCallback(() => {
        return action(
            "admin.user.verification.reject-document",
            messages.rejected
        );
    }, [action]);

    return (
        <ContainerBox>
            <ModalContent direction="row" alignItems="flex-start" spacing={2}>
                <Box sx={{width: 30, flexShrink: 0}}>
                    <FileIcon
                        {...iconStyles[data?.extension]}
                        extension={data?.extension}
                    />
                </Box>

                <Stack sx={{minWidth: 0, flexGrow: 1}}>
                    <Typography variant="subtitle2" noWrap>
                        {requirement?.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" noWrap>
                        {requirement?.description}
                    </Typography>
                </Stack>

                <IconButton onClick={download}>
                    <CloudDownloadIcon fontSize="inherit" />
                </IconButton>
            </ModalContent>

            {document.status !== "rejected" && (
                <ModalActions spacing={2}>
                    {["pending", "approved"].includes(document.status) && (
                        <LoadingButton
                            variant="contained"
                            color="error"
                            onClick={reject}
                            startIcon={<CancelIcon />}
                            disabled={loading}>
                            <FormattedMessage defaultMessage="Reject" />
                        </LoadingButton>
                    )}

                    {["pending"].includes(document.status) && (
                        <LoadingButton
                            variant="contained"
                            onClick={approve}
                            startIcon={<CheckCircleIcon />}
                            disabled={loading}>
                            <FormattedMessage defaultMessage="Approve" />
                        </LoadingButton>
                    )}
                </ModalActions>
            )}
        </ContainerBox>
    );
};

const ContainerBox = styled(Box)({
    position: "relative"
});

export default DocumentView;
