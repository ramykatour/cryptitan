import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {errorHandler, route, useRequest} from "services/Http";
import PeerOffer from "models/PeerOffer";
import Spin from "components/Spin";
import {isEmpty} from "lodash";
import Result404 from "components/Result404";
import {PeerOfferProvider} from "contexts/PeerOfferContext";
import Content from "./components/Content";

const Offer = () => {
    const {id} = useParams();
    const [request, loading] = useRequest();
    const [offer, setOffer] = useState();

    const fetchOffer = useCallback(() => {
        request
            .get(route("peer-offer.get", {offer: id}))
            .then((data) => setOffer(PeerOffer.use(data)))
            .catch(errorHandler());
    }, [request, id]);

    useEffect(() => {
        fetchOffer();
    }, [fetchOffer]);

    return (
        <Spin spinning={loading} size={70}>
            {!isEmpty(offer) ? (
                <PeerOfferProvider offer={offer} fetchOffer={fetchOffer}>
                    <Content />
                </PeerOfferProvider>
            ) : (
                !loading && <Result404 />
            )}
        </Spin>
    );
};

export default Offer;
