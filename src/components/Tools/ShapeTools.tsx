import { MainContext } from "@/store/store";
import { useContext } from "react";
import { ColorPicker, Tooltip, Popover, Slider, Button } from "antd";
import { BorderOuterOutlined, DeleteOutlined } from "@ant-design/icons"

import "./TextTools.less"
import "./ShapeTools.less"

const ShapeTools = () => {
    const { canvas, activeObject, setActiveObject } = useContext(MainContext)

    const onAddBorder = () => {
        setActiveObject((draft: any) => {
            draft.stroke = "#eee";
            draft.strokeWidth = 5
        })
        canvas?.getActiveObject()?.set({
            stroke: "#eee",
            strokeWidth: 5,
            strokeDashArray: undefined,// 虚线：[5, 5] 点线：[2, 2] 长短交替：[10, 5]

        })
        canvas?.renderAll()
    }

    const onStrokeWidthChange = (v) => {
        setActiveObject((draft: any) => {
            draft.strokeWidth = v
        })
        canvas?.getActiveObject()?.set({
            strokeWidth: v,
        })
        canvas?.renderAll()
    }

    const onRadiusChange = (v: any) => {
        console.log(v)
    }


    const onStrokeColorChange = (v: any) => {
        setActiveObject((draft: any) => {
            draft.stroke = v.toHexString()
        })
        canvas?.getActiveObject()?.set({
            stroke: v.toHexString(),
        })
        canvas?.renderAll()
    }


    const onFillColorChange = (v: any) => {
        setActiveObject((draft: any) => {
            draft.fill = v.toHexString()
        })
        canvas?.getActiveObject()?.set({
            fill: v.toHexString(),
        })
        canvas?.renderAll()

    }

    const handleDelEle = () => {
        if (activeObject && canvas) {
            canvas.remove(canvas.getActiveObject())
            canvas.renderAll();
            setActiveObject(() => null)
        }
    }


    return <div className="text-tool-panel">
        <Tooltip placement="bottom" title={'颜色'}>
            <ColorPicker onChange={onFillColorChange} value={activeObject?.fill as any} />
        </Tooltip>
        <Popover placement="bottom" trigger={"hover"} title="边框样式" content={
            <div className="stroke-tools">
                <ColorPicker allowClear value={activeObject?.stroke} onChange={onStrokeColorChange} />
                <div>
                    <Button>无</Button>
                    <Button onClick={onAddBorder}>--</Button>
                    <Button onClick={onAddBorder}>- -</Button>
                    <Button onClick={onAddBorder}>==</Button>
                </div>
                <div>边框粗细 { }</div>
                <Slider onChange={onStrokeWidthChange} min={0} max={100} />
                <div>圆角 { }</div>
                <Slider onChange={onRadiusChange} min={0} max={100} />
            </div>}>
            <BorderOuterOutlined />
        </Popover>
        <DeleteOutlined style={{ fontSize: "18px", color: "#434343" }} onClick={handleDelEle} />

    </div>
}

export default ShapeTools;