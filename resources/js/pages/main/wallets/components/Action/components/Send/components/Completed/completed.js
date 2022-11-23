import React from "react";
import {FormattedMessage} from "react-intl";
import {experimentalStyled as styled} from "@mui/material/styles";
import Result from "components/Result";
import {Button} from "@mui/material";
import {SuccessIllustration} from "assets/index";

const Completed = ({lastSent, onReset}) => {
    if (!lastSent) {
        return null;
    }

    return (
        <Container>
            <Result
                icon={SuccessIllustration}
                title={<FormattedMessage defaultMessage="Sent" />}
                description={`${lastSent.value} ${lastSent.coin.symbol}`}
                extra={<ResetButton onReset={onReset} />}
                sx={{py: 4}}
                iconSize={130}
            />
        </Container>
    );
};

const ResetButton = ({onReset}) => {
    return (
        <Button onClick={onReset} variant="contained">
            <FormattedMessage defaultMessage="Continue" />
        </Button>
    );
};

const Container = styled("div")(({theme}) => ({
    position: "absolute",
    background: theme.palette.background.paper,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 10
}));

export default Completed;
