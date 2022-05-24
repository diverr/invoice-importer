import { ICSVParser } from '../ports/csvParser';
import { InvoiceRow, Status } from '../models/invoiceRow';
import { RowError, RowErrorLine } from '../models/rowError';

export class InvoiceRowService {

  constructor(private csvParser: ICSVParser) {
    this.csvParser = csvParser;
  }

  parse(filePath: string): {ok: InvoiceRow[], ko: RowError[]}{
    const separator = ',';
    const data: string[][] = this.csvParser.parse(filePath, separator);

    const result: {ok: InvoiceRow[], ko: RowError[]} = {
      ok: [],
      ko: []
    };

    for(let i = 1; i < data.length; i++) {
      const row: string[] = data[i];

      const errorMessages = this.isValid(row)

      if(errorMessages.length > 0) {
        result.ko.push({
          line: i,
          errors: errorMessages
        });
        continue;
      }

      result.ok.push({
        code: row[0],
        issuedDate: row[1],
        ownerName: row[2],
        contactName: row[3],
        subtotal: parseFloat(row[4]),
        taxes: parseFloat(row[5]),
        total: parseFloat(row[6]),
        status: row[7] as Status
      });

    }

    return result;

  }

  private isValid(row: string[]): RowErrorLine[] {
    const result: RowErrorLine[] = [];

    if(!row[0]) {
      result.push({
        property: 'code',
        message: 'required'
      });
    }

    if(!row[2]) {
      result.push({
        property: 'ownerName',
        message: 'required'
      });
    }

    if(row[7] === 'bad status') {
      result.push({
        property: 'status',
        message: 'invalid'
      });
    }

    try {
      parseFloat(row[4])
    } catch (e) {
      result.push({
        property: 'subtotal',
        message: 'invalid'
      });
    }

    try {
      parseFloat(row[5])
    } catch (e) {
      result.push({
        property: 'taxes',
        message: 'invalid'
      });
    }

    try {
      parseFloat(row[6])
    } catch (e) {
      result.push({
        property: 'total',
        message: 'invalid'
      });
    }

    return result;
  }


}
