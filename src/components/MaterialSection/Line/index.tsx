import { Button } from "antd"
import { useContext } from "react"
import { fabric } from "fabric"
import { MainContext } from "@/store/store"


const Line = () => {
    const { store } = useContext(MainContext)
    const onAddLine = () => {
        const line = new fabric.Line([0, 100, 100, 100], {
            fill: 'red',     // 填充颜色（可选，如果不需要填充可以省略）
            stroke: 'blue',  // 边框颜色
            strokeWidth: 2,
            selectable: true,
            // 边框宽度
        })
        store?.canvas?.add(line)
    }

    return <div>
        <Button onClick={onAddLine}>添加一个横线</Button>
        <Button onClick={onAddLine}>添加一条竖线</Button>
    </div>
}

export default Line