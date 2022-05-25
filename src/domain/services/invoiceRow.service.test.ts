import { CSVReader } from '../../infrastructure/csvReader';
import { InvoiceRowService } from './invoiceRow.service';
import * as utils from './utils';

jest.mock('path');

const MOCK_READ_FN = jest.fn(() => [
  [
    'Invoice Code',
    'Issued Date',
    'Owner Name',
    'Contact Name',
    'Subtotal',
    'Taxes',
    'Total',
    'Status',
  ],
  [
    'F001',
    '2021-04-17',
    'John Doe S.L.',
    'Jane Roe',
    '100.00',
    '21.00',
    '121.00',
    'issued',
  ],
]);
jest.mock('../../infrastructure/csvReader', () => {
  return {
    CSVReader: jest.fn().mockImplementation(() => {
      return {
        read: MOCK_READ_FN,
      };
    }),
  };
});

describe('InvoiceRowService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should import csv file without errors', async () => {
    const spySanitizeRow = jest.spyOn(utils, 'sanitizeRow');
    const spyIsValidRow = jest
      .spyOn(utils, 'isValidRow')
      .mockImplementation(() => []);

    const invoiceRowService = new InvoiceRowService(new CSVReader());

    const result = await invoiceRowService.import('test.csv');

    expect(MOCK_READ_FN).toHaveBeenCalledTimes(1);
    expect(spySanitizeRow).toHaveBeenCalledTimes(1);
    expect(spyIsValidRow).toHaveBeenCalledTimes(1);

    expect(result).toStrictEqual({
      ok: [
        {
          code: 'F001',
          issuedDate: '2021-04-17',
          ownerName: 'John Doe S.L.',
          contactName: 'Jane Roe',
          subtotal: 100,
          taxes: 21,
          total: 121,
          status: 'issued',
        },
      ],
      ko: [],
    });
  });

  it('should import csv file with errors', async () => {
    const spySanitizeRow = jest.spyOn(utils, 'sanitizeRow');
    const spyIsValidRow = jest
      .spyOn(utils, 'isValidRow')
      .mockImplementation(() => [
        {
          property: 'code',
          message: 'Invalid code',
        },
      ]);

    const invoiceRowService = new InvoiceRowService(new CSVReader());

    const result = await invoiceRowService.import('test.csv');

    expect(MOCK_READ_FN).toHaveBeenCalledTimes(1);
    expect(spySanitizeRow).toHaveBeenCalledTimes(1);
    expect(spyIsValidRow).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      ok: [],
      ko: [
        {
          errors: [
            {
              property: 'code',
              message: 'Invalid code',
            },
          ],
          line: 1,
        },
      ],
    });
  });

  it('should throw error when fails reading file', () => {
    MOCK_READ_FN.mockImplementation(() => {
      throw new Error('Error reading file');
    });

    const invoiceRowService = new InvoiceRowService(new CSVReader());

    try {
      invoiceRowService.import('test.csv');
    } catch (error) {
      expect(error.message).toEqual('Error reading file');
    }
  });
});
