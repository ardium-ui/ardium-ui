import { DateRange } from '../../calendar';
import { ArdDateInputDeserializeFn, ArdDateInputSerializeFn } from './date-input.types';

export const DEFAULT_DATE_INPUT_SERIALIZE_FN: ArdDateInputSerializeFn<Date> = (value: Date | null) => {
  if (value instanceof Date) {
    return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${value.getFullYear()}`;
  }
  return '';
};

export const DEFAULT_DATE_RANGE_INPUT_SERIALIZE_FN: ArdDateInputSerializeFn<DateRange> = (value: DateRange | null) => {
  if (value instanceof DateRange) {
    const from = `${value.from.getDate().toString().padStart(2, '0')}/${(value.from.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${value.from.getFullYear()}`;
    const to = `${value.to.getDate().toString().padStart(2, '0')}/${(value.to.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${value.to.getFullYear()}`;
    return `${from} – ${to}`;
  }
  return '';
};

export const DEFAULT_DATE_INPUT_DESERIALIZE_FN: ArdDateInputDeserializeFn<Date> = (
  value: string,
  prevValue: Date | null
): Date | null => {
  const trimmed = value.trim();

  // case: ISO string
  if (!trimmed.includes('/') && !isNaN(Date.parse(trimmed))) {
    const isoDate = new Date(trimmed);
    isoDate.setHours(0, 0, 0, 0);
    return isoDate;
  }

  const parts = trimmed.split('/');
  const currentYear = new Date().getFullYear();

  if (parts.length === 1) {
    // case: only year provided
    const year = parseInt(parts[0], 10);
    if (isNaN(year)) return null;
    const date = new Date(year, 0, 1); // Jan 1st
    return date;
  }

  if (parts.length === 2) {
    // case: day/month, use current year
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    if (isNaN(day) || isNaN(month)) return null;
    const date = new Date(currentYear, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  if (parts.length === 3) {
    // case: full date
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // invalid format
  return prevValue;
};
