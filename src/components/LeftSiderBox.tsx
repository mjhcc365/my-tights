import { Menu } from "antd"
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

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

const items: MenuItem[] = [
    getItem('模板', 'sub1', <MailOutlined />,),
    getItem('素材', 'sub2', <AppstoreOutlined />,),
    getItem('文字', 'sub3', <SettingOutlined />),
    getItem('照片', 'sub4', <SettingOutlined />),
    getItem('背景', 'sub5', <SettingOutlined />),
    getItem('工具', 'sub5', <SettingOutlined />),
];

const LeftSiderBox = () => {
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
    };
    return <div>
        <Menu onClick={onClick} style={{ width: 100, height: "calc(100vh - 64px)" }} mode="vertical" items={items} />
    </div>
}

export default LeftSiderBox;