import { ICSVReader } from '../domain/ports/csvReader';
import * as fs from 'fs';

export class CSVReader implements ICSVReader {
  read(filePath: string, separator?: string): string[][] {
    const output: string = fs.readFileSync(filePath, 'utf8');
    return output
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => line.split(separator ? separator : ';'));
  }
}
