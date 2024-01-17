// import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import TextTools from "@/components/Tools/TextTools"
import ImageTools from "@/components/Tools/ImageTools"
import ShapeTools from "@/components/Tools/ShapeTools"

import "./TopTools.less"
import { MainContext } from "../store/store"

const TopTools = (props: { activeObject: fabric.Object | null }) => {
    const type = props.activeObject?.type

    const renderNode = () => {
        switch (type) {
            case "text":
            case "textbox":
                return <TextTools />
            case "image":
                return <ImageTools />
            case "ellipse":
            case "circle":
            case "triangle":
            case "rect":
            case "line":
                return <ShapeTools />
            default:
                return null
        }
    }
    // console.log("==>", type)
    return <div className="section-top-tool">{renderNode()}</div>

}

export default TopTools