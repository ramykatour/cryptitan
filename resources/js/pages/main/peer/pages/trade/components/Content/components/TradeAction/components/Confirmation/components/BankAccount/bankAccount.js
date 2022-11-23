import React, {useContext} from "react";
import PeerTradeContext from "contexts/PeerTradeContext";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import BankLogo from "components/BankLogo";
import Popup from "components/Popup";
import HelpIcon from "@mui/icons-material/Help";

const BankAccount = () => {
    const {trade} = useContext(PeerTradeContext);
    const bankAccount = trade.bank_account;

    return (
        <Stack direction="row" sx={{px: 2.5, py: 0.5}} spacing={2}>
            <BankLogo src={bankAccount.bank_logo} />

            <Box sx={{my: 1, maxWidth: 150}}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2" noWrap>
                        {bankAccount.bank_name}
                    </Typography>

                    {bankAccount.note && (
                        <Popup
                            component={IconButton}
                            content={bankAccount.note}
                            size="small">
                            <HelpIcon fontSize="inherit" />
                        </Popup>
                    )}
                </Stack>

                <Typography variant="body2" color="text.secondary" noWrap>
                    {bankAccount.number}
                </Typography>

                <Typography variant="body2" color="text.secondary" noWrap>
                    {bankAccount.beneficiary}
                </Typography>
            </Box>
        </Stack>
    );
};

export default BankAccount;
