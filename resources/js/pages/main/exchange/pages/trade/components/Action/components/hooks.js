import {useActiveWalletAccount} from "hooks/account";
import {useCallback, useEffect, useMemo} from "react";
import Value from "utils/classes/Value";
import {useChangeDetect} from "models/Model";
import {fetchWalletAccounts, setActiveAccount} from "redux/slices/wallet";
import {useDispatch} from "react-redux";
import {errorHandler, route} from "services/Http";
import {defineMessages, useIntl} from "react-intl";
import {notify} from "utils/index";
import {fetchPaymentAccount} from "redux/slices/payment";

const messages = defineMessages({
    success: {defaultMessage: "Order created successfully."}
});

export function useInitialAmount(scale = "unit") {
    const account = useActiveWalletAccount();

    return useMemo(() => {
        if (account.isNotEmpty()) {
            return new Value(
                0,
                scale,
                account.price,
                account.wallet.coin.precision,
                account.wallet.coin.currency_precision
            );
        }
    }, [account, scale]);
}

export function useAccountEffect(form) {
    const account = useActiveWalletAccount();
    const changed = useChangeDetect(account);

    useEffect(() => {
        if (account.get("id") && changed) {
            form.resetFields();
            form.setFieldsValue({account: account.get("id")});
        }
    }, [account, form, changed]);

    useEffect(() => {
        if (account.get("id") && !changed) {
            const amount = form.getFieldValue("amount");
            const updated = amount.setUnitPrice(account.price);
            form.setFieldsValue({amount: updated});
        }
    }, [account, form, changed]);
}

export function useValuesChangeHandler(setSummary) {
    const dispatch = useDispatch();

    return useCallback(
        (values) => {
            if (values.amount) {
                setSummary({});
            }
            if (values.account) {
                dispatch(setActiveAccount(values.account));
            }
        },
        [dispatch, setSummary]
    );
}

export function useSummaryRequest(name, form, formRequest, setSummary) {
    const account = useActiveWalletAccount();
    const dispatch = useDispatch();

    return useCallback(() => {
        if (!account.isEmpty()) {
            form.validateFields(["amount"])
                .then((values) => {
                    formRequest
                        .post(route(name), {
                            amount: Number(values.amount),
                            account: account.id
                        })
                        .then((data) => {
                            dispatch(fetchWalletAccounts());
                            setSummary(data);
                        })
                        .catch(errorHandler());
                })
                .catch(() => null);
        }
    }, [name, form, formRequest, setSummary, account, dispatch]);
}

export function useSubmitRequest(name, form, formRequest, setSummary) {
    const intl = useIntl();
    const dispatch = useDispatch();

    return useCallback(
        (values) => {
            values.amount = Number(values.amount);

            formRequest
                .post(route(name), values)
                .then(() => {
                    notify.success(intl.formatMessage(messages.success));
                    form.resetFields(["amount"]);
                    dispatch(fetchWalletAccounts());
                    dispatch(fetchPaymentAccount());
                    setSummary({});
                })
                .catch(errorHandler());
        },
        [name, form, formRequest, intl, setSummary, dispatch]
    );
}
