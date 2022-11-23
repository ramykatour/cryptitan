import React, {useContext, useMemo} from "react";
import PeerOfferContext from "contexts/PeerOfferContext";
import {Alert, Button, Stack} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useVerification} from "hooks/user";
import {Link as RouterLink} from "react-router-dom";
import router from "router/router";
import {useAuth} from "models/Auth";
import {isEmpty} from "lodash";
import ProfileLink from "components/ProfileLink";

const StatusAlert = () => {
    const auth = useAuth();
    const {offer} = useContext(PeerOfferContext);

    if (offer.tradable) {
        return null;
    }

    if (!offer.isAvailable()) {
        return (
            <Alert severity="warning">
                <FormattedMessage defaultMessage="This is currently unavailable." />
            </Alert>
        );
    }

    if (offer.owner.id === auth.user.id) {
        return (
            <Alert severity="success">
                <FormattedMessage defaultMessage="This is one of your offers." />
            </Alert>
        );
    }

    if (!offer.owner.active) {
        return (
            <Alert severity="error">
                <FormattedMessage defaultMessage="This trader has been suspended." />
            </Alert>
        );
    }

    return (
        <Stack spacing={1}>
            <LongTerm />
            <Verification />
            <Following />
        </Stack>
    );
};

const Verification = () => {
    const {level} = useVerification();
    const {offer} = useContext(PeerOfferContext);

    const incomplete = useMemo(() => {
        return offer.require_verification && level !== "advanced";
    }, [offer, level]);

    const action = (
        <Button
            component={RouterLink}
            to={router.generatePath("main.user.account")}
            state={{tab: "verification"}}
            variant="outlined"
            size="small"
            color="inherit">
            <FormattedMessage defaultMessage="Verify Now" />
        </Button>
    );

    return (
        incomplete && (
            <Alert severity="warning" action={action}>
                <FormattedMessage defaultMessage="Requires a complete verification." />
            </Alert>
        )
    );
};

const LongTerm = () => {
    const auth = useAuth();
    const {offer} = useContext(PeerOfferContext);

    const incomplete = useMemo(() => {
        return offer.require_long_term && !auth.user.long_term;
    }, [offer, auth]);

    return (
        incomplete && (
            <Alert severity="warning">
                <FormattedMessage defaultMessage="This is unavailable to newly created account." />
            </Alert>
        )
    );
};

const Following = () => {
    const {offer} = useContext(PeerOfferContext);

    const incomplete = useMemo(() => {
        return offer.require_following && isEmpty(offer.owner.following);
    }, [offer]);

    const action = (
        <ProfileLink user={offer.owner} sx={{color: "inherit"}}>
            <Button variant="outlined" size="small" color="inherit">
                <FormattedMessage defaultMessage="Profile" />
            </Button>
        </ProfileLink>
    );

    return (
        incomplete && (
            <Alert severity="warning" action={action}>
                <FormattedMessage
                    defaultMessage="You must be one of {user}'s followers"
                    values={{user: <b>{offer.owner.name}</b>}}
                />
            </Alert>
        )
    );
};

export default StatusAlert;
