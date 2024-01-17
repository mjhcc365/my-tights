import { useContext, useState } from "react";
import { DatePicker, Button } from "antd"
import dayjs from "dayjs"
import { useDraw } from "./tools"

import { ImageCard } from "./Images";
import { MainContext } from "@/store/store";

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

const Year = () => {
    const { canvas } = useContext(MainContext)?.store || {}
    const [showTool, setShowTool] = useState<boolean>(true);

    const { drawMonth } = useDraw()

    const changeTheme = () => { }

    const onChangeTime = () => { }

    const onDrawDays = () => { }

    const onDrawMonth = () => {
        drawMonth()
    }


    return <div className="time-section-class" >
        <div className="time-section-tool">
            <DatePicker onChange={onChangeTime} style={{ width: "50%" }} allowClear={false} defaultValue={dayjs()} picker="year" />
        </div>
        <div className="time-section-title">
            <div>{"简约风格"}</div>
        </div>
        <div className="time-section-images">
            <Button onClick={onDrawDays}>画日历每天</Button>
            <Button onClick={onDrawMonth} >画两列日历</Button>
            {YearsTemp.map((ele) => {
                return <ImageCard imgInfo={ele} onClick={changeTheme} />
            })}
        </div>
    </div>
}

export default Year