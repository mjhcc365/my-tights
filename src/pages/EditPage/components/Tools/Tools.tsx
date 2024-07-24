import {
  CopyOutlined,
  DeleteOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  BorderOuterOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Select,
  ColorPicker,
  Popover,
  Button,
  Slider,
  InputNumber,
  Tooltip,
} from "antd";
import { util, Group } from "fabric";
import { nanoid } from "nanoid";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import { Layers, ALL_FONTS, ALL_SIZE } from "@/utils/fonts";

import "./Tools.less";
import Icon from "@/HbsUI/Icon";
// import { observer } from "mobx-react-lite";

export const Copy = () => {
  const store = useContext(CanvasStoreContext);
  const handleCope = () => {
    if (!store.canvas) return;
    // const clonedRect = util.object.clone(
    //   store?.canvas?.getActiveObject()
    // );
    // store?.canvas?.add(clonedRect);
    // clonedRect.set({
    //   left: (store?.canvas?.getActiveObject()?.left || 0) + 60,
    //   top: (store?.canvas?.getActiveObject()?.top || 0) + 60,
    // });
    // store?.canvas?.discardActiveObject();
    // store?.canvas?.renderAll();
  };

  return (
    <Tooltip placement="bottom" title="复制">
      <CopyOutlined
        style={{ fontSize: "18px", color: "#434343" }}
        onClick={handleCope}
      />
    </Tooltip>
  );
};

export const Delete = () => {
  const store = useContext(CanvasStoreContext);
  const handleDelEle = () => {
    if (!store.canvas) return;
    if (store.canvas?.getActiveObject()) {
      store.canvas?.remove(store.canvas?.getActiveObject() as any);
      store.setActiveObj(null);
      store.canvas?.renderAll();
    }
  };
  return (
    <Tooltip placement="bottom" title="删除">
      <DeleteOutlined
        style={{ fontSize: "18px", color: "#434343" }}
        onClick={handleDelEle}
      />
    </Tooltip>
  );
};

export const Lock = () => {
  const store = useContext(CanvasStoreContext);
  const handleLock = () => {
    if (!store.canvas) return;
    if (store.canvas.getActiveObject()) {
      store.canvas.getActiveObject()?.set({
        lockRotation: true,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
      });
      store.canvas.discardActiveObject();
      store.canvas.renderAll();
    }
  };
  return (
    <Tooltip placement="bottom" title="锁定">
      <LockOutlined
        style={{ fontSize: "18px", color: "#434343" }}
        onClick={handleLock}
      />
    </Tooltip>
  );
};

export const UnLock = () => {
  const store = useContext(CanvasStoreContext);
  const handleUnLock = () => {
    if (!store.canvas) return;
    if (store.canvas?.getActiveObject()) {
      store.canvas?.getActiveObject()?.set({
        lockRotation: false,
        lockMovementX: false,
        lockMovementY: false,
        lockScalingX: false,
        lockScalingY: false,
      });
      store.canvas?.renderAll();
    }
  };
  return (
    <Tooltip placement="bottom" title="解锁">
      <UnlockOutlined
        style={{ fontSize: "18px", color: "#434343" }}
        onClick={handleUnLock}
      />
    </Tooltip>
  );
};

