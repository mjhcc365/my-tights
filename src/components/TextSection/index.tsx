
import { Button } from "antd"
import { useContext } from "react"
import { fabric } from "fabric"
import { MainContext } from "@/pages/store"
import { nanoid } from "nanoid"

const TextSectioin = () => {
    const { store } = useContext(MainContext)

    const handleAddText = () => {
        if (!store.canvas) return
        // TODO 双击修改文案
        const text = new fabric.Textbox('双击可修改文案', {
            left: 50,
            top: 50,
            fontFamily: 'Arial',
            fontSize: 20,
            hbsId: nanoid(),
            hbsType: "textbox",
            fill: "rgb(255,134,211)"
        } as any)
        store.canvas.add(text)
    }


    return <div>
        <Button onClick={handleAddText}>一级标题</Button>
    </div>
}

export default TextSectioin