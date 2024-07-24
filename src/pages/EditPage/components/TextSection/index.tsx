import { Textbox } from "fabric";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import { nanoid } from "nanoid";
import { WEB_FONTS } from "@/pages/EditPage/components/Tools/types";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

const TextSectioin = () => {
  const store = useContext(CanvasStoreContext);

  const handleAddText = (param: string, options: any) => {
    if (!store.canvas) return;
    // TODO 双击修改文案
    const text = new Textbox(param, {
      fontSize: 20,
      fontFamily: store.defaultFont,
      hbsId: nanoid(),
      hbsType: "textbox",
      fill: store.defaultColor,
      selectable: true,
      ...options,
    } as any);
    store.addObject(text);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "字体",
      children: (
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {WEB_FONTS.map((ele) => {
            return (
              <div
                onClick={() => {
                  handleAddText(`DONE LIST`, {
                    fontFamily: `${ele.value}`,
                  });
                }}
                style={{
                  width: "45%",
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  padding: "4px",
                  fontFamily: `${ele.value}`,
                }}
              >
                DONE LIST
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "2",
      label: "艺术字",
      children: "Content of Tab Pane 2",
    },
  ];

  return (
    <div className="flex flex-col gap-4 pt-4 cursor-pointer">
      <>
        {[14, 16, 20].reverse().map((size: number) => {
          return (
            <div
              style={{
                fontSize: size,
                fontFamily: store.defaultFont,
                color: store.defaultColor,
              }}
              onClick={() => {
                handleAddText(`点击添加标题文字`, { fontSize: size });
              }}
            >
              点击添加标题文字
            </div>
          );
        })}
      </>

      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default TextSectioin;
