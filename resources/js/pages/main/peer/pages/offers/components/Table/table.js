import React, {useMemo, useRef} from "react";
import PropTypes from "prop-types";
import {Card} from "@mui/material";
import AsyncTable from "components/AsyncTable";
import TrapScrollBox from "components/TrapScrollBox";
import {route} from "services/Http";
import OwnerTableCell from "components/TableCells/PeerOfferTable/OwnerTableCell";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import PriceTableCell from "components/TableCells/PeerOfferTable/PriceTableCell";
import LimitTableCell from "components/TableCells/PeerOfferTable/LimitTableCell";
import PaymentTableCell from "components/TableCells/PeerOfferTable/PaymentTableCell";
import {assign} from "lodash";
import CoinTableCell from "components/TableCells/CoinTableCell";
import ActionTableCell from "components/TableCells/PeerOfferTable/ActionTableCell";

const messages = defineMessages({
    price: {defaultMessage: "Price"},
    limit: {defaultMessage: "Limit"},
    payment: {defaultMessage: "Payment"}
});

const Table = ({type, filters}) => {
    const intl = useIntl();
    const tableRef = useRef();

    const columns = useMemo(
        () => [
            {
                field: "owner",
                minWidth: 200,
                flex: 1,
                renderHeader: () => {
                    if (type === "buy") {
                        return <FormattedMessage defaultMessage="Buyer" />;
                    } else {
                        return <FormattedMessage defaultMessage="Seller" />;
                    }
                },
                renderCell: ({value}) => <OwnerTableCell user={value} />
            },
            {
                field: "coin",
                width: 50,
                renderHeader: () => <span />,
                align: "center",
                renderCell: ({value}) => <CoinTableCell value={value} />
            },
            {
                field: "price",
                width: 150,
                headerName: intl.formatMessage(messages.price),
                renderCell: ({row: data}) => <PriceTableCell offer={data} />
            },
            {
                field: "limit",
                width: 130,
                headerName: intl.formatMessage(messages.limit),
                renderCell: ({row: data}) => <LimitTableCell offer={data} />
            },
            {
                field: "payment",
                minWidth: 130,
                flex: 1,
                headerName: intl.formatMessage(messages.payment),
                renderCell: ({row: data}) => <PaymentTableCell offer={data} />
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: data}) => <ActionTableCell offer={data} />
            }
        ],
        [type, intl]
    );

    const url = useMemo(() => {
        return route("peer-offer.paginate", assign({type}, filters));
    }, [type, filters]);

    return (
        <Card>
            <TrapScrollBox>
                <AsyncTable ref={tableRef} columns={columns} url={url} />
            </TrapScrollBox>
        </Card>
    );
};

Table.propTypes = {
    type: PropTypes.oneOf(["buy", "sell"]),
    filters: PropTypes.object
};

export default Table;
