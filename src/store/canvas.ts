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
    setCanvas = (canvas: fabric.Canvas | null) => {
        this.canvas = canvas;
    }

    @action
    setZoomRodio = (zoomRodio: number) => {
        this.zoomRodio = zoomRodio;
    }

}


export default CanvasStore