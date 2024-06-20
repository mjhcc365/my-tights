import { observer } from "mobx-react-lite";
import { MainTools } from "@/pages/EditPage/components/Tools/Tools";
import { useContext } from "react";
import { CanvasStoreContext } from "@/store/canvas";
import "./TopTools.less";

const TopTools = () => {
  const store = useContext(CanvasStoreContext);

  return (
    <>
      {store.activeObj ? (
        <div className="section-top-tool">
          <MainTools />
        </div>
      ) : (
        <div className="section-top-tool">{111}</div>
      )}
    </>
  );
};

export default observer(TopTools);
