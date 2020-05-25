import { isEmpty, complement } from 'ramda';

export const isFunc = v => typeof v === 'function';

export const isNotEmpty = complement(isEmpty);
