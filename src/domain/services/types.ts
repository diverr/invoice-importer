import { InvoiceRow } from '../models/invoiceRow';
import { RowError } from '../models/rowError';

export type ImportResult = {
  ok: InvoiceRow[];
  ko: RowError[];
};
