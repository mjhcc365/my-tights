import {
    CopyOutlined,
    DeleteOutlined,
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    BorderOuterOutlined,
    LockOutlined,
    UnlockOutlined
} from "@ant-design/icons"
import {
    Select,
    ColorPicker,
    Popover,
    Button,
    Slider,
    InputNumber,
    Tooltip
} from "antd"
import { useContext } from "react"
import { fabric } from "fabric"
import { MainContext } from "@/store/store"
import { nanoid } from "nanoid"
import { Layers, SYS_FONTS, WEB_FONTS } from "./types"

import "./Tools.less"
import Icon from "@/HbsUI/Icon"

export const Copy = () => {
    const { canvas } = useContext(MainContext);

    const handleCope = () => {
        if (!canvas) return
        const clonedRect = fabric.util.object.clone(canvas?.getActiveObject());
        canvas.add(clonedRect);
        clonedRect.set({
            left: (canvas?.getActiveObject()?.left || 0) + 60,
            top: (canvas?.getActiveObject()?.top || 0) + 60,
        });
        canvas.discardActiveObject()
        canvas?.renderAll();
    }

    return <Tooltip placement="bottom" title="复制">
        <CopyOutlined style={{ fontSize: "18px", color: "#434343" }} onClick={handleCope} />
    </Tooltip>
}

export const Delete = () => {
    const { canvas, setActiveObject } = useContext(MainContext);
    const handleDelEle = () => {
        if (!canvas) return
        if (canvas.getActiveObject() && canvas) {
            canvas.remove((canvas.getActiveObject()) as any)
            canvas.renderAll();
            setActiveObject(() => null)
        }
    }
    return <Tooltip placement="bottom" title="删除">
        <DeleteOutlined style={{ fontSize: "18px", color: "#434343" }} onClick={handleDelEle} />
    </Tooltip>
}

export const Lock = () => {
    const { canvas, setActiveObject } = useContext(MainContext);
    const handleLock = () => {
        if (!canvas) return
        if (canvas.getActiveObject() && canvas) {
            setActiveObject((d: any) => {
                d.lockRotation = true;
                d.lockMovementX = true;
                d.lockMovementY = true;
                d.lockScalingX = true;
                d.lockScalingY = true;
            })
            canvas.getActiveObject()?.set({
                lockRotation: true,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true
            })
            canvas.discardActiveObject()
            canvas.renderAll();
        }
    }
    return <Tooltip placement="bottom" title="锁定">
        <LockOutlined style={{ fontSize: "18px", color: "#434343" }} onClick={handleLock} />
    </Tooltip>
}


export const UnLock = () => {
    const { canvas, setActiveObject } = useContext(MainContext);
    const handleUnLock = () => {
        if (!canvas) return
        if (canvas.getActiveObject() && canvas) {
            setActiveObject((d: any) => {
                d.lockRotation = false;
                d.lockMovementX = false;
                d.lockMovementY = false;
                d.lockScalingX = false;
                d.lockScalingY = false;
            })
            canvas.getActiveObject()?.set({
                lockRotation: false,
                lockMovementX: false,
                lockMovementY: false,
                lockScalingX: false,
                lockScalingY: false
            })
            canvas.renderAll();
        }
    }
    return <Tooltip placement="bottom" title="解锁">
        <UnlockOutlined style={{ fontSize: "18px", color: "#434343" }} onClick={handleUnLock} />
    </Tooltip>
}

const ALL_FONTS = SYS_FONTS.concat(WEB_FONTS)
const ALL_SIZE = [{
    label: "100",
    value: 100
},
{
    label: "90",
    value: 90
}, {
    label: "80",
    value: 80
}, {
    label: "70",
    value: 70
}, {
    label: "60",
    value: 60
}, {
    label: "50",
    value: 50
},
{
    label: "40",
    value: 40
},
{
    label: "30",
    value: 30
},
{
    label: "20",
    value: 20
},
{
    label: "18",
    value: 18
},
{
    label: "16",
    value: 16
}]

