import { Button } from "antd"
import { useContext } from "react"
import { fabric } from "fabric"
import { MainContext } from "@/store/store"
import svg from "@/assets/iconfont/weixin.svg"


const Icon = () => {
    const { store } = useContext(MainContext)
    const onAddIcon = () => {
        fabric.loadSVGFromURL(svg, (objects, options) => {
            // console.log("==>", objects, options)
            store?.canvas?.add(objects[0]).renderAll();
        })
    }
    return <div>
        <Button onClick={onAddIcon}>添加一个icon</Button>
    </div>
}

export default Icon