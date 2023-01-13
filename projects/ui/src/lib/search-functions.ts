import { ArdOption, SearchFn } from "./_internal/item-storages/item-storage.types";


export function searchInString(searchTerm: string, toSearch: any) {
    if (toSearch === undefined) return false;
    return String(toSearch).toLocaleLowerCase().indexOf(searchTerm) != -1;
}
export const searchFunctions: {
    byLabel: SearchFn,
    byValue: SearchFn,
    byGroup: SearchFn,
    byLabelAndGroup: SearchFn,
    byLabelAndValue: SearchFn,
    byLabelAndGroupAndValue: SearchFn,
} = {
    /**
     * Determines if the item should appear in the search results, based on the label only.
     * @param searchTerm The term to search by.
     * @param item The `ArdOption` item to search in.
     * @returns `true` if the item matches the search term, otherwise `false`.
     */
    byLabel: (searchTerm: string, item: ArdOption) => {
        return searchInString(searchTerm, item.label);
    },
    /**
     * Determines if the item should appear in the search results, based on the value only.
     * @param searchTerm The term to search by.
     * @param item The `ArdOption` item to search in.
     * @returns `true` if the item matches the search term, otherwise `false`.
     */
    byValue: (searchTerm: string, item: ArdOption) => {
        return searchInString(searchTerm, item.value);
    },
    /**
     * Determines if the item should appear in the search results, based on the group only.
     * @param searchTerm The term to search by.
     * @param item The `ArdOption` item to search in.
     * @returns `true` if the item matches the search term, otherwise `false`.
     */
    byGroup: (searchTerm: string, item: ArdOption) => {
        return searchInString(searchTerm, item.group);
    },
    /**
     * Determines if the item should appear in the search results, based on the label and group.
     * @param searchTerm The term to search by.
     * @param item The `ArdOption` item to search in.
     * @returns `true` if the item matches the search term, otherwise `false`.
     */
    byLabelAndGroup: (searchTerm: string, item: ArdOption) => {
        return (
            searchFunctions.byLabel(searchTerm, item) ||
            (
                item.label !== item.value &&
                searchFunctions.byValue(searchTerm, item)
            )
        );
    },
    /**
     * Determines if the item should appear in the search results, based on the label and value.
     * @param searchTerm The term to search by.
     * @param item The `ArdOption` item to search in.
     * @returns `true` if the item matches the search term, otherwise `false`.
     */
    byLabelAndValue: (searchTerm: string, item: ArdOption) => {
        return (
            searchFunctions.byLabel(searchTerm, item) ||
            searchFunctions.byValue(searchTerm, item)
        );
    },
    /**
     * Determines if the item should appear in the search results, based on the label, group, and value.
     * @param searchTerm The term to search by.
     * @param item The `ArdOption` item to search in.
     * @returns `true` if the item matches the search term, otherwise `false`.
     */
    byLabelAndGroupAndValue: (searchTerm: string, item: ArdOption) => {
        return (
            searchFunctions.byLabel(searchTerm, item) ||
            (
                item.label !== item.value &&
                searchFunctions.byValue(searchTerm, item)
            ) ||
            searchFunctions.byGroup(searchTerm, item)
        );
    },
}