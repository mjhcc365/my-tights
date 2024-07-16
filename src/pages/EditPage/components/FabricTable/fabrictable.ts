import * as fabric from "fabric";
import { classRegistry, FabricObject, GroupProps, Textbox } from "fabric";
import { icons } from "./Icons";
import {
  TableColumn,
  TableRow,
  TableCellDefinition,
  TableColumnOptions,
  TableRowOptions,
  TableCellOptions,
  TableCell,
  TableCellDataOptions,
  TableCellOutput,
  TableSelectionBounds,
} from "./interface/tableType";

import { mockOptions } from "./mockdata";
import { defaultTheme, defaultGroupProps } from "./defautTheme";
import { theme } from "antd";
import { ThemeType } from "./interface/theme";
import { DataConfig } from "./interface/dataType";

export class FabricTable extends fabric.Group {
  static type = "FabricTable";

  selection: TableCell[] = [];

  columns: TableColumnOptions[] = [];
  rows: TableRowOptions[] = [];
  cells: TableCellOptions[][] = [];

  cellPadding: number = 3;
  resizerSize: number = 6;
  fontSize: number = 14;
  fillText: string = "#000000";
  fillActive: string = "#fff";
  fillHover: string = "#ffffff33";
  fillHeader: string = "#00000066";
  minRowHeight: number = 5;
  minColumnWidth: number = 5;

  private _cellsmodified?: boolean;
  private _rowsmodified?: boolean;
  private _columnsmodified?: boolean;

  private _cols: TableColumn[] = [];
  private _rows: TableRow[] = [];
  private _cells: TableCellDefinition[][] = [];

  private _cellsMap: Map<fabric.Rect, TableCell> = new Map();
  private _textMap: Map<fabric.FabricText, TableCell> = new Map();

  private _hoverCell?: TableCell;

  private _renderInvisible(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {}

  private _resizingXData?: {
    col: TableColumn;
    min: number;
    initial: number;
  };
  private _resizingYData?: {
    row: TableRow;
    min: number;
    initial: number;
  };

  private _selectionData?: {
    begin: TableCell;
    end: TableCell;
  };

  private _currentSelectionBounds?: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };

  private _currentSelectionCells?: TableCell[];

  constructor(dataconfig: DataConfig, theme?: ThemeType) {
    // 继承的过程
    super([], {
      ...defaultGroupProps,
      top: 100,
      left: 100,
      // width: 300,
      // height: 200,
    });
    this.__setcolumns(dataconfig.columns);
    this.__setrows(dataconfig.rows);
    this._updateRows();
    this._updateColumns();

    this.__setcells(dataconfig.cells);
    this._updateCellsGeometry();

    this.controls = this._getControls();

    this.on({
      modified: this._cleanCache.bind(this),
      resizing: this._cleanCache.bind(this),
      added: this._updateLines.bind(this),
      deselected: this.clearSelection.bind(this),
      row: this._cleanCache.bind(this),
      column: this._cleanCache.bind(this),
    });

    /** hover */
    this.enableHover();
    this.enableSelection();
    this.enableDBClick();
    // mousedblclick

    this.set("subTargetCheck", true);
    this.set("interactive", true);
    // subTargetCheck: true,
    // interactive: true   //  enables selecting subtargets
  }

  private _cleanCache() {
    if (this.canvas) {
      this._cacheCanvas?.width;
      this._cacheContext?.clearRect(
        this._cacheCanvas?.width as number,
        this._cacheCanvas?.height as number,
        (this._cacheCanvas?.width as number) * 2,
        (this._cacheCanvas?.height as number) * 2
      );
      this.dirty = true;
      this.canvas.renderAll();
    }
  }

