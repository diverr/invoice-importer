import { ICSVParser } from '../domain/ports/csvParser';
import * as fs from 'fs';

export class CSVParser implements ICSVParser {
  parse(filePath: string, separator?: string): string[][] {
    const output: string = fs.readFileSync(filePath, 'utf8');
    return output.split('\n').map(line => line.split(separator ? separator : ','));
  }
}
