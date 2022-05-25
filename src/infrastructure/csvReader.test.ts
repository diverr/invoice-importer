const MOCK_READ_FILE_SYNC_FN = jest.fn();

jest.mock('fs', () => ({
  readFileSync: MOCK_READ_FILE_SYNC_FN,
}));

import { CSVReader } from './csvReader';

describe('CSVReader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read csv file', async () => {
    const csvReader = new CSVReader();
    const csvFile = 'test.csv';
    const csvFileContent =
      'Invoice Code;Issued Date;Owner Name;Contact Name;Subtotal;Taxes;Total;Status\n' +
      'F001;2021-04-17;John Doe S.L.;Jane Roe;100.00;21.00;121.00;issued';

    MOCK_READ_FILE_SYNC_FN.mockReturnValue(csvFileContent);

    const result = await csvReader.read(csvFile);

    expect(MOCK_READ_FILE_SYNC_FN).toHaveBeenCalledWith(csvFile, 'utf8');
    expect(result).toEqual([
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
  });
});
