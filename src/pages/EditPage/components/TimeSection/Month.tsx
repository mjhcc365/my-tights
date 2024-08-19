import { useContext, useState } from "react";
import { FabricObject, Textbox } from "fabric";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";

import { Group, Line } from "fabric";
import { nanoid } from "nanoid";
import { CanvasStoreContext } from "@/store/canvas";

import { getDaysInMonth, getFirstDayOfMonth } from "@/utils/daygird";
import { WEEK_STRING_ARR } from "./WeekTool";

import "./Image.less";

const Month = () => {
  const store = useContext(CanvasStoreContext);

  const [date, setData] = useState(dayjs());

  const drawMonth = () => {
    const { width, height, top, left } =
      store.getWorkSpaceDraw() as FabricObject;
    const cWidth = width;
    const cHeight = height;

    const group = new Group([], {
      hbsId: nanoid(),
    } as any);
    // 横线 7等分
    for (let i = 1; i < 7; i++) {
      const line = new Line(
        [
          left,
          top + Math.floor(i) * (cHeight / 7),
          left + cWidth,
          top + Math.floor(i) * (cHeight / 7),
        ],
        {
          stroke: store.defaultColor, // 边框颜色
          strokeWidth: 1, // 边框宽度
        }
      );
      group.add(line);
    }
    store.addObject(group);
  };

  const handleMonth = () => {
    const textArr = [];
    let daysInMonth = getDaysInMonth(date);
    let firstDayOfMonth = getFirstDayOfMonth(date);

    const { x, y } = store.getCenterPoint();
    for (let i = 0; i < daysInMonth; i++) {
      let left = ((i + firstDayOfMonth) % 7) * 7 * store.zoom + x;
      let top = Math.floor((i + firstDayOfMonth) / 7) * 7 * store.zoom + y;

      let text = new Textbox(String(i + 1), {
        left: left,
        top: top,
        fontSize: 14,
        width: 15,
        height: 15,
        fontFamily: store.defaultFont,
        fill: store.defaultColor,
        textAlign: "center",
      });
      textArr.push(text);
    }

    for (let i = 1; i <= 7; i++) {
      const rect = new Textbox(WEEK_STRING_ARR[i - 1], {
        top: y - 5 * store.zoom, // 距离画布顶部距离
        left: 7 * store.zoom * (i - 1) + x, // 距离画布左侧距离
        width: 15,
        height: 15,
        fontSize: 14,
        fill: store.defaultColor,
        fontFamily: store.defaultFont,
        fontWeight: "bold",
        textAlign: "center", // 水平居中
      });
      textArr.push(rect);
    }
    const group = new Group(textArr);
    store.addObject(group);
  };

  return (
    <div className="time-section-class">
      <div className="time-section-tool">
        <DatePicker
          style={{ width: "50%" }}
          allowClear={false}
          value={date}
          onChange={(v) => {
            setData(v);
          }}
          picker="month"
        />
      </div>
      <div className="time-section-images">
        <Button
          onClick={() => {
            drawMonth();
          }}
        >
          7等分线
        </Button>
        <Button
          onClick={() => {
            handleMonth();
          }}
        >
          月历
        </Button>
      </div>
    </div>
  );
};

export default Month;
