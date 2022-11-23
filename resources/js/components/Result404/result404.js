import React from "react";
import Page from "components/Page";
import {m} from "framer-motion";
import {Link} from "react-router-dom";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Button, Container, Typography} from "@mui/material";
import {MotionContainer, varBounce} from "components/Animate";
import {PageNotFoundIllustration} from "assets/index";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import router from "router";

const messages = defineMessages({
    title: {defaultMessage: "Page Not Found"}
});

const Result404 = () => {
    const intl = useIntl();

    return (
        <StyledPage title={intl.formatMessage(messages.title)}>
            <Container component={MotionContainer}>
                <Content>
                    <m.div variants={varBounce().in}>
                        <Typography variant="h3" paragraph>
                            <FormattedMessage defaultMessage="Sorry, page not found!" />
                        </Typography>
                    </m.div>

                    <m.div variants={varBounce().in}>
                        <Typography sx={{color: "text.secondary"}}>
                            <FormattedMessage defaultMessage="Sorry, we could not find the page you’re looking for." />
                        </Typography>
                    </m.div>

                    <m.div variants={varBounce().in}>
                        <PageNotFoundIllustration
                            sx={{my: {xs: 5, sm: 10}, height: 250}}
                        />
                    </m.div>

                    <Button
                        variant="contained"
                        size="large"
                        to={router.generatePath("main.home")}
                        component={Link}>
                        <FormattedMessage defaultMessage="Go to Home" />
                    </Button>
                </Content>
            </Container>
        </StyledPage>
    );
};

const StyledPage = styled(Page)(({theme}) => ({
    display: "flex",
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
    minHeight: "100%",
    alignItems: "center"
}));

const Content = styled("div")({
    maxWidth: 480,
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center"
});

export default Result404;
