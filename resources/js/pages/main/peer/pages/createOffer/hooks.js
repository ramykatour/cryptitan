import {useCallback, useEffect} from "react";
import {useActiveWalletAccount} from "hooks/account";
import {useChangeDetect} from "models/Model";
import {setActiveAccount} from "redux/slices/wallet";
import {useDispatch} from "react-redux";

export function useAccountEffect(form) {
    const account = useActiveWalletAccount();
    const changed = useChangeDetect(account);

    useEffect(() => {
        if (account.isNotEmpty() && changed) {
            form.setFieldsValue({fixed_price: account.price});
            form.setFieldsValue({account: account.id});
        }
    }, [account, form, changed]);
}

export function useValuesChangeHandler() {
    const dispatch = useDispatch();

    return useCallback(
        (values) => {
            if (values.account) {
                dispatch(setActiveAccount(values.account));
            }
        },
        [dispatch]
    );
}
