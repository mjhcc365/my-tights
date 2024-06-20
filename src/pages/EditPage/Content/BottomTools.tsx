import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { CanvasStoreContext } from "@/store/canvas";
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

  return (
    <>
      <div className="section-bottom-tool">
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
