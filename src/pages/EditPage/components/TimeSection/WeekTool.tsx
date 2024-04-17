import { useContext, useState } from "react";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { fabric } from "fabric";
import { useDraw } from "./tools";
import { stores as store } from "@/store/main";

import PenImg from "@/assets/pen.jpg";
import LogoImg from "@/assets/logo.png";

import "./Image.less";
import "./index.less";

const YearsTemp = [
  {
    src: PenImg,
  },
  {
    src: LogoImg,
  },
];

const Week = () => {
  const [showTool, setShowTool] = useState<boolean>(true);

  // const { drawMonth } = useDraw()

  const onDrawWeek = () => {
    const group = new fabric.Group();

    for (let i = 1; i <= 7; i++) {
      const rect = new fabric.Rect({
        top: 20, // 距离画布顶部距离
        left:
          (5 * store?.canvasStore.zoomRodio +
            2 * store?.canvasStore.zoomRodio) *
          i, // 距离画布左侧距离
        width: 5 * store?.canvasStore.zoomRodio, // 矩形宽度
        height: 5 * store?.canvasStore.zoomRodio, // 矩形高度
        // fill: "#f5f5f5",
        // stroke: ""
      });

      group.addWithUpdate(rect);
    }
    store?.canvasStore.canvas?.add(group);
    store?.canvasStore.canvas?.renderAll();
  };

  const onChangeTime = () => {};

  return (
    <div className="time-section-class">
      <div className="time-section-tool">
        <DatePicker
          onChange={onChangeTime}
          style={{ width: "50%" }}
          allowClear={false}
          defaultValue={dayjs()}
          picker="week"
        />
      </div>
      <div className="time-section-images">
        <Button onClick={onDrawWeek}>画一组打卡</Button>
        <Button onClick={onDrawWeek}>画两列日历</Button>
      </div>
    </div>
  );
};

export default Week;
