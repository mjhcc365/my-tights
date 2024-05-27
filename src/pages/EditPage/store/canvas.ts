import { action, computed, makeAutoObservable, observable } from "mobx";
import { Canvas, FabricObject, Point } from "fabric";
import { nonid } from "@/utils/common";
import { check } from "@/utils/check";
import { verticalLine, horizontalLine } from "@/types/elements";
import { FabricRuler } from "@/extension/fabricRuler";
import { FabricGuide } from "@/extension/fabricGuide";

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

  canvas: Canvas = null;
  activeObj: FabricObject | null = null;

  constructor() {
    makeAutoObservable(this, {
      canvas: observable,
      activeObj: observable,
      zoom: observable,
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

  // loadCanvasFormObj = (snapshot: any) => {
  //   if (!snapshot) return;
  //   this.canvas?.loadFromJSON(snapshot.templates[0], () => {
  //     console.log("==>loadFromJSON", snapshot.templates[0]);
  //   });
  //   this.canvas?.renderAll();
  // };
}

export default FabricCanvas;
