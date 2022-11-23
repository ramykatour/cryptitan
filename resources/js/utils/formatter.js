import numeral from "numeral";
import {isString} from "lodash";
import {parseDate} from "utils/form";

export function formatData(number) {
    return numeral(number).format("0[.]0b");
}

export function formatPercent(number) {
    return numeral(number / 100).format("0[.]0%");
}

export function formatNumber(number) {
    return numeral(number).format("0[.]0a");
}

export function formatDollar(number) {
    return numeral(number).format("$0[.]0a");
}

export function formatDate(value, format = "LL") {
    return !isString(value) ? null : parseDate(value).format(format);
}

export function formatDateFromNow(value) {
    return !isString(value) ? null : parseDate(value).fromNow();
}
