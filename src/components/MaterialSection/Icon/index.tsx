import { Button } from "antd"
import { fabric } from "fabric"
import svg from "@/assets/iconfont/weixin.svg"
import { stores as store } from "@/store/main"


const Icon = () => {
    const onAddIcon = () => {
        fabric.loadSVGFromURL(svg, (objects, options) => {
            store?.canvasStore.canvas?.add(objects[0]).renderAll();
        })
    }
    return <div>
        <Button onClick={onAddIcon}>添加一个icon</Button>
    </div>
}

export default Icon