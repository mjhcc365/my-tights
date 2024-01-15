export enum SIZE_Type {
    a7 = "a7",
    m5 = "m5"
}

export const SIZE_ALL = [
    {
        label: "A7 120mm*80mm",
        value: SIZE_Type.a7
    }, {
        label: "M5 105mm*67mm",
        value: SIZE_Type.m5
    }
]

type PaperHoles = {
    holesNum: number, // 六孔
    holesStep: number, // 孔心距
    holesSize: number, // 圆形的大小
    holesLeft: number,
}

type PaperTypeConfig = {
    label: string
    type: SIZE_Type,
    width: number,
    height: number,
    radius: number, // 圆角
    holes: PaperHoles
}

export const typeConfig: PaperTypeConfig[] = [
    {
        label: "A7 120mm*80mm",
        type: SIZE_Type.a7,
        width: 80,
        height: 120,
        radius: 0, // 圆角
        holes: {
            holesNum: 6, // 六孔
            holesStep: 19, // 孔心距
            holesSize: 5, // 圆形的大小
            holesLeft: 12,
        }
    },
    {
        label: "M5 105mm*67mm",
        type: SIZE_Type.m5,
        width: 67,
        height: 105,
        radius: 0, // 圆角
        holes: {
            holesNum: 6,
            holesStep: 19,
            holesSize: 5,
            holesLeft: 12,
        }
    }
]

export const getSizeOptions = () => {
    return typeConfig.map((ele) => { return { label: ele.label, value: ele.type } })
}

export const getConfigByType = (type: string): PaperTypeConfig | undefined => {
    return typeConfig.find((ele) => ele.type === type)
}

export const drawSideCircle = () => {



}
