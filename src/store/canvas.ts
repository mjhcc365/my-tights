import { createContext } from "react";
import { makeObservable } from "mobx";

import { action, computed, makeAutoObservable, observable } from "mobx";
import {
  Canvas,
  FabricObject,
  Point,
  util,
  Line,
  Group,
  Rect,
  Path,
  Circle,
} from "fabric";
import { nanoid } from "nanoid";
import { nonid } from "@/utils/common";
import { check } from "@/utils/check";
import { verticalLine, horizontalLine } from "@/types/elements";
import { FabricGuide } from "@/extension/fabricGuide";
import { initAligningGuidelines } from "@/app/aligning_guidelines";
import { FabricRuler } from "@/extension/fabricRuler";
import { HBSType } from "@/pages/EditPage/components/SizeSection/type";
import { DefaultDPI, DefaultRatio } from "@/configs/size";
import { Padding } from "@/configs/background";
import {
  WorkSpaceClipType,
  WorkSpaceDrawType,
  WorkSpaceMaskType,
  WorkSpaceSafeType,
  WorkSpaceClipColor,
  WorkSpaceSafeColor,
  WorkSpaceMaskColor,
  WorkSpaceThumbType,
  WorkSpaceCommonOption,
} from "@/configs/canvas";
import { LineOption } from "@/types/canvas";
import { TransparentFill } from "@/configs/background";
import { ReferenceLine } from "@/extension/object/ReferenceLine";

import { PaperStore } from "./paperStore";
import {
  A7TempConfig,
  PaperConfig,
} from "@/pages/EditPage/components/SizeSection/usePaperStore";
export const DEFAULT_ZOOM = 5;

export interface IFabricState {
  wrapperRef: null | HTMLDivElement;
  canvasRef: null | HTMLCanvasElement;
  zoom: number;
  clip: number; // 出血尺寸
  safe: number; // 安全尺寸
  round: number; // 圆角尺寸
  diagonal: number; // 角线
  opacity: number; // 蒙版透明度 0-1
  showClip: boolean; // 显示裁切线
  showSafe: boolean; // 显示安全线
  isDragging: boolean;
  isDrawing: boolean;
  isCropping: boolean;
  isTexting: boolean;
  isCtrlKey: boolean;
  isModifed: boolean;
  isChecked: boolean;
  verticalLines: verticalLine[];
  horizontalLines: horizontalLine[];
  elementCoords: Point[];
  elementHover: string;
  scalePercentage: number;
}

export class CanvasStore {
  wrapperRef: null | HTMLDivElement = null;
  canvasRef: null | HTMLCanvasElement = null;
  zoom: number = 5;
  clip: number = 2; // 出血尺寸
  safe: number = 5; // 安全尺寸
  round: number = 0; // 圆角尺寸
  diagonal: number = 18; // 角线
  opacity: number = 1; // 蒙版透明度 0-1
  showClip: boolean = true; // 显示裁切线
  showSafe: boolean = true; // 显示安全线
  isDragging: boolean = false;
  isDrawing: boolean = false;
  isCropping: boolean = false;
  isTexting: boolean = false;
  isCtrlKey: boolean = false;
  isModifed: boolean = false;
  isChecked: boolean = false;
  verticalLines: verticalLine[] = [];
  scalePercentage: number = 1;
  horizontalLines: horizontalLine[] = [];
  elementCoords: Point[] = [];
  elementHover: string = "";

  defaultFont: string = "素材集市康康体"; // 默认字体
  defaultColor: string = "#545454"; // 默认颜色

  canvas!: Canvas;
  activeObj: { [key: string]: any } | null = null;

  paperStore: PaperStore = null as unknown as PaperStore;

  showSafeLine: boolean = true;
  showClipLine: boolean = true;

  constructor() {
    makeObservable(this, {
      canvas: observable,
      activeObj: observable,
      zoom: observable,
      showSafeLine: observable,
      showClipLine: observable,
      defaultFont: observable,
      defaultColor: observable,
      setActiveObj: action,
      setActiveObjParam: action,
      initCanvas: action,
      setWrapperRef: action,
      setCanvasRef: action,
      setZoom: action,
    });
  }

  /** 设置被选中元素 */
  setActiveObj = (activeObj: FabricObject | FabricObject[] | null) => {
    if (!activeObj) {
      this.activeObj = null;
    } else {
      const obj = Array.isArray(activeObj) ? activeObj[0] : activeObj;
      const nextObj = {};
      Object.keys(obj).map((key) => {
        if (typeof obj[key] !== "function" && typeof obj[key] !== "object") {
          nextObj[key] = obj[key];
        }
      });
      nextObj.type = obj?.type;
      this.activeObj = nextObj;
    }
  };

