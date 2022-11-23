import React, {memo, useCallback} from "react";
import WalletAccount from "models/WalletAccount";
import IconBuilder from "../IconBuilder";
import {useActiveWalletAccount, useWalletAccounts} from "hooks/account";
import {defineMessages, useIntl} from "react-intl";
import {setActiveAccount} from "redux/slices/wallet";
import {useDispatch} from "react-redux";
import {experimentalStyled as styled} from "@mui/material/styles";
import {MenuItem, TextField, Typography} from "@mui/material";

const messages = defineMessages({
    placeholder: {defaultMessage: "Select account"}
});

const SelectAccount = memo((props) => {
    const {data} = useWalletAccounts();
    const activeAccount = useActiveWalletAccount();
    const intl = useIntl();
    const dispatch = useDispatch();

    const updateAccount = useCallback(
        (e) => {
            dispatch(setActiveAccount(e.target.value));
        },
        [dispatch]
    );

    return (
        <TextField
            size="small"
            fullWidth
            value={activeAccount.id || ""}
            label={intl.formatMessage(messages.placeholder)}
            onChange={updateAccount}
            select
            {...props}>
            {data.map((record) => {
                const account = WalletAccount.use(record);
                const icon = account.wallet.coin.svgIcon();
                return (
                    <MenuItem value={account.id} key={account.id}>
                        <CoinStyle>
                            <IconBuilder sx={{fontSize: "25px"}} icon={icon} />

                            <Typography variant="body2" ml={1} noWrap>
                                {account.wallet.coin.name}
                            </Typography>
                        </CoinStyle>
                    </MenuItem>
                );
            })}
        </TextField>
    );
});

const CoinStyle = styled("div")({
    display: "flex",
    alignItems: "center",
    minWidth: 0
});

export default SelectAccount;
