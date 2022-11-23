import React, {Fragment, useCallback, useRef, useState} from "react";
import {MenuItem, Typography} from "@mui/material";
import useLocales from "hooks/useLocales";
import MenuPopover from "components/MenuPopover";
import ActionButton from "components/ActionButton";
import {values} from "lodash";
import FlagIcon from "components/FlagIcon";

const Language = () => {
    const anchorRef = useRef(null);
    const {locales, current, setLocale} = useLocales();
    const [open, setOpen] = useState(false);

    const changeLocale = useCallback(
        (value) => {
            setLocale(value);
            setOpen(false);
        },
        [setLocale]
    );

    return (
        <Fragment>
            <ActionButton
                ref={anchorRef}
                onClick={() => setOpen(true)}
                sx={{p: 1, width: 40, height: 40}}
                active={open}>
                <FlagIcon code={current?.region} />
            </ActionButton>

            <MenuPopover
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={anchorRef.current}
                sx={{py: 1}}>
                {values(locales).map((option) => (
                    <MenuItem
                        key={option.locale}
                        selected={option.locale === current?.locale}
                        onClick={() => changeLocale(option.locale)}
                        sx={{py: 1, px: 2}}>
                        <FlagIcon
                            sx={{mr: 2, flexShrink: 0}}
                            code={option.region}
                        />

                        <Typography variant="body2" noWrap>
                            {option.native}
                        </Typography>
                    </MenuItem>
                ))}
            </MenuPopover>
        </Fragment>
    );
};

export default Language;
