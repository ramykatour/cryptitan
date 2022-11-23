import React, {createElement, Fragment, useCallback, useState} from "react";
import {CardContent, IconButton, Popover} from "@mui/material";

const Popup = ({component = IconButton, onClick, content, ...otherProps}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const cancel = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);

    return (
        <Fragment>
            {createElement(component, {
                ...otherProps,
                onClick: handleClick
            })}

            <Popover
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={cancel}
                PaperProps={{sx: {maxWidth: 300}}}
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom"
                }}
                transformOrigin={{
                    horizontal: "center",
                    vertical: "center"
                }}>
                <CardContent>{content}</CardContent>
            </Popover>
        </Fragment>
    );
};

export default Popup;
