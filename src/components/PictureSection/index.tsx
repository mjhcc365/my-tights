import { fabric } from "fabric"
import { useContext, useRef } from "react"
import { nanoid } from "nanoid"
import { MainContext } from "@/store/useCanvas"
import BlackImg from "@/assets/black.jpg"
// import ColorImg from "@/assets/color.jpg"
// import PenImg from "@/assets/pen.jpg"

import "./index.less"


const PictureSection = () => {
    const { canvas } = useContext(MainContext)
    const imgRef = useRef(null)

    const handleAddPicture = () => {
        if (!canvas) return
        const Image = new fabric.Image(imgRef.current || "", {
            top: 20,
            left: 90,
            width: 200,
            height: 200,
            angle: 20,
            hbsId: nanoid(),
            hbsType: "group"
        } as any)
        canvas.add(Image)
    }

    return <div className="temp-content">
        <div onClick={handleAddPicture} className="imgBox"><img ref={imgRef} className="" src={BlackImg} /></div>
    </div>
}

export default PictureSection