export const TextTools = observer(() => {
  const store = useContext(CanvasStoreContext);
  // 加粗
  const handleChangeFontWight = () => {
    if (store.activeObj && store.canvas) {
      const nextValue =
        (store.activeObj as any)?.fontWeight === "bold" ? "normal" : "bold";
      store.setActiveObjParam("fontWeight", nextValue);
      store.canvas.renderAll();
    }
  };
  // 斜体
  const handleChangeFontStyle = () => {
    if (store.activeObj && store.canvas) {
      const nextValue =
        (store.activeObj as any)?.fontStyle === "italic" ? "normal" : "italic";
      store.setActiveObjParam("fontStyle", nextValue);
      store.canvas.renderAll();
    }
  };

  // 下划线
  const handleChangeUnderline = () => {
    const nextValue = !(store.activeObj as any).underline;
    store.setActiveObjParam("underline", nextValue);
    store.canvas?.renderAll();
  };

  // 删除线
  const handleChangeLinethrough = () => {
    if (!store.canvas) return;
    const nextValue = !(store.activeObj as any).linethrough;
    store.setActiveObjParam("linethrough", nextValue);
    store.canvas.renderAll();
  };

  const handleFontChange = (value: string) => {
    if (store.activeObj && store.canvas) {
      store.setActiveObjParam("fontFamily", value);
      store.canvas.renderAll();
    }
  };

  const handleChangeSize = (value: string) => {
    if (store.activeObj && store.canvas) {
      store.setActiveObjParam("fontSize", parseInt(value));
    }
  };
  return (
    <>
      <Select
        style={{ width: 100 }}
        value={(store.activeObj as any)?.fontFamily}
        options={ALL_FONTS}
        optionRender={(ele) => {
          return <div style={{ fontFamily: `${ele.value}` }}>{ele.label}</div>;
        }}
        onChange={handleFontChange}
        size="small"
      />
      <Select
        style={{ width: 75 }}
        value={(store.activeObj as any)?.fontSize}
        onChange={handleChangeSize}
        options={ALL_SIZE}
        size="small"
      />
      <Tooltip placement="bottom" title="加粗">
        <BoldOutlined onClick={handleChangeFontWight} />
      </Tooltip>

      <Tooltip placement="bottom" title="斜体">
        <ItalicOutlined onClick={handleChangeFontStyle} />
      </Tooltip>

      <Tooltip placement="bottom" title="下划线">
        <UnderlineOutlined onClick={handleChangeUnderline} />
      </Tooltip>
      <Tooltip placement="bottom" title="删除线">
        <StrikethroughOutlined onClick={handleChangeLinethrough} />
      </Tooltip>
    </>
  );
});

export const LaylerSelect = () => {
  const store = useContext(CanvasStoreContext);
  const handleChangeLayer = (value: string) => {
    if (!store.canvas) return;
    switch (value) {
      case "top":
        // store?.canvas?.getActiveObject()?.bringToFront();
        break;
      case "pre": //
        // store?.canvas?.getActiveObject()?.bringForward();
        break;
      case "next": // 下一层
        // store?.canvas?.getActiveObject()?.sendBackwards();
        break;
      case "bottom": // 底层
        // store?.canvas?.getActiveObject()?.sendToBack();
        break;
      default:
        return;
    }
  };
  return (
    <Select
      style={{ width: 100 }}
      placeholder="图层"
      options={Layers}
      onChange={handleChangeLayer}
      size="small"
    />
  );
};

export const FillColor = () => {
  const store = useContext(CanvasStoreContext);
  const handleChangeColor = (v: any) => {
    if (!store.canvas) return;
    store.setActiveObjParam("fill", v.toHexString());
  };
  return (
    <ColorPicker
      format="hex"
      value={(store.activeObj as any)?.fill}
      onChange={handleChangeColor}
    />
  );
};

// 描边样式
export const StokeStyle = () => {
  const store = useContext(CanvasStoreContext);
  const onStrokeColorChange = (v: any) => {
    // setActiveObject((draft: any) => {
    //     draft.stroke = v.toHexString()
    // })
    store.canvas?.getActiveObject()?.set({
      stroke: v.toHexString(),
    });
    store.canvas?.renderAll();
  };

  const onStrokeWidthChange = (v: number) => {
    // setActiveObject((draft: any) => {
    //     draft.strokeWidth = v
    // })
    store.canvas?.getActiveObject()?.set({
      strokeWidth: v,
    });
    store.canvas?.renderAll();
  };

  const onRadiusChange = (v: any) => {
    console.log(v);
  };

  return (
    <Popover
      placement="bottom"
      trigger={"hover"}
      title="边框样式"
      content={
        <div className="stroke-tools">
          <ColorPicker
            allowClear
            value={store.activeObj?.stroke}
            onChange={onStrokeColorChange}
          />
          <div>
            <Button>无</Button>
            <Button onClick={onRadiusChange}>--</Button>
            <Button onClick={onRadiusChange}>- -</Button>
            <Button onClick={onRadiusChange}>==</Button>
          </div>
          <div>边框粗细 {}</div>
          <Slider onChange={onStrokeWidthChange} min={0} max={100} />
          <div>圆角 {}</div>
          <Slider onChange={onRadiusChange} min={0} max={100} />
        </div>
      }
    >
      <BorderOuterOutlined style={{ fontSize: "18px", color: "#434343" }} />
    </Popover>
  );
};

