import { useRef, useContext } from "react"
import { fabric } from "fabric"
import { nanoid } from "nanoid"
import { MainContext } from "@/pages/store"
import PenImg from "@/assets/pen.jpg"

import "./Image.less"

export interface ImageCardProps {
    src: string
}

export const ImageCard = (props: {
    imgInfo: ImageCardProps,
    onClick: () => void;
}) => {
    const { imgInfo, onClick } = props
    const imgRef = useRef(null)

    const handleClick = () => {
        onClick()
    }

    return <div className="time-section-img-box" onClick={handleClick}>
        <img className="time-section-img" ref={imgRef} src={imgInfo.src || PenImg} />
        <div>模板样式年历111</div>
    </div >
}
