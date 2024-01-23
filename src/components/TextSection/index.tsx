
import { Button } from "antd"
import { useContext } from "react"
import { fabric } from "fabric"
import { MainContext } from "@/store/useCanvas"
import { nanoid } from "nanoid"

const TextSectioin = () => {
    const { canvas } = useContext(MainContext)

    const handleAddText = () => {
        if (!canvas) return
        // TODO 双击修改文案
        const text = new fabric.Textbox('双击可修改文案', {
            left: 50,
            top: 50,
            fontFamily: 'Arial',
            fontSize: 20,
            hbsId: nanoid(),
            hbsType: "textbox",
            fill: "rgb(0,0,0)",
            selectable: true
        } as any)
        canvas.add(text)
    }


    return <div>
        <Button onClick={handleAddText}>一级标题</Button>
    </div>
}

export default TextSectioin