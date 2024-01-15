import type { MenuProps } from 'antd';

export interface GridsInterface {
    spacing: number;
    stroke: string;
}
export enum MENUKEY {
    temp = "temp", // 模板
    material = "material", // 素材
    text = "text",//文字
    picture = "picture",// 照片
    background = "background",// 背景
    tools = "tools", // 工具
    size = "size", // 调整布局
    time = "time" //  时间轴 年月日
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

export const items: MenuItem[] = [
    getItem('尺寸', MENUKEY.size,), // 调整尺寸
    // getItem('模板', MENUKEY.temp,), // 经典模板，一日一页，两日一页等
    getItem('素材', MENUKEY.material,), // 形状，线条，图标
    getItem('文字', MENUKEY.text,), // 艺术字体
    // getItem('照片', MENUKEY.picture,), // 自己的图片,网站提供一些图片
    // getItem('工具', MENUKEY.tools,), // 
    getItem('时间', MENUKEY.time,), // 
];
