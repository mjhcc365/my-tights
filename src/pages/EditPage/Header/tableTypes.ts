import * as fabric from "fabric";
import { Point, GroupProps } from "fabric";

export type TableCellDefinition = TableCell | null;

/**
 * Table Column Initialization Options
 */
export interface TableColumnOptions {
  /**
   * width in px
   */
  width?: number;
  /**
   * is header column
   */
  header?: boolean;
}

/**
 * Table Row Initialization Options
 */
export interface TableRowOptions {
  /**
   * height in px
   */
  height?: number;
  /**
   * is header row
   */
  header?: boolean;
}

/**
 * Data Related to Table Column
 */
export interface TableColumn extends Required<TableColumnOptions> {
  /**
   * column index
   */
  index: number;
  /**
   * offset related to left side of the table in px
   */
  left: number;
}

/**
 * Data Related to Table Row
 */
export interface TableRow extends Required<TableRowOptions> {
  /**
   * row index
   */
  index: number;
  /**
   * offset related to top side of the table in px
   */
  top: number;
}

/**
 * Table Cell Initialization Options
 */
export interface TableCellOptions {
  /**
   * colspan
   */
  colspan?: number;
  /**
   * rowspan
   */
  rowspan?: number;
  /**
   * cell text data
   */
  text?: string;
}

/**
 * Data Related to Table Cell
 */
export interface TableCell extends Required<TableCellOptions> {
  /**
   * row data element
   */
  r: TableRow;
  /**
   * column data element
   */
  c: TableColumn;
  /**
   * column width in px
   */
  width: number;
  /**
   * column height in px
   */
  height: number;
  /**
   * associated rectangle object in the group
   */
  o: fabric.Rect;
  /**
   * associated text object in the group
   */
  t?: Text;
}

/**
 * Table Cells Selection Bounds
 */
export interface TableSelectionBounds {
  /**
   * first selected column
   */
  x: number;
  /**
   * first selected row
   */
  y: number;
  /**
   * eelection width
   */
  w: number;
  /**
   * eelection height
   */
  h: number;
  /**
   * last selected column
   */
  x2: number;
  /**
   * last selected row
   */
  y2: number;
}

/**
 * Data Related to Table Cell
 */
export interface TableCellOutput extends TableCellOptions {
  /**
   * column index
   */
  x?: number;
  /**
   * row index
   */
  y?: number;
  /**
   * cell height in px
   */
  height?: number;
  /**
   * cell width in px
   */
  width?: number;
  /**
   * offset related to top side of the table in px
   */
  top?: number;
  /**
   * offset related to left side of the table in px
   */
  left?: number;
  /**
   * coordinates array related to left top corner of the table in px
   */
  coords?: [Point, Point, Point, Point];
}

/**
 * Additional Table Intilization properties
 */
export interface TableOptions extends GroupProps {
  controls?: any;
  columns?: TableColumnOptions[];
  rows?: TableRowOptions[];
  cells?: TableCellOptions[][];
  fillText?: string | null;
  fillHover?: string | null;
  cellPadding?: number;
  fontSize?: number;
  fillActive?: string | null;
  fillHeader?: string | null;
  minRowHeight?: number;
  minColumnWidth?: number;
  resizerSize?: number;
}

/**
 * Options to retrive more data about Table Cells
 */
export interface TableCellDataOptions {
  includeAll?: boolean;
  includeOffset?: boolean;
  includePosition?: boolean;
  includeWidth?: boolean;
  includeHeight?: boolean;
  includeCoords?: boolean;
}

export interface CellsSelectionEvent {
  target?: fabric.Table;
  begin: fabric.TableCell;
  end: fabric.TableCell;
  bounds: { x1: number; x2: number; y1: number; y2: number };
  cells: fabric.TableCell[];
}

export interface MergedEvent {
  bounds: fabric.TableSelectionBounds;
  merged: fabric.TableCell[];
  cell: fabric.TableCell;
}
