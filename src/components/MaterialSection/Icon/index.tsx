import { fabric } from "fabric";
import { rilis } from "./calendar";

import { stores as store } from "@/store/main";

const IconEditor = () => {
  const onAddIcon = (param: any) => {
    fabric.loadSVGFromURL(rilis[param], (objects, options) => {
      store?.canvasStore.canvas?.add(objects[0]).renderAll();
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {rilis.map((ele, index) => {
          return (
            <div
              style={{
                width: 36,
                height: 28,
              }}
              onClick={() => {
                onAddIcon(index);
              }}
            >
              <img src={ele} style={{ width: 24, height: 24 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconEditor;
