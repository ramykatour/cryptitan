import React from "react";
import {Stack, Typography} from "@mui/material";

const CurrencyCell = ({currency, currencyName, country, countryName}) => {
    return (
        currency && (
            <Stack sx={{minWidth: 0}}>
                <Typography variant="body2" noWrap>
                    {`${currencyName} (${currency})`}
                </Typography>

                {country && (
                    <Typography
                        variant="caption"
                        sx={{color: "text.secondary"}}
                        noWrap>
                        {`${countryName} (${country})`}
                    </Typography>
                )}
            </Stack>
        )
    );
};

export default CurrencyCell;
