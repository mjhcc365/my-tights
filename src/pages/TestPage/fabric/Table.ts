/**
 * TypeScript class definition for a table object using FabricJS,
 * This class extends the fabric.Group class, which is a part of the FabricJS library.
 * The table object is designed to have rows, columns, and cells that can be interactively manipulated within an HTML canvas.
 *
 * Here's a brief overview of the key features and functionalities provided by this class:
 *
 * Properties and Styling:
 *
 * The table has letious customizable properties such as stroke color, stroke width, fill color, font size, and more.
 * It has options for specifying the appearance of header cells, active cells, and hover effects.
 * Rows, Columns, and Cells:
 *
 * Rows and columns can be added or removed dynamically.
 * The cells within the table can be customized, and their content can be modified.
 * Selection and Interaction:
 *
 * The class supports selecting cells, rows, and columns.
 * It allows for deleting selected rows and columns.
 * Selection can be merged or unmerged, and the selection bounds can be obtained.
 * The class provides methods for inserting new rows and columns.
 * Cell Text and Styling:
 *
 * Text properties such as font color and cell padding can be customized.
 * Events:
 *
 * The class triggers events for actions like modifying, resizing, and selecting.
 * Rendering:
 *
 * The render method is overridden to provide custom rendering, including visual cues for active selection and hover effects.
 * Additional Functionality:
 *
 * The class includes functionality for handling resizing of rows and columns.
 * It provides methods for checking if certain operations (e.g., merging, unmerging) are available based on the current selection.
 * Undo Mechanism:
 *
 * There is an initialization of an undo mechanism for reverting changes.
 */
import { icons } from "./Icons";
import * as fabric from "fabric";
import { Group } from "fabric";
import "./Object";
import "./Util";
import { changeSizeUtils } from "./Util";

const tableOwnProperties = ["columns", "rows", "cells", "fontSize"];

/**
 * FabricJS Table Object
 */
class FabricTable extends Group {
  /**
   * default FabricJS properties
   */

  /**
   * Selected Cells Properties
   */
  fillActive?: string;
  /**
   * Cell Highlighting On Hover. null to disable
   */
  fillHover?: string;
  /**
   * Text Properties
   */
  fillText?: string;
  /**
   * Header Cells Properties
   */
  fillHeader?: string;
  /**
   * Rows And Columns Properties
   */
  cellPadding: number = 0;

  fontSize?: number;

  minRowHeight: number = 0;

  minColumnWidth: number = 0;

  /**
   * Rows/Columns Resizing Area
   */
  resizerSize?: number;

  /**
   * columns data
   */
  columns?: fabric.TableColumnOptions[];
  /**
   * rows data
   */
  rows?: fabric.TableRowOptions[];
  /**
   * cells data
   */
  cells?: fabric.TableCellOptions[][];
  /**
   * array of selected cells
   */
  selection: fabric.TableCell[] = [];

  /**
   * private properties
   */
  private _cellsmodified?: boolean;
  private _rowsmodified?: boolean;
  private _columnsmodified?: boolean;

  private _resizingXData?: {
    col: fabric.TableColumn;
    min: number;
    initial: number;
  };
  private _resizingYData?: {
    row: fabric.TableRow;
    min: number;
    initial: number;
  };

  private _cols: fabric.TableColumn[];
  private _rows: fabric.TableRow[];
  private _cells: fabric.TableCellDefinition[][];
  private _selectionData?: {
    begin: fabric.TableCell;
    end: fabric.TableCell;
  };
  private _hoverCell?: fabric.TableCell;
  private _selectionLast?: fabric.TableCell;
  private _currentSelectionBounds?: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
  private _currentSelectionCells?: fabric.TableCell[];
  private _cellsMap: Map<fabric.Rect, fabric.TableCell> = new Map();
  private _textMap: Map<fabric.Text, fabric.TableCell> = new Map();
  // stateProperties: any[];
  // cacheProperties: any[];
  // propertyApplyOrder: string[];

  constructor(o: Partial<fabric.TableOptions>) {
    super();
    this._cols = [];
    this._rows = [];
    this._cells = [];

    let options = Object.assign(
      {},
      this.getDefaultProperties()
    ) as fabric.TableOptions;
    console.log("===>getDefaultProperties", options);
    Object.assign(options, o);

    if (options.columns && options.rows && !options.cells) {
      options.cells = new Array(options.rows.length);
      for (let y = 0; y < options.columns.length; y++) {
        options.cells[y] = new Array(options.columns.length);

        for (let x = 0; x < options.columns.length; x++) {
          options.cells[y][x] = {};
        }
      }
    }
    this.callSuper("initialize", options);
    this.controls = this._getControls();
    this.on({
      modified: this._cleanCache.bind(this),
      resizing: this._cleanCache.bind(this),
      row: this._cleanCache.bind(this),
      column: this._cleanCache.bind(this),
      added: this._updateLines.bind(this),
      deselected: this.clearSelection.bind(this),
    });
    this.enableHover();
    this.enableSelection();
    this._updateCellsGeometry();

    if (!this.columns?.length && this.width) {
      this.set("columns", [{ width: this.width }]);
    }
    if (!this.rows?.length && this.height) {
      this.set("rows", [{ height: this.height }]);
    }
    if (!this._cells?.length) {
      this.set("cells", [[{}]]);
    }

    this.initUndo();
  }
  callSuper(arg0: string, options: fabric.TableOptions) {
    throw new Error("Method not implemented.");
  }
  override onSet(options: { [key: string]: any }) {
    let dirty =
      this._columnsmodified || this._rowsmodified || this._cellsmodified;
    if (!dirty) {
      return;
    }

    if (this._columnsmodified) {
      this._updateColumns();
      this._updateTableWidth();
      this._refillCells();
      delete this._columnsmodified;
    }

    if (this._rowsmodified) {
      this._updateRows();
      this._updateTableHeight();
      this._refillCells();
      delete this._rowsmodified;
    }

    if (this._cellsmodified) {
      this.cells = this.getCells();
      delete this._cellsmodified;
    }

    if (dirty) {
      this._updateCellsGeometry();
    }
  }

  // Clear the cache canvas and mark the object as dirty to avoid visual artifacts caused by noScaleCache property
  private _cleanCache() {
    if (this.canvas) {
      this._cacheContext.clearRect(
        -this._cacheCanvas.width,
        -this._cacheCanvas.height,
        this._cacheCanvas.width * 2,
        this._cacheCanvas.height * 2
      );
      this.dirty = true;
      this.canvas.renderAll();
    }
  }

