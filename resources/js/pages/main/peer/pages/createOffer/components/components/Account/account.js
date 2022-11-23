import React from "react";
import SummaryItem from "../SummaryItem";
import {FormattedMessage} from "react-intl";
import {useActiveWalletAccount} from "hooks/account";

const Account = () => {
    const account = useActiveWalletAccount();

    if (account.isEmpty()) {
        return null;
    }

    return (
        <SummaryItem
            title={<FormattedMessage defaultMessage="Account" />}
            content={account.wallet.coin.name}
        />
    );
};

export default Account;
