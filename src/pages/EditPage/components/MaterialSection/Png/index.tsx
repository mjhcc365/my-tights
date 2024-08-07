import { FabricImage } from "fabric";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CanvasStoreContext } from "@/store/canvas";
import { mockpng } from "./mockpng";

const Png = () => {
  const store = useContext(CanvasStoreContext);
  const handleAddPicture = async (index: any) => {
    FabricImage.fromURL(mockpng[index]).then((img) => {
      img.scaleToWidth(100); // 设置图像宽度
      img.scaleToHeight(100); // 设置图像高度
      store.addObject(img); // 添加图像到 Canvas
    });
  };

  return (
    <>
      <div
        className="grid grid-cols-3 cursor-pointer gap-2  h-full"
        style={{ height: "calc(100vh - 200px)", gridAutoRows: "max-content" }}
        onClick={handleAddPicture}
      >
        {mockpng.map((ele, index) => {
          return (
            <img
              key={ele}
              style={{
                width: 80,
                height: 80,
              }}
              className="cursor-pointer"
              src={ele}
              onClick={() => {
                handleAddPicture(index);
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default Png;
