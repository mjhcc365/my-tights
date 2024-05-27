import { Button } from "antd";
import * as fabric from "fabric";
import { stores as store } from "@/pages/EditPage/store/main";

import { FabricTable } from "./fabrictable";

import { s2DataConfig, s2Options } from "./mockdata";

const Table = () => {
  const onAddTable = () => {
    const table = new FabricTable(s2DataConfig);

    store.canvasStore.addObject(table);
    store.canvasStore.canvas?.renderAll();
  };

  const onAddTextBox = () => {
    const text = new fabric.Textbox("121212", {
      top: 100,
      left: 100,
      hasControls: false,
      width: 100,
      height: 10,
      fixedWidth: 100,
    });
    console.log("===>table", text);
    store.canvasStore.canvas?.renderAll();
  };
  return (
    <div>
      <Button onClick={onAddTable}>添加表格</Button>
      <Button onClick={onAddTextBox}>添加Textbox</Button>
    </div>
  );
};

export default Table;
