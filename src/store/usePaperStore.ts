import { useImmer } from "use-immer";
import { fabric } from "fabric"
// 管理背景
const usePaperStore = () => {
    const [paperConfig, setPaperConfig] = useImmer(A7TempConfig)
    // 画背景
    const drawBackPaper = (paperConfig: PaperConfig) => { }

    // 画网格

    // 画横线

    // 画点阵
    return {
        paperConfig,
        setPaperConfig,
        drawBackPaper
    }
}


export enum PaperTempType {
    A7 = "A7",
    M5 = "M5",
    selfdesign = "selfdesign",
}

export const PaperTempOptions = [
    {
        label: "A7 120mm*80mm",
        value: PaperTempType.A7
    }, {
        label: "M5 105mm*67mm",
        value: PaperTempType.M5
    }
]

export enum PaperBackType {
    grid = "grid",
    dots = "dots",
    lines = "lines",
}

export const PaperBackOptions = [{
    label: "网格背景",
    value: PaperBackType.grid
},
{
    label: "点阵背景",
    value: PaperBackType.dots
},
{
    label: "横线背景",
    value: PaperBackType.lines
}]

export interface SileHoles {
    holesSize?: number;
    holesNum?: number;
    holesLeft?: number;
    holesGroupGap?: number;
    holesGap?: number;
}

export interface LineConfig {
    stroke: string;
    strokeWidth: number;
    strokeDashArray: number[]
}



export interface LineConfigType extends LineConfig {
    gap: number
}



export interface PaperConfig {
    // 模板类型
    curTempType: PaperTempType;
    // 画布尺寸
    width: number;
    height: number;
    backgroundColor: string; // 纸张的背景颜色
    // 活页孔
    sideHoles?: SileHoles;
    // 背景的类型
    backConfig: PaperBackType;
    // 是否展示背景颜色
    showBackColor: boolean;
    // 是否展示侧边活页孔
    showHole: boolean,
    // 是否展示侧边活页孔
    showBackTexture: boolean,
    lineConfig: LineConfigType;
    // // 网格属性
    // gridConfig?: GridConfigType;
    // // 横线属性
    // lineConfig?: LineConfigType;
    // // 点阵属性
    // dotsConfig?: DotsConfigType;
}

export const A7TempConfig: PaperConfig = {
    curTempType: PaperTempType.A7,
    width: 80,
    height: 120,
    backgroundColor: "#fff",
    sideHoles: {
        holesSize: 2,
        holesNum: 6,
        holesLeft: 2,
        holesGroupGap: 19,
        holesGap: 19,
    },
    backConfig: PaperBackType.grid,
    showBackColor: true,
    showHole: true,
    showBackTexture: true,
    lineConfig: {
        stroke: "#f5f5f5",
        strokeWidth: 1,
        strokeDashArray: [2, 2],
        gap: 3.5
    },

}

export default usePaperStore