import { Button } from "antd"
import { fabric } from "fabric"
import { stores as store } from "@/store/main"


const Line = () => {
    const onAddLine = () => {
        const cw = store?.canvasStore.canvas?.getWidth() || 0
        const ch = store?.canvasStore.canvas?.getHeight() || 0

        const line = new fabric.Line([0, ch / 2, cw, ch / 2], {
            stroke: '#000',  // 边框颜色
            strokeWidth: 2,
        })
        store?.canvasStore.canvas?.add(line)
    }

    return <div>
        <Button onClick={onAddLine}>添加横线</Button>
    </div>
}

export default Line