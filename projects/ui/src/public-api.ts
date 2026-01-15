/*
 * Public API Surface of Ardium UI
 */
import 'first-last';

//! component group 0 - inputs and selects
export * from './lib/inputs/autocomplete-input'; // 003
export * from './lib/inputs/digit-input'; // 004
export * from './lib/inputs/input'; // 002
export * from './lib/inputs/password-input'; // 005
export * from './lib/option'; // 001
export * from './lib/select'; // 000
// export * from './lib/inputs/color-input'; // 006
export * from './lib/file-inputs/file-drop-area'; // 010
export * from './lib/file-inputs/file-input'; // 011
export * from './lib/inputs/date-input'; // 008 & 009 & 012
export * from './lib/inputs/hex-input'; // 016
export * from './lib/inputs/number-input'; // 007

//! component group 1 - small forms-related components
export * from './lib/buttons/button';
export * from './lib/buttons/fab';
export * from './lib/buttons/general-button.types';
export * from './lib/buttons/icon-button';
export * from './lib/checkbox';
export * from './lib/chip';
export * from './lib/radio'; // 103
export * from './lib/segment'; // 104
export * from './lib/slide-toggle';
export * from './lib/slider'; // 105 & 106
export * from './lib/star/rating-input'; // 108
export * from './lib/star/star-button'; // 107
export * from './lib/statebox'; // 109

//! component group 2 - pickers
export * from './lib/calendar'; // 200 & 201
// export * from './lib/color/color-picker'; // 202

//! component group 3 - lists
export * from './lib/checkbox-list'; // 300

//! component group 4 - state display components
export * from './lib/badge'; // 403
export * from './lib/progress-bar'; // 401
export * from './lib/progress-circle'; // 402
export * from './lib/spinner'; // 400

//! component group 5 - data display components
// export * from './lib/color/color-display'; // 502
export * from './lib/dropdown-panel'; // 501
export * from './lib/form-field'; // 511-514
export * from './lib/form-field-frame'; // 500
export * from './lib/kbd'; // 503
export * from './lib/kbd-shortcut'; // 504
export * from './lib/star'; // 508
export * from './lib/star/rating-display'; // 509
export * from './lib/table'; // 505
export * from './lib/table-from-csv'; // 507
export * from './lib/table-pagination'; // 506
export * from './lib/text-list'; // 510

//! component group 6 - layout components
export * from './lib/card';
export * from './lib/divider';
export * from './lib/tabber'; // 600

//! component group 7 - popups
export * from './lib/dialog'; // 701
export * from './lib/modal'; // 700
export * from './lib/snackbar'; // 702

//! component group 9 - other
export * from './lib/icon'; // 900

//! types
export * from './lib/_internal/public-api';
export * from './lib/types/alignment.types';
export * from './lib/types/colors.types';
export * from './lib/types/item-storage.types';
export * from './lib/types/theming.types';
export * from './lib/types/utility.types';

//! miscellaneous
export { searchFunctions as ArdSearchFunction, searchInString } from './lib/search-functions';

