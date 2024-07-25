import { Button } from "antd";
import * as fabric from "fabric";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import dayjs from "dayjs";
import { CanvasStoreContext } from "@/store/canvas";
import { FabricTable } from "./fabrictable";

import { s2DataConfig, s2Options } from "./mockdata";

const Table = () => {
  const store = useContext(CanvasStoreContext);

  const getMonthData = () => {
    const today = dayjs();
    const firstDayOfMonth = today.startOf("month"); // 第一天
    const daysInMonth = today.daysInMonth(); // 31天
    const weekStart = firstDayOfMonth.day(); // 每个月第一天是周几
    let currentDay = firstDayOfMonth;
    const data = new Array(5).fill([]);

    for (let r = 0; r < 5; r++) {
      data[r] = [];
      for (let c = 0; c < 7; c++) {
        if (r === 0 && c < weekStart) {
          data[r][c] = undefined;
        } else if (currentDay.date() < daysInMonth) {
          data[r][c] = currentDay.date();
          currentDay = currentDay.add(1, "day");
        } else {
          data[r][c] = undefined;
        }
      }
    }

    // console.log(
    //   "==>",
    //   data.map((ele) => getCells(ele))
    // );

    return [
      [
        { text: "S" },
        { text: "M" },
        { text: "T" },
        { text: "W" },
        { text: "T" },
        { text: "F" },
        { text: "S" },
      ],
      ...data.map((ele) => getCells(ele)),
    ];
  };

  const getCells = (data: []) => {
    const res = [];
    let tempArr = [];
    data.forEach((ele) => {
      if (ele == undefined) {
        tempArr.push(ele);
      } else {
        if (tempArr.length > 0) {
          res.push({ colspan: tempArr.length });
        }
        res.push({ text: ele + "" });
        tempArr = [];
      }
    });

    if (tempArr.length > 0) {
      res.push({ colspan: tempArr.length });
      tempArr = [];
    }

    return res;
  };
  const onAddTable = () => {
    // getMonthData();
    const cell = getMonthData();

    const table = new FabricTable({
      cells: cell,
      rows: [
        { height: 28, header: true },
        { height: 25 },
        { height: 25 },
        { height: 25 },
        { height: 25 },
        { height: 25 },
        { height: 23 },
      ],
      columns: [
        { width: 50 },
        { width: 50 },
        { width: 50 },
        { width: 50 },
        { width: 50 },
        { width: 50 },
        { width: 50 },
      ],
    });
    store.addObject(table);
  };

  return (
    <>
      <Button onClick={onAddTable}>添加表格</Button>
      {/* <Button onClick={onAddTextBox}>添加Textbox</Button> */}
    </>
  );
};

export default observer(Table);