  /** 改变被选中元素属性 */
  setActiveObjParam = (key: string, value?: any) => {
    this.canvas?.getActiveObject()?.set({ [key as any]: value });
    this.activeObj[key] = value;
    if (key === "fontFamily") {
      this.setDefaultFont(value);
    }
    if (key === "fill") {
      this.setDefaultColor(value);
    }
    this.canvas?.renderAll();
  };

  /** 设置全局默认颜色 */
  setDefaultColor = (color: string) => {
    this.defaultColor = color;
  };

  /** 设置全局默认字体 */
  setDefaultFont = (font: string) => {
    this.defaultFont = font;
  };

  initCanvas = (canvas: Canvas) => {
    new FabricGuide(canvas);
    new FabricRuler(canvas);

    this.canvas = canvas;
    this.paperStore = new PaperStore(A7TempConfig);

    // todo 拖拽过程中 更新active参数
    this.canvas.on("mouse:down", (event) => {
      this.setActiveObj(event.target as any);
    });

    const w = this.paperStore.paperConfig.width * this.zoom;
    const h = this.paperStore.paperConfig.height * this.zoom;
    const x = this.canvas.width * 0.5;
    const y = this.canvas.height * 0.5;

    const rect = new Rect({
      id: WorkSpaceDrawType,
      name: "rect",
      fill: "#ffffff",
      selectable: false,
      evented: false,
      lockMovementX: false,
      lockMovementY: false,
      objectCaching: true,
      transparentCorners: false,
      hasBorders: true,
      originX: "left",
      originY: "top",
      left: x - w * 0.5,
      top: Math.max(y - h * 0.5, 64),
      width: w,
      height: h,
    });

    this.canvas.add(rect);
    this.initCommon();
    this.canvas.renderAll();
  };

  setWrapperRef = (ref: HTMLDivElement) => {
    this.wrapperRef = ref;
  };

  setCanvasRef = (ref: HTMLCanvasElement) => {
    this.canvasRef = ref;
  };

  addObject = (obj: FabricObject[] | FabricObject) => {
    if (Array.isArray(obj)) {
      obj.forEach((ele) => {
        this.canvas.add(this.setDefaultAttr(ele as any));
      });
    } else {
      const o = this.setDefaultAttr(obj as any);
      this.canvas.add(o);
      this.setActiveObj(
        this.canvas
          .getObjects()
          .filter((objects) => (objects as any).id === o.id)
      );
    }
  };

  getWorkSpaceDraw = () => {
    const workSpaceDraw = this.canvas
      .getObjects()
      .filter((ele) => (ele as any)?.id === WorkSpaceDrawType)[0];
    if (!workSpaceDraw) return null;
    return workSpaceDraw;
  };

  setDefaultAttr(target: FabricObject & { name: string; id: string }) {
    // 添加name
    if (!target.name) {
      target.set({ name: target.type });
    }
    // 添加id
    if (!target.id) {
      target.set({ id: nonid(8) });
    }

    if (!target.top) {
      const { y = 100 } = this.getCenterPoint();
      target.set({ top: y - (target?.height || 100) * 0.5 });
    }

    if (!target.left) {
      const { x = 100 } = this.getCenterPoint();
      target.set({ left: x - (target?.width || 100) * 0.5 });
    }

    if (check.isTextObject(target)) {
      target.set({ color: target.fill });
    }
    if (check.isCollection(target)) {
      target._objects.forEach((obj) => {
        this.setDefaultAttr(obj as any);
      });
    }
    return target;
  }

  setCanvasPercentage = (val: number) => {
    this.scalePercentage = val;
    const { x, y } = this.getCenterPoint();
    this.canvas.zoomToPoint(new Point({ x, y }), val);
  };

  getCurCanvasObj = () => {
    return this.canvas?.toObject();
  };

