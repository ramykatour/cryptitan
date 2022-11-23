import {useCallback, useContext, useEffect, useState} from "react";
import {errorHandler, route, useRequest} from "services/Http";
import PeerTradeContext from "contexts/PeerTradeContext";

export function useChatParticipants() {
    const [request, loading] = useRequest();
    const [participants, setParticipants] = useState([]);
    const {trade} = useContext(PeerTradeContext);

    const fetchParticipants = useCallback(() => {
        request
            .get(route("peer-trade.get-participants", {trade: trade.id}))
            .then((data) => setParticipants(data))
            .catch(errorHandler());
    }, [request, trade]);

    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    return {
        participants,
        loadingParticipants: loading,
        fetchParticipants
    };
}
