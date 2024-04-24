import { Button } from "antd";
import { stores as store } from "@/pages/EditPage/store/main";
import { fabricRenderJson } from "@/utils/fabric";

const testjson = require("@/mock/testjson.json");

const Rule = () => {
  const onLoadJson = () => {
    if (!store?.canvasStore.canvas) return;
    const group = fabricRenderJson(testjson.objects || []);
    store?.canvasStore.canvas.add(group);
    store?.canvasStore.canvas.renderAll();
  };

  return (
    <div>
      <Button onClick={onLoadJson}>添加尺子</Button>
    </div>
  );
};

export default Rule;