  // Enable hover functionality for the table cells
  enableHover() {
    this.on({
      mousemove: (e: fabric.IEvent) => {
        if (this.canvas!.getActiveObject() === this && e?.subTargets) {
          let subtarget = e.subTargets[0];
          if (subtarget?.type === "rect") {
            this.hoverCell(this._cellsMap!.get(subtarget)!);
          } else {
            this._unhoverCell();
          }
        }
      },
      mouseout: (e: fabric.IEvent) => {
        this._unhoverCell();
      },
    });
  }

  // Enable selection functionality for the table cells
  enableSelection() {
    this.on({
      mouseup: () => {
        if (this._selectionData) {
          this.selectionFinish();
        }
      },
      mousedown: (e: fabric.IEvent) => {
        if (this.canvas!.getActiveObject() === this && e?.subTargets) {
          let subtarget = e.subTargets[0] as fabric.Rect;
          if (subtarget?.type === "rect") {
            this.selectionBegin(this._cellsMap!.get(subtarget)!);
          }
        }
      },
      mousemove: (e: fabric.IEvent) => {
        if (
          this._selectionData &&
          this.canvas!.getActiveObject() === this &&
          e?.subTargets
        ) {
          let subtarget = e.subTargets[0] as fabric.Rect;
          if (subtarget?.type === "rect" && this._selectionData.begin) {
            this._selectionProcess(this._cellsMap!.get(subtarget)!);
          }
        }
      },
    });
  }

