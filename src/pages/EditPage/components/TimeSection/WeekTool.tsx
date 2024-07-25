import { useContext, useState } from "react";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";

import { Group, Rect, Textbox } from "fabric";
import { useDraw } from "./tools";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import PenImg from "@/assets/pen.jpg";
import LogoImg from "@/assets/logo.png";

import "./Image.less";

const weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

const YearsTemp = [
  {
    src: PenImg,
  },
  {
    src: LogoImg,
  },
];

const WEEK_STRING_ARR = ["M", "T", "W", "T", "F", "S", "S"];

const Week = () => {
  const store = useContext(CanvasStoreContext);

  const onDrawWeek = () => {
    // 画方框
    const rectGroup = new Group([]);
    for (let i = 1; i <= 7; i++) {
      for (let j = 1; j <= 1; j++) {
        const rect = new Rect({
          top: 100 * j, // 距离画布顶部距离
          left: (4 * store.zoom + 1 * store.zoom) * i, // 距离画布左侧距离
          width: 4 * store.zoom, // 矩形宽度
          height: 4 * store.zoom, // 矩形高度
          stroke: store.defaultColor,
          fill: "transparent",
          strokeWidth: 1,
          rx: 2 * store.zoom,
          ry: 2 * store.zoom,
        });
        rectGroup.add(rect);
      }
    }

    store.addObject(rectGroup);

    // 画文案
    const textGroup = new Group([]);
    for (let i = 1; i <= 7; i++) {
      const rect = new Textbox(WEEK_STRING_ARR[i - 1], {
        top: 80, // 距离画布顶部距离
        left: (4 * store.zoom + 1 * store.zoom) * i, // 距离画布左侧距离
        width: 4 * store.zoom, // 矩形宽度
        height: 4 * store.zoom, // 矩形高度
        fill: store.defaultColor,
        fontSize: 14,
        fontFamily: store.defaultFont,
        textAlign: "center", // 水平居中
        pathAlign: "baseline", // 垂直居中
      });
      textGroup.add(rect);
    }
    store.addObject(textGroup);
  };

  const onChangeTime = () => {};

  return (
    <div className="time-section-class">
      <div className="time-section-tool">
        <DatePicker
          onChange={onChangeTime}
          style={{ width: "50%" }}
          allowClear={false}
          picker="week"
        />
      </div>
      <div className="time-section-images">
        <Button onClick={onDrawWeek}>画一组打卡</Button>
        <Button
          onClick={() => {
            const text = new Textbox(`WEEK-${dayjs().week()}`, {
              top: 80, // 距离画布顶部距离
              left: 100, // 距离画布左侧距离
              fill: store.defaultColor,
              fontFamily: store.defaultFont,
              fontSize: 14,
            });
            store.addObject(text);
          }}
        >{`WEEK-${dayjs().week()}`}</Button>
      </div>
    </div>
  );
};

export default Week;
