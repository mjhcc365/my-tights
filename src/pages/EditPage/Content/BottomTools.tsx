import { observer } from "mobx-react-lite";
// import { MainTools } from "@/pages/EditPage/components/Tools/Tools";
import { stores as store } from "@/pages/EditPage/store/main";
import Icon from "@/HbsUI/Icon";

import "./index.less";

const BottomTools = () => {
  /** 尺子 */
  const toggleRuler = () => {
    store.canvasStore.toggleRuler();
  };

  /** 隐藏|显示 安全线 */
  const toggleClipLine = () => {
    store.canvasStore.toggleClipLine();
  };

  /** 出血线  */
  const toggleSafeLine = () => {
    store.canvasStore.toggleSafeLine();
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
        <div onClick={toggleRuler}>
          <Icon fontSize={18} icon="ruler" />
        </div>
      </div>
    </>
  );
};

export default observer(BottomTools);
