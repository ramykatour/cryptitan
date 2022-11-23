import React, {useCallback} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import {notify} from "utils";
import {defineMessages, useIntl} from "react-intl";
import {defaultTo} from "lodash";
import {IconButton, Stack, Typography} from "@mui/material";
import PropTypes from "prop-types";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const messages = defineMessages({
    copied: {defaultMessage: "Copied to clipboard."}
});

const Copyable = ({
    onCopy,
    ellipsis,
    containerProps,
    buttonProps,
    children,
    text,
    ...otherProps
}) => {
    const intl = useIntl();

    const handleCopy = useCallback(
        (...args) => {
            notify.success(intl.formatMessage(messages.copied));
            onCopy?.(...args);
        },
        [onCopy, intl]
    );

    return (
        <Stack
            direction="row"
            alignItems="center"
            {...containerProps}
            sx={{minWidth: 0}}
            spacing={1}>
            <Typography noWrap={ellipsis} {...otherProps}>
                {children}
            </Typography>

            <CopyToClipboard
                text={defaultTo(text, children)}
                onCopy={handleCopy}>
                <IconButton size="small" {...buttonProps}>
                    <ContentCopyIcon fontSize="inherit" />
                </IconButton>
            </CopyToClipboard>
        </Stack>
    );
};

Copyable.propTypes = {text: PropTypes.string};

export default Copyable;
