import { fabric } from "fabric";
import { stores as store } from "@/store/main";
import { nanoid } from "nanoid";
import { WEB_FONTS } from "@/components/Tools/types";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

const TextSectioin = () => {
  const handleAddText = (param: string, options: any) => {
    if (!store?.canvasStore.canvas) return;
    // TODO 双击修改文案
    const text = new fabric.Textbox(param, {
      left: 150,
      top: 150,
      fontSize: 20,
      hbsId: nanoid(),
      hbsType: "textbox",
      fill: "rgb(0,0,0)",
      selectable: true,
      ...options,
    } as any);
    store?.canvasStore.canvas.add(text);
  };

  const onChangeTab = () => {};

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "单一素材",
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
      label: "组合素材",
      children: "Content of Tab Pane 2",
    },
  ];

  return (
    <div
      style={{
        cursor: "pointer",
      }}
    >
      <h1
        onClick={() => {
          handleAddText("点击添加标题文字", {
            fontSize: 20,
          });
        }}
      >
        点击添加标题文字
      </h1>
      <h4
        onClick={() => {
          handleAddText("点击添加副标题文字", {
            fontSize: 16,
          });
        }}
      >
        点击添加副标题文字
      </h4>
      <div
        onClick={() => {
          handleAddText("点击添加正文", {
            fontSize: 14,
          });
        }}
      >
        点击添加正文
      </div>
      {/* <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        <Button>横向</Button>
        <Button>竖向</Button>
      </div> */}

      <Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} />
    </div>
  );
};

export default TextSectioin;
