// import { GroupProps, TextProps, RectProps } from "fabric";

// export interface BorderProps {
//   borderColor: string;
//   borderDashArray: number[] | null;
//   hasBorders: boolean;
//   borderOpacityWhenMoving: number;
//   borderScaleFactor: number;
// }

export interface BackgroundType {
  color: string;
  opacity: number;
}

export interface ThemeType {
  // 单元格
  cellPadding: number;
  //   cellBorder: BorderProps;
  minRowHeight: number;
  minColumnWidth: number;
  // 字体
  fontSize: number;
  fillText: string;
  // 交互
  fillActive: string;
  fillHover: string; // hover 颜色
  // else
  fillHeader: string;
  resizerSize: number;
}
