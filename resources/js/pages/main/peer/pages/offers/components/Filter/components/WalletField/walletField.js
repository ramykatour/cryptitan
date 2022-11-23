import React from "react";
import {defineMessages, useIntl} from "react-intl";
import {useWalletAccounts} from "hooks/account";
import Form, {TextField} from "components/Form";
import WalletAccount from "models/WalletAccount";
import {Box, MenuItem} from "@mui/material";
import IconBuilder from "components/IconBuilder";
import {experimentalStyled as styled} from "@mui/material/styles";

const messages = defineMessages({
    wallet: {defaultMessage: "Wallet"}
});

const WalletField = () => {
    const intl = useIntl();
    const {data} = useWalletAccounts();

    return (
        <Form.Item name="wallet" label={intl.formatMessage(messages.wallet)}>
            <TextField fullWidth select>
                {data.map((record) => {
                    const account = WalletAccount.use(record);
                    const icon = account.wallet.coin.svgIcon();

                    return (
                        <MenuItem
                            value={account.wallet.id}
                            key={account.wallet.id}>
                            <CoinStyle>
                                <IconBuilder
                                    sx={{fontSize: "25px"}}
                                    icon={icon}
                                />

                                <Box component="span" sx={{ml: 1}}>
                                    {account.wallet.coin.name}
                                </Box>
                            </CoinStyle>
                        </MenuItem>
                    );
                })}
            </TextField>
        </Form.Item>
    );
};

const CoinStyle = styled("div")({
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    flexBasis: 0
});

export default WalletField;
