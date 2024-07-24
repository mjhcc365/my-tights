import { Group, Line } from "fabric";
import { nanoid } from "nanoid";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
export const useDraw = () => {
  // 画月份

  return {
    drawMonth,
  };
};
