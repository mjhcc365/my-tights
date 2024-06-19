import { Textbox } from "fabric";
import { stores as store } from "@/pages/EditPage/store/main";
import { nanoid } from "nanoid";
import { WEB_FONTS } from "@/pages/EditPage/components/Tools/types";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

const TextSectioin = () => {
  const handleAddText = (param: string, options: any) => {
    if (!store?.canvasStore.canvas) return;
    // TODO 双击修改文案
    const text = new Textbox(param, {
      fontSize: 20,
      fontFamily: store.mainStore.fontFamily,
      hbsId: nanoid(),
      hbsType: "textbox",
      fill: "rgb(0,0,0)",
      selectable: true,
      ...options,
    } as any);
    store?.canvasStore.addObject(text);
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
                  handleAddText(`TO DO LIST`, {
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
                TO DO LIST
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
      <div
        className="text-3xl"
        onClick={() => {
          handleAddText("点击添加标题文字", {
            fontSize: 20,
          });
        }}
      >
        点击添加标题文字
      </div>
      <h4
        className="text-2xl"
        onClick={() => {
          handleAddText("点击添加副标题文字", {
            fontSize: 16,
          });
        }}
      >
        点击添加副标题文字
      </h4>
      <div
        className="text-xl"
        onClick={() => {
          handleAddText("点击添加正文", {
            fontSize: 14,
          });
        }}
      >
        点击添加正文
      </div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default TextSectioin;
