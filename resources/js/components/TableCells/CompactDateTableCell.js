import React from "react";
import {parseDate} from "utils/form";
import {Typography} from "@mui/material";
import {dayjs} from "utils/index";
import {experimentalStyled as styled} from "@mui/material/styles";

const CompactDateTableCell = ({value}) => {
    const date = parseDate(value);

    return (
        <TxDate>
            <Typography
                variant="body2"
                sx={{
                    lineHeight: 1.1,
                    color: "text.secondary",
                    fontWeight: "normal"
                }}>
                {date.format("MMM")}
            </Typography>

            <Typography
                variant="h4"
                sx={{
                    fontWeight: "normal",
                    lineHeight: 1.2
                }}>
                {date.format("DD")}
            </Typography>

            {date.isBefore(dayjs().startOf("year")) && (
                <Typography
                    variant="caption"
                    sx={{
                        color: "text.secondary",
                        fontWeight: "normal",
                        lineHeight: 1.1
                    }}>
                    {date.format("YYYY")}
                </Typography>
            )}
        </TxDate>
    );
};

const TxDate = styled("div")({
    margin: "0 2px",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    textAlign: "center"
});

export default CompactDateTableCell;
