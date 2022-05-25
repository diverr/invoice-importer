export interface ICSVReader {
  read(filePath: string, separator?: string): Promise<string[][]>;
}
