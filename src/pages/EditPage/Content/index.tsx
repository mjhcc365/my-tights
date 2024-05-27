import { useRef, useEffect } from "react";
import * as fabric from "fabric";
import TopTools from "./TopTools";
import { observer } from "mobx-react-lite";
import { stores as store } from "@/pages/EditPage/store/main";
// import { FabricCanvas } from "@/extension/fabricCanvas";

const MainContent = () => {
  const canvasBoxRef = useRef<HTMLInputElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);

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
    const wrapperWidth = canvasBoxRef.current?.getBoundingClientRect().width;
    const wrapperHeight = canvasBoxRef.current?.getBoundingClientRect().height;

    console.log("===>", canvasBoxRef.current, wrapperHeight, wrapperWidth);

    const options = {
      backgroundColor: "pink",
      absolutePositioned: true,
      selectable: false,
      width: wrapperWidth,
      height: wrapperHeight,
    };

    const canvas = new fabric.Canvas(
      canvasEl?.current as HTMLCanvasElement,
      options
    );
    store.canvasStore.initCanvas(canvas);
    store.canvasStore.setWrapperRef(canvasBoxRef.current as HTMLInputElement);
    store.canvasStore.setCanvasRef(canvasEl?.current as HTMLCanvasElement);
    canvas.renderAll();
    return () => {
      canvas.dispose();
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
      <canvas ref={canvasEl} />
    </div>
  );
};

export default observer(MainContent);
