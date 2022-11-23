import React, {createContext} from "react";
import PropTypes from "prop-types";

const initialState = {
    fetchUser: () => {}
};

const UserContext = createContext(initialState);

const UserProvider = ({user, fetchUser, children}) => {
    return (
        <UserContext.Provider value={{user, fetchUser}}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    user: PropTypes.object,
    fetchUser: PropTypes.func
};

export {UserProvider};
export default UserContext;
