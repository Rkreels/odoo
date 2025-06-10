
export type SpreadsheetStatus = 'private' | 'shared' | 'public';
export type CellType = 'text' | 'number' | 'formula' | 'date' | 'boolean';
export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'area';
export type FilterOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'starts_with';

export interface Spreadsheet {
  id: string;
  name: string;
  description: string;
  status: SpreadsheetStatus;
  owner: string;
  collaborators: SpreadsheetCollaborator[];
  lastModified: string;
  rowCount: number;
  columnCount: number;
  template?: string;
  version: number;
  isLocked: boolean;
  lockedBy?: string;
  sheets: SpreadsheetSheet[];
  charts: SpreadsheetChart[];
  namedRanges: NamedRange[];
  formulas: FormulaDefinition[];
  settings: SpreadsheetSettings;
  permissions: SpreadsheetPermissions;
  history: SpreadsheetHistoryEntry[];
}

export interface SpreadsheetCollaborator {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer' | 'commenter';
  joinedAt: string;
  isOnline: boolean;
  cursor?: CellReference;
}

export interface SpreadsheetSheet {
  id: string;
  name: string;
  index: number;
  isHidden: boolean;
  isProtected: boolean;
  rowCount: number;
  columnCount: number;
  cells: { [key: string]: SpreadsheetCell };
  filters: ColumnFilter[];
  sorting: SortConfig[];
  formatting: CellFormatting;
}

export interface SpreadsheetCell {
  row: number;
  column: number;
  value: string | number | boolean | null;
  formula?: string;
  type: CellType;
  formatting?: CellStyle;
  comment?: string;
  validation?: CellValidation;
  lastModified: string;
  modifiedBy: string;
}

export interface CellStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textColor?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  border?: BorderStyle;
  numberFormat?: string;
}

export interface BorderStyle {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  color?: string;
}

export interface CellValidation {
  type: 'number' | 'date' | 'list' | 'custom';
  criteria: any;
  errorMessage?: string;
  showDropdown?: boolean;
}

export interface CellReference {
  sheet: string;
  row: number;
  column: number;
}

export interface ColumnFilter {
  column: number;
  operator: FilterOperator;
  value: any;
  isActive: boolean;
}

export interface SortConfig {
  column: number;
  direction: 'asc' | 'desc';
  priority: number;
}

export interface CellFormatting {
  conditionalFormats: ConditionalFormat[];
  frozenRows: number;
  frozenColumns: number;
  gridlines: boolean;
  headers: boolean;
}

export interface ConditionalFormat {
  id: string;
  range: string;
  condition: string;
  format: CellStyle;
  isActive: boolean;
}

export interface SpreadsheetChart {
  id: string;
  type: ChartType;
  title: string;
  dataRange: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: ChartConfig;
  sheetId: string;
}

export interface ChartConfig {
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  legend?: LegendConfig;
  colors?: string[];
  showDataLabels?: boolean;
  showGridlines?: boolean;
}

export interface ChartAxis {
  title?: string;
  min?: number;
  max?: number;
  format?: string;
}

export interface LegendConfig {
  show: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface NamedRange {
  id: string;
  name: string;
  range: string;
  sheetId: string;
  description?: string;
}

export interface FormulaDefinition {
  name: string;
  formula: string;
  description: string;
  category: string;
  parameters: FormulaParameter[];
}

export interface FormulaParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface SpreadsheetSettings {
  autoSave: boolean;
  showFormulas: boolean;
  calculationMode: 'automatic' | 'manual';
  iterativeCalculation: boolean;
  maxIterations: number;
  defaultNumberFormat: string;
  timezone: string;
}

export interface SpreadsheetPermissions {
  canEdit: boolean;
  canComment: boolean;
  canShare: boolean;
  canDownload: boolean;
  canPrint: boolean;
  canCopy: boolean;
}

export interface SpreadsheetHistoryEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  changes: any;
  cellRange?: string;
}

export interface SpreadsheetTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  isPublic: boolean;
  usageCount: number;
  creator: string;
  createdAt: string;
  tags: string[];
  sheets: SpreadsheetSheet[];
}
