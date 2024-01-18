import { fabric } from "fabric";
import { Button } from "antd"
import rule from "@/assets/cm.svg"
import { useContext } from "react";
import { MainContext } from "@/store/store";

const Rule = () => {
    const { canvas } = useContext(MainContext);
    const onAddRule = () => {
        fabric.loadSVGFromURL(rule, (objects, options) => {
            const group = new fabric.Group(objects, {
                lockScalingX: true,
                lockScalingY: true,
            })
            canvas?.add(group).renderAll();
            console.log("===>", objects, options)
        })
    }

    return <div>
        <Button>添加尺子</Button>
    </div>
}

export default Rule