export const TextTools = () => {
    const { canvas, activeObject, setActiveObject } = useContext(MainContext);
    // 加粗
    const handleChangeFontWight = () => {
        if (activeObject && canvas) {
            const nextValue = (activeObject as any)?.fontWeight === 'bold' ? 'normal' : 'bold';
            setActiveObject((draft: any) => {
                draft.fontWeight = nextValue
            })
            canvas.getActiveObject()?.set({ fontWeight: nextValue } as any)
            console.log("==>", canvas.getActiveObject())
            canvas.renderAll();
        }
    }
    // 斜体
    const handleChangeFontStyle = () => {
        if (activeObject && canvas) {
            const nextValue = (activeObject as any)?.fontStyle === 'italic' ? 'normal' : 'italic';
            setActiveObject((draft: any) => {
                draft.fontStyle = nextValue
            })
            canvas.getActiveObject()?.set({ fontStyle: nextValue } as any)
            console.log("==>", canvas.getActiveObject())
            canvas.renderAll();
        }
    }

    // 下划线
    const handleChangeUnderline = () => {
        const nextValue = !(activeObject as any).underline
        setActiveObject((draft: any) => {
            draft.underline = nextValue
        })
        canvas?.getActiveObject()?.set({ underline: nextValue } as any)
        canvas?.renderAll();
    }

    // 删除线
    const handleChangeLinethrough = () => {
        if (!canvas) return
        const nextValue = !(activeObject as any).linethrough
        setActiveObject((draft: any) => {
            draft.linethrough = nextValue
        })
        canvas.getActiveObject()?.set({ linethrough: nextValue } as any)
        canvas.renderAll();
    }

    const handleFontChange = (value: string) => {
        if (activeObject && canvas) {
            setActiveObject((draft: any) => {
                draft.fontFamily = value
            })
            canvas.getActiveObject()?.set({ fontFamily: value } as any)
            canvas.renderAll();
        }
    }

    const handleChangeSize = (value: string) => {
        if (activeObject && canvas) {
            setActiveObject((draft: any) => {
                draft.fontSize = parseInt(value)
            })
            canvas.getActiveObject()?.set({ fontSize: parseInt(value) } as any)
            canvas.renderAll();
        }
    }
    return <>
        <Select
            style={{ width: 100 }}
            value={(activeObject as any)?.fontFamily}
            options={ALL_FONTS}
            optionRender={(ele) => {
                return <div style={{ fontFamily: `${ele.value}` }}>{ele.label}</div>
            }}
            onChange={handleFontChange} />
        <Select
            style={{ width: 75 }}
            value={(activeObject as any)?.fontSize}
            onChange={handleChangeSize}
            options={ALL_SIZE} />
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

}

export const LaylerSelect = () => {
    const { canvas, } = useContext(MainContext);
    const handleChangeLayer = (value: string) => {
        if (!canvas) return
        switch (value) {
            case "top":
                canvas?.getActiveObject()?.bringToFront();
                break;
            case "pre": // 
                canvas?.getActiveObject()?.bringForward();
                break;
            case "next": // 下一层
                canvas?.getActiveObject()?.sendBackwards();
                break;
            case "bottom": // 底层
                canvas?.getActiveObject()?.sendToBack();
                break;
            default:
                return
        }
    }
    return <Select style={{ width: 100 }} placeholder="图层" options={Layers} onChange={handleChangeLayer} />
}


export const FillColor = () => {
    const { canvas, activeObject, setActiveObject } = useContext(MainContext);

    const handleChangeColor = (v: any) => {
        if (!canvas) return
        setActiveObject((draft: any) => {
            draft.fill = v.toRgbString()
        })
        canvas.getActiveObject()?.set({ fill: v.toRgbString() })
        canvas.renderAll();
    }
    return <ColorPicker format="rgb" value={(activeObject as any)?.fill} onChange={handleChangeColor} />

}

