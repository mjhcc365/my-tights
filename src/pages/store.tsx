import { createContext, useMemo, useRef } from "react";
import { fabric } from "fabric"
import { makeObservable, observable } from "mobx"
// import { GridsInterface } from "./types"
// import { nanoid } from "nanoid";
import { useImmer } from 'use-immer'
import { autoAction } from "mobx/dist/internal";

export enum HBSType {
    timeLine = "timeLine", //  时间轴
    month = "month", // 月历
    todo = "todo", // todoList
    holes = "holes", // 侧边的洞
    back = "back", // 背景网格|点阵
}

export const hbsTypes: HBSType[] = [HBSType.timeLine, HBSType.month, HBSType.todo]

export const MJ_DATA = "MJ_DATA"

class EditorStore {
    elements = new Map()
    canvas: fabric.Canvas | null = null;
    zoomRatio: number = 5;
    activeObject: fabric.Object | null = null;
    activeType: string | null = null;

    constructor() {
        makeObservable(this, {
            canvas: observable,
            activeObject: observable,
            activeType: observable,
        })
        this.init()
    }
    // 状态改变时自动执行
    handleCanvasChange = () => {
        console.log(this.canvas?.getWidth())
    }

    // 修改监听的对象
    setAObject = (param: fabric.Object | null) => {
        this.activeObject = param
    }

    handleAOChange = () => {
        console.log("11111")
    }


    // 初始化
    init = () => {
        if (localStorage.getItem(MJ_DATA) || "") {
            const data = JSON.parse(localStorage.getItem(MJ_DATA) || "")
            const { canvas, zoomRatio, canvasWidth, canvasHeight } = data || {};
            this.canvas?.loadFromJSON(canvas, () => {
                console.log("==>加载成功")
            })
            this.zoomRatio = zoomRatio || 5;
            this.canvas?.setHeight(canvasHeight);
            this.canvas?.setWidth(canvasWidth)
        }
        this.zoomRatio = 5;
    }

    delElements = () => { }

    setCanvas = (param: any) => {
        this.canvas = param
    }

    // 暂存
    temporaryStorage = () => {
        const data = {
            // elementsMap: this.elementsMap,
            canvas: this.canvas?.toJSON(['groupId', 'selectable']),
            zoomRatio: this.zoomRatio,
            canvasWidth: this.canvas?.getWidth(),
            canvasHeight: this.canvas?.getHeight()
        }
        localStorage.setItem(MJ_DATA, JSON.stringify(data))
    }
    // 删除元素
    // 查找元素
    // 修改元素
}


export const useCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const store = useMemo(() => new EditorStore(), [])
    const [activeObject, setActiveObject] = useImmer(null)


    return {
        canvasRef,
        store,
        activeObject,
        setActiveObject
    }
}

// class 

interface MainContextInterface {
    // canvas: fabric.Canvas | null;
    // setCanvas: any;
    activeObject: fabric.Object | null;
    setActiveObject: any;
    // zoomRatio: number,
    // setZoomRatio: any,
    // activeType: string | null;
    // setActiveType: any;
    store: EditorStore
}

export const MainContext = createContext<MainContextInterface>({} as any)
