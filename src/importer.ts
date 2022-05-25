import { CSVReader } from './infrastructure/csvReader';
import { InvoiceRowService } from './domain/services/invoiceRow.service';

export class Importer {
  async import(filePath: string): Promise<any> {
    const service = new InvoiceRowService(new CSVReader());

    try {
      return await service.import(filePath);
    } catch (error) {
      // do something with error, post to sentry, etc...

      throw error;
    }
  }
}
