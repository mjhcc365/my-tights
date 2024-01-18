

import { useContext } from "react"
import { MainContext } from "@/store/store"
import { MainTools } from "@/components/Tools/Tools"

import "./TopTools.less"

const TopTools = () => {
    const { activeObject } = useContext(MainContext)
    return <>
        {
            activeObject?.type
                ?
                <div className="section-top-tool">
                    <MainTools />
                </div>
                :
                <div />
        }
    </>

}

export default TopTools