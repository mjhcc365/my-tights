import { fabric } from "fabric";
import { useRef } from "react";
// import { nanoid } from "nanoid";
// import BlackImg from "@/assets/black.jpg";
import { stores as store } from "@/store/main";
import { mockpng } from "./mockpng";

const Png = () => {
  // const imgRef = useRef(null);

  const handleAddPicture = (index: any) => {
    fabric.Image.fromURL(mockpng[index], function (img) {
      // 图像加载成功后的回调函数
      img.scaleToWidth(200); // 设置图像宽度
      img.scaleToHeight(200); // 设置图像高度
      store?.canvasStore.canvas?.add(img); // 添加图像到 Canvas
      store?.canvasStore.canvas?.renderAll(); // 渲染 Canvas
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          cursor: "pointer",
        }}
        onClick={handleAddPicture}
      >
        <span>从七牛等下载，暂无合适的资源可用</span>
        {mockpng.map((ele, index) => {
          return (
            <img
              key={ele}
              style={{
                width: 80,
                height: 80,
              }}
              className=""
              src={ele}
              onClick={() => {
                handleAddPicture(index);
              }}
            />
          );
        })}
        {/* */}
      </div>
    </div>
  );
};

export default Png;
