// export import { SystemFont } from "@/types/common"

export type SystemFont = {
    label: string
    value: string
}

export const SYS_FONTS: SystemFont[] = [
    { label: 'Arial', value: 'Arial' },
    { label: '微软雅黑', value: 'Microsoft Yahei' },
    { label: '宋体', value: 'SimSun' },
    { label: '黑体', value: 'SimHei' },
    { label: '楷体', value: 'KaiTi' },
    { label: '新宋体', value: 'NSimSun' },
    { label: '仿宋', value: 'FangSong' },
    { label: '苹方', value: 'PingFang SC' },
    { label: '华文黑体', value: 'STHeiti' },
    { label: '华文楷体', value: 'STKaiti' },
    { label: '华文宋体', value: 'STSong' },
    { label: '华文仿宋', value: 'STFangSong' },
    { label: '华文中宋', value: 'STZhongSong' },
    { label: '华文琥珀', value: 'STHupo' },
    { label: '华文新魏', value: 'STXinwei' },
    { label: '华文隶书', value: 'STLiti' },
    { label: '华文行楷', value: 'STXingkai' },
    { label: '冬青黑体', value: 'Hiragino Sans GB' },
    { label: '兰亭黑', value: 'Lantinghei SC' },
    { label: '偏偏体', value: 'Hanzipen SC' },
    { label: '手札体', value: 'Hannotate SC' },
    { label: '宋体', value: 'Songti SC' },
    { label: '娃娃体', value: 'Wawati SC' },
    { label: '行楷', value: 'Xingkai SC' },
    { label: '圆体', value: 'Yuanti SC' },
    { label: '华文细黑', value: 'STXihei' },
    { label: '幼圆', value: 'YouYuan' },
    { label: '隶书', value: 'LiSu' },
]

export const WEB_FONTS = [
    { label: '仓耳小丸子', value: '仓耳小丸子' },
    { label: '优设标题黑', value: '优设标题黑' },
    { label: '峰广明锐体', value: '峰广明锐体' },
    { label: '摄图摩登小方体', value: '摄图摩登小方体' },
    { label: '站酷快乐体', value: '站酷快乐体' },
    { label: '字制区喜脉体', value: '字制区喜脉体' },
    { label: '素材集市康康体', value: '素材集市康康体' },
    { label: '素材集市酷方体', value: '素材集市酷方体' },
    { label: '途牛类圆体', value: '途牛类圆体' },
    { label: '锐字真言体', value: '锐字真言体' },
    { label: '得意黑', value: '得意黑' },
]

export const Layers = [{
    label: "上移一层",
    value: "pre"
}, {
    label: "下移一层",
    value: "next"
}, {
    label: "置于顶层",
    value: "top"
}, {
    label: "置于底层",
    value: "bottom"
}]