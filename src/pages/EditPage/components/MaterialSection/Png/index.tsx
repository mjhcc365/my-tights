import { FabricImage } from "fabric";
import { stores as store } from "@/pages/EditPage/store/main";
import { mockpng } from "./mockpng";

const Png = () => {
  const handleAddPicture = async (index: any) => {
    FabricImage.fromURL(mockpng[index]).then((img) => {
      img.scaleToWidth(200); // 设置图像宽度
      img.scaleToHeight(200); // 设置图像高度
      store?.canvasStore.canvas?.add(img); // 添加图像到 Canvas
      store?.canvasStore.canvas?.renderAll(); // 渲染 Canvas
    });
  };

  return (
    <>
      <div
        className="grid grid-cols-3 cursor-pointer gap-2  h-full"
        style={{
          height: "calc(100vh - 200px)",
        }}
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
