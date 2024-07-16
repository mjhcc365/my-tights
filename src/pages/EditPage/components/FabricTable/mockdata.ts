import * as fabric from "fabric";

export const getInitTable = () => {
  const rect1 = new fabric.Rect({
    width: 10,
    height: 10,
    top: 10,
    left: 20,
    backgroundColor: "black",
  });

  const rect2 = new fabric.Rect({
    width: 10,
    height: 10,
    top: 100,
    left: 200,
    backgroundColor: "black",
  });
  return {
    objs: [rect1, rect2],
  };
};

export const mockOptions = {
  columns: [
    { width: 50 },
    { width: 50 },
    { width: 50 },
    { width: 50 },
    { width: 50 },
    { width: 50 },
  ],
  rows: [
    { height: 28, header: true },
    { height: 25 },
    { height: 25 },
    { height: 25 },
    { height: 25 },
    { height: 25 },
    { height: 23 },
  ],
  cells: [
    [{ colspan: 6, text: "1" }],
    [{ text: "2" }, { text: "3" }, { text: "4" }, { text: "5" }, { text: "6" }],
    [
      { text: "7" },
      { text: "A" },
      { text: "B" },
      { text: "C" },
      { text: "D" },
      { text: "E" },
    ],
    [{ text: "F" }, { text: "G" }, { text: "H" }, { text: "I" }, { text: "K" }],
    [{ text: "L" }, { text: "M" }, { text: "N" }, { text: "O" }, { text: "P" }],
    [
      { rowspan: 2, text: "8" },
      { text: "Q" },
      { text: "R" },
      { text: "S" },
      { text: "T" },
      { text: "U" },
    ],
    [{ text: "V" }, { text: "W" }, { text: "X" }, { text: "Y" }, { text: "Z" }],
  ],
};

export const s2DataConfig = {
  fields: {
    rows: ["province", "city"],
    columns: ["type"],
    values: ["price"],
  },
  data: [
    {
      province: "浙江",
      city: "杭州",
      type: "笔",
      price: "1",
    },
    {
      province: "浙江",
      city: "杭州",
      type: "纸张",
      price: "2",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "笔",
      price: "17",
    },
    {
      province: "浙江",
      city: "舟山",
      type: "纸张",
      price: "0.5",
    },
    {
      province: "吉林",
      city: "长春",
      type: "笔",
      price: "8",
    },
    {
      province: "吉林",
      city: "白山",
      type: "笔",
      price: "9",
    },
    {
      province: "吉林",
      city: "长春",
      type: " 纸张",
      price: "3",
    },
    {
      province: "吉林",
      city: "白山",
      type: "纸张",
      price: "1",
    },
  ],
};

export const s2Options = {
  width: 600,
  height: 600,
};
