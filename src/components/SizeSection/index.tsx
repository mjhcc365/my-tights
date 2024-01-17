
import { InputNumber, Select, ColorPicker, Form, Flex, Button, Switch } from "antd"
import { useContext } from "react";
import { fabric } from "fabric";
import { nanoid } from "nanoid";
import { MainContext, HBSType } from "@/store/store"
import usePaperStore, { PaperTempOptions, PaperBackOptions, A7TempConfig, PaperConfig } from "@/store/usePaperStore"
import { SIZE_ALL, getConfigByType, SIZE_Type } from "./type"

import "./index.less"

const FormItem = Form.Item


const SizeSection = () => {
    const { canvas, zoomRatio } = useContext(MainContext);

    const { paperConfig, setPaperConfig, drawBackPaper } = usePaperStore()

    const [form] = Form.useForm();

    const onChange = () => {
        form.validateFields().then((v) => {
            const { backType } = v;
            switch (backType) {
                case "grid":
                    console.log("===>grid")
                    onSetGridsBack()
                    break;
                case "color":
                    clearGridBack()
                    onSetColorBack();
                    break;
                case "dots":
                    break;
                case "lines":
                    break;
                default:
                    return

            }
        })
    }

    const clearGridBack = () => {
        canvas?.getObjects().forEach((ele: any) => {
            if (ele.hbsType === HBSType.back) {
                canvas?.remove(ele)
            }
        })
    }


    const handleSizeChange = (type: string) => {
        // const { width, height, holes } = getConfigByType(type) as any
        // const { holesNum = 6,
        //     holesStep = 19,
        //     holesSize = 5,
        // } = holes

        // form.setFieldsValue({
        //     canvasWidth: width,
        //     canvasHeight: height,
        //     holesNum,
        //     holesSize,
        //     holesStep,
        // })
        // canvas?.setWidth(width * zoomRatio)
        // canvas?.setHeight(height * zoomRatio);
        // onChange()
    }

    // 绘制网格背景
    const onSetGridsBack = () => {
        const cWidth: number = canvas?.getWidth() || 0
        const cHeight: number = canvas?.getHeight() || 0
        clearGridBack()

        form.validateFields().then((v) => {
            const { lineGap = 3.5 * zoomRatio, lineColor } = v
            // 定义网格线的间距
            const group = new fabric.Group([], {
                hbsId: nanoid(),
                hbsType: HBSType.back,
                selectable: false,
                lockMovementX: true,
                lockMovementY: true,
            } as any)
            // canvas?.add(group)
            // 绘制横向网格线
            for (var i = 0; i <= cHeight; i += lineGap) {
                const cline = new fabric.Line([0, i, cWidth, i], {
                    stroke: typeof lineColor === "string" ? lineColor : lineColor.toHexString(),
                });
                group.addWithUpdate(cline);
            }

            // // 绘制纵向网格线
            for (var j = 0; j <= cWidth; j += lineGap) {
                const vline = new fabric.Line([j, 0, j, cHeight], {
                    stroke: typeof lineColor === "string" ? lineColor : lineColor.toHexString(),
                    selectable: false
                });
                group.addWithUpdate(vline);
            }

            canvas?.add(group)
            group?.sendToBack();// 置于底层
            group?.center()
            canvas?.renderAll()

        })
    }

    // 设置背景颜色
    const onSetColorBack = () => {
        if (!canvas) return
        form.validateFields().then((v) => {
            const { backgroundColor } = v
            const newColor: string = typeof backgroundColor === "string" ? backgroundColor : backgroundColor.toHexString();
            canvas?.setBackgroundColor(newColor, () => { })
            canvas?.renderAll()
        })
    }

    const delHoles = () => {
        canvas?.getObjects().forEach((ele: any) => {
            if (ele.hbsType === "holes") {
                canvas?.remove(ele)
            }
        })
    }

    // 
    const onAddCircle = (v: boolean) => {
        console.log("==>v", v);
        if (!v) {
            delHoles()
            return
        }
        const cw = canvas?.getWidth() || 0
        const ch = canvas?.getHeight() || 0
        const middle = Math.floor(ch / 2)
        const LEFT_GAP = 8.5

        const lineh = new fabric.Line([
            LEFT_GAP * zoomRatio, 0, LEFT_GAP * zoomRatio, ch
        ], {
            stroke: "#F5F5F5",
            strokeWidth: 2,
            strokeDashArray: [2, 2]
        })
        const linev = new fabric.Line([
            0, middle, cw, middle
            // LEFT_GAP * zoomRatio, 0, LEFT_GAP * zoomRatio, ch
        ], {
            stroke: "#F5F5F5",
            strokeWidth: 2,
            strokeDashArray: [2, 2]
        })

        const group = new fabric.Group([lineh, linev], {
            selectable: false,
            hbsType: "holes"
        } as any)

        const CIRCLE_R = 2.5;
        const CIRCLE_GAP = 19;
        const CIRCLE_GROUP_GAP = 19;
        const CIRCLR_LEFT = 2.5

        for (let i = 0; i <= 2; i++) {
            const c = new fabric.Circle({
                radius: CIRCLE_R * zoomRatio,
                top: middle + (CIRCLE_GROUP_GAP / 2 - CIRCLE_R + CIRCLE_GAP * i) * zoomRatio,
                left: CIRCLR_LEFT * zoomRatio,
                fill: "#F5F5F5",
            })
            group.addWithUpdate(c)
        }

        for (let i = 0; i <= 2; i++) {
            const c = new fabric.Circle({
                radius: CIRCLE_R * zoomRatio,
                top: middle - ((CIRCLE_GROUP_GAP / 2 + CIRCLE_R) + CIRCLE_GAP * i) * zoomRatio,
                left: CIRCLR_LEFT * zoomRatio,
                fill: "#F5F5F5",
            })
            group.addWithUpdate(c)
        }

        canvas?.add(group);
        canvas?.renderAll()
    }

    return <div className="size-section">
        <Flex vertical={true} gap="middle" >
            <div className="section-title">画布尺寸</div>
            <Flex align="center" gap="small">
                <div>尺寸：</div>
                <Select value={paperConfig.curTempType} style={{ flex: 1 }} onChange={handleSizeChange} options={PaperTempOptions} />
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
                <Switch value={paperConfig.showBackColor} onChange={onAddCircle} />
            </div>
            <Flex align="center" gap="small">
                <div>背景颜色:</div>
                <ColorPicker
                    style={{
                        flex: 1
                    }}
                    value={paperConfig.backgroundColor}
                    onChange={onSetColorBack} />
            </Flex>
            <div className="section-title">活页孔 <Switch value={paperConfig.showHole} onChange={onAddCircle} /></div>
            <div className="section-title">画布填充 <Switch value={paperConfig.showBackTexture} onChange={onAddCircle} /></div>

            <Flex align="center" gap="small">
                <div>背景类型:</div>
                <Select
                    style={{ flex: 1 }}
                    value={paperConfig.backConfig}
                    options={PaperBackOptions}
                    onChange={() => { }}
                />
            </Flex>
            <Flex align="center" gap="small">
                <div>线条颜色:</div>
                <ColorPicker
                    style={{ flex: 1 }}
                    value={paperConfig.lineConfig.stroke} onChange={onChange} allowClear />
            </Flex>
            <Flex align="center" gap="small" >
                <div>线条类型:</div>
                {/* <ColorPicker value={paperConfig.lineConfig?.strokeWidth} onChange={onChange} allowClear /> */}
            </Flex>

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