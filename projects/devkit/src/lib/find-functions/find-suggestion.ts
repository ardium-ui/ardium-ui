import { compareTwoStrings, findBestMatch } from "string-similarity";


export function findBestSuggestions(toMatch: string, suggestions: string[], limit: number = 8): string[] {
    return suggestions
        //map to values and ratings
        .map(v => ({ target: v, rating: compareTwoStrings(toMatch, v) }))
        //sort by rating, descending
        .sort((a, b) => b.rating - a.rating)
        //map to just values
        .map(v => v.target)
        //set the limit
        .slice(0, limit);
}

export function findBestAutocomplate(toMatch: string, autocompletes: string[]): string {
    return findBestMatch(toMatch, autocompletes).bestMatch.target;
}