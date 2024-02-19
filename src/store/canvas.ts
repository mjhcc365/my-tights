import { action, computed, makeAutoObservable, observable } from "mobx"
import { fabric } from "fabric"


class CanvasStore {
    canvas: fabric.Canvas | null = null;
    activeObj: fabric.Object | null = null;
    zoomRodio: number = 5

    constructor() {
        makeAutoObservable(this, {
            canvas: observable,
            activeObj: observable,
            zoomRodio: observable
        })
    }

    @computed get activeType() {
        return this.activeObj?.type
    }

    @action
    setActiveObj = (activeObj: fabric.Object | null) => {
        this.activeObj = activeObj
    }

    @action
    setActiveObjParam = (k: any, v: any) => {
        this.activeObj[k] = v
        this.canvas?.getActiveObject()?.set({
            [k]: v
        })
        this.canvas?.renderAll()
    }

    @action
    setCanvas = (canvas: fabric.Canvas | null) => {
        this.canvas = canvas;
    }

    @action
    setZoomRodio = (zoomRodio: number) => {
        this.zoomRodio = zoomRodio;
    }

    getCurCanvasObj = () => {
        return this.canvas?.toObject()
    }

    loadCanvasFormObj = (snapshot: any) => {
        if (!snapshot) return
        this.canvas?.loadFromJSON(snapshot.templates[0], () => {
            console.log("==>loadFromJSON", snapshot.templates[0])
        })
        this.canvas?.renderAll()
    }
}


export default CanvasStore