import React, {createElement, Fragment, useCallback, useState} from "react";
import {LoadingButton} from "@mui/lab";
import {
    Button,
    CardActions,
    CardContent,
    Popover,
    Typography
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {styled} from "@mui/material/styles";

const PopConfirm = ({
    component = LoadingButton,
    onClick,
    content = <FormattedMessage defaultMessage="Are you sure?" />,
    confirmText = <FormattedMessage defaultMessage="Yes" />,
    cancelText = <FormattedMessage defaultMessage="No" />,
    ...otherProps
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const confirm = useCallback(() => {
        onClick?.();
        setAnchorEl(null);
    }, [onClick]);

    const handleClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);

    const cancel = useCallback(() => {
        setAnchorEl(null);
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
                <StyledCardContent>
                    <Typography variant="subtitle2">{content}</Typography>
                </StyledCardContent>

                <StyledCardActions>
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={confirm}>
                        {confirmText}
                    </Button>

                    <Button
                        color="inherit"
                        variant="outlined"
                        size="small"
                        onClick={cancel}>
                        {cancelText}
                    </Button>
                </StyledCardActions>
            </Popover>
        </Fragment>
    );
};

const StyledCardContent = styled(CardContent)(({theme}) => ({
    padding: theme.spacing(1, 2, 0.5)
}));

const StyledCardActions = styled(CardActions)(({theme}) => ({
    justifyContent: "flex-end",
    padding: theme.spacing(0.5, 2, 1)
}));

export default PopConfirm;
