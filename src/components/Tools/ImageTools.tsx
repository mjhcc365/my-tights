import { useContext, useMemo, useState } from "react"
import { Select, Slider, Button, InputNumber, Popover } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { fabric } from "fabric"
import { MainContext } from "@/pages/store"
import "./TextTools.less"
import { Layers } from "./types"

const TextTools = () => {
    const { store, activeObject, setActiveObject } = useContext(MainContext);

    const textObj: any = useMemo(() => {
        return store.canvas?.getActiveObject() || null
    }, [])

    const handleChangeLayer = (value: string) => {
        if (!store.canvas) return
        switch (value) {
            case "top":
                store.canvas?.getActiveObject()?.bringToFront();
                break;
            case "pre": // 
                store.canvas?.getActiveObject()?.bringForward();
                break;
            case "next": // 下一层
                store.canvas?.getActiveObject()?.sendBackwards();
                break;
            case "bottom": // 底层
                store.canvas?.getActiveObject()?.sendToBack();
                break;
            default:
                return
        }
    }

    const handleDelEle = () => {
        if (textObj && store.canvas) {
            store.canvas.remove(textObj)
            store.canvas.renderAll();
        }
    }

    const handleImageWidth = (v: any) => {
        setActiveObject((draft: any) => {
            draft.width = v
        })
        store.canvas?.getActiveObject()?.set({
            width: v
        })
        store.canvas?.renderAll();

    }

    const handleImageHeight = (v: any) => {
        setActiveObject((draft: any) => {
            draft.height = v
        })
        store.canvas?.getActiveObject()?.set({
            height: v
        })
        store.canvas?.renderAll();
    }

    // const handleRadius = () => {
    //     const rectWidth = activeObject?.width || 0;
    //     const rectHeight = activeObject?.height || 0;
    //     const rect = new fabric.Rect({
    //         width: rectWidth,
    //         height: rectHeight,
    //         rx: rectWidth / 2,
    //         ry: rectHeight / 2,
    //         left: -rectWidth / 2,
    //         top: -rectHeight / 2,
    //     })

    //     store.canvas?.getActiveObject()?.set({
    //         clipPath: rect
    //     })
    //     store.canvas?.renderAll();
    //     console.log("==>", store.canvas?.getActiveObject())
    // }

    const handleOpacity = (v: any) => {
        setActiveObject((draft: any) => {
            draft.opacity = v
        })
        store.canvas?.getActiveObject()?.set({
            opacity: v
        })
        store.canvas?.renderAll();
    }

    // const handleClip = () => {
    //     // activeObject
    //     store.canvas?.getActiveObject()?.set({
    //         __isCropping: true, clipPath: undefined, cropPath: undefined
    //     })
    //     store.canvas?.renderAll()
    // }


    console.log("===>", activeObject)
    return <div className="text-tool-panel">
        <InputNumber value={Math.floor(activeObject?.width * activeObject.scaleX)} prefix="W" onChange={handleImageWidth} />
        <InputNumber value={Math.floor(activeObject?.height * activeObject?.scaleY)} prefix="H" onChange={handleImageHeight} />
        <Popover placement="bottom" content={<Slider value={activeObject?.opacity} onChange={handleOpacity} style={{ minWidth: 148 }} min={0} max={1} step={0.01} />} arrow={false}>
            <Button>透明度</Button>
        </Popover>
        {/* <Popover placement="bottom" content={<Slider value={} onChange={handleRadius} style={{ minWidth: 148 }} min={0} max={1} step={0.01} />} arrow={false}>
            <Button >圆角</Button>
        </Popover> */}
        {/* <Button type="text" onClick={ }>翻转</Button> */}
        {/* <Button type="text" onClick={handleClip}>裁剪</Button> */}

        <Select style={{ width: 100 }} placeholder="图层" options={Layers} onChange={handleChangeLayer} />
        {/* <Select defaultValue={textObj?.fontFamily || ""} style={{ width: 100 }} options={[]} onChange={handleChange} /> */}
        {/* <Select defaultValue={`${textObj?.fontSize}` || ""} style={{ width: 75 }} onChange={handleChangeSize} options={ALL_SIZE} /> */}
        <DeleteOutlined style={{ fontSize: "18px", color: "#434343" }} onClick={handleDelEle} />
    </div>
}

export default TextTools