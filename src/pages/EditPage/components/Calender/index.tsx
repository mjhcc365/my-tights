import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { stores as store } from "@/pages/EditPage/store/main";
import { Button } from "antd";

const Calender = () => {
  const handleClick = () => {
    // store.canvasStore;
  };
  return (
    <div>
      <Button onClick={handleClick}>点击渲染到canvas上</Button>
      {/* <FullCalendar
        headerToolbar={false}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
      /> */}
    </div>
  );
};

// const Calender = () => {
//   return <div>111</div>;
// };

export default Calender;
