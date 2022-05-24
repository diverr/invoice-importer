import { CSVReader } from './infrastructure/csvReader';
import { InvoiceRowService } from './domain/services/invoiceRow.service';

export class Importer {
  async import(filePath: string): Promise<any> {
    const service = new InvoiceRowService(new CSVReader());
    return service.import(filePath);
  }
}
