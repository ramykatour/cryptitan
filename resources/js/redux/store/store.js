import rootReducer from "./rootReducer";
import {configureStore} from "@reduxjs/toolkit";

export default function createStore(initialState) {
    const store = configureStore({
        reducer: rootReducer,
        devTools: process.env.NODE_ENV !== "production",
        preloadedState: initialState
    });

    if (module.hot) {
        module.hot.accept("./rootReducer", () => {
            store.replaceReducer(rootReducer);
        });
    }

    return store;
}
