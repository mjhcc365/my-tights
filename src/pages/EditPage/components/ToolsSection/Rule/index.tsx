import { Button } from "antd";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import { fabricRenderJson } from "@/utils/fabric";

const testjson = require("@/mock/testjson.json");

const Rule = () => {
  const store = useContext(CanvasStoreContext);

  const onLoadJson = () => {
    if (!store.canvas) return;
    const group = fabricRenderJson(testjson.objects || []);
    store.addObject(group);
    store.canvas.renderAll();
  };

  return (
    <div>
      <Button onClick={onLoadJson}>添加尺子</Button>
    </div>
  );
};

export default Rule;
