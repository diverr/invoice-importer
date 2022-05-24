export type RowError = {
  line: number;
  errors: RowErrorLine[];
};

export type RowErrorLine = {
  property: string;
  message: string;
};
