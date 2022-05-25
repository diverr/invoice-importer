import { isValidRow, sanitizeRow } from './utils';

describe('utils', () => {
  it('should sanitize row cleaning white spaces at the start and at the end', () => {
    const row = ['  a  ', '  b b  ', '  c c  c  '];
    const sanitizedRow = sanitizeRow(row);
    expect(sanitizedRow).toStrictEqual(['a', 'b b', 'c c  c']);
  });

  it('should validate valid invoice row', () => {
    const row = [
      'F001',
      '2021-04-17',
      'John Doe S.L.',
      'Jane Roe',
      '100.00',
      '21.00',
      '121.00',
      'issued',
    ];

    const result = isValidRow(row);

    expect(result).toStrictEqual([]);
  });

  it('should not validate row without code field', () => {
    const row = [
      '',
      '2021-04-17',
      'John Doe S.L.',
      'Jane Roe',
      '100.00',
      '21.00',
      '121.00',
      'issued',
    ];

    const result = isValidRow(row);

    expect(result).toStrictEqual([
      {
        property: 'code',
        message: 'required',
      },
    ]);
  });

  it('should not validate row without ownerName field', () => {
    const row = [
      'F001',
      '2021-04-17',
      '',
      'Jane Roe',
      '100.00',
      '21.00',
      '121.00',
      'issued',
    ];

    const result = isValidRow(row);

    expect(result).toStrictEqual([
      {
        property: 'ownerName',
        message: 'required',
      },
    ]);
  });

  it('should not validate row with bad status', () => {
    const row = [
      'F001',
      '2021-04-17',
      'John Doe S.L.',
      'Jane Roe',
      '100.00',
      '21.00',
      '121.00',
      'bad status',
    ];

    const result = isValidRow(row);

    expect(result).toStrictEqual([
      {
        property: 'status',
        message: 'invalid',
      },
    ]);
  });

  it('should not validate row with invalid subtotal field', () => {
    const row = [
      'F001',
      '2021-04-17',
      'John Doe S.L.',
      'Jane Roe',
      'subtotal',
      '21.00',
      '121.00',
      'issued',
    ];

    const result = isValidRow(row);

    expect(result).toStrictEqual([
      {
        property: 'subtotal',
        message: 'invalid',
      },
    ]);
  });

  it('should not validate row with invalid taxes field', () => {
    const row = [
      'F001',
      '2021-04-17',
      'John Doe S.L.',
      'Jane Roe',
      '100.00',
      '',
      '121.00',
      'issued',
    ];

    const result = isValidRow(row);

    expect(result).toStrictEqual([
      {
        property: 'taxes',
        message: 'invalid',
      },
    ]);
  });

  it('should not validate row with invalid total field', () => {
    const row = [
      'F001',
      '2021-04-17',
      'John Doe S.L.',
      'Jane Roe',
      '100.00',
      '21.00',
      'ciento veintiuno',
      'issued',
    ];

    const result = isValidRow(row);

    expect(result).toStrictEqual([
      {
        property: 'total',
        message: 'invalid',
      },
    ]);
  });
});
