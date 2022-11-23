import createStore from "redux/store";
import {initSettingsState} from "redux/slices/settings";
import {initAuthState} from "redux/slices/auth";

const store = createStore({
    settings: initSettingsState(),
    auth: initAuthState()
});

export default store;
