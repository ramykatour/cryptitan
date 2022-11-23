import {createContext} from "react";

const value = window?.__APP__ ?? {};
const AppContext = createContext(value);

export {AppContext};
export default value;
