import dayjs from "dayjs";

import { Textbox } from "fabric";

export function getDaysInMonth(date) {
  return date.daysInMonth();
}

export function getFirstDayOfMonth(date) {
  return date.startOf("month").day();
}

function drawCalendar(date) {
  //   let fabricCanvas = new fabric.Canvas("calendar");
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
    // fabricCanvas.add(text);
  }
}

let date = dayjs();
drawCalendar(date);
