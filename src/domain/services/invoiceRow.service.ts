import { ICSVReader } from '../ports/csvReader';
import { Status } from '../models/invoiceRow';
import * as path from 'path';
import { ImportResult } from './types';
import { isValidRow, sanitizeRow } from './utils';

export class InvoiceRowService {
  constructor(private csvReader: ICSVReader) {
    this.csvReader = csvReader;
  }

  async import(
    filePath: string,
    isHeader = true,
    separator = ';',
  ): Promise<ImportResult> {
    const data: string[][] = await this.csvReader.read(
      path.resolve(__dirname, `../../../files/${filePath}`),
      separator,
    );

    const result: ImportResult = {
      ok: [],
      ko: [],
    };

    const startRow = isHeader ? 1 : 0;

    for (let i = startRow; i < data.length; i++) {
      const row: string[] = sanitizeRow(data[i]);

      const errorMessages = isValidRow(row);

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

    return Promise.resolve(result);
  }
}
