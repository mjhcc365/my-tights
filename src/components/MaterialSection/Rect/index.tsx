import { Button } from "antd"
import { useContext } from "react"
import { fabric } from "fabric"
import { MainContext } from "@/pages/store"


const Rect = () => {
    const { store } = useContext(MainContext)

    const onAddRect = () => {
        const rect = new fabric.Rect({
            top: 20, // 距离画布顶部距离
            left: 30, // 距离画布左侧距离
            width: 60, // 矩形宽度
            height: 40 // 矩形高度
        })
        store?.canvas?.add(rect)
    }

    return <div>
        <Button onClick={onAddRect}>矩形</Button>
        <Button onClick={onAddRect}>三角形</Button>
        <Button onClick={onAddRect}>圆形</Button>
        <Button onClick={onAddRect}>椭圆形</Button>
        {/* <Button onClick={onAddRect}>添加一个椭圆形</Button> */}
    </div>
}

export default Rect