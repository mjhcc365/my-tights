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
  coords?: [IPoint, IPoint, IPoint, IPoint];
}

/**
 * Additional Table Intilization properties
 */
export interface TableOptions extends IGroupOptions {
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
interface IObservable<T> {
  /**
   * Fires event with an optional options object
   * @param {String} eventName Event name to fire
   * @param {Object} [options] Options object
   * @return {Self} thisArg
   * @chainable
   */
  fire(eventName: "cells:merge", options: MergedEvent): T;
  fire(eventName: "selection:begin", options: CellsSelectionEvent): T;
  fire(eventName: "selection:end", options: CellsSelectionEvent): T;
  fire(eventName: "selection", options: CellsSelectionEvent): T;

  on(eventName: "cells:merge", handler: (e: MergedEvent) => void): T;
  on(
    eventName: "selection:begin",
    handler: (e: CellsSelectionEvent) => void
  ): T;
  on(eventName: "selection:end", handler: (e: CellsSelectionEvent) => void): T;
  on(eventName: "selection", handler: (e: CellsSelectionEvent) => void): T;
  on(
    eventName: "object:selection:begin",
    handler: (e: CellsSelectionEvent) => void
  ): T;
  on(
    eventName: "object:selection:end",
    handler: (e: CellsSelectionEvent) => void
  ): T;
  on(
    eventName: "object:selection",
    handler: (e: CellsSelectionEvent) => void
  ): T;

  on(eventName: "viewport:translate", handler: (e: fabric.IPoint) => void): T;
  on(eventName: "viewport:scaled", handler: (e: { scale: number }) => void): T;
}
