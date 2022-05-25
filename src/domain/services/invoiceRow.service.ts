import { ICSVReader } from '../ports/csvReader';
import { Status } from '../models/invoiceRow';
import * as path from 'path';
import { ImportResult } from '../models/importResult';
import { isValidRow, sanitizeRow } from './utils';

export class InvoiceRowService {
  constructor(private csvReader: ICSVReader) {
    this.csvReader = csvReader;
  }

  async import(
    filePath: string,
    withHeader = true,
    separator = ';',
  ): Promise<ImportResult> {
    let data: string[][];

    try {
      data = await this.csvReader.read(
        path.resolve(__dirname, `../../../files/${filePath}`),
        separator,
      );
    } catch (e) {
      throw `Error reading file ${filePath}`;
    }

    const result: ImportResult = {
      ok: [],
      ko: [],
    };

    const startRow = withHeader ? 1 : 0;

    for (let i = startRow; i < data.length; i++) {
      try {
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
      } catch (e) {
        result.ko.push({
          line: i,
          errors: [
            {
              property: '',
              message: `Error parsing row - ${e.message}`,
            },
          ],
        });

        // log error or whatever appropriate
        console.error(`Error parsing row ${i}`, e);
      }
    }

    return Promise.resolve(result);
  }
}
