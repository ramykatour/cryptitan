import React, {Fragment} from "react";
import Form from "components/Form";
import {FormattedMessage} from "react-intl";
import {round} from "lodash";
import {useActiveWalletAccount} from "hooks/account";
import SummaryTotal from "../SummaryTotal";
import {Divider} from "@mui/material";

const Price = () => {
    const account = useActiveWalletAccount();

    const getContent = (form) => {
        if (form.getFieldValue("price_type") === "percent") {
            const precision = account.wallet.coin.currency_precision;
            const percent = form.getFieldValue("percent_price");
            return round((percent * account.price) / 100, precision);
        } else {
            return form.getFieldValue("fixed_price");
        }
    };

    const getCurrency = (form) => {
        return form.getFieldValue("currency");
    };

    if (account.isEmpty()) {
        return null;
    }

    return (
        <Fragment>
            <Divider />

            <Form.Item shouldUpdate>
                {(form) => (
                    <SummaryTotal
                        title={
                            <FormattedMessage
                                defaultMessage="Price ({currency})"
                                values={{currency: getCurrency(form)}}
                            />
                        }
                        content={getContent(form)}
                    />
                )}
            </Form.Item>
        </Fragment>
    );
};

export default Price;
