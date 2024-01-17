import { MainContext } from "@/store/store"
import { useContext } from "react"
import { fabric } from "fabric"
import { nanoid } from "nanoid"

export const useDraw = () => {
    const { canvas } = useContext(MainContext)

    const drawMonth = () => {
        if (!canvas) return
        const cWidth = canvas?.getWidth();
        const cheight = canvas?.getHeight();

        const group = new fabric.Group([], {
            hbsId: nanoid()
        } as any)

        // 横线
        for (let i = 1; i < 6; i++) {
            const top = Math.floor(i) * (cheight / 6);
            const line = new fabric.Line([0, top, cWidth, top], {
                fill: 'red',     // 填充颜色（可选，如果不需要填充可以省略）
                stroke: 'blue',  // 边框颜色
                strokeWidth: 2    // 边框宽度
            })
            group.addWithUpdate(line)
        }
        // 竖线
        canvas.add(group);
        canvas.renderAll()
    }

    return {
        drawMonth
    }
}