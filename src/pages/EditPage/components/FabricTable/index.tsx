import { Button } from "antd";
import * as fabric from "fabric";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { CanvasStoreContext } from "@/store/canvas";
import { FabricTable } from "./fabrictable";

import { s2DataConfig, s2Options } from "./mockdata";

const Table = () => {
  const store = useContext(CanvasStoreContext);
  const onAddTable = () => {
    const table = new FabricTable(s2DataConfig);
    store.addObject(table);
    store.canvas?.renderAll();
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
    store.canvas?.renderAll();
  };
  return (
    <>
      <Button onClick={onAddTable}>添加表格</Button>
      <Button onClick={onAddTextBox}>添加Textbox</Button>
    </>
  );
};

export default observer(Table);
