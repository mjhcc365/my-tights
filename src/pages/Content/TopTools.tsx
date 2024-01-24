

import { useContext } from "react"
import { MainStoreContext } from "@/store/main"
import { observer } from "mobx-react-lite"
import { MainTools } from "@/components/Tools/Tools"
import { stores as store } from "@/store/main"

import "./TopTools.less"

const TopTools = () => {
    console.log("==>store?.canvasStore.activeObj?.type", store?.canvasStore.activeType)
    return <>
        {
            store?.canvasStore?.activeType
                ?
                <div className="section-top-tool">
                    <MainTools />
                </div>
                :
                <div className="section-top-tool">{store?.canvasStore?.activeType}</div>
        }
    </>

}

export default observer(TopTools)