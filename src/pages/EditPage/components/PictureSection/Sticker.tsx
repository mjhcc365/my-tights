// 实现懒加载

import { FabricImage } from "fabric";
import { useContext } from "react";
import { CanvasStoreContext } from "@/store/canvas";

// const stiker = import("@/assets/stickers/weeknote.jpg");

import stiker from "@/assets/stickers/weeknote.jpg";

const Sticker = () => {
  const store = useContext(CanvasStoreContext);

  const handleAddPicture = async () => {
    FabricImage.fromURL(stiker).then((img) => {
      img.scaleToWidth(100); // 设置图像宽度
      img.scaleToHeight(100); // 设置图像高度
      store.addObject(img); // 添加图像到 Canvas
    });
  };

  return (
    <div>
      <img
        src={stiker}
        onClick={() => {
          handleAddPicture();
        }}
      />
      Sticker
    </div>
  );
};

export default Sticker;
