// import
import { Button } from "antd";
import { useEffect, useRef } from "react";
import * as fabric from "fabric";

import { controlsUtils } from "fabric";
// import { FabricTable } from "./fabric/Table";
// import { Canvas } from "./fabric/fabricCanvas";
import "./fabric/index";

// isTransformCentered

const options: any = {
  columns: [
    { width: 110, header: true },
    { width: 110 },
    { width: 110 },
    { width: 110 },
    { width: 110 },
    { width: 110 },
  ],
  rows: [
    { height: 28, header: true },
    { height: 25, header: true },
    { height: 25 },
    { height: 25 },
    { height: 25 },
    { height: 25 },
    { height: 23 },
  ],
  cells: [
    [{ colspan: 6, text: "1" }],
    [
      { text: "2" },
      { text: "3" },
      { colspan: 2, text: "4" },
      { text: "5" },
      { text: "6" },
    ],
    [
      { rowspan: 3, text: "7" },
      { text: "A" },
      { text: "B" },
      { text: "C" },
      { text: "D" },
      { text: "E" },
    ],
    [{ text: "F" }, { text: "G" }, { text: "H" }, { text: "I" }, { text: "K" }],
    [{ text: "L" }, { text: "M" }, { text: "N" }, { text: "O" }, { text: "P" }],
    [
      { rowspan: 2, text: "8" },
      { text: "Q" },
      { text: "R" },
      { text: "S" },
      { text: "T" },
      { text: "U" },
    ],
    [{ text: "V" }, { text: "W" }, { text: "X" }, { text: "Y" }, { text: "Z" }],
  ],
};

const TestPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<fabric.Canvas | undefined>(undefined);
  const handleClick = () => {
    const table = new fabric.Table(options);
    table.set("fill", "pink");
    table.set("width", 100);
    table.set("height", 100);
    const group = new fabric.Group();
    const rect = new fabric.Rect({
      width: 100,
      height: 100,
      top: 100,
      left: 100,
    });
    group.add(rect);
    console.log("==>table", table);
    console.log("==>group", group);
    ref.current?.set("backgroundColor", "#f5f5f5");
    ref?.current?.add(table);
    ref?.current?.add(group);
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
