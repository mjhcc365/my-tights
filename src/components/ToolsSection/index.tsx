import { MainContext } from "@/store/useCanvas";
import { Tabs } from "antd";
import type { TabsProps } from 'antd';
import { useContext } from "react";
import { fabric } from "fabric"

import HelpLine from "./HelpLine";
import Rule from "./Rule";


const items: TabsProps['items'] = [
    {
        key: '1',
        label: '等分线',
        children: <HelpLine />,
    },
    {
        key: '2',
        label: '尺子',
        children: <Rule />
    }
];


// TODO 添加等分线
// 添加尺子
const ToolsSection = () => {
    const onChange = (key: string) => {
        console.log(key);
    }

    return <div style={{ height: "calc(100vh - 64px)" }}>
        <Tabs
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            indicatorSize={(origin) => origin - 16}
        />

    </div>
}

export default ToolsSection