import { createContext, useRef, useState } from "react";
import { fabric } from "fabric"
import { useImmer } from 'use-immer'

export enum HBSType {
    timeLine = "timeLine", //  时间轴
    month = "month", // 月历
    todo = "todo", // todoList
    holes = "holes", // 侧边的洞
    back = "back", // 背景网格|点阵
}

export const hbsTypes: HBSType[] = [HBSType.timeLine, HBSType.month, HBSType.todo]

export const MJ_DATA = "MJ_DATA"


export const useCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [zoomRatio, setZoomRatio] = useState<number>(5)
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
    const [activeObject, setActiveObject] = useImmer(null);

    // 背景

    // 从localStorege获取原始数据
    const init = (): fabric.Canvas => {
        const cWidth = Math.floor((80 * 5 || 0));
        const cHeight = Math.floor((120 * 5 || 0))
        const options = {
            backgroundColor: '#fff',
            width: cWidth,
            height: cHeight,
            absolutePositioned: true,
            selectable: false,
        }
        const newCanvas = new fabric.Canvas(canvasRef.current, options);
        if (localStorage.getItem(MJ_DATA) || "") {
            const data = JSON.parse(localStorage.getItem(MJ_DATA) || "")
            const { canvas, zoomRatio, canvasWidth, canvasHeight } = data || {};
            newCanvas?.loadFromJSON(canvas, () => {
                console.log("==>加载成功")
                newCanvas?.renderAll()
            })
            setZoomRatio(() => zoomRatio)
            newCanvas?.setHeight(canvasHeight);
            newCanvas?.setWidth(canvasWidth)
        }
        return newCanvas
    }

    const temporaryStorage = () => {
        // const data = {
        //     //     lockRotation: true,
        //     //     lockMovementX: true,
        //     //     lockMovementY: true,
        //     //     lockScalingX: true,
        //     //     lockScalingY: true
        //     canvas: canvas?.toJSON(['groupId', 'selectable', "hbsType", 'fontFamily', "lockRotation", "lockMovementX", "lockMovementY"]),
        //     zoomRatio: zoomRatio,
        //     canvasWidth: canvas?.getWidth(),
        //     canvasHeight: canvas?.getHeight()
        // }
        // localStorage.setItem(MJ_DATA, JSON.stringify(data))
    }

    return {
        canvasRef,
        canvas,
        setCanvas,
        activeObject,
        setActiveObject,
        init,
        temporaryStorage,
        zoomRatio,
        setZoomRatio,
    }
}

interface MainContextInterface {
    canvas: fabric.Canvas | null;
    setCanvas: any;
    activeObject: fabric.Object | null;
    setActiveObject: any;
    zoomRatio: number,
    temporaryStorage: () => void
}

export const MainContext = createContext<MainContextInterface>({} as any)
