import { useRef, useEffect } from "react";
import * as fabric from "fabric";
import TopTools from "./TopTools";
import BottomTools from "./BottomTools";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas"; // import { FabricCanvas } from "@/extension/fabricCanvas";

const MainContent = () => {
  const canvasBoxRef = useRef<HTMLInputElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const store = useContext(CanvasStoreContext);

  useEffect(() => {
    const wrapperWidth = canvasBoxRef.current?.getBoundingClientRect().width;
    const wrapperHeight = canvasBoxRef.current?.getBoundingClientRect().height;
    const options = {
      absolutePositioned: true,
      selectable: false,
      width: wrapperWidth,
      height: wrapperHeight,
    };

    const canvas = new fabric.Canvas(
      canvasEl?.current as HTMLCanvasElement,
      options
    );
    store.initCanvas(canvas);
    store.setWrapperRef(canvasBoxRef.current as HTMLInputElement);
    store.setCanvasRef(canvasEl?.current as HTMLCanvasElement);

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
      <BottomTools />
    </div>
  );
};

export default observer(MainContent);
