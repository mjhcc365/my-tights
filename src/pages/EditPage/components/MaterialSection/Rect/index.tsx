import { Button } from "antd";
import { Rect as FabricRect, Triangle, Circle, Ellipse } from "fabric";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import "./index.less";

const Rect = () => {
  const store = useContext(CanvasStoreContext);
  const onAddRect = () => {
    const rect = new FabricRect({
      width: 20,
      height: 20,
    });
    store.addObject(rect);
  };

  const onAddTriangle = () => {
    const triangle = new Triangle({
      width: 80, // 底边长度
      height: 100, // 底边到对角的距离
    });
    store.addObject(triangle);
  };

  const onAddCircle = () => {
    // 创建圆形
    let circle = new Circle({
      radius: 50, // 半径
    });
    store.addObject(circle);
  };

  const onAddEllipse = () => {
    let ellipse = new Ellipse({
      rx: 50,
      ry: 30,
    });
    store.addObject(ellipse);
  };

  return (
    <div className="shap-tool-contain">
      <Button onClick={onAddRect}>矩形</Button>
      <Button onClick={onAddTriangle}>三角形</Button>
      <Button onClick={onAddCircle}>圆形</Button>
      <Button onClick={onAddEllipse}>椭圆形</Button>
    </div>
  );
};

export default observer(Rect);
