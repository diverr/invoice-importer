export type Status = 'issued' | 'draft' | 'bad status';

export type InvoiceRow = {
  code: string;
  issuedDate: string;
  ownerName: string;
  contactName: string;
  subtotal: number;
  taxes: number;
  total: number;
  status: Status;
};
