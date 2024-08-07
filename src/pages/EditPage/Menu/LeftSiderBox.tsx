import { useState } from "react";
import Icon from "@/HbsUI/Icon";
import TextSectioin from "@/pages/EditPage/components/TextSection";
import MaterialSection from "@/pages/EditPage/components/MaterialSection";
import SizeSection from "@/pages/EditPage/components/SizeSection";
import TimeSection from "@/pages/EditPage/components/TimeSection";
import Calender from "@/pages/EditPage/components/Calender";
import ToolsSection from "@/pages/EditPage/components/ToolsSection";
import PictureSection from "../components/PictureSection";
import FabricTable from "@/pages/EditPage/components/FabricTable";
import { menuConfig, MENUKEY } from "./types";

const LeftSiderBox = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [curmenu, setMenu] = useState<MENUKEY>(
    (localStorage.getItem("mj-menu") as MENUKEY) || MENUKEY.temp
  );

  const onClickMenu = (ele: MENUKEY) => {
    setMenu(() => ele);
    setIsOpen(() => true);
    localStorage.setItem("mj-menu", ele);
  };

  return (
    <div className="leftPanel-section relative h-full">
      <div className="w-14 pt-8 ">
        <menu className="flex absolute flex-col gap-4 px-1 z-20 ">
          {menuConfig.map((ele) => {
            return (
              <li key={ele.key} className="h-12   text-slate-500">
                <div
                  className={`w-12 h-12 
                  flex gap-1 flex-col items-center 
                  hover:bg-slate-200  rounded-lg justify-between 
                  ${curmenu === ele.key ? "bg-slate-200" : ""}
                  py-1
                  `}
                  onClick={() => {
                    onClickMenu(ele.key);
                  }}
                >
                  <Icon fontSize={26} icon={ele.icon} />
                  <div className="text-xs">{ele?.label}</div>
                </div>
              </li>
            );
          })}
        </menu>
      </div>
      <div
        className={`${
          !isOpen && "hidden"
        } border-l absolute top-0  w-72 h-full bg-white z-10 px-4 `}
        style={{
          animation: "moveAndHide .3s forwards",
        }}
      >
        {/* {curmenu === MENUKEY.temp && isOpen && <TemplatesSectioin />} */}
        {curmenu === MENUKEY.text && <TextSectioin />}
        {curmenu === MENUKEY.material && <MaterialSection />}
        {curmenu === MENUKEY.size && <SizeSection />}
        {curmenu === MENUKEY.time && <TimeSection />}
        {/* {curmenu === MENUKEY.tools && <ToolsSection />} */}
        {curmenu === MENUKEY.tools && <FabricTable />}
        {curmenu === MENUKEY.picture && <PictureSection />}
        {curmenu === MENUKEY.todos && <Calender />}
      </div>
      <div
        style={{
          left: isOpen ? 344 : 58,
          display: "none",
        }}
        className="absolute top-36 z-30 bg-slate-200 h-16 w-5 rounded-r-2xl"
        // onClick={() => {
        //   setIsOpen((preValue) => !preValue);
        // }}
      >
        {/* {isOpen ? "关" : "开"} */}
      </div>
    </div>
  );
};

export default LeftSiderBox;
