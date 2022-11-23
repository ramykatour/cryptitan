import React from "react";
import {Card} from "@mui/material";
import UserCard from "./components/UserCard";
import Reviews from "./components/Reviews";
import MinAmount from "./components/MinAmount";
import MaxAmount from "./components/MaxAmount";
import TimeLimit from "./components/TimeLimit";
import OfferRate from "./components/OfferRate";
import Payment from "./components/Payment";

const Details = () => {
    return (
        <Card>
            <UserCard />
            <Reviews inverse />
            <OfferRate />
            <MaxAmount inverse />
            <MinAmount />
            <Payment inverse />
            <TimeLimit />
        </Card>
    );
};

export default Details;
