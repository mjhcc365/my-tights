import { useContext } from "react";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
// import PenImg from "@/assets/pen.jpg";
// import LogoImg from "@/assets/logo.png";

import { Group, Line } from "fabric";
import { nanoid } from "nanoid";
import { CanvasStoreContext } from "@/store/canvas";

import "./Image.less";
import "./index.less";

// const YearsTemp = [
//   {
//     src: PenImg,
//   },
//   {
//     src: LogoImg,
//   },
// ];

const Month = () => {
  const store = useContext(CanvasStoreContext);

  const drawMonth = () => {
    const cWidth = store.canvas?.getWidth();
    const cheight = store.canvas?.getHeight();

    const group = new Group([], {
      hbsId: nanoid(),
    } as any);
    // 横线
    for (let i = 1; i < 6; i++) {
      const top = Math.floor(i) * (cheight / 6);
      const line = new Line([0, top, cWidth, top], {
        fill: store.defaultColor, // 填充颜色（可选，如果不需要填充可以省略）
        stroke: "blue", // 边框颜色
        strokeWidth: 2, // 边框宽度
      });
      group.add(line);
    }
    store.addObject(group);
  };

  const onChangeTime = () => {};

  const onDrawMonth = () => {
    drawMonth();
  };

  return (
    <div className="time-section-class">
      <div className="time-section-tool">
        <DatePicker
          onChange={onChangeTime}
          style={{ width: "50%" }}
          allowClear={false}
          defaultValue={dayjs()}
          picker="month"
        />
      </div>
      <div className="time-section-images">
        <Button onClick={onDrawMonth}>样式1</Button>
        <Button onClick={onDrawMonth}>样式2</Button>
      </div>
    </div>
  );
};

export default Month;
