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
  gridMap: Map<string, any> = new Map([]);
  top: number = 0;
  left: number = 0;
  cWidth: number = 0;
  cHeight: number = 0;
  originData: any[] = [];
  dataMap: any[] = [];
  canvas: any;
  tableGroup: Group = new Group([], {
    subTargetCheck: true,
    interactive: true, // 启用选择子目标
  });

  constructor(canvas: any) {
    this.canvas = canvas;
    this.doLayout();
    this.renderCell();
  }

  doLayout = () => {
    // doLayout
    mockdata.forEach((ele, rowIndex) => {
      Object.keys(ele).forEach((_, colIndex) => {
        const cellCfg = {
          row: rowIndex,
          col: colIndex,
          width: DEFAULT_COL_WIDTH,
          height: DEFAULT_ROW_HEIGHT,
          top: DEFAULT_ROW_HEIGHT * rowIndex,
          left: DEFAULT_COL_WIDTH * colIndex,
        };
        this.gridMap.set(`row${rowIndex}-col${colIndex}`, cellCfg);
      });
    });
  };

  initGroup = () => {
    this.renderCell();
    this.renderLine();
  };

  renderCell = () => {
    this.gridMap.forEach((cell) => {
      // this.renderCell(this.tableGroup, cell, config);
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
