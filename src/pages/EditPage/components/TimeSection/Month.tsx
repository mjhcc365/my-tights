import { useContext, useState } from "react";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { useDraw } from "./tools";

import { ImageCard } from "./Images";
import { stores as store } from "@/pages/EditPage/store/main";

import PenImg from "@/assets/pen.jpg";
import LogoImg from "@/assets/logo.png";

import "./Image.less";
import "./index.less";

const YearsTemp = [
  {
    src: PenImg,
  },
  {
    src: LogoImg,
  },
];

const Month = () => {
  const [showTool, setShowTool] = useState<boolean>(true);

  const { drawMonth } = useDraw();

  // const changeTheme = () => {};

  const onChangeTime = () => {};

  // const onDrawDays = () => {};

  const onDrawMonth = () => {
    drawMonth();
  };

  return (
    <div className="time-section-class">
      <div className="time-section-tool">
        <DatePicker
          onChange={onChangeTime}
          style={{ width: "50%" }}
          allowClear={false}
          defaultValue={dayjs()}
          picker="month"
        />
      </div>
      <div className="time-section-images">
        <Button onClick={onDrawMonth}>样式1</Button>
        <Button onClick={onDrawMonth}>样式2</Button>
      </div>
    </div>
  );
};

export default Month;
