import { Button } from "antd"
import { useContext } from "react"
import { fabric } from "fabric"
import { MainContext } from "@/store/store"


const Line = () => {
    const { canvas } = useContext(MainContext)
    const onAddLine = () => {
        const cw = canvas?.getWidth() || 0
        const ch = canvas?.getHeight() || 0

        const line = new fabric.Line([0, ch / 2, cw, ch / 2], {
            stroke: '#000',  // 边框颜色
            strokeWidth: 2,
        })
        canvas?.add(line)
    }

    return <div>
        <Button onClick={onAddLine}>添加横线</Button>
    </div>
}

export default Line