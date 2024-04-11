import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
import "./index.less";

const Day = () => {
  const onChangeTime = () => {};

  const onDraw = () => {};

  return (
    <div className="time-section-class">
      <div className="time-section-tool">
        <DatePicker
          onChange={onChangeTime}
          style={{ width: "50%" }}
          allowClear={false}
          defaultValue={dayjs()}
          picker="date"
        />
      </div>
      <div className="time-section-images">
        <Button onClick={onDraw}>样式1</Button>
        <Button onClick={onDraw}>样式2</Button>
      </div>
    </div>
  );
};

export default Day;