  // Set columns for the table
  setColumns(value: fabric.TableColumnOptions[]) {
    this.__setcolumns(value);
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Get columns data
  getColumns(): fabric.TableColumnOptions[] {
    return this._cols.reduce((p: fabric.TableColumnOptions[], c) => {
      let coldata = { width: c.width } as fabric.TableColumnOptions;
      if (c.header) {
        coldata.header = c.header;
      }
      p.push(coldata);
      return p;
    }, []);
  }

  // Set header for a specific column
  setHeaderColumn(i: number, header: boolean = true) {
    this._cols[i].header = header;
    this._refillCells();
    this._updateColumns();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Set header for a specific row
  setHeaderRow(i: number, header: boolean = true) {
    this._rows[i].header = header;
    this._refillCells();
    this._updateRows();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Set rows for the table
  setRows(value: fabric.TableRowOptions[]) {
    this.__setrows(value);
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Set text for a specific cell
  setCellText(col: number, row: number, text: string) {
    this._setCellText(col, row, text);
    this.cells = this.getCells();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Get rows data
  getRows(): fabric.TableRowOptions[] {
    return this._rows.reduce((p: fabric.TableRowOptions[], c) => {
      let rowdata = { height: c.height } as fabric.TableRowOptions;
      if (c.header) {
        rowdata.header = c.header;
      }
      p.push(rowdata);
      return p;
    }, []);
  }

  // Delete selected rows
  deleteSelectedRows(): void {
    let bounds = this.getSelectionBounds();
    if (!bounds) {
      return;
    }
    for (let y = bounds.y2; y >= bounds.y; y--) {
      this._deleteRow(y);
    }
    this._updateRows();
    this._updateTableHeight();
    this._updateCellsGeometry();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Delete a specific row
  deleteRow(position: number): void {
    this._deleteRow(position);
    this._updateRows();
    this._updateTableHeight();
    this._updateCellsGeometry();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Merge selected cells
  mergeSelection(): void {
    let bounds = this.getSelectionBounds();
    if (!bounds) {
      return;
    }
    let cell = this._cells[bounds.y][bounds.x];
    if (!cell) {
      return;
    }
    cell.colspan = bounds.w;
    cell.rowspan = bounds.h;
    let merged: fabric.TableCell[] = [];
    let text = [cell.text];
    for (let x = bounds.x; x <= bounds.x2; x++) {
      for (let y = bounds.y; y <= bounds.y2; y++) {
        let c2 = this._cells[y][x];
        if (c2 && c2 !== cell && c2.c.index === x && c2.r.index === y) {
          this._deleteCell(c2);
          c2.text && text.push(c2.text);
          merged.push(c2);
        }
        this._cells[y][x] = cell;
      }
    }
    this._setCellText(bounds.x, bounds.y, text.join(" "));
    this.selection = [cell];
    this._updateCellsGeometry();
    let event: fabric.MergedEvent = {
      bounds,
      merged,
      cell,
    };
    this.fire("cells:merge", event);
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Unmerge selected cells
  unmergeSelection(): void {
    let bounds = this.getSelectionBounds();
    if (!bounds) {
      return;
    }
    for (let cell of this.selection) {
      let w = cell.colspan || 1,
        h = cell.rowspan || 1;
      if (w > 1 || h > 1) {
        for (let x = cell.c.index; x <= cell.c.index + w - 1; x++) {
          for (let y = cell.r.index; y <= cell.r.index + h - 1; y++) {
            if (x !== cell.c.index || y !== cell.r.index) {
              this._createCell(x, y);
            }
          }
        }
        cell.colspan = 1;
        cell.rowspan = 1;
      }
    }
    this.selectRange(
      { x: bounds.x, y: bounds.y },
      { x: bounds.x2, y: bounds.y2 }
    );
    this._updateCellsGeometry();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Get bounds of the current selection
  getSelectionBounds(): fabric.TableSelectionBounds | null {
    if (!this.selection.length) {
      return null;
    }
    let c = this.selection[0];
    let xmin = this.selection.reduce(
      (min, p) => (p.c.index < min ? p.c.index : min),
      c.c.index
    );
    let xmax = this.selection.reduce(
      (max, p) =>
        p.c.index + (p.colspan || 1) - 1 > max
          ? p.c.index + (p.colspan || 1) - 1
          : max,
      c.c.index + (c.colspan || 1) - 1
    );
    let ymin = this.selection.reduce(
      (min, p) => (p.r.index < min ? p.r.index : min),
      c.r.index
    );
    let ymax = this.selection.reduce(
      (max, p) =>
        p.r.index + (p.rowspan || 1) - 1 > max
          ? p.r.index + (p.rowspan || 1) - 1
          : max,
      c.r.index + (c.rowspan || 1) - 1
    );
    return {
      x: xmin,
      y: ymin,
      w: xmax - xmin + 1,
      h: ymax - ymin + 1,
      x2: xmax,
      y2: ymax,
    };
  }

  // Check if a cell is a header cell
  isHeaderCell(cell: fabric.TableCell) {
    return cell.r?.header || cell.c?.header;
  }

  // Hover over a cell
  hoverCell(cell: fabric.TableCell) {
    if (cell && cell !== this._hoverCell) {
      this._hoverCell = cell;
      this.dirty = true;
      this.canvas?.renderAll();
    }
  }

  // Set selection of cells
  setSelection(newSelection: fabric.TableCell[] = []) {
    this.selection = newSelection;
    this.dirty = true;
    this.canvas?.renderAll();
  }

  // Clear the current selection
  clearSelection() {
    if (!this.selection.length) {
      return;
    }
    this.selection = [];
    this.dirty = true;
    this.canvas?.renderAll();
  }

  // Select a specific cell
  selectCell({ x, y }: { x: number; y: number }) {
    if (this._cells[y]?.[x]) {
      this.setSelection([this._cells[y][x] as fabric.TableCell]);
    } else {
      this.setSelection([]);
    }
  }

  // Delete selected columns
  deleteSelectedColumns(): void {
    let bounds = this.getSelectionBounds();
    if (!bounds) {
      return;
    }
    for (let x = bounds.x2; x >= bounds.x; x--) {
      this._deleteColumn(x);
    }
    this._updateColumns();
    this._updateTableWidth();
    this._updateCellsGeometry();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Delete a specific column
  deleteColumn(position: number): void {
    this._deleteColumn(position);
    this._updateColumns();
    this._updateTableWidth();
    this._updateCellsGeometry();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Select a range of cells
  selectRange(
    rangeBegin: { x: number; y: number },
    rangeEnd: { x: number; y: number }
  ) {
    let bounds = {
      x1: Math.min(rangeBegin.x, rangeEnd.x),
      x2: Math.max(rangeBegin.x, rangeEnd.x),
      y1: Math.min(rangeBegin.y, rangeEnd.y),
      y2: Math.max(rangeBegin.y, rangeEnd.y),
    };
    this._currentSelectionBounds = {
      x1: bounds.x1,
      x2: bounds.x2,
      y1: bounds.y1,
      y2: bounds.y2,
    };
    this._currentSelectionCells = [];
    for (let x = bounds.x1; x <= bounds.x2; x++) {
      for (let y = bounds.y1; y <= bounds.y2; y++) {
        this._addCellToSelection(x, y);
      }
    }
    this.setSelection(this._currentSelectionCells);
    delete this._currentSelectionCells;
  }

  // Set cells data for the table
  setCells(cells: fabric.TableCellOptions[][]) {
    this.__setcells(cells);
    this._updateCellsGeometry();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  addColumn() {
    return this.insertColumn(this._cols.length);
  }

  addRow() {
    return this.insertRow(this._rows.length);
  }

  // Insert a column at a specific position
  insertColumn(
    position = -1,
    width = this._cols[this._cols.length - 1].width || 1
  ): void {
    if (position === -1) {
      let bounds = this.getSelectionBounds();
      if (bounds) {
        position = this.getSelectionBounds().x2;
      } else {
        position = this._cols.length;
      }
    }

    for (let x = position; x < this._cols.length; x++) {
      this._cols[x].index++;
    }
    this.width! += width;
    this._cols.splice(position, 0, {
      index: position,
      width,
    } as fabric.TableColumn);
    let expandedCells: fabric.TableCell[] = [];
    let left: fabric.TableCellDefinition, right: fabric.TableCellDefinition;
    for (let y = 0; y < this._rows.length; y++) {
      this._cells[y].splice(position, 0, null);
      left = this._cells[y][position - 1];
      right = this._cells[y][position + 1];

      if (left && right && left === right) {
        this._cells[y][position] = left;
        if (!expandedCells.includes(left)) {
          expandedCells.push(left);
        }
      } else {
        this._createCell(position, y);
      }
    }
    for (let cell of expandedCells) {
      if (!cell.colspan) {
        cell.colspan = 1;
      }
      cell.colspan++;
    }
    this._updateColumns();
    this._updateTableWidth();
    this._updateCellsGeometry();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Insert a row at a specific position
  insertRow(
    position = -1,
    height = this._rows[this._rows.length - 1].height || 1
  ): void {
    if (position === -1) {
      let bounds = this.getSelectionBounds();
      if (bounds) {
        position = this.getSelectionBounds().y2;
      } else {
        position = this._rows.length;
      }
    }

    for (let y = position; y < this._rows.length; y++) {
      this._rows[y].index++;
    }
    this.height! += height;
    this._rows.splice(position, 0, {
      index: position,
      height,
    } as fabric.TableRow);
    let expandedCells: fabric.TableCell[] = [];
    this._cells.splice(position, 0, []);
    for (let x = 0; x < this._cols.length; x++) {
      let top = position > 0 && this._cells[position - 1][x];
      let bottom =
        position < this._rows.length - 1 && this._cells[position + 1][x];
      if (top && bottom && top === bottom) {
        this._cells[position][x] = top;
        if (!expandedCells.includes(top)) {
          expandedCells.push(top);
        }
      } else {
        this._createCell(x, position);
      }
    }
    for (let cell of expandedCells) {
      if (!cell.rowspan) {
        cell.rowspan = 1;
      }
      cell.rowspan++;
    }

    this._updateRows();
    this._updateTableHeight();
    this._updateCellsGeometry();
    this.fire("modified");
    this.canvas?.fire("object:modified", { target: this });
    this.canvas?.renderAll();
  }

  // Get cells data with additional properties
  getCells(
    options: fabric.TableCellDataOptions = {}
  ): fabric.TableCellOutput[][] {
    let processed: fabric.TableCell[] = [];
    let cells: fabric.TableCellOutput[][] = [];

    for (let y = 0; y < this._rows.length; y++) {
      let cellsrow: fabric.TableCellOutput[] = [];
      for (let x = 0; x < this._cols.length; x++) {
        let cell = this._cells[y]?.[x];
        if (cell && !processed.includes(cell)) {
          let data = this._getCellData(cell, options);
          processed.push(cell);
          cellsrow.push(data);
        }
      }
      cells.push(cellsrow);
    }
    return cells;
  }

  // Convert object properties to be included
  override toObject(propertiesToInclude: string[] = []): fabric.IObjectOptions {
    return fabric.Object.prototype.toObject.call(this, [
      ...tableOwnProperties,
      ...propertiesToInclude,
    ]);
  }

  override toDatalessObject(propertiesToInclude: string[]) {
    return fabric.Object.prototype.toDatalessObject.call(
      this,
      propertiesToInclude
    );
  }

  // Render function for the table
  override render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.transform(ctx);

    let w = this.width!,
      h = this.height!,
      x = -w / 2,
      y = -h / 2;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    this._renderPaintInOrder(ctx);
    ctx.restore();

    fabric.Group.prototype.render.call(this, ctx);
    let bounds = this.getSelectionBounds();
    if (bounds || this._hoverCell) {
      ctx.save();
      this.transform(ctx);
      if (bounds && this.fillActive) {
        if (
          this._cols[bounds.x] &&
          this._rows[bounds.y] &&
          this._cols[bounds.x2] &&
          this._rows[bounds.y2]
        ) {
          ctx.fillStyle = this.fillActive;
          ctx.fillRect(
            x + this._cols[bounds.x].left,
            y + this._rows[bounds.y].top,
            this._cols[bounds.x2].left -
              this._cols[bounds.x].left +
              this._cols[bounds.x2].width,
            this._rows[bounds.y2].top -
              this._rows[bounds.y].top +
              this._rows[bounds.y2].height
          );
        }
      }

      if (this._hoverCell && this.fillHover) {
        let rect = this._hoverCell.o;

        ctx.fillStyle = this.fillHover;
        ctx.fillRect(rect.left!, rect.top!, rect.width!, rect.height!);
      }
      ctx.restore();
    }
  }

  // Checks if the current selection is mergeable (i.e., more than one cell is selected)
  isSelectionMergeble(): boolean {
    return this.selection.length > 1;
  }

  // Checks if the current selection is unmergeable (i.e., any cell in the selection has colspan or rowspan greater than 1)
  isSelectionUnmergeble(): boolean {
    return !!this.selection.find(
      (c) => (c.colspan || 1) > 1 || (c.rowspan || 1) > 1
    );
  }

  setHeadersAvailableForSelection(): boolean {
    if (!this.selection.length) return false;
    return !!this.selection?.find((cell: any) => !cell.c.header);
  }
  unsetHeadersAvailableForSelection(): boolean {
    if (!this.selection.length) return false;
    return !!this.selection?.find((cell: any) => cell.c.header);
  }

  // Checks if inserting a column is available for the current selection
  isInsertColumnAvailableForSelection(): boolean {
    if (!this.selection.length) return false;
    if (this.selection.length === 1) return true;
    //do not allow insert column if more than 1 column is selected
    return !this.selection.find(
      (cell) => cell.c.index !== this.selection[0].c.index
    );
  }

  // Checks if inserting a row is available for the current selection
  isInsertRowAvailableForSelection(): boolean {
    if (!this.selection.length) return false;
    if (this.selection.length === 1) return true;
    //do not allow insert row if more than 1 row is selected
    return !this.selection.find(
      (cell) => cell.r.index !== this.selection[0].r.index
    );
  }

  // Checks if removing a column is available for the current selection
  isRemoveColumnAvailableForSelection(): boolean {
    let bounds = this.getSelectionBounds();
    if (!bounds) return false;
    if (this._rows.length === bounds.w) return false;
    if (!this.selection.length) return false;
    return true;
  }

  // Checks if removing a row is available for the current selection
  isRemoveRowAvailableForSelection(): boolean {
    let bounds = this.getSelectionBounds();
    if (!bounds) return false;
    if (this._rows.length === bounds.h) return false;
    if (!this.selection.length) return false;
    return true;
  }

  setHeadersForSelectedColumns(): void {
    let bounds = this.getSelectionBounds();
    if (bounds) {
      for (let column = bounds.x; column <= bounds.x2; column++) {
        this.setHeaderColumn(column, true);
      }
    }
  }

  setHeadersForSelectedRows(): void {
    let bounds = this.getSelectionBounds();
    if (bounds) {
      for (let row = bounds.y; row <= bounds.y2; row++) {
        this.setHeaderRow(row, true);
      }
    }
  }
  unsetHeadersForSelectedColumns(): void {
    let bounds = this.getSelectionBounds();
    if (bounds) {
      for (let column = bounds.x; column <= bounds.x2; column++) {
        this.setHeaderColumn(column, false);
      }
    }
  }

  unsetHeadersForSelectedRows(): void {
    let bounds = this.getSelectionBounds();
    if (bounds) {
      for (let row = bounds.y; row <= bounds.y2; row++) {
        this.setHeaderRow(row, false);
      }
    }
  }

  // Clears the hover effect on a cell
  private _unhoverCell() {
    this.__unhoverCell();
    this.canvas?.renderAll();
  }

  // Updates the columns based on the provided options
  private __setcolumns(value: fabric.TableColumnOptions[]) {
    this.clearSelection();
    if (!this._cols) this._cols = [];
    for (let x = value.length; x < this._cols.length; x++) {
      delete this.controls["col" + x];
    }
    this._cols.length = value.length;
    for (let x = 0; x < value.length; x++) {
      if (!this._cols[x]) {
        this._cols[x] = { index: x, left: 0, width: 0, header: false };
      }
      this._cols[x].width = value[x].width || 0;
      this._cols[x].header = value[x].header || false;
    }
    this._columnsmodified = true;
  }

  // Updates the rows based on the provided options
  private __setrows(value: fabric.TableRowOptions[]) {
    this.clearSelection();
    if (!this._rows) this._rows = [];
    for (let y = value.length; y < this._rows.length; y++) {
      delete this.controls["row" + y];
    }
    this._rows.length = value.length;
    for (let y = 0; y < value.length; y++) {
      if (!this._rows[y]) {
        this._rows[y] = { index: y, top: 0, height: 0, header: false };
      }
      this._rows[y].height = value[y].height || 0;
      this._rows[y].header = value[y].header || false;
    }
    this._rowsmodified = true;
  }

  // Updates the cells based on the provided options
  private __setcells(cells: fabric.TableCellOptions[][]) {
    this.clearSelection();
    this._deleteCells();
    this._cells = new Array(cells.length);

    for (let y = 0; y < cells.length; y++) {
      let x = 0;
      for (let i = 0; i < cells[y].length; i++) {
        while (this._cells[y]?.[x]) {
          x++;
        }
        this._createCell(x, y, cells[y][i]);
        if (cells[y][i].colspan) {
          x += cells[y][i].colspan as number;
        }
      }
    }

    this._cellsmodified = true;
  }

  // Sets the height of the table
  private __setheight(newHeight: number) {
    if (this._rows.length) {
      let minHeigth = this._rows
        .slice(0, this._rows.length - 1)
        .reduce((p: number, c) => p + c.height, 0);
      newHeight = Math.max(minHeigth + this.minRowHeight, newHeight);
      if (newHeight !== this.height) {
        this._rows[this._rows.length - 1].height = newHeight - minHeigth;
        this.height = newHeight;
        this._rowsmodified = true;
      }
    } else {
      this.height = Math.max(newHeight, this.minRowHeight);
    }
  }

  // Sets the width of the table
  private __setwidth(newWidth: number) {
    if (this._cols.length) {
      let minWidth = this._cols
        .slice(0, this._cols.length - 1)
        .reduce((p: number, c) => p + c.width, 0);
      newWidth = Math.max(minWidth + this.minColumnWidth, newWidth);

      if (newWidth !== this.width) {
        this._cols[this._cols.length - 1].width = newWidth - minWidth;
        this.width = newWidth;
        this._columnsmodified = true;
      }
    } else {
      this.width = Math.max(newWidth, this.minColumnWidth);
    }
  }

  // Renders the grab control for table moving
  private _renderGrabControl(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: fabric.IObjectOptions,
    fabricObject: fabric.Object
  ) {
    let size = 15; //this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.drawImage(icons.grab, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  // Renders the icon control for adding columns and rows
  private _renderIconControl(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: fabric.IObjectOptions,
    fabricObject: fabric.Object
  ) {
    let size = 25; //this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(icons.add, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  // Renders an invisible control
  private _renderInvisible(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: fabric.IObjectOptions,
    fabricObject: fabric.Object
  ) {}

  // Retrieves the controls for the table
  private _getControls() {
    //@ts-ignore
    let cursorStyleHandler = fabric.controlsUtils.scaleCursorStyleHandler;
    let changeSize = changeSizeUtils;
    //@ts-ignore
    let dragHandler = fabric.controlsUtils.dragHandler;

    return {
      tl: new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyleHandler,
        actionHandler: changeSizeUtils,
      }),
      tr: new fabric.Control({
        x: 0.5,
        y: -0.5,
        cursorStyleHandler,
        actionHandler: changeSizeUtils,
      }),
      bl: new fabric.Control({
        x: -0.5,
        y: 0.5,
        cursorStyleHandler,
        actionHandler: changeSizeUtils,
      }),
      br: new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyleHandler,
        actionHandler: changeSizeUtils,
      }),
      drag: new fabric.Control({
        x: -0.5,
        y: -0.5,
        offsetX: -13,
        offsetY: -13,
        cursorStyle: "grab",
        mouseDownHandler: () => {
          this._unlockMovement();
          return true;
        },
        mouseUpHandler: () => {
          this._lockMovement();
          return true;
        },
        actionHandler: dragHandler, //change to this
        actionName: "drag",
        render: this._renderGrabControl.bind(this),
      }),
      addColumn: new fabric.Control({
        x: 0.5,
        y: 0,
        offsetX: 15,
        cursorStyle: "pointer",
        actionName: "addColumn",
        mouseDownHandler: () => {
          this.insertColumn();
          return false;
        },
        render: this._renderIconControl.bind(this),
      }),
      addRow: new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 15,
        cursorStyle: "pointer",
        actionName: "addRow",
        mouseDownHandler: () => {
          this.insertRow();
          return false;
        },
        render: this._renderIconControl.bind(this),
      }),
    };
  }

  // Unlocks movement in both X and Y directions
  private _unlockMovement() {
    // @ts-ignore
    this.set({
      lockMovementX: false,
      lockMovementY: false,
    });
  }

  // Locks movement in both X and Y directions
  private _lockMovement() {
    // @ts-ignore
    this.set({
      lockMovementX: true,
      lockMovementY: true,
    });
  }

  // Clears the hover effect on a cell
  private __unhoverCell() {
    delete this._hoverCell;
    this.dirty = true;
  }

  // Gets the fill color for a cell based on whether it is a header cell
  private _getCellFill(cell: fabric.TableCell) {
    let header = cell.r.header || cell.c.header;
    return header ? this.fillHeader : this.fill;
  }

  // Initiates the selection process for a cell
  private selectionBegin(cell: fabric.TableCell) {
    delete this.canvas!._currentTransform;

    this._selectionData = { begin: cell, end: cell };
    this.selectCell({ x: cell.c.index, y: cell.r.index });

    this.fireSelectionEvent("begin");
  }

  private fireSelectionEvent(postfix: string) {
    let data: fabric.CellsSelectionEvent = {
      cells: this.selection,
      bounds: this._currentSelectionBounds,
      begin: this._selectionData.begin,
      end: this._selectionData.end,
    };
    let eventname = "selection";
    if (postfix) {
      eventname += ":" + postfix;
    }
    this.fire(eventname, data);
    this.canvas?.fire("object:" + eventname, { target: this, ...data });
  }

  // Processes the selection of cells
  private _selectionProcess(cell: fabric.TableCell) {
    if (!this._selectionData || this._selectionData.end === cell) {
      return;
    }
    this._selectionData.end = cell;
    this.selectRange(
      {
        x: this._selectionData.begin.c.index,
        y: this._selectionData.begin.r.index,
      },
      { x: cell.c.index, y: cell.r.index }
    );

    this.fireSelectionEvent("change");
  }

  // Finishes the selection process
  private selectionFinish() {
    this.fireSelectionEvent("end");
    if (!this._selectionData) {
      return;
    }
    delete this._selectionData;
  }

  // Refills the cells with appropriate fill colors
  private _refillCells() {
    if (!this._rows || !this._cols || !this._cells) {
      return;
    }
    let processed: fabric.TableCell[] = [];
    for (let y = 0; y < this._rows.length; y++) {
      for (let x = 0; x < this._cols.length; x++) {
        let cell = this._cells[y]?.[x];
        if (cell && !processed.includes(cell)) {
          processed.push(cell);
          cell.o.set({
            fill: this._getCellFill(cell),
            dirty: true,
          });
        }
      }
    }
    this.dirty = true;
    this.canvas?.renderAll();
  }

  // Adds a cell to the current selection
  private _addCellToSelection(x: number, y: number) {
    if (!this._currentSelectionCells || !this._currentSelectionBounds) {
      return;
    }
    if (!this._cells[y][x]) {
      return;
    }
    let cell = this._cells[y][x] as fabric.TableCell;
    if (!this._currentSelectionCells.includes(cell)) {
      this._currentSelectionCells.push(cell);
      if (cell.c.index < this._currentSelectionBounds.x1) {
        let oldMinX = this._currentSelectionBounds.x1;
        let newMinX = cell.c.index;
        this._currentSelectionBounds.x1 = newMinX;
        for (let xi = newMinX; xi < oldMinX; xi++) {
          this._addColumnToSelection(xi);
        }
      }
      if (cell.r.index < this._currentSelectionBounds.y1) {
        let oldMinY = this._currentSelectionBounds.y1;
        let newMinY = cell.r.index;
        this._currentSelectionBounds.y1 = newMinY;
        for (let yi = newMinY; yi < oldMinY; yi++) {
          this._addRowToSelection(yi);
        }
      }
      if (cell.c.index + cell.colspan - 1 > this._currentSelectionBounds.x2) {
        let oldMaxX = this._currentSelectionBounds.x2;
        let newMaxX = cell.c.index + cell.colspan - 1;
        this._currentSelectionBounds.x2 = newMaxX;
        for (let xi = oldMaxX + 1; xi <= newMaxX; xi++) {
          this._addColumnToSelection(xi);
        }
      }
      if (cell.r.index + cell.rowspan - 1 > this._currentSelectionBounds.y2) {
        let oldMaxY = this._currentSelectionBounds.y2;
        let newMaxY = cell.r.index + cell.rowspan - 1;
        this._currentSelectionBounds.y2 = newMaxY;
        for (let yi = oldMaxY + 1; yi <= newMaxY; yi++) {
          this._addRowToSelection(yi);
        }
      }
    }
  }

  // Adds a row to the current selection
  private _addRowToSelection(y: number) {
    if (!this._currentSelectionBounds) {
      return;
    }
    for (
      let x = this._currentSelectionBounds.x1;
      x <= this._currentSelectionBounds.x2;
      x++
    ) {
      this._addCellToSelection(x, y);
    }
  }

  // Adds a column to the current selection
  private _addColumnToSelection = (x: number) => {
    if (!this._currentSelectionBounds) {
      return;
    }
    for (
      let y = this._currentSelectionBounds.y1;
      y <= this._currentSelectionBounds.y2;
      y++
    ) {
      this._addCellToSelection(x, y);
    }
  };

  //Sets corner and controls position coordinates based on current angle, width and height, left and top.
  override setCoords(skipCorners: boolean) {
    fabric.Group.prototype.setCoords.call(this, skipCorners);
    this._updateRowsAndColumnsControls();
    return this;
  }

  // Updates the controls for rows and columns
  private _updateRowsAndColumnsControls() {
    if (!this.canvas || !this._rows) {
      return;
    }
    let zoom = this.canvas.getZoom(),
      h = this.height! * zoom * this.scaleY!,
      w = this.width! * zoom * this.scaleX!;

    for (let i = 0; i < this._rows.length; i++) {
      let row = this._rows[i];
      let control = this.controls["row" + i];
      if (control) {
        control.y = -1.5 + (row.top + row.height) / this.height!;
        control.sizeX = w;
        control.offsetX = w + 1;
        control.offsetY = h;
      }
    }

    for (let i = 0; i < this._cols.length; i++) {
      let col = this._cols[i];
      let control = this.controls["col" + i];
      if (control) {
        control.x = -1.5 + (col.left + col.width) / this.width!;
        control.sizeY = h;
        control.offsetX = w;
        control.offsetY = h + 1;
      }
    }
  }

  // Gets the data for a cell based on provided options
  private _getCellData(
    cell: fabric.TableCell,
    options: fabric.TableCellDataOptions = {}
  ) {
    let c = cell.c;
    let r = cell.r;
    let x = c.index;
    let y = r.index;
    let data: fabric.TableCellOutput = {};
    if (cell.colspan !== 1) data.colspan = cell.colspan;
    if (cell.rowspan !== 1) data.rowspan = cell.rowspan;
    if (cell.text) data.text = cell.text;
    if (options.includeAll || options.includePosition) {
      data.x = x;
      data.y = y;
    }
    if (options.includeAll || options.includeOffset) {
      data.top = r.top;
      data.left = c.left;
    }
    if (options.includeAll || options.includeWidth) {
      if (cell.width) data.width = cell.width;
    }
    if (options.includeAll || options.includeHeight) {
      if (cell.height) data.height = cell.height;
    }
    if (options.includeAll || options.includeCoords) {
      data.coords = cell.o.getAbsoluteCoordinates();
    }
    return data;
  }

  // Sets the text for a cell at a specific position
  private _setCellText(x: number, y: number, text: string) {
    if (!this._cells[y][x]) {
      return;
    }
    let cell = this._cells[y][x] as fabric.TableCell;
    if (cell.text === text) {
      return;
    }
    cell.text = text;

    if (text) {
      if (!cell.t) {
        cell.t = new fabric.Text(text, {
          hasControls: false,
          fontSize: this.fontSize,
          fontFamily: "Arial",
          originX: "left",
          originY: "top",
          left: 0,
          top: 0,
          padding: this.cellPadding,
          fill: this.fillText,
        });
        this._textMap.set(cell.t, cell);
        this.add(cell.t);
      } else {
        cell.t.set({ text } as fabric.TextOptions);
      }
      this._updateCellsGeometry();
    } else {
      if (cell.t) {
        this.remove(cell.t);
      }
    }
  }

  // Creates a cell at a specific position
  private _createCell(
    x: number,
    y: number,
    cell: fabric.TableCellOptions = {}
  ) {
    let w = cell?.colspan || 1,
      h = cell?.rowspan || 1;

    if (!this._rows) {
      this._rows = [];
    }
    if (!this._cols) {
      this._cols = [];
    }
    if (!this._rows[y]) {
      this._rows.push({
        index: y,
        height: this.minRowHeight,
      } as fabric.TableRow);
    }
    if (!this._cols[x]) {
      this._cols.push({
        index: x,
        width: this.minColumnWidth,
      } as fabric.TableColumn);
    }

    let cellData: fabric.TableCell = {
      r: this._rows[y],
      c: this._cols[x],
      colspan: w,
      rowspan: h,
    } as fabric.TableCell;

    for (let xi = 0; xi < w; xi++) {
      for (let yi = 0; yi < h; yi++) {
        if (!this._cells[y + yi]) {
          this._cells[y + yi] = [];
        }
        if (!this._rows[y + yi]) {
          this._rows.push({
            index: y + yi,
            height: this.minRowHeight,
          } as fabric.TableRow);
        }
        if (!this._cols[x + xi]) {
          this._cols.push({
            index: x + xi,
            width: this.minColumnWidth,
          } as fabric.TableColumn);
        }
        this._cells[y + yi][x + xi] = cellData;
      }
    }
    cellData.o = new fabric.Rect({
      id: `cell-${y}-${x}`,
      hasControls: false,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      strokeUniform: this.strokeUniform,
      lockMovementX: true,
      lockMovementY: true,
      originX: "left",
      originY: "top",
      left: 0,
      top: 0,
      width: 1,
      height: 1,
      fill: this.isHeaderCell(cellData) ? this.fillHeader : this.fill,
    });
    this._cellsMap.set(cellData.o, cellData);

    this.add(cellData.o);
    if (cell.text) {
      this._setCellText(x, y, cell.text);
    }
    return cellData;
  }

  // Initiates the row resizing process
  private rowResizingBegin() {
    let row = this._getCurrentRow();
    if (!row) {
      return;
    }
    this._resizingYData = {
      row,
      min: row.top + this.minRowHeight,
      initial: row.height,
    };
  }

  //get current transformation row
  private _getCurrentRow(): fabric.TableRow | null {
    if (!this.canvas?._currentTransform) {
      return null;
    }
    return this._rows[+this.canvas._currentTransform.corner.substring(3)];
  }

  //get current transformation column
  private _getCurrentColumn(): fabric.TableColumn | null {
    if (!this.canvas?._currentTransform) {
      return null;
    }
    return this._cols[+this.canvas._currentTransform.corner.substring(3)];
  }

  // Initiates the column resizing process
  private columnResizingBegin() {
    let col = this._getCurrentColumn();
    if (!col) {
      return;
    }
    this._resizingXData = {
      col,
      min: col.left + this.minColumnWidth,
      initial: col.width,
    };
  }

  // Resizes a row during the resizing process
  private rowResizing(
    eventData: MouseEvent,
    transform: fabric.Transform,
    x: number,
    y: number,
    options: any = {}
  ) {
    if (!this.canvas || !this._resizingYData) {
      return false;
    }
    let row = this._resizingYData.row;
    let zoom = this.canvas.getZoom();
    let newPoint = fabric.controlsUtils.getLocalPoint(
      transform,
      transform.originX,
      transform.originY,
      x,
      y
    );
    newPoint.y += this.scaleY! * this.height! * zoom;
    let oldHeight = row.height;
    row.height =
      Math.max(newPoint.y / this.scaleY!, this._resizingYData.min) - row.top;
    this._updateRows();
    this._updateTableHeight();
    this._updateCellsGeometry();
    if (oldHeight !== row.height) {
      this.fire("row");
      return true;
    }
    return false;
  }

  // Resizes a column during the resizing process
  private columnResizing(
    eventData: MouseEvent,
    transform: fabric.Transform,
    x: number,
    y: number,
    options: any = {}
  ) {
    if (!this.canvas || !this._resizingXData) {
      return false;
    }
    let column = this._resizingXData.col;
    let zoom = this.canvas.getZoom();
    let newPoint = fabric.controlsUtils.getLocalPoint(
      transform,
      transform.originX,
      transform.originY,
      x,
      y
    );
    newPoint.x += this.scaleX! * this.width! * zoom;
    let oldWidth = column.width;
    column.width =
      Math.max(newPoint.x / this.scaleX!, this._resizingXData.min) -
      column.left;
    this._updateColumns();
    this._updateTableWidth();
    this._updateCellsGeometry();
    if (oldWidth !== column.width) {
      this.fire("column");
      return true;
    }
    return false;
  }

  // Ends the resizing process for a column
  private columnResizingFinish() {
    if (!this.canvas || !this._resizingXData) {
      return;
    }
    let column = this._resizingXData.col;
    if (this._resizingXData.initial !== column.width) {
      this.fire("modified");
      this.canvas.fire("object:modified", { target: this, column });
    }
    delete this._resizingXData;
  }

  // Ends the resizing process for a row
  private rowResizingFinish() {
    if (!this.canvas || !this._resizingYData) {
      return;
    }
    let row = this._resizingYData.row;
    if (this._resizingYData.initial !== row.height) {
      this.fire("modified");
      this.canvas.fire("object:modified", { target: this, row });
    }
    delete this._resizingYData;
  }

  //// Updates the horizontal and vertical dividers based on the current table state
  private _updateLines() {
    if (!this.canvas) {
      return;
    }
    if (!this._cells) {
      return;
    }
    let zoom = this.canvas.getZoom();
    //horizontal dividers
    let top = -this.height! / 2;
    for (let rowindex = 0; rowindex < this._rows.length; rowindex++) {
      let row = this._rows[rowindex];
      top += row.height;

      if (!this.controls["row" + rowindex]) {
        this.controls["row" + rowindex] = new fabric.Control({
          render: this._renderInvisible,
          x: -1,
          sizeY: this.resizerSize,
          cursorStyle: "ns-resize",
          actionHandler: this.rowResizing.bind(this),
          mouseDownHandler: () => {
            this.rowResizingBegin();
            return true;
          },
          mouseUpHandler: () => {
            this.rowResizingFinish();
            return true;
          },
          actionName: "row",
        });
      }
    }

    //vertical dividers
    let left = -this.width! / 2;
    for (let columnindex = 0; columnindex < this._cols.length; columnindex++) {
      let column = this._cols[columnindex];
      left += column.width;

      if (!this.controls["col" + columnindex]) {
        this.controls["col" + columnindex] = new fabric.Control({
          render: this._renderInvisible,
          y: -1,
          sizeX: this.resizerSize,
          cursorStyle: "ew-resize",
          actionHandler: this.columnResizing.bind(this),
          mouseDownHandler: () => {
            this.columnResizingBegin();
            return true;
          },
          mouseUpHandler: () => {
            this.columnResizingFinish();
            return true;
          },
          actionName: "column",
        });
      }
    }
    this.dirty = true;
  }

  // Updates the geometry of cells based on rows and columns
  private _updateCellsGeometry(): void {
    if (!this._cells) {
      return;
    }
    let top = 0,
      left: number,
      rowindex: number,
      columnindex: number;

    for (rowindex = 0; rowindex < this._rows.length; rowindex++) {
      left = 0;
      for (columnindex = 0; columnindex < this._cols.length; columnindex++) {
        let cell = this._cells[rowindex]?.[columnindex];
        if (!cell) {
          continue;
        }
        if (cell.c.index === columnindex && cell.r.index === rowindex) {
          let width = 0,
            height = 0,
            colspan = cell.colspan || 1,
            rowspan = cell.rowspan || 1;
          for (let x = 0; x < colspan; x++) {
            if (this._cols[columnindex + x]) {
              width += this._cols[columnindex + x].width;
            }
          }
          for (let y = 0; y < rowspan; y++) {
            if (this._rows[rowindex + y]) {
              height += this._rows[rowindex + y].height;
            }
          }
          cell.width = width;
          cell.height = height;
          cell.o.set({
            left: left - this.width! / 2 - 1,
            top: top - this.height! / 2 - 1,
            width,
            height,
          });
          cell.o.setCoords();
          if (cell.t) {
            cell.t.set({
              left: left - this.width! / 2 + this.cellPadding - 1,
              top: top - this.height! / 2 + this.cellPadding - 1,
              width,
              height,
            });
          }
        }
        left += this._cols[columnindex].width;
      }
      top += this._rows[rowindex].height;
    }
    this._updateLines();
    this.cells = this.getCells();
    this.dirty = true;
    this.canvas?.renderAll();
  }

  // Updates the width of the table based on columns
  private _updateTableWidth(): void {
    if (this._cols && this._cells) {
      this.set(
        "width",
        this._cols.reduce((p, c) => p + c.width, 0)
      );
    }
  }

  // Updates the height of the table based on rows
  private _updateTableHeight(): void {
    if (this._rows && this._cells) {
      this.set(
        "height",
        this._rows.reduce((p, c) => p + c.height, 0)
      );
    }
  }

  // Updates the left positions of columns
  private _updateColumns(): void {
    let l = 0;
    for (let x = 0; x < this._cols.length; x++) {
      this._cols[x].left = l;
      l += this._cols[x].width;
    }
    this.columns = this.getColumns();
  }

  // Updates the top positions of rows
  private _updateRows(): void {
    let t = 0;
    for (let y = 0; y < this._rows.length; y++) {
      this._rows[y].top = t;
      t += this._rows[y].height;
    }
    this.rows = this.getRows();
  }

  // Deletes a column at the specified position
  private _deleteColumn(position = this._cols.length - 1): void {
    let column = this._cols[position];
    delete this.controls["col" + (this._cols.length - 1)];

    let processed: fabric.TableCell[] = [];
    for (let y = 0; y < this._rows.length; y++) {
      let mid = this._cells[y][position];
      if (!mid) {
        continue;
      }
      let left = position > 0 && this._cells[y][position - 1];
      let right =
        position < this._cols.length - 1 && this._cells[y][position + 1];
      if (processed.includes(mid)) {
        continue;
      }
      processed.push(mid);
      if (left === mid) {
        left.colspan--;
      } else if (right === mid) {
        right.colspan--;
        right.c = this._cols[right.c.index + 1];
      } else {
        this._deleteCell(mid);
      }
    }
    for (let x = position + 1; x < this._cols.length; x++) {
      this._cols[x].index--;
    }
    this.width! -= column.width;
    this._cols.splice(position, 1);
    for (let y = 0; y < this._rows.length; y++) {
      this._cells[y].splice(position, 1);
    }
  }

  // Deletes a row at the specified position
  private _deleteRow(position = this._rows.length - 1): void {
    let row = this._rows[position];
    delete this.controls["row" + (this._cols.length - 1)];
    let processed: fabric.TableCell[] = [];
    for (let x = 0; x < this._cols.length; x++) {
      let mid = this._cells[position][x];
      if (!mid) {
        continue;
      }
      let top = position > 0 && this._cells[position - 1][x];
      let bottom =
        position < this._rows.length - 1 && this._cells[position + 1][x];
      if (processed.includes(mid)) {
        continue;
      }
      processed.push(mid);
      if (top === mid) {
        top.rowspan--;
      } else if (bottom === mid) {
        bottom.rowspan--;
        bottom.r = this._rows[bottom.r.index + 1];
      } else {
        this._deleteCell(mid);
      }
    }
    for (let y = position + 1; y < this._rows.length; y++) {
      this._rows[y].index--;
    }
    this.height! -= row.height;
    this._rows.splice(position, 1);
    this._cells.splice(position, 1);
  }

  // Deletes a specific cell from the table
  private _deleteCell(cell: fabric.TableCell): void {
    for (let y = 0; y < this._rows.length; y++) {
      for (let x = 0; x < this._cols.length; x++) {
        if (this._cells[y][x] === cell) {
          this._cells[y][x] = null;
        }
      }
    }
    if (this.selection.includes(cell)) {
      this.selection.splice(this.selection.indexOf(cell), 1);
    }
    this.remove(cell.o);
    if (cell.t) {
      this.remove(cell.t);
    }
  }

  // Deletes all cells in the table
  private _deleteCells(): void {
    if (this._cells) {
      for (let y = 0; y < this._cells.length; y++) {
        for (let x = 0; x < this._cells[y].length; x++) {
          let cell = this._cells[y][x];
          if (cell) {
            this.remove(cell.o);
            if (cell.t) {
              this.remove(cell.t);
            }
            this._cells[y][x] = null;
          }
        }
      }
    }
    this.selection.length = 0;
  }

  override defaultProperties: fabric.TableOptions = {
    noScaleCache: false,
    lockMovementX: true,
    lockMovementY: true,
    subTargetCheck: true,
    hoverCursor: "default",
    lockScalingFlip: true,
    /**
     * customizable FabricJS properties
     */
    transparentCorners: false,
    originX: "left",
    originY: "top",
    stroke: "#000000",
    strokeWidth: 2,
    cornerColor: "#000000",
    fill: "#00000022",
    cornerSize: 8,
    lockRotation: true,
    strokeUniform: true,

    /**
     * custom FabricJS properties
     */
    fillHover: "#ffffff33",
    fillText: "#000000",
    cellPadding: 3,
    fontSize: 20,
    fillActive: "#ffffff66",
    fillHeader: "#00000066",
    minRowHeight: 5,
    minColumnWidth: 5,
    resizerSize: 6,
  };
}

FabricTable.prototype.type = "table";

// FabricTable.prototype.type = "table";
// FabricTable.prototype.stateProperties = [
//   ...fabric.Object.prototype.stateProperties!,
//   ...tableOwnProperties,
// ];
// FabricTable.prototype.cacheProperties = [
//   ...fabric.Group.prototype.cacheProperties!,
//   ...tableOwnProperties,
// ];
// FabricTable.prototype.propertyApplyOrder = [
//   "columns",
//   "rows",
//   "cells",
//   "width",
//   "height",
// ];

fabric.Table = FabricTable;

// Augment the fabric namespace to include Table
declare module "fabric" {
  export namespace fabric {
    type TableCellDefinition = fabric.TableCell | null;

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
      on(
        eventName: "selection:end",
        handler: (e: CellsSelectionEvent) => void
      ): T;
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

      on(
        eventName: "viewport:translate",
        handler: (e: fabric.IPoint) => void
      ): T;
      on(
        eventName: "viewport:scaled",
        handler: (e: { scale: number }) => void
      ): T;
    }
    class Table extends FabricTable {
      //todo history mixin
      history: {
        disabled?: boolean;
        undo: fabric.IObjectOptions[];
        redo: fabric.IObjectOptions[];
        state: fabric.IObjectOptions;
      };
      disableHistory(): void;
      enableHistory(): void;
      addUndoState(): void;
      initUndo(): void;
      undo(): void;
      redo(): void;
      undoable(): boolean;
      redoable(): boolean;
    }
  }
}
