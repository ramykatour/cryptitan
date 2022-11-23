import React, {useCallback} from "react";
import {Stack, Typography} from "@mui/material";
import Copyable from "components/Copyable";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import {notify} from "utils/index";

const messages = defineMessages({
    copied: {defaultMessage: "Copied to clipboard."}
});

const DescriptionTableCell = ({transaction}) => {
    const intl = useIntl();

    const handleCopy = useCallback(() => {
        notify.success(intl.formatMessage(messages.copied));
    }, [intl]);

    return (
        <Stack sx={{minWidth: 0}}>
            <Copyable variant="body2" ellipsis>
                {transaction.description}
            </Copyable>

            {transaction.hash && (
                <CopyToClipboard text={transaction.hash} onCopy={handleCopy}>
                    <Typography
                        variant="caption"
                        sx={{cursor: "pointer"}}
                        color="text.secondary">
                        <FormattedMessage defaultMessage="Copy Transaction Hash" />
                    </Typography>
                </CopyToClipboard>
            )}
        </Stack>
    );
};

export default DescriptionTableCell;
