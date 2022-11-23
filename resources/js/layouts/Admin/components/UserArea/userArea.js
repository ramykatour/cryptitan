import React from "react";
import {Icon} from "@iconify/react";
import homeFill from "@iconify-icons/ri/layout-grid-fill";
import ActionButton from "components/ActionButton";
import {Link as RouterLink} from "react-router-dom";
import router from "router";

const UserArea = () => {
    return (
        <ActionButton
            component={RouterLink}
            to={router.generatePath("main.home")}>
            <Icon icon={homeFill} />
        </ActionButton>
    );
};

export default UserArea;
