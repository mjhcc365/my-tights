import { useContext, useEffect, useMemo, useState } from "react"
import { Select, ColorPicker } from "antd"
import { fabric } from "fabric"
import {
    DeleteOutlined,
    BoldOutlined,
    // AlignLeftOutlined,
    // AlignCenterOutlined,
    // AlignRightOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    HighlightOutlined,
    BgColorsOutlined,
    CopyOutlined
} from "@ant-design/icons"
import { MainContext } from "@/store/store"
import { SYS_FONTS, WEB_FONTS, Layers } from "./types"
import "./TextTools.less"


const ALL_FONTS = SYS_FONTS.concat(WEB_FONTS)
const ALL_SIZE = [{
    label: "100",
    value: 100
}, {
    label: "30",
    value: 30
}]

// interface TextToolsStates extends fabric.TextOptions { }

const TextTools = () => {
    const { canvas, activeObject, setActiveObject } = useContext(MainContext);

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

    const handleChange = (value: string) => {
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

    const handleDelEle = () => {
        if (activeObject && canvas) {
            canvas.remove((canvas.getActiveObject()) as any)
            canvas.renderAll();
            setActiveObject(() => null)
        }
    }

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

    const handleChangeUnderline = () => {
        const nextValue = !(activeObject as any).underline
        setActiveObject((draft: any) => {
            draft.underline = nextValue
        })
        canvas?.getActiveObject()?.set({ underline: nextValue } as any)
        canvas?.renderAll();
    }

    const handleChangeLinethrough = () => {
        const nextValue = !activeObject.linethrough
        setActiveObject((draft: any) => {
            draft.linethrough = nextValue
        })
        canvas.getActiveObject()?.set({ linethrough: nextValue })
        canvas.renderAll();
    }

    const handleChangeColor = (v) => {
        setActiveObject((draft: any) => {
            draft.fill = v.toRgbString()
        })
        canvas.getActiveObject()?.set({ fill: v.toRgbString() })
        canvas.renderAll();
    }

    const handleCope = () => {
        const active = canvas?.getActiveObject();
        const clonedRect = fabric.util.object.clone(active);

        clonedRect.set({
            left: active.left + 60,
            top: active.top
        });
        canvas.discardActiveObject()
        canvas.add(clonedRect);
        canvas?.renderAll();


    }

    return <div className="text-tool-panel">
        <Select style={{ width: 100 }}
            value={(activeObject as any)?.fontFamily}
            options={ALL_FONTS}
            optionRender={(ele) => {
                return <div style={{ fontFamily: `${ele.value}` }}>{ele.label}</div>
            }}
            onChange={handleChange} />
        <Select style={{ width: 75 }} value={(activeObject as any)?.fontSize} onChange={handleChangeSize} options={ALL_SIZE} />
        <Select style={{ width: 100 }} placeholder="图层" options={Layers} onChange={handleChangeLayer} />
        <ColorPicker format="rgb" value={(activeObject as any)?.fill} onChange={handleChangeColor} />
        <BoldOutlined onClick={handleChangeFontWight} />
        <ItalicOutlined onClick={handleChangeFontStyle} />
        <UnderlineOutlined onClick={handleChangeUnderline} />
        <StrikethroughOutlined onClick={handleChangeLinethrough} />
        {/* <HighlightOutlined /> */}
        {/* <BgColorsOutlined /> */}
        {/* <AlignLeftOutlined style={{ fontSize: "18px", color: "#434343" }} />
        <AlignCenterOutlined style={{ fontSize: "18px", color: "#434343" }} />
        <AlignRightOutlined style={{ fontSize: "18px", color: "#434343" }} /> */}
        <CopyOutlined style={{ fontSize: "18px", color: "#434343" }} onClick={handleCope} />
        <DeleteOutlined style={{ fontSize: "18px", color: "#434343" }} onClick={handleDelEle} />
    </div>
}

export default TextTools