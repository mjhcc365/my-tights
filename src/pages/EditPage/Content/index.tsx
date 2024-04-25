import { useRef, useEffect } from "react";
import * as fabric from "fabric";
import TopTools from "./TopTools";
import { observer } from "mobx-react-lite";
import { stores as store } from "@/pages/EditPage/store/main";

const MainContent = () => {
  const canvasBoxRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleEnter = () => {
    console.log("-->回车");
  };

  const onKeyDown = (e: { code: any }) => {
    const code = e.code;
    switch (code) {
      case "Enter":
        handleEnter();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    const wrapperWidth = canvasBoxRef.current?.width;
    const wrapperHeight = canvasBoxRef.current?.height;

    const cWidth = Math.floor(wrapperWidth || 80 * 5);
    const cHeight = Math.floor(wrapperHeight || 120 * 5);

    const options = {
      backgroundColor: "#fff",
      width: cWidth,
      height: cHeight,
      absolutePositioned: true,
      selectable: false,
    };
    const newCanvas = new fabric.Canvas(canvasRef.current as any, options);

    // newCanvas.on("mouse:down", () => {
    //   // console.log("==>", store?.canvasStore.canvas?.getActiveObject()?.toObject())
    //   store?.canvasStore.setActiveObj(
    //     store.canvasStore.canvas?.getActiveObject()?.toObject()
    //   );
    // });
    store?.canvasStore.setCanvas(newCanvas);
    store?.canvasStore.canvas?.renderAll();
    store?.dexieStore.clear();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      store.canvasStore.canvas?.dispose();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        position: "relative",
      }}
      ref={canvasBoxRef}
    >
      <TopTools />
      <canvas ref={canvasRef} />
    </div>
  );
};

export default observer(MainContent);
