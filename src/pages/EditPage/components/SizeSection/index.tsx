import { Select, ColorPicker, Flex, Switch, Button } from "antd";
import { Group, Circle, FabricObject } from "fabric";
import { HBSType } from "./type";
import { stores as store } from "@/pages/EditPage/store/main";

import usePaperStore, {
  PaperTempOptions,
  PaperBackType,
  PaperBackArray,
} from "@/pages/EditPage/components/SizeSection/usePaperStore";

import "./index.less";

const IconImage = (props: {
  src: string;
  value: PaperBackType;
  isActive: boolean;
  onClick: (v: PaperBackType) => void;
}) => {
  const { src, value, isActive, onClick } = props;
  return (
    <div
      className={`back-icon ${isActive ? "active-back-icon" : ""}`}
      onClick={() => {
        onClick(value);
      }}
    >
      <img src={src} />
    </div>
  );
};

const SizeSection = () => {
  const {
    paperConfig,
    setPaperConfig,
    drawGridTexture,
    drawLineTexture,
    drawDotsTexture,
  } = usePaperStore();

  const onChangeBackColor = (v: any) => {
    const hex = v.toHexString();
    setPaperConfig((d) => {
      d.backgroundColor = hex.slice(-2) === "00" ? "#ffffff" : hex;
    });
    store.canvasStore.setBackColor(hex);
  };

  const resetBackColor = (v: boolean) => {
    const hex = v ? paperConfig.backgroundColor : "#fff";
    setPaperConfig((d) => {
      d.showBackColor = v;
    });
    store.canvasStore.setBackColor(hex);
  };

  const onClearBackTexture = () => {
    store.canvasStore.canvas?.getObjects().forEach((ele) => {
      if ((ele as any).hbsType === HBSType.back) {
        store.canvasStore.canvas?.remove(ele);
      }
    });
    store.canvasStore.canvas?.renderAll();
  };

  // 改变背景纹理
  const onChangeTexture = (v?: PaperBackType, color?: any) => {
    const hex = color?.toHexString() || paperConfig.lineConfig.stroke;
    const type = v || paperConfig.backConfig;
    onClearBackTexture();
    switch (type) {
      case PaperBackType.forDots:
        drawDotsTexture(hex);
        break;
      case PaperBackType.lines:
        drawLineTexture(hex);
        break;
      case PaperBackType.rectangle:
        drawGridTexture(hex);
        break;
      default:
        break;
    }
  };

  const onChangeTextureColor = (v: any) => {
    const hex = v?.toHexString() || paperConfig.lineConfig.stroke;
    setPaperConfig((d) => {
      d.lineConfig.stroke = hex;
    });
    store.canvasStore.canvas?.getObjects().forEach((ele) => {
      if ((ele as any).hbsType === HBSType.back) {
        ((ele as Group).getObjects() || []).forEach((item) => {
          item.set({
            stroke: hex,
          });
        });
      }
    });
    store.canvasStore.canvas?.renderAll();
  };

  // 绘制活页孔
  const onToggleCircle = (v: boolean) => {
    if (
      store.canvasStore.canvas
        .getObjects()
        .find((fabricObject) => (fabricObject as any).hbsType === HBSType.holes)
    ) {
      store.canvasStore.canvas?.getObjects().forEach((ele: any) => {
        if (ele.hbsType === HBSType.holes) {
          ele.visible = v;
        }
      });

      setPaperConfig((d) => {
        d.showHole = v;
      });
    } else {
      onAddCircle();
      setPaperConfig((d) => {
        d.showHole = true;
      });
    }
    store.canvasStore.canvas?.renderAll();
  };

  const onToggleBack = (v: boolean) => {
    store.canvasStore.canvas?.getObjects().forEach((ele: any) => {
      if (ele.hbsType === HBSType.back) {
        ele.visible = v;
      }
    });
    setPaperConfig((d) => {
      d.showBackTexture = v;
    });
    store.canvasStore.canvas?.renderAll();
  };

  const onAddCircle = () => {
    const { width, height, top, left } =
      store.canvasStore.getWorkSpaceDraw() as FabricObject;
    const cw = width;
    const ch = height;

    const middle = Math.floor(ch / 2);
    const LEFT_GAP = 8.5;
    const CIRCLE_R = 2.5;
    const CIRCLE_GAP = 19;
    const CIRCLE_GROUP_GAP = 19;
    const CIRCLR_LEFT = 2.5;

    const selfZoom = 5;

    const circles = [];
    for (let i = 0; i <= 2; i++) {
      const c = new Circle({
        radius: CIRCLE_R * store.canvasStore.zoom * selfZoom,
        top:
          middle +
          (CIRCLE_GROUP_GAP / 2 - CIRCLE_R + CIRCLE_GAP * i) *
            store.canvasStore.zoom *
            selfZoom,
        left: CIRCLR_LEFT * store.canvasStore.zoom * selfZoom,
        fill: "#F5F5F5",
      });
      circles.push(c);
    }

    for (let i = 0; i <= 2; i++) {
      const c = new Circle({
        radius: CIRCLE_R * store.canvasStore.zoom * selfZoom,
        top:
          middle -
          (CIRCLE_GROUP_GAP / 2 + CIRCLE_R + CIRCLE_GAP * i) *
            store.canvasStore.zoom *
            selfZoom,
        left: CIRCLR_LEFT * store.canvasStore.zoom * selfZoom,
        fill: "#F5F5F5",
      });
      circles.push(c);
    }

    const group = new Group(circles, {
      top,
      left,
      selectable: false,
      hbsType: "holes",
    } as any);

    store.canvasStore.canvas?.add(group);
    store.canvasStore.canvas?.renderAll();
  };

  return (
    <div className="size-section">
      <Flex vertical={true} gap="middle">
        <div className="section-title">画布尺寸</div>
        <Flex align="center" gap="small">
          <div>尺寸：</div>
          <Select
            value={paperConfig.curTempType}
            style={{ flex: 1 }}
            onChange={(tempType) => {
              console.log("==>", tempType);
            }}
            options={PaperTempOptions}
          />
        </Flex>
        <div className="section-title">
          背景颜色
          <Switch value={paperConfig.showBackColor} onChange={resetBackColor} />
        </div>
        <Flex align="center" gap="small">
          <div>背景颜色:</div>
          <ColorPicker
            style={{
              flex: 1,
            }}
            value={paperConfig.backgroundColor}
            onChange={onChangeBackColor}
          />
        </Flex>
        <div className="section-title">
          活页孔
          <Switch value={paperConfig.showHole} onChange={onToggleCircle} />
        </div>
        <div className="section-title">
          画布填充
          <Switch value={paperConfig.showBackTexture} onChange={onToggleBack} />
        </div>
        <Flex align="self-start" gap="small">
          <div>背景类型:</div>
          <Flex flex={1} gap="small" wrap="wrap">
            {PaperBackArray.map((ele) => {
              return (
                <IconImage
                  key={ele.value}
                  {...ele}
                  isActive={paperConfig.backConfig === ele.value}
                  onClick={(v) => {
                    onChangeTexture(v, null);
                    setPaperConfig((d) => {
                      d.backConfig = v;
                    });
                  }}
                />
              );
            })}
          </Flex>
        </Flex>
        <Flex align="center" gap="small">
          <div>线条颜色:</div>
          <ColorPicker
            style={{ flex: 1 }}
            value={paperConfig.lineConfig.stroke}
            onChange={onChangeTextureColor}
            allowClear
          />
        </Flex>
      </Flex>
    </div>
  );
};

export default SizeSection;
