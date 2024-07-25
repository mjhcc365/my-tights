import { Button } from "antd";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import { Rect, Group, IText, Textbox, Line } from "fabric";
import dayjs from "dayjs";
import { getDaysInMonth, getFirstDayOfMonth } from "./drawMonth";

const Calender = observer(() => {
  const store = useContext(CanvasStoreContext);

  const handleMonth = () => {
    const group = new Group([]);
    let date = dayjs();
    let daysInMonth = getDaysInMonth(date);
    let firstDayOfMonth = getFirstDayOfMonth(date);

    for (let i = 0; i < daysInMonth; i++) {
      let x = ((i + firstDayOfMonth) % 7) * 70 + 35;
      let y = Math.floor((i + firstDayOfMonth) / 7) * 70 + 35;

      let text = new Textbox(String(i + 1), {
        left: x,
        top: y,
        fontSize: 20,
        originX: "center",
        originY: "center",
      });
      group.add(text);
    }

    store.addObject(group);
    store.canvas?.renderAll();
  };

  const timeline = () => {
    const hoursInDay = 24;
    const canvasHeight = store.canvas?.height || 200;
    const group = new Group([]);

    for (let i = 6; i <= hoursInDay; i++) {
      let y = (canvasHeight / hoursInDay) * i;
      // 创建垂直线代表每一个小时
      let line = new Line([0, y, 40, y], {
        stroke: "#999999",
        selectable: false,
      });
      group.add(line);
      // 创建描述每个小时的文本
      let text = new Textbox(i + ":00", {
        width: 40,
        left: 17,
        top: y + 5,
        fontSize: 12,
        originX: "center",
        originY: "top",
      });
      group.add(text);
    }
    group.set("left", 100);
    store.addObject(group);
    store.canvas?.renderAll();
  };
  return (
    <div>
      {/* <Button onClick={handleClick}>点击渲染到canvas上</Button> */}
      {/* <Button onClick={handleGroup}>添加group</Button> */}
      <Button onClick={handleMonth}>Month</Button>
      <Button onClick={timeline}>timeline</Button>
    </div>
  );
});

export default Calender;
