import { Button } from "antd";
import { fabric } from "fabric";
import { stores as store } from "@/store/main";
import { nanoid } from "nanoid";
import { mockbrush } from "@/mock/brush";
import { WEB_FONTS } from "../Tools/types";

const TextSectioin = () => {
  const handleAddText = (param) => {
    if (!store?.canvasStore.canvas) return;
    // TODO 双击修改文案
    const text = new fabric.Textbox(param?.label, {
      left: 50,
      top: 50,
      fontFamily: param.value,
      fontSize: 20,
      hbsId: nanoid(),
      hbsType: "textbox",
      fill: "rgb(0,0,0)",
      selectable: true,
    } as any);
    store?.canvasStore.canvas.add(text);
  };

  // 根据组绘制图形组合
  const handleAddGroup = (param) => {};

  return (
    <div>
      <div>单一字体</div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {WEB_FONTS.map((ele) => {
          return (
            <Button
              onClick={() => {
                handleAddText(ele);
              }}
              style={{
                fontFamily: `${ele.value}`,
              }}
            >
              {ele.label}
            </Button>
          );
        })}
      </div>
      <div>组合文案</div>
      <div>{mockbrush.map((ele) => {})}</div>
    </div>
  );
};

export default TextSectioin;
