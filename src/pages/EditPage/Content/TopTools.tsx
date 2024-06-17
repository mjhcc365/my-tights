import { observer } from "mobx-react-lite";
import { MainTools } from "@/pages/EditPage/components/Tools/Tools";
import { stores as store } from "@/pages/EditPage/store/main";

import "./TopTools.less";

const TopTools = () => {
  return (
    <>
      {/* {store?.canvasStore?.activeType ? (
        <div className="section-top-tool">
          <MainTools />
        </div>
      ) : ( */}
      <div className="section-top-tool">{store?.canvasStore?.activeType}</div>
      {/* )} */}
    </>
  );
};

export default observer(TopTools);
