import { useContext, useState } from "react";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { Group, Rect } from "fabric";
import { useDraw } from "./tools";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
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
  const store = useContext(CanvasStoreContext);
  // const { drawMonth } = useDraw()

  const onDrawWeek = () => {
    const group = new Group();

    for (let i = 1; i <= 7; i++) {
      for (let j = 1; j <= 2; j++) {
        const rect = new Rect({
          top: 100 * j, // 距离画布顶部距离
          left: (5 * store.zoomRodio + 2 * store.zoomRodio) * i, // 距离画布左侧距离
          width: 5 * store.zoomRodio, // 矩形宽度
          height: 5 * store.zoomRodio, // 矩形高度
        });
        group.add(rect);
      }
    }
    store.canvas?.add(group);
    store.canvas?.renderAll();
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
