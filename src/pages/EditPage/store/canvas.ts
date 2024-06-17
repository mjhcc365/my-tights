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
} from "fabric";
import { nonid } from "@/utils/common";
import { check } from "@/utils/check";
import { verticalLine, horizontalLine } from "@/types/elements";
import { FabricRuler } from "@/extension/fabricRuler";
import { FabricGuide } from "@/extension/fabricGuide";
// import Hammer from "hammerjs";
// import useCanvas from './useCanvas'
// import { Point, Object as FabricObject, util } from 'fabric'

// import { useFabricStore, useTemplatesStore } from "@/store";
import { DefaultDPI, DefaultRatio } from "@/configs/size";
import { Padding } from "@/configs/background";
// import { storeToRefs } from "pinia"
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
// import useCanvas from "./useCanvas";
import { ReferenceLine } from "@/extension/object/ReferenceLine";
// import { stores } from "@/pages/EditPage/store/main";

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

class FabricCanvas {
  wrapperRef: null | HTMLDivElement = null;
  canvasRef: null | HTMLCanvasElement = null;
  zoom: number = 1;
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
  scalePercentage: number = 75;
  verticalLines: verticalLine[] = [];
  horizontalLines: horizontalLine[] = [];
  elementCoords: Point[] = [];
  elementHover: string = "";

  canvas: Canvas | null = null;
  activeObj: FabricObject | null = null;

  showSafeLine: boolean = true;
  showClipLine: boolean = true;
  ruler: any = null;

  constructor() {
    makeAutoObservable(this, {
      canvas: observable,
      activeObj: observable,
      zoom: observable,
      showSafeLine: observable,
      showClipLine: observable,
      ruler: observable,
    });
  }

  @computed get activeType() {
    return this.activeObj?.type;
  }

  @action
  setActiveObj = (activeObj: FabricObject | null) => {
    this.activeObj = activeObj;
  };

  @action
  setActiveObjParam = (k: any, v: any) => {
    this.activeObj[k] = v;
    this.canvas?.getActiveObject()?.set({
      [k]: v,
    });
    this.canvas?.renderAll();
  };

  @action
  initCanvas = (canvas: Canvas) => {
    new FabricRuler(canvas);
    new FabricGuide(canvas);
    this.canvas = canvas;
    const rect = new Rect({
      id: "WorkSpaceDrawType",
      name: "rect",
      fill: "#ffffff",
      selectable: false,
      evented: false,
      lockMovementX: false,
      lockMovementY: false,
      objectCaching: true,
      transparentCorners: false,
      hasBorders: true,
      type: "Rect",
      originX: "left",
      originY: "top",
      left: 0,
      top: 0,
      width: this.canvas.width - 100,
      height: this.canvas.height - 40,
    });

    this.canvas.add(rect);
    this.initCommon();
    this.canvas.renderAll();
  };

  @action
  setWrapperRef = (ref: HTMLDivElement) => {
    this.wrapperRef = ref;
  };

  @action
  setCanvasRef = (ref: HTMLCanvasElement) => {
    this.canvasRef = ref;
  };

  @action
  setZoomRodio = (zoomRodio: number) => {
    this.zoom = zoomRodio;
  };

  @action
  addObject = (obj: FabricObject[] | FabricObject) => {
    if (Array.isArray(obj)) {
      obj.forEach((ele) => {
        this.canvas.add(this.setDefaultAttr(ele as any));
      });
    } else {
      this.canvas.add(this.setDefaultAttr(obj as any));
    }
  };

  private setDefaultAttr(target: FabricObject & { name: string; id: string }) {
    // 添加name
    if (!target.name) {
      target.set({ name: target.type });
    }
    // 添加id
    if (!target.id) {
      target.set({ id: nonid(8) });
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
  };

  getWidth = () => {
    return this.wrapperRef?.offsetWidth || window.innerWidth - 420;
  };

  getHeight() {
    return this.wrapperRef?.offsetHeight || window.innerHeight - 40;
  }

  getCurCanvasObj = () => {
    return this.canvas?.toObject();
  };

  initCommon = () => {
    const workSpaceDraw = this.canvas
      .getObjects()
      .filter((ele) => ele.id === WorkSpaceDrawType)[0];
    if (!workSpaceDraw) return;
    // const fabricStore = useFabricStore();
    // const templatesStore = useTemplatesStore()
    // const { currentTemplate } = storeToRefs(templatesStore)

    // this.canvas.remove(
    //   ...this.canvas
    //     .getObjects()
    //     .filter((ele) => WorkSpaceThumbType.includes(ele.id))
    // );
    // const workWidth = currentTemplate.value.width / currentTemplate.value.zoom
    // const workHeight = currentTemplate.value.height / currentTemplate.value.zoom
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

    const maskPath = `M0 0 L${Padding} 0 L${Padding} ${Padding} L0 ${Padding} L0 0 Z 
      M${PaddingHalf + left} ${PaddingHalf + top} 
      L${PaddingHalf + left} ${PaddingHalf + top + workHeight} 
      L${PaddingHalf + left + workWidth} ${PaddingHalf + top + workHeight} 
      L${PaddingHalf + left + workWidth} ${PaddingHalf + top} 
      L${PaddingHalf + left} ${PaddingHalf + top} Z`;

    const workSpaceMask = new Path(maskPath, {
      left: -PaddingHalf,
      top: -PaddingHalf,
      fill: WorkSpaceMaskColor,
      opacity: this.opacity,
      id: WorkSpaceMaskType,
      originX: "left",
      originY: "top",
      ...WorkSpaceCommonOption,
    });
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
    this.canvas.add(workSpaceMask);
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
    console.log("===>obj", obj);
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

  /** 隐藏|显示 标尺 */
  toggleRuler = () => {
    this.canvas.ruler.enabled = !this.canvas?.ruler?.enabled;
  };
}

export default FabricCanvas;