  initCommon = () => {
    const workSpaceDraw = this.canvas
      .getObjects()
      .filter((ele) => ele.id === WorkSpaceDrawType)[0];
    if (!workSpaceDraw) return;
    const workWidth = workSpaceDraw.width,
      workHeight = workSpaceDraw.height;
    const PaddingHalf = Padding / 2;
    const clipPX = (this.clip * DefaultDPI) / DefaultRatio;
    const diagonalPX = (this.diagonal * DefaultDPI) / DefaultRatio;
    const safePX = (2 * this.safe * DefaultDPI) / DefaultRatio;
    const left = workSpaceDraw.left,
      top = workSpaceDraw.top;

    const workSpaceClip = new Rect({
      left: left + clipPX,
      top: top + clipPX,
      width: workWidth - 2 * clipPX,
      height: workHeight - 2 * clipPX,
      fill: TransparentFill,
      stroke: WorkSpaceClipColor, // 边框颜色
      strokeWidth: 1, // 边框大小
      visible: this.showClip,
      id: WorkSpaceClipType,
      ...WorkSpaceCommonOption,
    });

    const workSpaceSafe = new Rect({
      left: left + safePX,
      top: top + safePX,
      width: workWidth - 2 * safePX,
      height: workHeight - 2 * safePX,
      fill: TransparentFill,
      stroke: WorkSpaceSafeColor, // 边框颜色
      strokeWidth: 1, // 边框大小
      visible: this.showSafe,
      id: WorkSpaceSafeType,
      ...WorkSpaceCommonOption,
    });

    // const maskPath = `M0 0 L${Padding} 0 L${Padding} ${Padding} L0 ${Padding} L0 0 Z
    //   M${PaddingHalf + left} ${PaddingHalf + top}
    //   L${PaddingHalf + left} ${PaddingHalf + top + workHeight}
    //   L${PaddingHalf + left + workWidth} ${PaddingHalf + top + workHeight}
    //   L${PaddingHalf + left + workWidth} ${PaddingHalf + top}
    //   L${PaddingHalf + left} ${PaddingHalf + top} Z`;

    // const workSpaceMask = new Path(maskPath, {
    //   left: -PaddingHalf,
    //   top: -PaddingHalf,
    //   fill: WorkSpaceMaskColor,
    //   opacity: this.opacity,
    //   id: WorkSpaceMaskType,
    //   originX: "left",
    //   originY: "top",
    //   ...WorkSpaceCommonOption,
    // });
    // [lineEnd, lineHeight, leftStart, top] 终止位置，线长，起始位置，top
    const diagonalHalfPX = diagonalPX / 2;
    const diagonals: LineOption[] = [
      // 左上水平
      [
        PaddingHalf - diagonalHalfPX - clipPX,
        PaddingHalf + clipPX,
        PaddingHalf - diagonalHalfPX / 2 - clipPX,
        PaddingHalf + clipPX,
      ],
      // 左上垂直
      [
        PaddingHalf,
        PaddingHalf - diagonalHalfPX,
        PaddingHalf,
        PaddingHalf - diagonalHalfPX / 2,
      ],

      // 左下水平
      [
        PaddingHalf - diagonalHalfPX - clipPX,
        PaddingHalf + workHeight - clipPX,
        PaddingHalf - diagonalHalfPX / 2 - clipPX,
        PaddingHalf + workHeight - clipPX,
      ],
      // 左下垂直
      [
        PaddingHalf,
        PaddingHalf + diagonalHalfPX + workHeight,
        PaddingHalf,
        PaddingHalf + workHeight + diagonalHalfPX / 2,
      ],

      // 右上水平
      [
        PaddingHalf + workWidth + clipPX,
        PaddingHalf + clipPX,
        PaddingHalf + workWidth + diagonalHalfPX / 2 + clipPX,
        PaddingHalf + clipPX,
      ],
      // 右上垂直
      [
        PaddingHalf + workWidth - clipPX * 2,
        PaddingHalf - diagonalHalfPX,
        PaddingHalf + workWidth - clipPX * 2,
        PaddingHalf - diagonalHalfPX / 2,
      ],

      // 右下水平
      [
        PaddingHalf + workWidth + clipPX,
        PaddingHalf + workHeight - clipPX,
        PaddingHalf + workWidth + diagonalHalfPX / 2 + clipPX,
        PaddingHalf + workHeight - clipPX,
      ],
      // 右下垂直
      [
        PaddingHalf + workWidth - clipPX * 2,
        PaddingHalf + diagonalHalfPX + workHeight,
        PaddingHalf + workWidth - clipPX * 2,
        PaddingHalf + workHeight + diagonalHalfPX / 2,
      ],
    ];
    const diagonalLines: Line[] = [];
    diagonals.forEach((line) => {
      const diagonalLine = new Line(line, {
        selectable: false,
        hoverCursor: "default",
        evented: false,
        excludeFromExport: false,
        hasBorders: false,
        perPixelTargetFind: true,
        strokeWidth: 1,
        stroke: WorkSpaceClipColor,
      });
      diagonalLines.push(diagonalLine);
    });

    const workLineGroup = new Group([...diagonalLines], {
      // @ts-ignore
      id: WorkSpaceClipType,
      left: left - diagonalHalfPX,
      top: top - diagonalHalfPX,
      visible: this.showClip,
      ...WorkSpaceCommonOption,
    });

    this.canvas.add(workSpaceClip);
    this.canvas.add(workSpaceSafe);
    this.canvas.add(workLineGroup);
    // this.canvas.add(workSpaceMask);
    this.canvas.renderAll();

    this.canvas.getObjects("ReferenceLine").forEach((item) => {
      const referenceLine = item as ReferenceLine;
      referenceLine.set({
        selectable: true,
        hasControls: false,
        hasBorders: false,
        padding: 5,
      });
      this.canvas.bringObjectToFront(referenceLine);
      this.canvas.renderAll();
    });
  };

