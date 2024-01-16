
import { InputNumber, Select, ColorPicker, Form, Flex, Button } from "antd"
import { useContext } from "react";
import { fabric } from "fabric";
import { nanoid } from "nanoid";
import { MainContext, HBSType } from "@/pages/store"
import { SIZE_ALL, getConfigByType, SIZE_Type } from "./type"

import "./index.less"
import { useForm } from "antd/es/form/Form";

const FormItem = Form.Item

interface BackStyleType {
    backSizeType: SIZE_Type;
    backgroundColor: string;
    lineColor: string;
    lineGap: number; // 网格之间的间距
    canvasWidth: number;
    canvasHeight: number;
    holesNum: number;
    holesSize: number;
    holesLeft: number;
    holesStep: number; // 圆心距
    holesGap: number | null; // 两组圆之间的距离
    backType: "grid" | "dots" | "lines" | "color"
}

const initialValues = {
    backSizeType: SIZE_Type.a7,
    backgroundColor: "#fff",
    canvasWidth: 80,
    canvasHeight: 120,
    holesNum: 6,
    holesSize: 5,
    holesLeft: 12,
    holesStep: 19, // 圆心距
    holesGap: 15,// 两组圆之间的距离
    backType: "grid",
    lineColor: "#f5f5f5",
    lineGap: 3.5, // 网格之间的间距
}

const SizeSection = () => {
    const { store } = useContext(MainContext);

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
        store.canvas?.getObjects().forEach((ele: any) => {
            if (ele.hbsType === HBSType.back) {
                store.canvas?.remove(ele)
            }
        })
    }


    const handleSizeChange = (type: string) => {
        const { width, height, holes } = getConfigByType(type) as any
        const { holesNum = 6,
            holesStep = 19,
            holesSize = 5,
        } = holes

        form.setFieldsValue({
            canvasWidth: width,
            canvasHeight: height,
            holesNum,
            holesSize,
            holesStep,
        })
        store.canvas?.setWidth(width * store.zoomRatio)
        store.canvas?.setHeight(height * store.zoomRatio);
        onChange()
    }

    // 绘制网格背景
    const onSetGridsBack = () => {
        const { canvas } = store;
        const cWidth: number = canvas?.getWidth() || 0
        const cHeight: number = canvas?.getHeight() || 0
        clearGridBack()

        form.validateFields().then((v) => {
            const { lineGap = 3.5 * store.zoomRatio, lineColor } = v
            // 定义网格线的间距
            const group = new fabric.Group([], {
                hbsId: nanoid(),
                hbsType: HBSType.back,
                selectable: false,
                lockMovementX: true,
                lockMovementY: true,
            } as any)
            // store.canvas?.add(group)
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

            store.canvas?.add(group)
            group?.sendToBack();// 置于底层
            group?.center()
            store.canvas?.renderAll()

        })
    }

    // 设置背景颜色
    const onSetColorBack = () => {
        if (!store.canvas) return
        form.validateFields().then((v) => {
            const { backgroundColor } = v
            const newColor: string = typeof backgroundColor === "string" ? backgroundColor : backgroundColor.toHexString();
            store.canvas?.setBackgroundColor(newColor, () => { })
            store.canvas?.renderAll()
        })
    }

    // 
    const onAddCircle = () => {
        const cw = store.canvas?.getWidth() || 0
        const ch = store.canvas?.getHeight() || 0
        const middle = Math.floor(ch / 2)
        const LEFT_GAP = 8.5

        const lineh = new fabric.Line([
            LEFT_GAP * store.zoomRatio, 0, LEFT_GAP * store.zoomRatio, ch
        ], {
            stroke: "#F5F5F5",
            strokeWidth: 2,
            strokeDashArray: [2, 2]
        })
        const linev = new fabric.Line([
            0, middle, cw, middle
            // LEFT_GAP * store.zoomRatio, 0, LEFT_GAP * store.zoomRatio, ch
        ], {
            stroke: "#F5F5F5",
            strokeWidth: 2,
            strokeDashArray: [2, 2]
        })

        const group = new fabric.Group([lineh, linev], {
            selectable: false
        })

        const CIRCLE_R = 2.5;
        const CIRCLE_GAP = 19;
        const CIRCLE_GROUP_GAP = 19;
        const CIRCLR_LEFT = 2.5

        // 下面三个○
        // 19-

        // const topGroup = new fabric.Group([])
        // const bottomGroup = new fabric.Group([])
        for (let i = 0; i <= 2; i++) {
            const c = new fabric.Circle({
                radius: CIRCLE_R * store.zoomRatio,
                top: middle + (CIRCLE_GROUP_GAP / 2 - CIRCLE_R + CIRCLE_GAP * i) * store.zoomRatio,
                left: CIRCLR_LEFT * store.zoomRatio,
                fill: "#F5F5F5",
            })
            group.addWithUpdate(c)
        }

        for (let i = 0; i <= 2; i++) {
            const c = new fabric.Circle({
                radius: CIRCLE_R * store.zoomRatio,
                top: middle - ((CIRCLE_GROUP_GAP / 2 + CIRCLE_R) + CIRCLE_GAP * i) * store.zoomRatio,
                left: CIRCLR_LEFT * store.zoomRatio,
                fill: "#F5F5F5",
            })
            group.addWithUpdate(c)
        }

        store.canvas?.add(group);
        store.canvas?.renderAll()
    }

    return <div className="size-section">
        <Form name="validate_other"
            form={form}
            initialValues={initialValues}
            style={{ maxWidth: 600 }}
        >
            <div className="section-title">画布尺寸</div>
            <FormItem label="尺寸" name="backSizeType">
                <Select onChange={handleSizeChange} options={SIZE_ALL} />
            </FormItem>
            <Flex gap={12}>
                <FormItem label="宽度" name="canvasWidth">
                    <InputNumber disabled />
                </FormItem>
                <FormItem label="高度" name="canvasHeight">
                    <InputNumber disabled />
                </FormItem>
            </Flex>
            <hr />
            <div className="section-title">活页孔</div>
            <FormItem style={{ flex: 1 }} label="孔数" name="holesNum">
                <Select options={[{
                    value: "6",
                    label: "六孔"
                }]} disabled />
            </FormItem>
            <Flex gap={12}>
                <FormItem style={{ flex: 1 }} label="孔距" name="holesStep">
                    <Select options={[{
                        value: "6",
                        label: "六孔"
                    }]} disabled />
                </FormItem>
                <FormItem style={{ flex: 1 }} label="间距" name="holesGap">
                    <Select options={[{
                        value: "6",
                        label: "六孔",

                    }]} disabled />
                </FormItem>
            </Flex>
            <hr />
            <div className="section-title">画布填充</div>
            <FormItem label="背景类型" name="backType">
                <Select style={{ width: "100%" }} options={[{
                    label: "网格背景",
                    value: "grid"
                },
                {
                    label: "点阵背景",
                    value: "dots"
                },
                {
                    label: "横线背景",
                    value: "lines"
                },
                {
                    label: "纯色背景",
                    value: "color"
                }]}
                    onChange={onChange}
                />
            </FormItem>
            <Flex gap={12}>
                <FormItem label="线条颜色" name="lineColor">
                    <ColorPicker onChange={onChange} allowClear />
                </FormItem>
            </Flex>
            <Flex gap={12}>
                <FormItem label="背景颜色" name="backgroundColor">
                    <ColorPicker onChange={onSetColorBack} allowClear />
                </FormItem>
            </Flex>
            <Flex gap={12}>
                <Button onClick={onAddCircle}>添加辅助线</Button>
            </Flex>
        </Form>
    </div>
}

export default SizeSection