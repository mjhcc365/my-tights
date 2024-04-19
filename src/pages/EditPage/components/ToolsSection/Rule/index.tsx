import { fabric } from "fabric";
import { Button } from "antd";
import { stores as store } from "@/pages/EditPage/store/main";
import rule from "@/assets/cm.svg";
import { fabricRenderJson } from "@/utils/fabric";

const testjson = require("@/mock/testjson.json");

// const json =
// const fabricRenderJson = (objects: any) => {
//   const group = new fabric.Group();
//   objects.map((ele: any) => {
//     switch (ele.type) {
//       case "textbox":
//         group.addWithUpdate(new fabric.Textbox(ele.text, { ...ele }));
//         break;
//       default:
//         break;
//     }
//   });

//   return group;
// };

const Rule = () => {
  const onAddRule = () => {
    fabric.loadSVGFromURL(rule, (objects, options) => {
      const group = new fabric.Group(objects, {
        lockScalingX: true,
        lockScalingY: true,
      });
      store.canvasStore.canvas?.add(group).renderAll();
      console.log("===>", objects, options);
    });
  };

  const onLoadJson = () => {
    if (!store?.canvasStore.canvas) return;
    console.log("==>", testjson);

    // store?.canvasStore.canvas.loadFromJSON(
    //   JSON.stringify(testjson),
    //   () => {},
    //   () => {}
    // );

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
