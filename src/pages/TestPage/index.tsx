// import
import { Button } from "antd";
import { useEffect, useRef } from "react";
import * as fabric from "fabric";
// import { options } from "./mockdata";

const TestPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<fabric.Canvas | undefined>(undefined);
  const handleClick = () => {
    console.log("===>");
  };

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current as any, {
      width: 1000,
      height: 500,
    });
    ref.current = newCanvas;

    return () => {
      ref.current?.dispose();
    };
  }, []);
  return (
    <div>
      <Button onClick={handleClick}>添加table</Button>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default TestPage;
