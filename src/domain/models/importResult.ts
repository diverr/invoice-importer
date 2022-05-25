import { InvoiceRow } from './invoiceRow';
import { ErrorRow } from './errorRow';

export type ImportResult = {
  ok: InvoiceRow[];
  ko: ErrorRow[];
};
