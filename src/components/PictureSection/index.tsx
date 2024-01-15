import { fabric } from "fabric"
import { useContext, useRef } from "react"
import { nanoid } from "nanoid"
import { MainContext } from "@/pages/store"
import BlackImg from "@/assets/black.jpg"
// import ColorImg from "@/assets/color.jpg"
// import PenImg from "@/assets/pen.jpg"

import "./index.less"


const PictureSection = () => {
    const { store } = useContext(MainContext)
    const imgRef = useRef(null)

    const handleAddPicture = () => {
        if (!store.canvas) return
        const Image = new fabric.Image(imgRef.current || "", {
            top: 20,
            left: 90,
            width: 200,
            height: 200,
            angle: 20,
            hbsId: nanoid(),
            hbsType: "group"
        } as any)
        store.canvas.add(Image)
    }

    return <div className="temp-content">
        <div onClick={handleAddPicture} className="imgBox"><img ref={imgRef} className="" src={BlackImg} /></div>
    </div>
}

export default PictureSection