// 描边样式
export const StokeStyle = () => {

    const { canvas, activeObject, setActiveObject } = useContext(MainContext);

    const onStrokeColorChange = (v: any) => {
        setActiveObject((draft: any) => {
            draft.stroke = v.toHexString()
        })
        canvas?.getActiveObject()?.set({
            stroke: v.toHexString(),
        })
        canvas?.renderAll()
    }

    const onStrokeWidthChange = (v: number) => {
        setActiveObject((draft: any) => {
            draft.strokeWidth = v
        })
        canvas?.getActiveObject()?.set({
            strokeWidth: v,
        })
        canvas?.renderAll()
    }

    const onRadiusChange = (v: any) => {
        console.log(v)
    }

    return <Popover placement="bottom" trigger={"hover"} title="边框样式" content={
        <div className="stroke-tools">
            <ColorPicker allowClear value={activeObject?.stroke} onChange={onStrokeColorChange} />
            <div>
                <Button>无</Button>
                <Button onClick={onRadiusChange}>--</Button>
                <Button onClick={onRadiusChange}>- -</Button>
                <Button onClick={onRadiusChange}>==</Button>
            </div>
            <div>边框粗细 { }</div>
            <Slider onChange={onStrokeWidthChange} min={0} max={100} />
            <div>圆角 { }</div>
            <Slider onChange={onRadiusChange} min={0} max={100} />
        </div>}>
        <BorderOuterOutlined style={{ fontSize: "18px", color: "#434343" }} />
    </Popover>
}

export const WHinfo = () => {
    const { canvas, activeObject, setActiveObject } = useContext(MainContext);

    const changeObjWidth = () => {
    }

    const changeObjHeight = () => {

    }

    return <>
        <InputNumber value={Math.floor(activeObject?.width)} prefix="W" onChange={changeObjWidth} />
        <InputNumber value={Math.floor(activeObject?.height)} prefix="H" onChange={changeObjHeight} />
    </>
}

export const Opacity = () => {
    const { canvas, activeObject, setActiveObject } = useContext(MainContext);

    const handleOpacity = (v: any) => {
        setActiveObject((draft: any) => {
            draft.opacity = v
        })
        canvas?.getActiveObject()?.set({
            opacity: v
        })
        canvas?.renderAll();
    }

    return <Popover placement="bottom" content={<Slider value={activeObject?.opacity} onChange={handleOpacity} style={{ minWidth: 148 }} min={0} max={1} step={0.01} />} arrow={false}>
        <div><Icon fontSize={18} icon="toumingdu" /></div>
    </Popover>
}

export const Position = () => {
    const { canvas, activeObject, setActiveObject } = useContext(MainContext);

    const changeObjTop = (v: number) => {
        setActiveObject((draft: any) => {
            draft.top = v
        })
        canvas?.getActiveObject()?.set({
            top: v
        })
        canvas?.renderAll();
    }

    const changeObjLeft = (v: number) => {
        setActiveObject((draft: any) => {
            draft.left = v
        })
        canvas?.getActiveObject()?.set({
            left: v
        })
        canvas?.renderAll();

    }
    return <>
        <InputNumber value={Math.floor(activeObject?.top || 0)} prefix="T" onChange={changeObjTop} />
        <InputNumber value={Math.floor(activeObject?.left || 0)} prefix="L" onChange={changeObjLeft} />
    </ >
}

