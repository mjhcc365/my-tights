import { fabric } from "fabric";
import { Button } from "antd"
import { stores as store } from "@/store/main";
import rule from "@/assets/cm.svg"

const Rule = () => {
    const onAddRule = () => {
        fabric.loadSVGFromURL(rule, (objects, options) => {
            const group = new fabric.Group(objects, {
                lockScalingX: true,
                lockScalingY: true,
            })
            store.canvasStore.canvas?.add(group).renderAll();
            console.log("===>", objects, options)
        })
    }

    return <div>
        <Button>添加尺子</Button>
    </div>
}

export default Rule