import React from "react";
import WalletAccount from "models/WalletAccount";
import {Box, MenuItem} from "@mui/material";
import IconBuilder from "components/IconBuilder";
import {TextField} from "components/Form";
import {useWalletAccounts} from "hooks/account";
import {experimentalStyled as styled} from "@mui/material/styles";

const AccountSelect = (props) => {
    const {data} = useWalletAccounts();

    return (
        <TextField fullWidth select {...props}>
            {data.map((record) => {
                const account = WalletAccount.use(record);
                const icon = account.wallet.coin.svgIcon();

                return (
                    <MenuItem value={account.id} key={account.id}>
                        <CoinStyle>
                            <IconBuilder sx={{fontSize: "25px"}} icon={icon} />
                            <Box component="span" sx={{marginLeft: "10px"}}>
                                {account.wallet.coin.name}
                            </Box>
                        </CoinStyle>
                    </MenuItem>
                );
            })}
        </TextField>
    );
};

const CoinStyle = styled("div")({
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    flexBasis: 0
});

export default AccountSelect;
