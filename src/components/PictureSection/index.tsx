import { fabric } from "fabric"
import { useContext, useRef } from "react"
import { nanoid } from "nanoid"
import { MainStoreContext } from "@/store/main"
import BlackImg from "@/assets/black.jpg"
import { stores as store } from "@/store/main"
import "./index.less"


const PictureSection = () => {
    const imgRef = useRef(null)

    const handleAddPicture = () => {
        const Image = new fabric.Image(imgRef.current || "", {
            top: 20,
            left: 90,
            width: 200,
            height: 200,
            angle: 20,
            hbsId: nanoid(),
            hbsType: "group"
        } as any)
        store?.canvasStore.canvas?.add(Image)
    }

    return <div className="temp-content">
        <div onClick={handleAddPicture} className="imgBox"><img ref={imgRef} className="" src={BlackImg} /></div>
    </div>
}

export default PictureSection