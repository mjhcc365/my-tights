import { useImmer } from "use-immer";

import forDots from "@/assets/backicon/four-dots.svg";
import lines from "@/assets/backicon/lines.svg";
import rectangle from "@/assets/backicon/rectangle.svg";
import { useContext } from "react";
import { CanvasStoreContext } from "@/store/canvas";
import { SIZE_Type } from "./type";

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

  // 画点阵
  return {
    paperConfig,
    setPaperConfig,
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
    value: SIZE_Type.a7,
  },
  {
    label: "M5 105mm*67mm",
    value: SIZE_Type.m5,
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
  curTempType: SIZE_Type;
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
  curTempType: SIZE_Type.a7,
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
export const A5TempConfig: PaperConfig = {
  curTempType: SIZE_Type.m5,
  width: 67,
  height: 105,
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

export const paperConfigMap = {
  [SIZE_Type.a7]: A7TempConfig,
  [SIZE_Type.m5]: A5TempConfig,
};

export default usePaperStore;
