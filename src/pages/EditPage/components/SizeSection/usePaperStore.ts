import { useImmer } from "use-immer";
import { Line, Group, Circle, FabricObject } from "fabric";
import { nanoid } from "nanoid";

import forDots from "@/assets/backicon/four-dots.svg";
import lines from "@/assets/backicon/lines.svg";
import rectangle from "@/assets/backicon/rectangle.svg";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import { HBSType } from "./type";

export enum PaperBackType {
  threeDots = "threeDots",
  forDots = "forDots",
  lines = "lines",
  rectangle = "rectangle",
  note = "note",
  triangle = "triangle",
  hexagon = "hexagon",
}

export const PaperBackArray = [
  {
    value: PaperBackType.forDots,
    src: forDots,
  },
  {
    value: PaperBackType.lines,
    src: lines,
  },
  {
    value: PaperBackType.rectangle,
    src: rectangle,
  },
];

// 管理背景
const usePaperStore = () => {
  const [paperConfig, setPaperConfig] = useImmer(A7TempConfig);
  const store = useContext(CanvasStoreContext);
  // 画网格
  const drawGridTexture = (stroke: string) => {
    const { width, height, top, left } =
      store.getWorkSpaceDraw() as FabricObject;
    const cWidth = width;
    const cHeight = height;
    const selfZoom = 3.5;
    const lineGap = paperConfig.lineConfig.gap * store.zoom * selfZoom;
    // 定义网格线的间距
    const lines = [];
    // 绘制横向网格线
    for (var i = 0; i <= cHeight; i += lineGap) {
      const cline = new Line([0, i, cWidth, i], {
        stroke: stroke || paperConfig.lineConfig.stroke,
      });
      lines.push(cline);
    }
    // 绘制纵向网格线
    for (var j = 0; j <= cWidth; j += lineGap) {
      const vline = new Line([j, 0, j, cHeight], {
        stroke: paperConfig.lineConfig.stroke,
        selectable: false,
      });
      lines.push(vline);
    }
    const group = new Group(lines, {
      top,
      left,
      hbsId: nanoid(),
      hbsType: HBSType.back,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
    } as any);

    store.addObject(group);
    store.canvas?.renderAll();
  };
  // 画横线
  const drawLineTexture = (stroke: string) => {
    const { width, height, top, left } =
      store.getWorkSpaceDraw() as FabricObject;
    const cWidth = width;
    const cHeight = height;

    const lineGap = paperConfig.lineConfig.gap * 5;
    const lines = [];
    // 绘制横向网格线
    for (var i = 0; i <= cHeight; i += lineGap) {
      const cline = new Line([0, i, cWidth, i], {
        stroke: stroke,
      });
      lines.push(cline);
    }
    const group = new Group(lines, {
      top,
      left,
      id: nanoid(),
      hbsType: HBSType.back,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
    } as any);
    store.addObject(group);
    store.canvas?.renderAll();
  };

  // 画点阵
  const drawDotsTexture = (stroke: string) => {
    const { width, height, top, left } =
      store.getWorkSpaceDraw() as FabricObject;
    const cWidth = width;
    const cHeight = height;

    const lineGap = paperConfig.lineConfig.gap * 5;
    // 定义网格线的间距
    const dots = [];
    for (var i = 0; i <= cWidth; i += lineGap) {
      for (var j = 0; j <= cHeight; j += lineGap) {
        const dot = new Circle({
          top: j,
          left: i,
          radius: 1,
          stroke: stroke,
        });
        dots.push(dot);
      }
    }
    const group = new Group(dots, {
      top,
      left,
      hbsId: nanoid(),
      hbsType: HBSType.back,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
    } as any);
    store.addObject(group);
    store.canvas?.renderAll();
  };
  // 画点阵
  return {
    paperConfig,
    setPaperConfig,
    drawGridTexture, // 绘制网格纹理
    drawLineTexture, // 绘制横线纹理
    drawDotsTexture, // 绘制点阵纹理
  };
};

export enum PaperTempType {
  A7 = "A7",
  M5 = "M5",
  selfdesign = "selfdesign",
}

export const PaperTempOptions = [
  {
    label: "A7 120mm*80mm",
    value: PaperTempType.A7,
  },
  {
    label: "M5 105mm*67mm",
    value: PaperTempType.M5,
  },
];

export interface SileHoles {
  holesSize?: number;
  holesNum?: number;
  holesLeft?: number;
  holesGroupGap?: number;
  holesGap?: number;
}

export interface LineConfig {
  stroke: string;
  strokeWidth: number;
  strokeDashArray: number[];
}

export interface LineConfigType extends LineConfig {
  gap: number;
}

export interface PaperConfig {
  // 模板类型
  curTempType: PaperTempType;
  // 画布尺寸
  width: number;
  height: number;
  backgroundColor: string; // 纸张的背景颜色
  // 活页孔
  sideHoles?: SileHoles;
  // 背景的类型
  backConfig: PaperBackType;
  // 是否展示背景颜色
  showBackColor: boolean;
  // 是否展示侧边活页孔
  showHole: boolean;
  // 是否展示侧边活页孔
  showBackTexture: boolean;
  lineConfig: LineConfigType;
  // // 网格属性
  // gridConfig?: GridConfigType;
  // // 横线属性
  // lineConfig?: LineConfigType;
  // // 点阵属性
  // dotsConfig?: DotsConfigType;
}

export const A7TempConfig: PaperConfig = {
  curTempType: PaperTempType.A7,
  width: 80,
  height: 120,
  backgroundColor: "#fff",
  sideHoles: {
    holesSize: 2,
    holesNum: 6,
    holesLeft: 2,
    holesGroupGap: 19,
    holesGap: 19,
  },
  backConfig: PaperBackType.rectangle,
  showBackColor: true,
  showHole: true,
  showBackTexture: true,
  lineConfig: {
    stroke: "#f5f5f5",
    strokeWidth: 1,
    strokeDashArray: [2, 2],
    gap: 3.5,
  },
};

export default usePaperStore;
