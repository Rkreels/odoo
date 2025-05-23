
export type SpreadsheetStatus = 'private' | 'shared' | 'public';

export interface Spreadsheet {
  id: string;
  name: string;
  description: string;
  status: SpreadsheetStatus;
  owner: string;
  collaborators: string[];
  lastModified: string;
  rowCount: number;
  columnCount: number;
  template?: string;
}

export interface SpreadsheetCell {
  row: number;
  column: number;
  value: string | number;
  formula?: string;
}
