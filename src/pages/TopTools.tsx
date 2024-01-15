import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import TextTools from "@/components/Tools/TextTools"
import ImageTools from "@/components/Tools/ImageTools"

import "./TopTools.less"
import { MainContext } from "./store"

const TopTools = (props: { activeObject: fabric.Object | null }) => {
    const type = props.activeObject?.type

    const renderNode = () => {
        switch (type) {
            case "text":
            case "textbox":
                return <TextTools />
            case "image":
                return <ImageTools />
            default:
                return null
        }
    }
    // console.log("==>", type)
    return <div className="section-top-tool">{renderNode()}</div>

}

export default TopTools