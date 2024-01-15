import { MainContext } from "@/pages/store"
import { useContext } from "react"
import { fabric } from "fabric"
import { nanoid } from "nanoid"

export const useDraw = () => {
    const { store } = useContext(MainContext)

    const drawMonth = () => {
        if (!store.canvas) return
        const cWidth = store.canvas?.getWidth();
        const cheight = store?.canvas?.getHeight();

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
        store?.canvas.add(group);
        store?.canvas.renderAll()
    }

    return {
        drawMonth
    }
}