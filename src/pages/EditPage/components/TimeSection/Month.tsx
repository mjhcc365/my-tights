import { useContext } from "react";
import { FabricObject } from "fabric";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";

import { Group, Line } from "fabric";
import { nanoid } from "nanoid";
import { CanvasStoreContext } from "@/store/canvas";

import "./Image.less";

const Month = () => {
  const store = useContext(CanvasStoreContext);

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

  return (
    <div className="time-section-class">
      <div className="time-section-tool">
        <DatePicker
          style={{ width: "50%" }}
          allowClear={false}
          defaultValue={dayjs()}
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
        <Button onClick={() => {}}>月历</Button>
      </div>
    </div>
  );
};

export default Month;
