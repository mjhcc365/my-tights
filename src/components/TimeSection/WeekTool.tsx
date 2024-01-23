import { useContext, useState } from "react";
import { DatePicker, Button } from "antd"
import dayjs from "dayjs"
import { fabric } from "fabric"
import { useDraw } from "./tools"

// import { ImageCard } from "./Images";
import { MainContext } from "@/store/useCanvas";

import PenImg from "@/assets/pen.jpg"
import LogoImg from "@/assets/logo.png"

import "./Image.less"
import "./index.less"


const YearsTemp = [{
    src: PenImg
}, {
    src: LogoImg
}
]

const Week = () => {
    const { canvas, zoomRatio } = useContext(MainContext)
    const [showTool, setShowTool] = useState<boolean>(true);

    const { drawMonth } = useDraw()

    const onDrawWeek = () => {
        const group = new fabric.Group()

        for (let i = 1; i <= 7; i++) {
            const rect = new fabric.Rect({
                top: 20, // 距离画布顶部距离
                left: (5 * zoomRatio + 2 * zoomRatio) * i, // 距离画布左侧距离
                width: 5 * zoomRatio, // 矩形宽度
                height: 5 * zoomRatio, // 矩形高度
                // fill: "#f5f5f5",
                // stroke: ""
            })

            group.addWithUpdate(rect)
        }
        canvas?.add(group);
        canvas?.renderAll()
    }

    const onChangeTime = () => { }

    return <div className="time-section-class" >
        <div className="time-section-tool">
            <DatePicker onChange={onChangeTime} style={{ width: "50%" }} allowClear={false} defaultValue={dayjs()} picker="week" />
        </div>
        <div className="time-section-images">
            <Button onClick={onDrawWeek}>画一组打卡</Button>
            <Button onClick={onDrawWeek} >画两列日历</Button>
        </div>
    </div>
}

export default Week