export const SetGroup = () => {
    const { canvas, setActiveObject } = useContext(MainContext);
    const handleCombineGroup = () => {
        if (!canvas) return
        var activeObjects = canvas.getActiveObjects();

        if (activeObjects.length > 1) {
            setActiveObject(() => null)
            canvas.discardActiveObject();
            const group = new fabric.Group(activeObjects, {
                id: nanoid(10),
                // name: ElementNames.GROUP,
                interactive: false,
                subTargetCheck: true,
            } as any);
            canvas.add(group);
            canvas.remove(...activeObjects)
            canvas.renderAll();
        }
    }

    const handleIntersectElements = () => {
        if (!canvas) return
        const group = canvas.getActiveObject() as fabric.Group;
        group.getObjects().forEach((ele) => {
            canvas.add(ele)
        })
        canvas.discardActiveObject()
        setActiveObject(() => null)
        canvas.remove(group);
        canvas.renderAll()
    }

    const handleLeft = () => {
        if (!canvas) return
        const group = canvas.getActiveObject() as fabric.Group;
        group.getObjects().forEach((ele) => {
            ele.set({
                left: -((group.width || 0) / 2)
            })
        })
        canvas.renderAll();
    }

    const handleRight = () => {
        if (!canvas) return
        const group = canvas.getActiveObject() as fabric.Group;

        group.getObjects().forEach((ele) => {
            ele.set({
                left: (group?.width || 0) / 2 - (ele?.width || 0)
            })
        })
        canvas.renderAll();
    }

    const handleTop = () => {
        if (!canvas) return
        const group = canvas.getActiveObject() as fabric.Group;
        group.getObjects().forEach((ele) => {
            ele.set({
                top: -((group.height || 0) / 2)
            })
        })
        canvas.renderAll();
    }

    const handleBottom = () => {
        if (!canvas) return
        const group = canvas.getActiveObject() as fabric.Group;
        group.getObjects().forEach((ele) => {
            ele.set({
                top: (group?.height || 0) / 2 - (ele?.height || 0)
            })
        })
        canvas.renderAll();
    }


    return <>
        <Tooltip placement="bottom" title="编组">
            <div onClick={handleCombineGroup}><Icon fontSize={20} icon="jianlizuhe" /></div>
        </Tooltip>

        <Tooltip placement="bottom" title="分组">
            <div onClick={handleIntersectElements}><Icon fontSize={18} icon="fenzu" /></div>
        </Tooltip>


        <Tooltip placement="bottom" title="左对齐">
            <div onClick={handleLeft}><Icon fontSize={18} icon="zuoduiqi" /></div>
        </Tooltip>

        <Tooltip placement="bottom" title="右对齐">
            <div onClick={handleRight}><Icon fontSize={18} icon="youduiqi" /></div>
        </Tooltip>

        <Tooltip placement="bottom" title="上对齐">
            <div onClick={handleTop}><Icon fontSize={14} icon="shangduiqi1" /></div>
        </Tooltip>
        <Tooltip placement="bottom" title="下对齐">
            <div onClick={handleBottom}><Icon fontSize={14} icon="xiaduiqi" /></div>
        </Tooltip>
    </>

}

export enum ToolType {
    wh = "wh",
    position = "position",
    opacity = "opacity",
    copy = "copy",
    delete = "delete",
    layer = "layer",
    fillcolor = "fillcolor",
    text = "text",
    stokeStyle = "stokeStyle",
    setGroup = "setGroup"
}



export const Common = [
    ToolType.wh,
    ToolType.position,
    ToolType.opacity,
    ToolType.copy,
    ToolType.delete,
    ToolType.layer,
    ToolType.fillcolor
]

export const TextToolTypes = [ToolType.fillcolor, ToolType.text]

export const ShapeToolTypes = [ToolType.wh, ToolType.fillcolor, ToolType.stokeStyle]

export const LineToolsType = [ToolType.stokeStyle]

// todo
export const ImageToolTypes = []

export const GroupToolTypes = [ToolType.wh, ToolType.setGroup]

export const PathToolType = [ToolType.wh, ToolType.fillcolor]


export const getTools = (type: string) => {
    switch (type) {
        case "text":
        case "textbox":
            return TextToolTypes
        case "image":
            return ImageToolTypes
        case "ellipse":
        case "circle":
        case "triangle":
        case "rect":
            return ShapeToolTypes;
        case "path":
            return PathToolType;
        case "group":
            return GroupToolTypes;
        case "activeSelection":
            return GroupToolTypes
        case "line":
            return LineToolsType
        default:
            return null
    }
}

export const MainTools = () => {
    const { activeObject, canvas } = useContext(MainContext)
    // console.log("===>", activeObject.type)
    return <>
        {
            canvas?.getActiveObject()?.lockMovementX ?
                <UnLock />
                : <>
                    <div className="tool-common-left">
                        <Position />
                    </div>
                    <div className="tool-self-center">
                        {getTools(activeObject?.type || "")?.map((ele) => {
                            switch (ele) {
                                case ToolType.fillcolor:
                                    return <FillColor />
                                case ToolType.stokeStyle:
                                    return <StokeStyle />
                                case ToolType.text:
                                    return <TextTools />
                                case ToolType.setGroup:
                                    return <SetGroup />
                                case ToolType.wh:
                                    return <WHinfo />
                                default:
                                    return null
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
        }
    </>
}
