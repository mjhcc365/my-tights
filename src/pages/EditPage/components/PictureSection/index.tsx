import { Tabs } from "antd";
import type { TabsProps } from "antd";

import Picture from "./Picture";
import Sticker from "./Sticker";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "贴纸",
    children: <Sticker />,
  },
  {
    key: "2",
    label: "图片",
    children: <Picture />,
  },
];

const PictureSection = () => {
  const onChange = () => {};

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicatorSize={(origin) => origin - 16}
      />
    </div>
  );
};

export default PictureSection;