export const WHinfo = observer(() => {
  const store = useContext(CanvasStoreContext);
  const changeObjWidth = (v: number | null) => {
    store.setActiveObjParam("width", v);
  };

  const changeObjHeight = (v: number | null) => {
    store.setActiveObjParam("height", v);
  };

  return (
    <>
      <InputNumber
        value={Math.floor(store.activeObj?.width || 0)}
        prefix="W"
        onChange={changeObjWidth}
        size="small"
      />
      <InputNumber
        value={Math.floor(store.activeObj?.height || 0)}
        prefix="H"
        onChange={changeObjHeight}
        size="small"
      />
    </>
  );
});

export const Opacity = () => {
  const store = useContext(CanvasStoreContext);
  const handleOpacity = (v: any) => {
    // setActiveObject((draft: any) => {
    //     draft.opacity = v
    // })
    store.canvas?.getActiveObject()?.set({
      opacity: v,
    });
    store.canvas?.renderAll();
  };

  return (
    <Popover
      placement="bottom"
      content={
        <Slider
          value={store.activeObj?.opacity}
          onChange={handleOpacity}
          style={{ minWidth: 148 }}
          min={0}
          max={1}
          step={0.01}
        />
      }
      arrow={false}
    >
      <div>
        <Icon fontSize={18} icon="toumingdu" />
      </div>
    </Popover>
  );
};

export const Position = observer(() => {
  const store = useContext(CanvasStoreContext);

  const changeObjTop = (v: number | null) => {
    if (!v) return;
    store?.setActiveObjParam("top", v);
  };

  const changeObjLeft = (v: number | null) => {
    if (!v) return;
    store?.setActiveObjParam("left", v);
  };

  return (
    <>
      <InputNumber
        value={Math.floor(store.activeObj?.top || 0)}
        prefix="T"
        onChange={changeObjTop}
        size="small"
      />
      <InputNumber
        value={Math.floor(store.activeObj?.left || 0)}
        prefix="L"
        onChange={changeObjLeft}
        size="small"
      />
    </>
  );
});

export const SetGroup = () => {
  const store = useContext(CanvasStoreContext);

  const handleCombineGroup = () => {
    if (!store?.canvas) return;
    var activeObjects = store?.canvas.getActiveObjects();

    if (activeObjects.length > 1) {
      store.setActiveObj(null);
      store.canvas.discardActiveObject();
      const group = new Group(activeObjects, {
        id: nanoid(10),
        // name: ElementNames.GROUP,
        interactive: false,
        subTargetCheck: true,
      } as any);
      store.addObject(group);
      store.canvas.remove(...activeObjects);
      store.canvas.renderAll();
    }
  };

  const handleIntersectElements = () => {
    if (!store?.canvas) return;
    const group = store?.canvas.getActiveObject() as Group;
    group.getObjects().forEach((ele) => {
      store.canvas?.add(ele);
    });
    store.canvas.discardActiveObject();
    // setActiveObject(() => null)
    store.canvas.remove(group);
    store.canvas.renderAll();
  };

  const handleLeft = () => {
    if (!store?.canvas) return;
    const group = store?.canvas.getActiveObject() as Group;
    group.getObjects().forEach((ele) => {
      ele.set({
        left: -((group.width || 0) / 2),
      });
    });
    store?.canvas.renderAll();
  };

  const handleRight = () => {
    if (!store?.canvas) return;
    const group = store?.canvas.getActiveObject() as Group;

    group.getObjects().forEach((ele) => {
      ele.set({
        left: (group?.width || 0) / 2 - (ele?.width || 0),
      });
    });
    store?.canvas.renderAll();
  };

  const handleTop = () => {
    if (!store?.canvas) return;
    const group = store?.canvas.getActiveObject() as Group;
    group.getObjects().forEach((ele) => {
      ele.set({
        top: -((group.height || 0) / 2),
      });
    });
    store?.canvas.renderAll();
  };

  const handleBottom = () => {
    if (!store?.canvas) return;
    const group = store?.canvas.getActiveObject() as Group;
    group.getObjects().forEach((ele) => {
      ele.set({
        top: (group?.height || 0) / 2 - (ele?.height || 0),
      });
    });
    store?.canvas.renderAll();
  };

  return (
    <>
      <Tooltip placement="bottom" title="编组">
        <div onClick={handleCombineGroup}>
          <Icon fontSize={20} icon="jianlizuhe" />
        </div>
      </Tooltip>

      <Tooltip placement="bottom" title="分组">
        <div onClick={handleIntersectElements}>
          <Icon fontSize={18} icon="fenzu" />
        </div>
      </Tooltip>

      <Tooltip placement="bottom" title="左对齐">
        <div onClick={handleLeft}>
          <Icon fontSize={18} icon="zuoduiqi" />
        </div>
      </Tooltip>

      <Tooltip placement="bottom" title="右对齐">
        <div onClick={handleRight}>
          <Icon fontSize={18} icon="youduiqi" />
        </div>
      </Tooltip>

      <Tooltip placement="bottom" title="上对齐">
        <div onClick={handleTop}>
          <Icon fontSize={14} icon="shangduiqi1" />
        </div>
      </Tooltip>
      <Tooltip placement="bottom" title="下对齐">
        <div onClick={handleBottom}>
          <Icon fontSize={14} icon="xiaduiqi" />
        </div>
      </Tooltip>
    </>
  );
};

