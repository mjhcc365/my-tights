import { Rect, IText } from "fabric";

export interface CellInfo {
  row: number;
  col: number;
  width: number;
  height: number;
  top: number;
  left: number;
}

export class BaseCell {
  public row: number = 0;
  public col: number = 0;
  protected width: number = 0;
  protected height: number = 0;
  protected left: number = 0;
  protected top: number = 0;
  public backgroundShape: Rect = new Rect({});
  public textShape: IText = new IText("");
  protected context: string = "";

  constructor(props: { meta: CellInfo; context: string }) {
    const { row, col, width, height, top, left } = props.meta;
    this.row = row;
    this.col = col;
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
    this.context = props.context;
    this.initCell();
  }

  initCell() {
    // 1、draw rect background
    this.drawBackgroundShape();
    // 2、draw text
    this.drawTextShape();
  }

  getBackgroundColor() {
    return "#f5f5f5";
  }

  drawBackgroundShape() {
    this.backgroundShape.set({
      top: this.top,
      left: this.left,
      width: this.width,
      height: this.height,
      fill: this.getBackgroundColor(),
      stroke: "red",
      selectable: false,
    });
  }

  drawTextShape() {
    this.textShape = new IText(this.context, {
      top: this.top,
      left: this.left,
      width: this.width,
      height: this.height,
      fontSize: 24,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      editable: true,
      hasControls: false,
    });
  }
}
