import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {errorHandler, route, useRequest} from "services/Http";
import {isEmpty} from "lodash";
import Result404 from "components/Result404";
import Spin from "components/Spin";
import {UserProvider} from "contexts/UserContext";
import Content from "./components/Content";
import User from "models/User";

const Profile = () => {
    const {name} = useParams();
    const [request, loading] = useRequest();
    const [user, setUser] = useState();

    const fetchUser = useCallback(() => {
        request
            .get(route("user.profile.get", {user: name}))
            .then((data) => setUser(User.use(data)))
            .catch(errorHandler());
    }, [request, name]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <Spin spinning={loading} size={70}>
            {!isEmpty(user) ? (
                <UserProvider user={user} fetchUser={fetchUser}>
                    <Content />
                </UserProvider>
            ) : (
                !loading && <Result404 />
            )}
        </Spin>
    );
};

export default Profile;
