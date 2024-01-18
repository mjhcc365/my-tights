import { MainContext } from "@/store/store";
import { Button } from "antd";
import { useContext } from "react";
import { fabric } from "fabric"

import rule from "@/assets/cm.svg"



// TODO 添加等分线
// 添加尺子
const ToolsSection = () => {
    const { canvas } = useContext(MainContext);

    const onAddRule = () => {
        fabric.loadSVGFromURL(rule, (objects, options) => {
            // canvas?.add(objects[0]).renderAll();
            const group = new fabric.Group(objects, {
                lockScalingX: true,
                lockScalingY: true,
            })
            canvas?.add(group).renderAll();
            console.log("===>", objects, options)
        })
    }

    return <div>
        <Button onClick={onAddRule}>添加尺子</Button>
        <Button>添加等分线-七等分线-横向-可用部分</Button>
        <Button>添加等分线-两等分线-竖向-可用部分</Button>
    </div>
}

export default ToolsSection