  /** 隐藏|显示 出血线 */
  toggleSafeLine = () => {
    const obj = this.canvas
      .getObjects()
      .filter((ele) => ele?.id === "WorkSpaceSafeType");
    obj.map((item) => item.set({ visible: !this.showSafeLine }));
    this.showSafeLine = !this.showSafeLine;
    this.canvas?.renderAll();
  };

  /** 隐藏|显示 安全线 */
  toggleClipLine = () => {
    const obj = this.canvas
      .getObjects()
      .filter((ele) => ele?.id === "WorkSpaceClipType");
    obj.map((item) => item.set({ visible: !this.showClipLine }));
    this.showClipLine = !this.showClipLine;
    this.canvas?.renderAll();
  };

  /** backend */
  /** 设置背景 */
  setBackColor = (hex: string) => {
    const backend = this.getWorkSpaceDraw();
    backend?.set({ fill: hex });
    this.canvas.renderAll();
  };

  /** 获取画板的中心 */
  getCenterPoint = (): { x: number; y: number } => {
    // console.log(this.canvas);
    return {
      x: this.getWorkSpaceDraw()?.getCenterPoint().x || 100,
      y: this.getWorkSpaceDraw()?.getCenterPoint().y || 100,
    };
  };

  /** 获取背景板的top,left */
  getBackTL = () => {
    const backend = this.getWorkSpaceDraw();
    return {
      top: backend?.top,
      left: backend?.left,
    };
  };

  /** 获取背景板的宽高 */
  getWrapperRefCenter = (): { x: number; y: number } => {
    return {
      x: (this.wrapperRef?.getBoundingClientRect()?.width || 100) * 0.5,
      y: (this.wrapperRef?.getBoundingClientRect()?.height || 100) * 0.5,
    };
  };

  /** 设置背景的大小 */
  setBackSize = (width = 100, height = 100) => {
    const { x, y } = this.getCenterPoint();
    const top = y - height * 0.5;
    const left = x - width * 0.5;

    this.canvas
      .getObjects()
      .filter((objects) => [WorkSpaceDrawType].includes((objects as any)?.id))
      .map((rect) => {
        rect.set({
          top,
          left,
          width,
          height,
        });
      });

    const clipPX = (this.clip * DefaultDPI) / DefaultRatio;
    const safePX = (2 * this.safe * DefaultDPI) / DefaultRatio;

    this.canvas
      .getObjects()
      .filter((objects) => [WorkSpaceSafeType].includes((objects as any)?.id))
      .map((rect) => {
        rect.set({
          left: left + safePX,
          top: top + safePX,
          width: width - 2 * safePX,
          height: height - 2 * safePX,
        });
      });

    this.canvas
      .getObjects()
      .filter((objects) => [WorkSpaceClipType].includes((objects as any)?.id))
      .map((rect) => {
        rect.set({
          left: left + clipPX,
          top: top + clipPX,
          width: width - 2 * clipPX,
          height: height - 2 * clipPX,
        });
      });

    this.canvas.renderAll();
  };

  /** 等比例缩放 */
  setZoom = (nextZoom: number) => {
    this.zoom = nextZoom;
  };

  // 画网格
  drawGridTexture = (stroke: string, paperConfig: PaperConfig) => {
    const { width, height, top, left } =
      this.getWorkSpaceDraw() as FabricObject;
    const cWidth = width;
    const cHeight = height;
    const selfZoom = 3.5;
    const lineGap = paperConfig.lineConfig.gap * this.zoom * selfZoom;
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

    this.addObject(group);
    this.canvas?.renderAll();
  };
  // 画横线
  drawLineTexture = (stroke: string, paperConfig: PaperConfig) => {
    const { width, height, top, left } =
      this.getWorkSpaceDraw() as FabricObject;
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
    this.addObject(group);
    this.canvas?.renderAll();
  };

  // 画点阵
  drawDotsTexture = (stroke: string, paperConfig: PaperConfig) => {
    const { width, height, top, left } =
      this.getWorkSpaceDraw() as FabricObject;
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
    this.addObject(group);
    this.canvas.sendObjectToBack(group);
    this.canvas.bringObjectForward(group);
    this.canvas?.renderAll();
  };

  /** 清除画板背景 */
  onClearBackTexture = () => {
    this.canvas?.getObjects().forEach((ele) => {
      if ((ele as any).hbsType === HBSType.back) {
        this.canvas?.remove(ele);
      }
    });
    this.canvas?.renderAll();
  };
}

export const CanvasStoreContext = createContext<CanvasStore>(
  null as unknown as CanvasStore
);
