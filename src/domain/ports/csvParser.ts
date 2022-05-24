export interface ICSVParser {
    parse(filePath: string, separator?: string): string[][];
}
