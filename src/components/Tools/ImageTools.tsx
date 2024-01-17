import { useContext, useMemo, useState } from "react"
import { Select, Slider, Button, InputNumber, Popover } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { fabric } from "fabric"
import { MainContext } from "@/store/store"
import "./TextTools.less"
import { Layers } from "./types"

const TextTools = () => {
    const { canvas, activeObject, setActiveObject } = useContext(MainContext);

    const textObj: any = useMemo(() => {
        return canvas?.getActiveObject() || null
    }, [])

    const handleChangeLayer = (value: string) => {
        if (!canvas) return
        switch (value) {
            case "top":
                canvas?.getActiveObject()?.bringToFront();
                break;
            case "pre": // 
                canvas?.getActiveObject()?.bringForward();
                break;
            case "next": // 下一层
                canvas?.getActiveObject()?.sendBackwards();
                break;
            case "bottom": // 底层
                canvas?.getActiveObject()?.sendToBack();
                break;
            default:
                return
        }
    }

    const handleDelEle = () => {
        if (textObj && canvas) {
            canvas.remove(textObj)
            canvas.renderAll();
        }
    }

    const handleImageWidth = (v: any) => {
        setActiveObject((draft: any) => {
            draft.width = v
        })
        canvas?.getActiveObject()?.set({
            width: v
        })
        canvas?.renderAll();

    }

    const handleImageHeight = (v: any) => {
        setActiveObject((draft: any) => {
            draft.height = v
        })
        canvas?.getActiveObject()?.set({
            height: v
        })
        canvas?.renderAll();
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

    //       canvas?.getActiveObject()?.set({
    //         clipPath: rect
    //     })
    //       canvas?.renderAll();
    //     console.log("==>",   canvas?.getActiveObject())
    // }

    const handleOpacity = (v: any) => {
        setActiveObject((draft: any) => {
            draft.opacity = v
        })
        canvas?.getActiveObject()?.set({
            opacity: v
        })
        canvas?.renderAll();
    }

    // const handleClip = () => {
    //     // activeObject
    //       canvas?.getActiveObject()?.set({
    //         __isCropping: true, clipPath: undefined, cropPath: undefined
    //     })
    //       canvas?.renderAll()
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