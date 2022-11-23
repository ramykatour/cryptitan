import React, {createContext} from "react";
import PropTypes from "prop-types";

const LoadingContext = createContext(false);

const LoadingProvider = ({loading, children}) => {
    return (
        <LoadingContext.Provider value={loading}>
            {children}
        </LoadingContext.Provider>
    );
};

LoadingProvider.propTypes = {
    loading: PropTypes.bool
};

export {LoadingProvider};
export default LoadingContext;
