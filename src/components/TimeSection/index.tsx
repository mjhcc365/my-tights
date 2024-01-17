
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import Year from "./Year"
import Week from "./WeekTool"



const items: TabsProps['items'] = [
    {
        key: '1',
        label: '年',
        children: <Year />,
    },
    {
        key: '2',
        label: '月',
        children: "月",
    },
    {
        key: '3',
        label: '周',
        children: <Week />,
    },
    {
        key: '4',
        label: '日',
        children: "日",
    },
];


const TimeSection = () => {
    const onChange = () => {
        console.log("===>")
    }
    return <div style={{ height: "calc(100vh - 64px)" }}>
        <Tabs
            defaultActiveKey="3"
            items={items}
            onChange={onChange}
            indicatorSize={(origin) => origin - 16}
        />
    </div>
}

export default TimeSection