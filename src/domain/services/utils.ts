import { RowErrorLine } from '../models/rowError';

const sanitizeRow = (row: string[]): string[] => {
  return row.map((cell) => cell.trim());
};

const isValidRow = (row: string[]): RowErrorLine[] => {
  const result: RowErrorLine[] = [];

  const [code, , ownerName, , subtotal, taxes, total, status] = row;

  if (!code) {
    result.push({
      property: 'code',
      message: 'required',
    });
  }

  if (!ownerName) {
    result.push({
      property: 'ownerName',
      message: 'required',
    });
  }

  if (status === 'bad status') {
    result.push({
      property: 'status',
      message: 'invalid',
    });
  }

  if (isNaN(parseFloat(subtotal))) {
    result.push({
      property: 'subtotal',
      message: 'invalid',
    });
  }

  if (isNaN(parseFloat(taxes))) {
    result.push({
      property: 'taxes',
      message: 'invalid',
    });
  }

  if (isNaN(parseFloat(total))) {
    result.push({
      property: 'total',
      message: 'invalid',
    });
  }

  return result;
};

export { sanitizeRow, isValidRow };
