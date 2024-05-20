import { GroupProps } from "fabric";
import { ThemeType } from "./interface/theme";

export const defaultGroupProps: Partial<GroupProps> = {
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
  backgroundColor: "pink",
  // opacity: 0.5,
};

export const defaultTheme: ThemeType = {
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
