import { DatePicker, Button } from "antd";
import { Textbox } from "fabric";
import { useState } from "react";
import dayjs from "dayjs";
import { useContext } from "react";
import { CanvasStoreContext } from "@/store/canvas";
import { FORMAT_MOCK } from "@/utils/date";

const Day = () => {
  const [date, setDate] = useState(dayjs());

  const store = useContext(CanvasStoreContext);

  const onChangeTime = (v: any) => {
    console.log("===>", v);
    // setDate(() => {
    //   return v;
    // });
  };

  const onDraw = (format: any) => {
    if (!store.canvas) return;
    const { x } = store.getCenterPoint();
    const text = new Textbox(dayjs(date).format(format), {
      left: x,
      top: 100,
      fontSize: 14,
      fontFamily: store.defaultFont,
      hbsType: "textbox",
      fill: store.defaultColor,
      selectable: true,
    } as any);

    store.addObject(text);
  };

  return (
    <div className="time-section-class">
      <div className="time-section-tool">
        <DatePicker
          value={date}
          onChange={onChangeTime}
          style={{ width: "50%" }}
          allowClear={false}
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
              {dayjs(date).format(ele.format)}
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
