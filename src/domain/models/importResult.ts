import { InvoiceRow } from './invoiceRow';
import { RowError } from './rowError';

export type ImportResult = {
  ok: InvoiceRow[];
  ko: RowError[];
};
