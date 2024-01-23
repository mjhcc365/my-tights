import { Button } from "antd"
import { useContext } from "react"
import { fabric } from "fabric"
import { MainContext } from "@/store/useCanvas"

import "./index.less"


const Rect = () => {
    const { canvas } = useContext(MainContext)

    const onAddRect = () => {
        const rect = new fabric.Rect({
            top: 20, // 距离画布顶部距离
            left: 30, // 距离画布左侧距离
            width: 60, // 矩形宽度
            height: 40 // 矩形高度
        })
        canvas?.add(rect)
    }


    const onAddTriangle = () => {
        const triangle = new fabric.Triangle({
            width: 80, // 底边长度
            height: 100,// 底边到对角的距离
        })
        canvas?.add(triangle)
    }

    const onAddCircle = () => {
        // 创建圆形
        let circle = new fabric.Circle({
            radius: 50 // 半径
        })
        canvas?.add(circle)
    }

    const onAddEllipse = () => {
        let ellipse = new fabric.Ellipse({
            rx: 50,
            ry: 30
        })
        canvas?.add(ellipse)
    }


    return <div className="shap-tool-contain">
        <Button onClick={onAddRect}>矩形</Button>
        <Button onClick={onAddTriangle}>三角形</Button>
        <Button onClick={onAddCircle}>圆形</Button>
        <Button onClick={onAddEllipse}>椭圆形</Button>
        {/* <Button onClick={onAddRect}>添加一个椭圆形</Button> */}
    </div>
}

export default Rect