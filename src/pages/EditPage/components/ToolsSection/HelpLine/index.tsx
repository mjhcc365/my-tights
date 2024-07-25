import { Flex, Button, ColorPicker, Radio } from "antd";
import { Line, Group } from "fabric";
import { useImmer } from "use-immer";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import "./index.less";

export interface HelpLineType {
  onlyUseful: boolean;
  direction: 1 | 0;
  portion: 2 | 3 | 4 | 7;
  stroke: string;
  strokeWidth: number;
  strokeDashArray: 1 | 2 | 3;
}

const initHelpLine = {
  onlyUseful: 1,
  direction: 1,
  portion: 2,
  stroke: "#000000",
  strokeWidth: 1,
  strokeDashArray: 1,
};

const HelpLine = () => {
  const [helpLine, setHelpLine] = useImmer(initHelpLine);
  const store = useContext(CanvasStoreContext);

  // 绘制横线
  const drawHline = () => {
    const cw = store.canvas?.getWidth() || 0;
    const ch = store.canvas?.getHeight() || 0;
    const item = ch / helpLine.portion;
    // 绘制横线
    const hLines = [];
    for (let i = 1; i < helpLine.portion; i++) {
      const line = new Line([0, item * i, cw, item * i], {
        stroke: helpLine.stroke,
        strokeWidth: helpLine.strokeWidth,
        strokeDashArray: [2, 2],
      });
      hLines.push(line);
    }

    const group = new Group(hLines);
    store.addObject(group);
  };

  // 绘制竖线
  const drawVline = () => {
    const cw = store.canvas?.getWidth() || 0;
    const ch = store.canvas?.getHeight() || 0;
    const item = cw / helpLine.portion;
    const vLines = [];
    for (let i = 1; i < helpLine.portion; i++) {
      const line = new Line([item * i, 0, item * i, ch], {
        stroke: helpLine.stroke,
        strokeWidth: helpLine.strokeWidth,
        strokeDashArray: [2, 2],
      });
      vLines.push(line);
    }
    const group = new Group(vLines);
    store.addObject(group);
  };

  const onHelpLineChange = () => {
    // 绘制横线
    if (helpLine.direction) {
      drawHline();
    } else {
      drawVline();
    }
    store.canvas?.renderAll();
  };

  return (
    <div>
      <Flex gap="middle" vertical>
        <Flex align="center" gap="small" wrap="wrap">
          <div className="label">仅可用区域:</div>
          <Radio.Group
            options={[
              { label: "是", value: 1 },
              { label: "否", value: 0 },
            ]}
            value={helpLine.onlyUseful}
            optionType="button"
            onChange={(e) => {
              setHelpLine((d) => {
                d.onlyUseful = e.target.value;
              });
            }}
          />
        </Flex>
        <Flex align="center" gap="small" wrap="wrap">
          <div className="label">方向:</div>
          <Radio.Group
            options={[
              { label: "横向", value: 1 },
              { label: "竖向", value: 0 },
            ]}
            value={helpLine.direction}
            onChange={(e) => {
              setHelpLine((d) => {
                d.direction = e.target.value;
              });
            }}
            optionType="button"
          />
        </Flex>
        <Flex align="center" gap="small" wrap="wrap">
          <div className="label">等分:</div>
          <Radio.Group
            options={[
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "4", value: 4 },
              { label: "7", value: 7 },
            ]}
            value={helpLine.portion}
            onChange={(e) => {
              setHelpLine((d) => {
                d.portion = e.target.value;
              });
            }}
            optionType="button"
          />
        </Flex>
        <Flex align="center" gap="small" wrap="wrap">
          <div className="label">线条粗细:</div>
          <Radio.Group
            options={[
              { label: "1", value: 1 },
              { label: "2", value: 2 },
              { label: "3", value: 3 },
              { label: "4", value: 4 },
            ]}
            onChange={(e) => {
              setHelpLine((d) => {
                d.strokeWidth = e.target.value;
              });
            }}
            value={helpLine.strokeWidth}
            optionType="button"
          />
        </Flex>
        <Flex align="center" gap="small" wrap="wrap">
          <div className="label">线条样式:</div>
          <Radio.Group
            options={[
              { label: "-", value: 1 },
              { label: "--", value: 2 },
              { label: "- - ", value: 3 },
            ]}
            onChange={(e) => {
              setHelpLine((d) => {
                d.strokeDashArray = e.target.value;
              });
            }}
            value={helpLine.strokeDashArray}
            optionType="button"
          />
        </Flex>
        <Flex align="center" gap="small" wrap="wrap">
          <div className="label">线条颜色:</div>
          <ColorPicker
            onChange={(v) => {
              setHelpLine((d) => {
                d.stroke = v.toHexString();
              });
            }}
            value={helpLine.stroke}
          />
        </Flex>
        <Flex align="center" gap="small" wrap="wrap">
          <Button onClick={onHelpLineChange} type="primary" style={{ flex: 1 }}>
            添加
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default HelpLine;
