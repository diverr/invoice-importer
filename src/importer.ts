import { CSVParser } from './infrastructure/csvParser';
import { InvoiceRowService } from './domain/services/invoiceRow.service';
import * as path from 'path';

export class Importer {
  async import(filePath: string): Promise<any> {
    console.log(filePath);

    const csvParser = new CSVParser();
    const service = new InvoiceRowService(csvParser);

    return service.parse(path.resolve(__dirname, `../files/${filePath}`));
  }
}
