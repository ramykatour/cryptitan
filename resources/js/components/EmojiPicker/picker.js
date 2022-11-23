import React, {useCallback, useMemo} from "react";
import "emoji-mart/css/emoji-mart.css";
import data from "emoji-mart/data/apple.json";
import {NimblePicker} from "emoji-mart";
import {styled, useTheme} from "@mui/material/styles";
import {isUndefined} from "lodash";
import {defineMessages, useIntl} from "react-intl";
import {Box} from "@mui/material";
import cssStyle from "utils/cssStyle";

const messages = defineMessages({
    search: {defaultMessage: "Search"},
    clear: {defaultMessage: "Clear"},
    notfound: {defaultMessage: "No Emoji Found"},
    skintext: {defaultMessage: "Choose your default skin tone"},
    categorySearch: {defaultMessage: "Search Results"},
    categoryRecent: {defaultMessage: "Frequently Used"},
    categorySmiley: {defaultMessage: "Smileys & Emotion"},
    categoryPeople: {defaultMessage: "People & Body"},
    categoryNature: {defaultMessage: "Animals & Nature"},
    categoryFoods: {defaultMessage: "Food & Drink"},
    categoryActivity: {defaultMessage: "Activity"},
    categoryPlaces: {defaultMessage: "Travel & Places"},
    categoryObjects: {defaultMessage: "Objects"},
    categorySymbols: {defaultMessage: "Symbols"},
    categoryFlags: {defaultMessage: "Flags"},
    categoryCustom: {defaultMessage: "Custom"},
    categoryLabel: {defaultMessage: "Emoji categories"},
    skintone1: {defaultMessage: "Default Skin Tone"},
    skintone2: {defaultMessage: "Light Skin Tone"},
    skintone3: {defaultMessage: "Medium-Light Skin Tone"},
    skintone4: {defaultMessage: "Medium Skin Tone"},
    skintone5: {defaultMessage: "Medium-Dark Skin Tone"},
    skintone6: {defaultMessage: "Dark Skin Tone"}
});

const Picker = ({value, onChange, ...otherProps}) => {
    const theme = useTheme();
    const intl = useIntl();

    const content = useMemo(() => {
        return isUndefined(value) ? "" : value;
    }, [value]);

    const update = useCallback(
        (e) => {
            return onChange?.(content + e?.native);
        },
        [onChange, content]
    );

    const i18n = useMemo(
        () => ({
            search: intl.formatMessage(messages.search),
            clear: intl.formatMessage(messages.clear),
            notfound: intl.formatMessage(messages.notfound),
            skintext: intl.formatMessage(messages.skintext),
            categories: {
                search: intl.formatMessage(messages.categorySearch),
                recent: intl.formatMessage(messages.categoryRecent),
                smileys: intl.formatMessage(messages.categorySmiley),
                people: intl.formatMessage(messages.categoryPeople),
                nature: intl.formatMessage(messages.categoryNature),
                foods: intl.formatMessage(messages.categoryFoods),
                activity: intl.formatMessage(messages.categoryActivity),
                places: intl.formatMessage(messages.categoryPlaces),
                objects: intl.formatMessage(messages.categoryObjects),
                symbols: intl.formatMessage(messages.categorySymbols),
                flags: intl.formatMessage(messages.categoryFlags),
                custom: intl.formatMessage(messages.categoryCustom)
            },
            categorieslabel: intl.formatMessage(messages.categoryLabel),
            skintones: {
                1: intl.formatMessage(messages.skintone1),
                2: intl.formatMessage(messages.skintone2),
                3: intl.formatMessage(messages.skintone3),
                4: intl.formatMessage(messages.skintone4),
                5: intl.formatMessage(messages.skintone5),
                6: intl.formatMessage(messages.skintone6)
            }
        }),
        [intl]
    );

    return (
        <PickerContainer>
            <NimblePicker
                {...otherProps}
                showSkinTones={false}
                showPreview={false}
                color={theme.palette.primary.main}
                sheetSize={20}
                onSelect={update}
                i18n={i18n}
                set="apple"
                data={data}
            />
        </PickerContainer>
    );
};

const PickerContainer = styled(Box)(({theme}) => ({
    "& .emoji-mart": {
        border: "none",
        backgroundColor: theme.palette.background.paper
    },
    "& .emoji-mart-anchor": {
        color: theme.palette.text.disabled,
        "&:hover, &:focus, &.emoji-mart-anchor-selected": {
            color: theme.palette.text.primary
        }
    },
    "& .emoji-mart-bar": {
        borderColor: theme.palette.divider
    },
    "& .emoji-mart-search input": {
        backgroundColor: "transparent",
        borderColor: theme.palette.grey[500_32],
        color: theme.palette.text.primary,
        "&::placeholder": {
            ...theme.typography.body2,
            color: theme.palette.text.disabled
        }
    },
    "& .emoji-mart-search-icon svg": {
        opacity: 1,
        fill: theme.palette.text.disabled
    },
    "& .emoji-mart-category-label span": {
        ...theme.typography.subtitle2,
        ...cssStyle(theme).bgBlur({color: theme.palette.background.paper}),
        color: theme.palette.text.primary
    },
    "& .emoji-mart-title-label": {
        color: theme.palette.text.primary
    },
    "& .emoji-mart-category .emoji-mart-emoji:hover:before": {
        backgroundColor: theme.palette.action.selected
    },
    "& .emoji-mart-emoji": {outline: "none"},
    "& .emoji-mart-preview-name": {
        color: theme.palette.text.primary
    },
    "& .emoji-mart-preview-shortname, .emoji-mart-preview-emoticon": {
        color: theme.palette.text.secondary
    }
}));

export default Picker;