  private _getControls() {
    //@ts-ignore
    return {
      ...fabric.controlsUtils.createObjectDefaultControls(),
      drag: new fabric.Control({
        x: 0,
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
        actionHandler: fabric.controlsUtils.dragHandler, //change to this
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

  insertRow = (
    position = -1,
    height = this._rows[this._rows.length - 1].height || 1
  ): void => {
    if (position === -1) {
      let bounds = this.getSelectionBounds();
      if (bounds) {
        position = this.getSelectionBounds()?.y2 || 0;
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
    } as TableRow);
    let expandedCells: TableCell[] = [];
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
  };

  // Updates the height of the table based on rows
  private _updateTableHeight(): void {
    if (this._rows && this._cells) {
      this.set(
        "height",
        this._rows.reduce((p, c) => p + c.height, 0)
      );
    }
  }

  // Get rows data
  getRows(): TableRowOptions[] {
    return this._rows.reduce((p: TableRowOptions[], c) => {
      let rowdata = { height: c.height } as TableRowOptions;
      if (c.header) {
        rowdata.header = c.header;
      }
      p.push(rowdata);
      return p;
    }, []);
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
  private _renderIconControl(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    let size = 25; //this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(icons.add, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  insertColumn(
    position = -1,
    width = this._cols[this._cols.length - 1].width || 1
  ): void {
    if (position === -1) {
      let bounds = this.getSelectionBounds();
      if (bounds) {
        position = this.getSelectionBounds()?.x2 || 0;
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
    } as TableColumn);
    let expandedCells: TableCell[] = [];
    let left: TableCellDefinition, right: TableCellDefinition;
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

  // Get bounds of the current selection
  getSelectionBounds(): TableSelectionBounds | null {
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

  private _updateTableWidth = (): void => {
    if (this._cols && this._cells) {
      this.set(
        "width",
        this._cols.reduce((p, c) => p + c.width, 0)
      );
    }
  };

  private _renderGrabControl(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ) {
    let size = 15; //this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.drawImage(icons.grab, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  private __setcolumns(value: TableColumnOptions[]) {
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
  private __setrows(value: TableRowOptions[]) {
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

  private __setcells(cells: TableCellOptions[][]) {
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
    // this.selection.length = 0;
  }

  // Creates a cell at a specific position
  private _createCell(x: number, y: number, cell: TableCellOptions = {}) {
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
      } as TableRow);
    }
    if (!this._cols[x]) {
      this._cols.push({
        index: x,
        width: this.minColumnWidth,
      } as TableColumn);
    }

    let cellData: TableCell = {
      r: this._rows[y],
      c: this._cols[x],
      colspan: w,
      rowspan: h,
    } as TableCell;

    for (let xi = 0; xi < w; xi++) {
      for (let yi = 0; yi < h; yi++) {
        if (!this._cells[y + yi]) {
          this._cells[y + yi] = [];
        }
        if (!this._rows[y + yi]) {
          this._rows.push({
            index: y + yi,
            height: this.minRowHeight,
          } as TableRow);
        }
        if (!this._cols[x + xi]) {
          this._cols.push({
            index: x + xi,
            width: this.minColumnWidth,
          } as TableColumn);
        }
        this._cells[y + yi][x + xi] = cellData;
      }
    }
    cellData.o = new fabric.Rect({
      id: `cell-${y}-${x}`,
      hasControls: false,
      stroke: "#000000",
      strokeWidth: 2,
      strokeUniform: true,
      lockMovementX: true,
      lockMovementY: true,
      originX: "left",
      originY: "top",
      left: this.left,
      top: this.top,
      // left: 0,
      // top: 0,
      width: 10,
      height: 10,
      fill: this.isHeaderCell(cellData) ? this.fillHeader : this.fill,
      selectable: false,
    });
    cellData.t = new fabric.Textbox(cell.text || "", {
      hasControls: false,
      fontSize: this.fontSize,
      fontFamily: "Arial",
      originX: "left",
      originY: "top",
      left: this.left,
      top: this.top,
      padding: this.cellPadding,
      hasBorders: false,
      fill: this.fillText,
      lockMovementX: true,
      lockMovementY: true,
    });
    this._cellsMap.set(cellData.o, cellData);
    this.add(cellData.o);
    this.add(cellData.t);
    if (cell.text) {
      this._setCellText(x, y, cell.text);
    }
    return cellData;
  }
  // Sets the text for a cell at a specific position
  private _setCellText(x: number, y: number, text: string) {
    if (!this._cells[y][x]) {
      return;
    }
    let cell = this._cells[y][x] as TableCell;
    if (cell.text === text) {
      return;
    }
    // cell.t = text;
    if (text) {
      if (!cell.t) {
        cell.t = new fabric.Textbox(text, {
          hasControls: false,
          fontSize: this.fontSize,
          fontFamily: "Arial",
          originX: "left",
          originY: "top",
          left: 0,
          top: 0,
          padding: this.cellPadding,
          hasBorders: false,
          fill: this.fillText,
          lockMovementX: true,
          lockMovementY: true,
          // selectable: false,
        });
        // this._textMap.set(cell.t, cell);
        this._textMap.set(cell.t, cell);
        this.add(cell.t as unknown as Textbox);
      } else {
        // console.log(cell.t);
        // cell.t. = text;
        // cell.t.set({ text });
      }
      this._updateCellsGeometry();
    } else {
      if (cell.t) {
        this.remove(cell.t);
      }
    }
  }

  // Ends the resizing process for a row
  private rowResizingFinish() {
    if (!this.canvas || !this._resizingYData) {
      return;
    }
    let newrow = this._resizingYData.row;
    if (this._resizingYData.initial !== newrow.height) {
      this.fire("modified");
      this.canvas.fire("object:modified", { target: this, newrow });
    }
    delete this._resizingYData;
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
    let newPoint = this.getLocalPoint(
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

  override setCoords() {
    super.setCoords();
    this._updateRowsAndColumnsControls();
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

  private _updateCellsGeometry = () => {
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
            cell.t.width = width - 20;
            cell.t.height = height - 20;
            cell.t.left = left - this.width! / 2 + this.cellPadding - 1;
            cell.t.top = top - this.height! / 2 + this.cellPadding - 1;
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
  };

  //get current transformation column
  private _getCurrentColumn(): TableColumn | null {
    if (!this.canvas?._currentTransform) {
      return null;
    }
    return this._cols[+this.canvas._currentTransform.corner.substring(3)];
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
    let newPoint = this.getLocalPoint(
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

  // Initiates the row resizing process
  private rowResizingBegin = () => {
    let row = this._getCurrentRow();
    if (!row) {
      return;
    }
    this._resizingYData = {
      row,
      min: row.top + this.minRowHeight,
      initial: row.height,
    };
  };

  private _getCurrentRow(): TableRow | null {
    if (!this.canvas?._currentTransform) {
      return null;
    }
    return this._rows[+this.canvas._currentTransform.corner.substring(3)];
  }

  // Get cells data with additional properties
  getCells = (options: TableCellDataOptions = {}) => {
    let processed: TableCell[] = [];
    let cells: TableCellOutput[][] = [];

    for (let y = 0; y < this._rows.length; y++) {
      let cellsrow: TableCellOutput[] = [];
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
  };

  // Gets the data for a cell based on provided options
  private _getCellData(cell: TableCell, options: TableCellDataOptions = {}) {
    let c = cell.c;
    let r = cell.r;
    let x = c.index;
    let y = r.index;
    let data: TableCellOutput = {};
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
      data.coords = this.getAbsoluteCoordinates(cell.o);
    }
    return data;
  }

  getAbsoluteProperties = function (object: fabric.Rect) {
    var matrix = object.calcTransformMatrix(),
      options = fabric.util.qrDecompose(matrix),
      center = new fabric.Point(options.translateX, options.translateY),
      center2 = object.translateToCenterPoint(center, "center", "center"),
      position = object.translateToOriginPoint(
        center2,
        object.originX,
        object.originY
      );

    return {
      width: object.width,
      height: object.height,
      left: position.x,
      top: position.y,
      angle: options.angle,
      scaleX: options.scaleX,
      scaleY: options.scaleY,
    };
  };

  getAbsoluteCoordinates = (object: fabric.Rect) => {
    let options = this.getAbsoluteProperties(object);
    // @ts-ignore
    if (!this.canvas._hackrect) {
      // @ts-ignore
      this.canvas._hackrect = new fabric.Rect({});
    }
    // @ts-ignore
    this.canvas._hackrect.set(options);
    // @ts-ignore
    return this.canvas._hackrect.getCoords(true, true);
  };

  isHeaderCell(cell: TableCell) {
    return cell.r?.header || cell.c?.header;
  }

  private _updateColumns(): void {
    let l = 0;
    for (let x = 0; x < this._cols.length; x++) {
      this._cols[x].left = l;
      l += this._cols[x].width;
    }
    this.columns = this.getColumns();
  }

  getColumns(): TableColumnOptions[] {
    return this._cols.reduce((p: TableColumnOptions[], c) => {
      let coldata = { width: c.width } as TableColumnOptions;
      if (c.header) {
        coldata.header = c.header;
      }
      p.push(coldata);
      return p;
    }, []);
  }

  clearSelection() {
    // if (!this.selection.length) {
    //   return;
    // }
    // this.selection = [];
    // this.dirty = true;
    // this.canvas?.renderAll();
  }

  changeSize = (
    eventData: Event,
    transform: fabric.Transform,
    x: number,
    y: number
  ) => {
    let target = transform.target,
      strokeWidth = target.strokeWidth || 0,
      localPoint = this.getLocalPoint(
        transform,
        transform.originX,
        transform.originY,
        x,
        y
      ),
      strokePaddingX =
        strokeWidth / (target.strokeUniform ? target.scaleX! : 1),
      strokePaddingY =
        strokeWidth / (target.strokeUniform ? target.scaleY! : 1),
      multiplier = this.isTransformCentered(transform) ? 2 : 1,
      oldWidth = target.width,
      newWidth =
        Math.abs((localPoint.x * multiplier) / target.scaleX!) - strokePaddingX,
      oldHeight = target.height,
      newHeight =
        Math.abs((localPoint.y * multiplier) / target.scaleY!) - strokePaddingY;
    target.set("width", Math.max(newWidth, 0));
    target.set("height", Math.max(newHeight, 0));
    return oldWidth !== newWidth || oldHeight !== newHeight;
  };
  isTransformCentered = (transform: fabric.Transform) => {
    return transform.originX === "center" && transform.originY === "center";
  };

  getLocalPoint = (
    transform: fabric.Transform,
    originX: fabric.TOriginX,
    originY: fabric.TOriginY,
    x: number,
    y: number
  ) => {
    let target = transform.target,
      control = target.controls[transform.corner],
      zoom = target.canvas!.getZoom(),
      padding = target.padding! / zoom,
      localPoint = this.toLocalPoint(
        target,
        new fabric.Point(x, y),
        originX,
        originY
      );
    if (localPoint.x >= padding) {
      localPoint.x -= padding;
    }
    if (localPoint.x <= -padding) {
      localPoint.x += padding;
    }
    if (localPoint.y >= padding) {
      localPoint.y -= padding;
    }
    if (localPoint.y <= padding) {
      localPoint.y += padding;
    }
    localPoint.x -= control.offsetX;
    localPoint.y -= control.offsetY;
    return localPoint;
  };

  toLocalPoint = (
    obj: FabricObject,
    point: fabric.Point,
    originX: fabric.TOriginX,
    originY: fabric.TOriginY
  ) => {
    let center = this.getCenterPoint(),
      p,
      p2;
    if (typeof originX !== "undefined" && typeof originY !== "undefined") {
      p = this.translateToGivenOrigin(
        center,
        "center",
        "center",
        originX,
        originY
      );
    } else {
      p = new fabric.Point(this.left, this.top);
    }
    p2 = new fabric.Point(point.x, point.y);
    if (this.angle) {
      p2 = fabric.util.rotatePoint(
        p2,
        center,
        fabric.util.degreesToRadians(this.angle)
      );
    }
    return p2.subtractEquals(p);
  };

  private fireSelectionEvent(postfix: string) {
    let data = {
      cells: this.selection,
      bounds: this._currentSelectionBounds,
      begin: this._selectionData?.begin,
      end: this._selectionData?.end,
    };
    let eventname = "selection";
    if (postfix) {
      eventname += ":" + postfix;
    }
    this.fire(eventname, data);
    this.canvas?.fire("object:" + eventname, { target: this, ...data });
  }

  // Finishes the selection process
  private selectionFinish() {
    this.fireSelectionEvent("end");
    if (!this._selectionData) {
      return;
    }
    delete this._selectionData;
  }

  // Hover over a cell
  hoverCell(cell: TableCell) {
    if (cell && cell !== this._hoverCell) {
      this._hoverCell = cell;
      this.dirty = true;
      this.canvas?.renderAll();
    }
  }
  private _unhoverCell() {
    this.canvas?.renderAll();
  }

  // Enable hover functionality for the table cells
  enableHover() {
    this.on({
      mousemove: (e: fabric.TEvent) => {
        if (this.canvas!.getActiveObject() === this && e?.subTargets) {
          let subtarget = e.subTargets[0];
          const type = subtarget?.type;
          if (["rect", "i-text"].includes(subtarget?.type)) {
            this.hoverCell(this._textMap!.get(subtarget)!);
          } else {
            this._unhoverCell();
          }
        }
      },
      mouseout: (e: fabric.TEvent) => {
        this._unhoverCell();
      },
    });
  }

  setSelection(newSelection: TableCell[] = []) {
    this.selection = newSelection;
    this.dirty = true;
    this.canvas?.renderAll();
  }

  // Select a specific cell
  selectCell({ x, y }: { x: number; y: number }) {
    if (this._cells[y]?.[x]) {
      this.setSelection([this._cells[y][x] as TableCell]);
    } else {
      this.setSelection([]);
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

  // Adds a cell to the current selection
  private _addCellToSelection(x: number, y: number) {
    if (!this._currentSelectionCells || !this._currentSelectionBounds) {
      return;
    }
    if (!this._cells[y][x]) {
      return;
    }
    let cell = this._cells[y][x] as TableCell;
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

  private selectionBegin(cell: TableCell) {
    delete this.canvas!._currentTransform;

    this._selectionData = { begin: cell, end: cell };
    this.selectCell({ x: cell.c.index, y: cell.r.index });

    this.fireSelectionEvent("begin");
  }
  // Processes the selection of cells
  private _selectionProcess(cell: TableCell) {
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

  // Enable selection functionality for the table cells
  enableSelection() {
    this.on({
      mouseup: () => {
        if (this._selectionData) {
          this.selectionFinish();
        }
      },
      mousedown: (e: fabric.TEvent) => {
        if (this.canvas!.getActiveObject() === this && e?.subTargets) {
          let subtarget = e.subTargets[0] as fabric.Rect;
          if (["rect"].includes(subtarget?.type)) {
            this.selectionBegin(this._cellsMap!.get(subtarget)!);
          }
        }
      },
      mousemove: (e: fabric.TEvent) => {
        if (
          this._selectionData &&
          this.canvas!.getActiveObject() === this &&
          e?.subTargets
        ) {
          let subtarget = e.subTargets[0] as fabric.Rect;
          if (["rect"].includes(subtarget?.type) && this._selectionData.begin) {
            this._selectionProcess(this._cellsMap!.get(subtarget)!);
          }
        }
      },
    });
  }

  enableDBClick() {
    this.on({
      mousedblclick: (e) => {
        // console.log("===>", e, e.subTargets[0]?.type);
      },
    });
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
}

classRegistry.setClass(FabricTable);
