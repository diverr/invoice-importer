import { ICSVReader } from '../ports/csvReader';
import { InvoiceRow, Status } from '../models/invoiceRow';
import { RowError, RowErrorLine } from '../models/rowError';
import * as path from 'path';

type ImportResult = {
  ok: InvoiceRow[];
  ko: RowError[];
};

export class InvoiceRowService {
  constructor(private csvReader: ICSVReader) {
    this.csvReader = csvReader;
  }

  import(filePath: string): ImportResult {
    const separator = ';';
    const data: string[][] = this.csvReader.read(
      path.resolve(__dirname, `../../../files/${filePath}`),
      separator,
    );

    const result: ImportResult = {
      ok: [],
      ko: [],
    };

    for (let i = 1; i < data.length; i++) {
      const row: string[] = this.sanitizeRow(data[i]);

      const errorMessages = this.isValid(row);

      if (errorMessages.length > 0) {
        result.ko.push({
          line: i,
          errors: errorMessages,
        });
        continue;
      }

      const [
        code,
        issuedDate,
        ownerName,
        contactName,
        subtotal,
        taxes,
        total,
        status,
      ] = row;

      result.ok.push({
        code: code,
        issuedDate: issuedDate,
        ownerName: ownerName,
        contactName: contactName,
        subtotal: parseFloat(subtotal),
        taxes: parseFloat(taxes),
        total: parseFloat(total),
        status: status as Status,
      });
    }

    return result;
  }

  private sanitizeRow(row: string[]): string[] {
    return row.map((cell) => cell.trim());
  }

  private isValid(row: string[]): RowErrorLine[] {
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
  }
}
