const MOCK_READ_FILE_SYNC = jest.fn();

jest.mock('fs', () => ({
  readFileSync: MOCK_READ_FILE_SYNC,
}));

import { CSVReader } from './csvReader';

describe('CSVReader', () => {
  it('should read csv file', () => {
    const csvReader = new CSVReader();
    const csvFile = 'test.csv';
    const csvFileContent = 'row1_1;row1_2;row1_3\nrow2_1;row2_2;row2_3';

    MOCK_READ_FILE_SYNC.mockReturnValue(csvFileContent);

    const result = csvReader.read(csvFile);

    expect(MOCK_READ_FILE_SYNC).toHaveBeenCalledWith(csvFile, 'utf8');
    expect(result).toEqual([
      ['row1_1', 'row1_2', 'row1_3'],
      ['row2_1', 'row2_2', 'row2_3'],
    ]);
  });
});
