import { fabric } from "fabric"
import { useContext, useRef } from "react"
import { nanoid } from "nanoid"
import { MainStoreContext } from "@/store/main"
import BlackImg from "@/assets/black.jpg"
import { stores as store } from "@/store/main"



const Png = () => {
    const imgRef = useRef(null)

    const handleAddPicture = () => {
        const Image = new fabric.Image(imgRef.current || "", {
            top: 20,
            left: 90,
            hbsId: nanoid(),
            hbsType: "image",
            scaleX: 0.2,
            scaleY: 0.2,
        } as any)
        store?.canvasStore.canvas?.add(Image)
    }

    return <div >
        <div onClick={handleAddPicture}><img ref={imgRef} style={{
            width: 120,
            height: 120
        }} className="" src={BlackImg} /></div>
    </div>
}

export default Png