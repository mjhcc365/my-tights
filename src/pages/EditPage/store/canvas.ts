import { action, computed, makeAutoObservable, observable } from "mobx";
import { Canvas, FabricObject } from "fabric";
import { FabricRuler } from "@/app/fabricRuler";
import { HoverBorders } from "@/app/hoverBorders";

class CanvasStore {
  canvas: Canvas | null = null;
  activeObj: FabricObject | null = null;
  zoomRodio: number = 5;

  constructor() {
    makeAutoObservable(this, {
      canvas: observable,
      activeObj: observable,
      zoomRodio: observable,
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
    new FabricRuler(canvas); // 绑定尺子
    new HoverBorders(canvas);
    this.canvas = canvas;
    this.canvas.renderAll();
  };

  @action
  setZoomRodio = (zoomRodio: number) => {
    this.zoomRodio = zoomRodio;
  };

  getCurCanvasObj = () => {
    return this.canvas?.toObject();
  };

  loadCanvasFormObj = (snapshot: any) => {
    if (!snapshot) return;
    this.canvas?.loadFromJSON(snapshot.templates[0], () => {
      console.log("==>loadFromJSON", snapshot.templates[0]);
    });
    this.canvas?.renderAll();
  };
}

export default CanvasStore;
