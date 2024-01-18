
import { InputNumber, Select, ColorPicker, Form, Flex, Button, Switch } from "antd"
import { useContext, useEffect } from "react";
import { fabric } from "fabric";
import { nanoid } from "nanoid";
import { MainContext, HBSType, hbsTypes } from "@/store/store";

import usePaperStore, { PaperTempOptions, PaperBackType, PaperBackArray } from "@/store/usePaperStore"

import "./index.less"

const IconImage = (props: {
    src: string,
    value: PaperBackType,
    isActive: boolean,
    onClick: (v: PaperBackType) => void
}) => {
    const { src, value, isActive, onClick } = props;
    return <div className={`back-icon ${isActive ? "active-back-icon" : ""}`} onClick={() => {
        onClick(value)
    }}>
        <img src={src} />
    </div>
}


const SizeSection = () => {
    const { canvas, zoomRatio } = useContext(MainContext);

    const {
        paperConfig,
        setPaperConfig,
        drawGridTexture,
        drawLineTexture,
        drawDotsTexture,
    } = usePaperStore()


    const uselessFn = () => { }

    const onChangeBackColor = (v: any) => {
        const hex = v.toHexString()
        setPaperConfig((d) => {
            d.backgroundColor = hex
        })
        canvas?.setBackgroundColor(hex, () => { })
        canvas?.renderAll()
    }

    const resetBackColor = (v: boolean) => {
        const hex = v ? paperConfig.backgroundColor : "#fff";
        setPaperConfig((d) => {
            d.showBackColor = v
        })
        canvas?.setBackgroundColor(hex, () => { })
        canvas?.renderAll()
    }

    const onClearBackTexture = () => {
        canvas?.getObjects().forEach((ele) => {
            if ((ele as any).hbsType === HBSType.back) {
                canvas.remove(ele)
            }
        })
        canvas?.renderAll()
    }

    // 改变背景纹理
    const onChangeTexture = (v?: PaperBackType, color?: any) => {
        const hex = color?.toHexString() || paperConfig.lineConfig.stroke;
        const type = v || paperConfig.backConfig
        onClearBackTexture()
        switch (type) {
            case PaperBackType.forDots:
                drawDotsTexture(hex)
                break;
            case PaperBackType.lines:
                drawLineTexture(hex)
                break;
            case PaperBackType.rectangle:
                drawGridTexture(hex)
                break;
            default:
                break
        }
    }

    const onChangeTextureColor = (v: any) => {
        const hex = v?.toHexString() || paperConfig.lineConfig.stroke;
        setPaperConfig((d) => {
            d.lineConfig.stroke = hex
        })
        canvas?.getObjects().forEach((ele) => {
            if ((ele as any).hbsType === HBSType.back) {
                ((ele as fabric.Group).getObjects() || []).forEach((item) => {
                    item.set({
                        stroke: hex
                    })
                })
            }
        })
        canvas?.renderAll()
    }

    // 绘制活页孔
    const onToggleCircle = (v: boolean) => {
        canvas?.getObjects().forEach((ele: any) => {
            if (ele.hbsType === HBSType.holes) {
                ele.visible = v
            }
        })
        setPaperConfig((d) => {
            d.showHole = v
        })
        canvas?.renderAll()
    }

    const onToggleBack = (v: boolean) => {
        canvas?.getObjects().forEach((ele: any) => {
            if (ele.hbsType === HBSType.back) {
                ele.visible = v
            }
        })
        setPaperConfig((d) => {
            d.showBackTexture = v
        })
        canvas?.renderAll()
    }

    const onAddCircle = () => {
        const cw = canvas?.getWidth() || 0
        const ch = canvas?.getHeight() || 0
        const middle = Math.floor(ch / 2)
        const LEFT_GAP = 8.5
        const CIRCLE_R = 2.5;
        const CIRCLE_GAP = 19;
        const CIRCLE_GROUP_GAP = 19;
        const CIRCLR_LEFT = 2.5

        const circles = []
        for (let i = 0; i <= 2; i++) {
            const c = new fabric.Circle({
                radius: CIRCLE_R * zoomRatio,
                top: middle + (CIRCLE_GROUP_GAP / 2 - CIRCLE_R + CIRCLE_GAP * i) * zoomRatio,
                left: CIRCLR_LEFT * zoomRatio,
                fill: "#F5F5F5",
            })
            circles.push(c)
        }

        for (let i = 0; i <= 2; i++) {
            const c = new fabric.Circle({
                radius: CIRCLE_R * zoomRatio,
                top: middle - ((CIRCLE_GROUP_GAP / 2 + CIRCLE_R) + CIRCLE_GAP * i) * zoomRatio,
                left: CIRCLR_LEFT * zoomRatio,
                fill: "#F5F5F5",
            })
            circles.push(c)
        }

        const group = new fabric.Group(circles, {
            selectable: false,
            hbsType: "holes"
        } as any)

        canvas?.add(group);
        canvas?.renderAll()
    }


    useEffect(() => {
        onChangeTexture();
        onAddCircle()
    }, [])

    return <div className="size-section">
        <Flex vertical={true} gap="middle" >
            <div className="section-title">画布尺寸</div>
            <Flex align="center" gap="small">
                <div>尺寸：</div>
                <Select disabled value={paperConfig.curTempType} style={{ flex: 1 }} onChange={uselessFn} options={PaperTempOptions} />
            </Flex>
            <Flex gap="small">
                <Flex align="center" gap="small">
                    <div>宽度:</div>
                    <InputNumber value={paperConfig.width} disabled />
                </Flex>
                <Flex align="center" gap="small">
                    <div>高度:</div>
                    <InputNumber value={paperConfig.height} disabled />
                </Flex>
            </Flex>
            <div className="section-title">背景颜色
                <Switch value={paperConfig.showBackColor} onChange={resetBackColor} />
            </div>
            <Flex align="center" gap="small">
                <div>背景颜色:</div>
                <ColorPicker
                    style={{
                        flex: 1
                    }}
                    value={paperConfig.backgroundColor}
                    onChange={onChangeBackColor} />
            </Flex>
            <div className="section-title">活页孔 <Switch value={paperConfig.showHole} onChange={onToggleCircle} /></div>
            <div className="section-title">画布填充 <Switch value={paperConfig.showBackTexture} onChange={onToggleBack} /></div>
            <Flex align="self-start" gap="small">
                <div>背景类型:</div>
                <Flex flex={1} gap="small" wrap="wrap">
                    {PaperBackArray.map((ele) => {
                        return <IconImage
                            key={ele.value}
                            {...ele}
                            isActive={paperConfig.backConfig === ele.value}
                            onClick={(v) => {
                                onChangeTexture(v, null, null)
                                setPaperConfig((d) => {
                                    d.backConfig = v
                                })
                            }} />
                    })}
                </Flex>
            </Flex>
            <Flex align="center" gap="small">
                <div>线条颜色:</div>
                <ColorPicker
                    style={{ flex: 1 }}
                    value={paperConfig.lineConfig.stroke} onChange={onChangeTextureColor} allowClear />
            </Flex>
            {/* <Flex align="center" gap="small" >
                <div>线条类型:</div>
                <ColorPicker value={paperConfig.lineConfig?.strokeWidth} onChange={onChange} allowClear />
            </Flex> */}

        </Flex>

        {/* <FormItem style={{ flex: 1 }} label="孔数" name="holesNum">
                <Select value={`${paperConfig.sideHoles?.holesNum}`} options={[{
                    value: "6",
                    label: "六孔"
                }]} disabled />
            </FormItem>
            <Flex gap={12}>
                <FormItem style={{ flex: 1 }} label="孔距" name="holesGap">
                    <Select value={paperConfig.sideHoles?.holesGap} options={[{
                        value: "6",
                        label: "六孔"
                    }]} disabled />
                </FormItem>
                <FormItem style={{ flex: 1 }} label="间距" name="holesGroupGap">
                    <Select
                        value={paperConfig.sideHoles?.holesGroupGap}
                        options={[{
                            value: "6",
                            label: "六孔",

                        }]} disabled />
                </FormItem>
            </Flex>*/}
    </div >
}

export default SizeSection