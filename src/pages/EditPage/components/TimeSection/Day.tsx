import { DatePicker, Button } from "antd";
import { Textbox } from "fabric";
import { useState } from "react";
import dayjs from "dayjs";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import { FORMAT_MOCK } from "@/utils/date";
import "./index.less";

const Day = () => {
  const [date, setDate] = useState(dayjs());

  const store = useContext(CanvasStoreContext);

  const onChangeTime = (v: any) => {
    setDate(() => {
      return v;
    });
  };

  const onDraw = (format: any) => {
    if (!store.canvas) return;
    const text = new Textbox(dayjs(date).format(format), {
      left: 50,
      top: 50,
      fontSize: 20,
      fontFamily: store.mainStore.fontFamily,
      hbsType: "textbox",
      fill: "rgb(0,0,0)",
      selectable: true,
    } as any);
    store?.canvasStoreObject(text);
  };

  return (
    <div className="time-section-class">
      <div className="time-section-tool">
        <DatePicker
          value={date}
          onChange={onChangeTime}
          style={{ width: "50%" }}
          allowClear={false}
          defaultValue={dayjs()}
          picker="date"
        />
      </div>
      <div className="time-section-images">
        {FORMAT_MOCK.map((ele) => {
          return (
            <Button
              key={ele.format}
              onClick={() => {
                onDraw(ele.format);
              }}
            >
              {ele.format}
            </Button>
          );
        })}
        {/* <Button onClick={onDraw}>样式1</Button>
        <Button onClick={onDraw}>样式2</Button> */}
      </div>
    </div>
  );
};

export default Day;
