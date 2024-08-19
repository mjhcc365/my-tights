// 日历组件的

// export const

// https://fullcalendar.io/docs#toc

import dayjs from "dayjs";

import { Textbox } from "fabric";

export function getDaysInMonth(date: any) {
  return date.daysInMonth();
}

export function getFirstDayOfMonth(date: any) {
  return date.startOf("month").day();
}

function drawCalendar(date: any) {
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
  }
}

let date = dayjs();
drawCalendar(date);
