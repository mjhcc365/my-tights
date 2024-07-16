export interface GridsInterface {
  spacing: number;
  stroke: string;
}
export enum MENUKEY {
  temp = "temp", // 模板
  material = "material", // 素材
  text = "text", //文字
  picture = "picture", // 照片
  background = "background", // 背景
  tools = "tools", // 工具
  size = "size", // 调整布局
  time = "time", //  时间轴 年月日
  todos = "todos", //  时间轴 年月日
}
export const menuConfig = [
  {
    label: "纸张",
    key: MENUKEY.size,
    icon: "Paper",
  },
  {
    label: "素材",
    key: MENUKEY.material,
    icon: "sucaiku_moren2x",
  },
  {
    label: "文字",
    key: MENUKEY.text,
    icon: "text",
  },
  {
    label: "图片",
    key: MENUKEY.picture,
    icon: "sucai",
  },
  {
    label: "时间",
    key: MENUKEY.time,
    icon: "shijian",
  },
  {
    label: "工具",
    key: MENUKEY.tools,
    icon: "sey-gongju-a",
  },
  {
    label: "打卡",
    key: MENUKEY.todos,
    icon: "sey-gongju-a",
  },
];
