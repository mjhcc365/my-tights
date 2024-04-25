import { Rect, Group, Line } from "fabric";
import { BaseCell, CellInfo } from "./base-cell";
import { debounce } from "lodash";

import { mockdata } from "./mockdata";
// import
// group 一整个的group，里面是rect和textbox
// dataSource
// colum
// 通过layout函数实现布局
// 先不处理header

const DEFAULT_COL_WIDTH = 50;
const DEFAULT_ROW_HEIGHT = 100;

export class fabricTable {
  group: Group = new Group([], {
    subTargetCheck: true,
    interactive: true, // 启用选择子目标
  });
  gridMap: Map<string, BaseCell> = new Map([]);
  top: number = 0;
  left: number = 0;

  constructor() {
    this.initGroup();
    // 绘制三层
    // 1. row 绘制每行cell
    // row 绘制行line 整行
    // col 绘制列line 整列
  }

  initGroup = () => {
    this.renderCell();
    this.renderLine();
  };

  renderCell = () => {
    mockdata.forEach((rowData: any, rowIndex: number) => {
      Object.keys(rowData).forEach((colDataKey, colIndex) => {
        const info = {
          row: rowIndex,
          col: colIndex,
          width: DEFAULT_COL_WIDTH,
          height: DEFAULT_ROW_HEIGHT,
          top: DEFAULT_ROW_HEIGHT * rowIndex,
          left: DEFAULT_COL_WIDTH * colIndex,
        };
        const cell = new BaseCell({
          meta: info,
          context: rowData[colDataKey],
        });

        this.gridMap.set(`row${rowIndex}-col${colIndex}`, cell);
        this.group.add(cell.backgroundShape);
        this.group.add(cell.textShape);
      });
    });
  };

  // 解决划线响应问题
  renderLine = () => {
    mockdata.forEach((rowData: any, rowIndex: number) => {
      const col = Object.keys(rowData).length;
      const top = this.top + DEFAULT_ROW_HEIGHT * rowIndex;
      const line = new Line([this.left, top, col * DEFAULT_COL_WIDTH, top], {
        stroke: "black",
        fill: "black",
        strokeWidth: 2,
        lockMovementX: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
      });
      //   line.on(
      //     "modified",
      //     debounce((options: any) => {
      //       const top = options.transform.target.top; // 偏移量
      //       //   console.log("====>", options.transform.target.top);
      //       //   console.log("==>", options.scenePoint.y);
      //       // this.group
      //       this.gridMap.forEach((cell) => {
      //         if (cell.row === rowIndex) {
      //           cell.backgroundShape.set("top", cell.backgroundShape.top + top);
      //           cell.textShape.set("top", cell.textShape.top + top);
      //           //   this.group.set("height", this.group.height + top);
      //         } else if (cell.row + 1 === rowIndex) {
      //           cell.backgroundShape.set(
      //             "height",
      //             cell.backgroundShape.height + top
      //           );
      //           cell.textShape.set("height", cell.textShape.height + top);
      //         }
      //       });
      //     }, 1000)
      //   );
      this.group.add(line);
    });
  };
}
