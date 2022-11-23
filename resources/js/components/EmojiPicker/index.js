import loadable from "@loadable/component";
import {CircularProgress, Stack} from "@mui/material";
import React from "react";

const componentImport = () =>
    import(/* webpackChunkName: 'emojiPicker' */ "./emojiPicker");

const Component = loadable(componentImport, {
    fallback: (
        <Stack direction="column" justifyContent="center" alignItems="center">
            <CircularProgress size="1em" />
        </Stack>
    )
});

export default (props) => {
    return <Component {...props} />;
};
