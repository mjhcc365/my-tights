import { stores as store } from "@/pages/EditPage/store/main";
import { Button } from "antd";
import { Rect, Group, FabricText, IText } from "fabric";
import { fabricTable } from "./fabricTable";

// TODO
// 所有元素添加到一个Group里面。
// 给Group 添加监听时间hover显示控制的句柄
//

const Calender = () => {
  const handleClick = () => {
    // store.canvasStore;
    const tabel = new fabricTable();
    store.canvasStore.canvas?.add(tabel.group);
    store.canvasStore.canvas?.renderAll();
  };

  const handleGroup = () => {
    const rect = new Rect({
      width: 100,
      height: 100,
      top: 100,
      left: 100,
    });

    const text = new IText("123", {
      // editable: true,
    });
    const group = new Group([text, rect], {
      subTargetCheck: true,
      interactive: true, // 启用选择子目标
    });
    store.canvasStore.canvas?.add(group);
    store.canvasStore.canvas?.renderAll();
  };
  return (
    <div>
      <Button onClick={handleClick}>点击渲染到canvas上</Button>
      <Button onClick={handleGroup}>添加group</Button>
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
