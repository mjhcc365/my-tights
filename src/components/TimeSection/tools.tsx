import { fabric } from "fabric"
import { nanoid } from "nanoid"
import { stores as store } from "@/store/main"

export const useDraw = () => {

    const drawMonth = () => {
        if (!store?.canvasStore.canvas) return
        const cWidth = store?.canvasStore.canvas?.getWidth();
        const cheight = store?.canvasStore.canvas?.getHeight();

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
        store?.canvasStore.canvas.add(group);
        store?.canvasStore.canvas.renderAll()
    }

    return {
        drawMonth
    }
}