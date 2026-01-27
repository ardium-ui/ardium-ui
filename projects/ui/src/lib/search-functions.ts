import { ArdOption, SearchFn } from './types/item-storage.types';

export function searchInString(searchTerm: string, toSearch: string) {
  if (toSearch === undefined) return false;
  return toSearch.indexOf(searchTerm) !== -1;
}
export const searchFunctions: {
  byLabel: SearchFn;
  byValue: SearchFn;
  byGroup: SearchFn;
  byLabelAndGroup: SearchFn;
  byLabelAndValue: SearchFn;
  byLabelAndGroupAndValue: SearchFn;
} = {
  /**
   * Determines if the item should appear in the search results, based on the label only.
   * @param searchTerm The term to search by.
   * @param item The `ArdOption` item to search in.
   * @returns `true` if the item matches the search term, otherwise `false`.
   */
  byLabel: (searchTerm: string, item: ArdOption) => {
    const lowerLabel = item.label.toLocaleLowerCase();
    const isExact = searchTerm === lowerLabel;
    return [isExact || searchInString(searchTerm, lowerLabel), isExact];
  },
  /**
   * Determines if the item should appear in the search results, based on the value only.
   * @param searchTerm The term to search by.
   * @param item The `ArdOption` item to search in.
   * @returns `true` if the item matches the search term, otherwise `false`.
   */
  byValue: (searchTerm: string, item: ArdOption) => {
    const lowerValue = String(item.value).toLocaleLowerCase();
    const isExact = searchTerm === lowerValue;
    return [isExact || searchInString(searchTerm, lowerValue), isExact];
  },
  /**
   * Determines if the item should appear in the search results, based on the group only.
   * @param searchTerm The term to search by.
   * @param item The `ArdOption` item to search in.
   * @returns `true` if the item matches the search term, otherwise `false`.
   */
  byGroup: (searchTerm: string, item: ArdOption) => {
    const lowerGroup = String(item.group).toLocaleLowerCase();
    const isExact = searchTerm === lowerGroup;
    return [isExact || searchInString(searchTerm, lowerGroup), isExact];
  },
  /**
   * Determines if the item should appear in the search results, based on the label and group.
   * @param searchTerm The term to search by.
   * @param item The `ArdOption` item to search in.
   * @returns `true` if the item matches the search term, otherwise `false`.
   */
  byLabelAndGroup: (searchTerm: string, item: ArdOption) => {
    const labelMatch = searchFunctions.byLabel(searchTerm, item);
    const matchData = labelMatch[0] ? ([true, labelMatch[1]] as [boolean, boolean]) : searchFunctions.byGroup(searchTerm, item);
    return matchData;
  },
  /**
   * Determines if the item should appear in the search results, based on the label and value.
   * @param searchTerm The term to search by.
   * @param item The `ArdOption` item to search in.
   * @returns `true` if the item matches the search term, otherwise `false`.
   */
  byLabelAndValue: (searchTerm: string, item: ArdOption) => {
    const labelMatch = searchFunctions.byLabel(searchTerm, item);
    const matchData = labelMatch[0] ? ([true, labelMatch[1]] as [boolean, boolean]) : searchFunctions.byValue(searchTerm, item);
    return matchData;
  },
  /**
   * Determines if the item should appear in the search results, based on the label, group, and value.
   * @param searchTerm The term to search by.
   * @param item The `ArdOption` item to search in.
   * @returns `true` if the item matches the search term, otherwise `false`.
   */
  byLabelAndGroupAndValue: (searchTerm: string, item: ArdOption) => {
    const labelAndValueMatch = searchFunctions.byLabelAndValue(searchTerm, item);
    const matchData = labelAndValueMatch[0]
      ? ([true, labelAndValueMatch[1]] as [boolean, boolean])
      : searchFunctions.byGroup(searchTerm, item);
    return matchData;
  },
};
