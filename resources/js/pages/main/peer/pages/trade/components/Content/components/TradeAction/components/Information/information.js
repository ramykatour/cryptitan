import React, {useContext} from "react";
import Collapsible from "../Collapsible";
import {FormattedMessage} from "react-intl";
import {styled} from "@mui/material/styles";
import walletIcon from "@iconify-icons/ri/wallet-3-fill";
import coinIcon from "@iconify-icons/ri/coin-fill";
import barChart from "@iconify-icons/ri/bar-chart-2-fill";
import {Stack, Typography} from "@mui/material";
import Iconify from "components/Iconify";
import PeerTradeContext from "contexts/PeerTradeContext";

const Information = () => {
    const {trade} = useContext(PeerTradeContext);

    return (
        <Collapsible
            title={<FormattedMessage defaultMessage="Information" />}
            content={
                <Stack spacing={1}>
                    <InformationItem
                        title={<FormattedMessage defaultMessage="Amount" />}
                        value={trade.formatted_amount}
                        icon={walletIcon}
                    />

                    <InformationItem
                        title={<FormattedMessage defaultMessage="Price" />}
                        value={trade.formatted_price}
                        icon={barChart}
                    />

                    <InformationItem
                        title={<FormattedMessage defaultMessage="Value" />}
                        value={`${trade.value} ${trade.coin.symbol}`}
                        icon={coinIcon}
                    />
                </Stack>
            }
        />
    );
};

const InformationItem = ({title, value, icon}) => {
    return (
        <Stack
            direction="row"
            sx={{px: 2.5, py: 0.5, minWidth: 0}}
            alignItems="center"
            spacing={2}>
            <IconWrapper>
                <Iconify icon={icon} width={28} height={28} />
            </IconWrapper>

            <Stack sx={{minWidth: 0}}>
                <Typography variant="body2" noWrap>
                    {title}
                </Typography>

                <Typography
                    variant="caption"
                    sx={{color: "text.secondary"}}
                    noWrap>
                    {value}
                </Typography>
            </Stack>
        </Stack>
    );
};

const IconWrapper = styled("div")(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[500_16],
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    height: 40,
    width: 40,
    flexShrink: 0
}));

export default Information;
