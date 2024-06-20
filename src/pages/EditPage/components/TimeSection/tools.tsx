import { Group, Line } from "fabric";
import { nanoid } from "nanoid";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
export const useDraw = () => {
  // 画月份
  const drawMonth = () => {
    const store = useContext(CanvasStoreContext);

    if (!store.canvas) return;

    const cWidth = store.canvas?.getWidth();
    const cheight = store.canvas?.getHeight();

    const group = new Group([], {
      hbsId: nanoid(),
    } as any);

    // 横线
    for (let i = 1; i < 6; i++) {
      const top = Math.floor(i) * (cheight / 6);
      const line = new Line([0, top, cWidth, top], {
        fill: "red", // 填充颜色（可选，如果不需要填充可以省略）
        stroke: "blue", // 边框颜色
        strokeWidth: 2, // 边框宽度
      });
      group.add(line);
      // group.addWithUpdate(line);
    }
    // 竖线
    store.addObject(group);
    store.canvas.renderAll();
  };

  return {
    drawMonth,
  };
};
