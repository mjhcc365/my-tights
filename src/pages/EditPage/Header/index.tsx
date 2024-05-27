import { Button, Select } from "antd";
import { observer } from "mobx-react-lite";
import imgUrl from "@/assets/logo.png";
import { stores as store } from "@/pages/EditPage/store/main";
import { ALL_FONTS } from "@/utils/fonts";
import { download, downloadJson } from "@/utils/download";

import "./index.less";

const MJHeader = () => {
  // 导出为图片
  const handleClickPic = () => {
    var dataURL = store?.canvasStore.canvas?.toDataURL({
      format: "png", // 指定导出格式，可以是 'png', 'jpeg', 'webp' 等
      quality: 0.8,
    });
    download(dataURL, "fabric_image.png");
  };

  const handleReset = () => {
    localStorage.clear();
    location.reload();
  };

  const handleClickJson = () => {
    if (!store?.canvasStore.canvas) return;
    var jsonString = JSON.stringify(store?.canvasStore.canvas.toJSON());
    // 创建一个下载链接
    var downloadLink = document.createElement("a");
    downloadLink.href =
      "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    downloadLink.download = "fabric_canvas.json"; // 设置下载的文件名
    // 将链接添加到文档中
    document.body.appendChild(downloadLink);
    // 模拟点击链接以触发下载
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  // 撤销 上一步
  const undo = async () => {
    const snapshot = await store.dexieStore.getPreSnapshot();
    store.dexieStore.setSnapshotCursor(store.dexieStore.snapshotCursor - 1);
    store.canvasStore.loadCanvasFormObj(snapshot);
    store.canvasStore.setActiveObj(null);
  };
  // 重做 下一步
  const redo = async () => {
    const snapshot = await store.dexieStore.getNextSnapshot();
    store.dexieStore.setSnapshotCursor(store.dexieStore.snapshotCursor + 1);
    console.log("==>snapshot", snapshot);
    await store.canvasStore.loadCanvasFormObj(snapshot);
    store.canvasStore.setActiveObj(null);
  };

  const handleFontChange = (v: string) => {
    store.mainStore.setFontFamily(v);
  };

  // 下载当前绘制的一个组
  const handleDownloadGroup = () => {
    const json = store.canvasStore.canvas?.getActiveObject()?.toJSON();
    downloadJson(JSON.stringify(json));
  };

  const handleRule = () => {
    new FabricRuler(store.canvasStore.canvas);
    store.canvasStore.canvas?.renderAll();
  };

  return (
    <div className="headerBox">
      <div className="logo-box">
        <img width={48} height={48} src={imgUrl} />
        <span style={{ color: "#1f1f1f" }}>胡百拾</span>
      </div>
      <div className="btns-box">
        <Button disabled={store.dexieStore.disableUndo} onClick={undo}>
          上一步
        </Button>
        <Button disabled={store.dexieStore.disableRedo} onClick={redo}>
          下一步
        </Button>
      </div>
      <div className="btns-box">
        <Button onClick={handleClickPic}>下载图片</Button>
        <Button onClick={handleDownloadGroup}>下载Group</Button>
        <Button onClick={handleClickJson}>下载JSON</Button>
        <Button onClick={handleClickJson}>下载PDF</Button>
        {/* <Button onClick={handleOnSave}>暂存</Button> */}
        <Button onClick={handleReset}>清除</Button>
        <Button onClick={handleReset}>保存</Button>
        <Select
          style={{ width: 100 }}
          value={store?.mainStore.fontFamily}
          options={ALL_FONTS}
          optionRender={(ele) => {
            return (
              <div style={{ fontFamily: `${ele.value}` }}>{ele.label}</div>
            );
          }}
          onChange={handleFontChange}
        />
        <Button onClick={handleRule}>画尺子</Button>
      </div>
    </div>
  );
};

export default observer(MJHeader);
