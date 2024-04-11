import { Tabs } from "antd";
import type { TabsProps } from "antd";

import Week from "./WeekTool";
import Month from "./Month";
import Day from "./Day";

const items: TabsProps["items"] = [
  {
    key: "2",
    label: "月",
    children: <Month />,
  },
  {
    key: "3",
    label: "周",
    children: <Week />,
  },
  {
    key: "4",
    label: "日",
    children: <Day />,
  },
];

const TimeSection = () => {
  const onChange = () => {
    console.log("===>");
  };

  return (
    <div style={{ height: "calc(100vh - 64px)" }}>
      <Tabs
        defaultActiveKey="3"
        items={items}
        onChange={onChange}
        indicatorSize={(origin) => origin - 16}
      />
    </div>
  );
};

export default TimeSection;
