import { Menu } from "antd";
import { useState } from "react";
import type { MenuProps } from 'antd';
import TemplatesSectioin from "../../components/Templates";
import TextSectioin from "../../components/TextSection";
import PictureSection from "../../components/PictureSection";
import MaterialSection from "@/components/MaterialSection";
import SizeSection from "@/components/SizeSection";
import TimeSection from "@/components/TimeSection";
import ToolsSection from "@/components/ToolsSection"
import { items, MENUKEY } from "../types";
import "./LeftSiderBox.less";

const LeftSiderBox = () => {
    const [menu, setMenu] = useState<MENUKEY>(localStorage.getItem("mj-menu") as MENUKEY || MENUKEY.temp)

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click', e.key);
        setMenu(() => e.key as MENUKEY)
        localStorage.setItem("mj-menu", e.key)
    };

    return <div className="leftPanel-section">
        <div className="leftPanel-menu">
            <Menu
                defaultSelectedKeys={[menu]}
                onClick={onClick}
                style={{ height: "calc(100vh - 64px)" }}
                mode="vertical"
                items={items} />
        </div>
        <div className="leftPanel-content">
            {menu === MENUKEY.temp && <TemplatesSectioin />}
            {menu === MENUKEY.text && <TextSectioin />}
            {menu === MENUKEY.material && <MaterialSection />}
            {menu === MENUKEY.picture && <PictureSection />}
            {menu === MENUKEY.size && <SizeSection />}
            {menu === MENUKEY.time && <TimeSection />}
            {menu === MENUKEY.tools && <ToolsSection />}
        </div>
    </div>
}

export default LeftSiderBox;