export enum ToolType {
  wh = "wh",
  position = "position",
  opacity = "opacity",
  copy = "copy",
  delete = "delete",
  layer = "layer",
  fillcolor = "fillcolor",
  text = "textbox",
  stokeStyle = "stokeStyle",
  setGroup = "setGroup",
}

export const Common = [
  ToolType.wh,
  ToolType.position,
  ToolType.opacity,
  ToolType.copy,
  ToolType.delete,
  ToolType.layer,
  ToolType.fillcolor,
];

export const TextToolTypes = [ToolType.fillcolor, ToolType.text];

export const ShapeToolTypes = [
  ToolType.wh,
  ToolType.fillcolor,
  ToolType.stokeStyle,
];

export const LineToolsType = [ToolType.stokeStyle];

// todo
export const ImageToolTypes = [];

export const GroupToolTypes = [ToolType.wh, ToolType.setGroup];

export const PathToolType = [ToolType.wh, ToolType.fillcolor];

export const getTools = (type: string) => {
  switch (type.toLowerCase()) {
    case "text":
    case "textbox":
      return TextToolTypes;
    case "image":
      return ImageToolTypes;
    case "ellipse":
    case "circle":
    case "triangle":
    case "rect":
      return ShapeToolTypes;
    case "path":
      return PathToolType;
    case "group":
      return GroupToolTypes;
    case "activeselection":
      return GroupToolTypes;
    case "line":
      return LineToolsType;
    default:
      return null;
  }
};

export const MainTools = observer(() => {
  const store = useContext(CanvasStoreContext);

  if (!store?.activeObj) {
    return <div></div>;
  }

  return (
    <div className="section-top-tool">
      {store?.canvas?.getActiveObject()?.lockMovementX ? (
        <UnLock />
      ) : (
        <>
          <div className="tool-common-left">
            <Position />
          </div>
          <div className="tool-self-center">
            {getTools(store?.activeObj?.type || "")?.map((ele) => {
              switch (ele) {
                case ToolType.fillcolor:
                  return <FillColor />;
                case ToolType.stokeStyle:
                  return <StokeStyle />;
                case ToolType.text:
                  return <TextTools />;
                case ToolType.setGroup:
                  return <SetGroup />;
                case ToolType.wh:
                  return <WHinfo />;
                default:
                  return null;
              }
            })}
          </div>
          <div className="tool-common-right">
            <Opacity />
            <Copy />
            <Delete />
            <Lock />
            <LaylerSelect />
          </div>
        </>
      )}
    </div>
  );
});
