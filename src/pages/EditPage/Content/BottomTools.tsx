import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { CanvasStoreContext, DEFAULT_ZOOM } from "@/store/canvas";
import { Select } from "antd";
import Icon from "@/HbsUI/Icon";

import "./index.less";

const BottomTools = () => {
  const store = useContext(CanvasStoreContext);

  /** 隐藏|显示 安全线 */
  const toggleClipLine = () => {
    store.toggleClipLine();
  };

  /** 出血线  */
  const toggleSafeLine = () => {
    store.toggleSafeLine();
  };

  /** zoom 百分比 */

  return (
    <>
      <div className="section-bottom-tool">
        <div className="zoom">
          <Select
            defaultValue="100%"
            style={{ width: 100 }}
            // variant="borderless"
            options={[
              {
                label: "25%",
                value: "0.25",
              },
              { label: "50%", value: "0.5" },
              { label: "75%", value: "0.75" },
              { label: "100%", value: "1" },
              { label: "125%", value: "1.25" },
              { label: "150%", value: "1.5" },
            ]}
            onChange={(value) => {
              const num = Number(value || 1);
              store.setCanvasPercentage(num);
            }}
          />
        </div>
        <div onClick={toggleSafeLine}>
          <Icon fontSize={18} color="grey" icon="jiandao" />
        </div>
        <div onClick={toggleClipLine}>
          <Icon fontSize={18} icon="dunpaibaowei_o" />
        </div>
      </div>
    </>
  );
};

export default observer(BottomTools);
