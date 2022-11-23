import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {errorHandler, route, useRequest} from "services/Http";
import PeerTrade from "models/PeerTrade";
import {isEmpty} from "lodash";
import Result404 from "components/Result404";
import Spin from "components/Spin";
import {PeerTradeProvider} from "contexts/PeerTradeContext";
import Content from "./components/Content";

const Trade = () => {
    const {id} = useParams();
    const [request, loading] = useRequest();
    const [trade, setTrade] = useState();

    const fetchTrade = useCallback(() => {
        request
            .get(route("peer-trade.get", {trade: id}))
            .then((data) => setTrade(PeerTrade.use(data)))
            .catch(errorHandler());
    }, [request, id]);

    useEffect(() => {
        fetchTrade();
    }, [fetchTrade]);

    return (
        <Spin spinning={loading} size={70}>
            {!isEmpty(trade) ? (
                <PeerTradeProvider trade={trade} fetchTrade={fetchTrade}>
                    <Content />
                </PeerTradeProvider>
            ) : (
                !loading && <Result404 />
            )}
        </Spin>
    );
};

export default Trade;
