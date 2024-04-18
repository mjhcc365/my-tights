import { Tabs } from "antd";
import type { TabsProps } from "antd";
import Rect from "./Rect";
import Icon from "./Icon";
import Emoji from "./Emoji";
import Png from "./Png";
import Picture from "./Picture";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "插画",
    children: <Png />,
  },
  {
    key: "2",
    label: "图标",
    children: <Icon />,
  },
  {
    key: "4",
    label: "emoji",
    children: <Emoji />,
  },
  {
    key: "5",
    label: "形状",
    children: <Rect />,
  },
  // {
  //   key: "6",
  //   label: "图片",
  //   children: <Picture />,
  // },
  // {
  //   key: "7",
  //   label: "表情包",
  //   children: <Picture />,
  // },
];

const MaterialSection = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div style={{ height: "calc(100vh - 64px)" }}>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicatorSize={(origin) => origin - 16}
      />
    </div>
  );
};

export default MaterialSection;
