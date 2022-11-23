import React, {useCallback, useEffect, useState} from "react";
import {errorHandler, route, useRequest} from "services/Http";
import UploadFile from "components/UploadFile";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Stack,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {defineMessages, useIntl} from "react-intl";
import Spin from "components/Spin";

const messages = defineMessages({
    required: {defaultMessage: "Required"},
    pending: {defaultMessage: "Pending"},
    approved: {defaultMessage: "Approved"},
    rejected: {defaultMessage: "Rejected"},
    data: {defaultMessage: "Data"}
});

const UploadDocument = ({expanded, expandedHandler, onChange}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [data, setData] = useState([]);

    const fetchData = useCallback(() => {
        request
            .get(route("user.verification.get-documents"))
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getStatusChip = useCallback(
        (status) => {
            switch (status) {
                case "approved":
                    return (
                        <Chip
                            size="small"
                            label={intl.formatMessage(messages.approved)}
                            color="primary"
                        />
                    );
                case "pending":
                    return (
                        <Chip
                            size="small"
                            label={intl.formatMessage(messages.pending)}
                            color="info"
                        />
                    );
                case "rejected":
                    return (
                        <Chip
                            size="small"
                            label={intl.formatMessage(messages.rejected)}
                            color="error"
                        />
                    );
                default:
                    return (
                        <Chip
                            label={intl.formatMessage(messages.required)}
                            size="small"
                        />
                    );
            }
        },
        [intl]
    );

    const onUpload = useCallback(() => {
        onChange?.();
        fetchData();
    }, [onChange, fetchData]);

    const action = route("user.verification.upload-document");

    const isDisabled = useCallback((status) => {
        return ["pending", "approved"].includes(status);
    }, []);

    return data.map((record, key) => {
        key = `document_${key}`;
        const disabled = isDisabled(record.document?.status);
        return (
            <Spin spinning={loading} key={key}>
                <Accordion
                    onChange={expandedHandler(key)}
                    expanded={!disabled && expanded === key}
                    disabled={disabled}
                    className="no-border">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" spacing={3}>
                            {getStatusChip(record.document?.status)}
                            <span>{record.requirement.name}</span>
                        </Stack>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Stack spacing={2}>
                            <Typography
                                variant="body2"
                                sx={{color: "text.secondary"}}>
                                {record.requirement.description}
                            </Typography>

                            <UploadFile
                                action={action}
                                data={{requirement: record.requirement.id}}
                                name="data"
                                onSuccess={onUpload}
                                maxSize={5120}
                            />
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Spin>
        );
    });
};

export default UploadDocument;
