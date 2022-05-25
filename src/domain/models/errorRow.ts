import { ErrorRowItem } from './errorRowItem';

export type ErrorRow = {
  line: number;
  errors: ErrorRowItem[];
};
