import { Button, Select } from "antd";
import { observer } from "mobx-react-lite";
import imgUrl from "@/assets/logo.png";
import { stores as store } from "@/pages/EditPage/store/main";
import { ALL_FONTS } from "@/utils/fonts";
import { download, downloadJson } from "@/utils/download";

import { FabricTable } from "./table";
// import { FabricTable } from "./tablenew";
// import { FabricTable } from "./table";
import * as fabric from "fabric";

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

  const handleTable = () => {
    // const options = {
    //   width: 300,
    //   height: 300,
    // };

    // const rect1 = new fabric.Rect({
    //   width: 10,
    //   height: 10,
    //   top: 10,
    //   left: 20,
    //   backgroundColor: "black",
    // });

    // const rect2 = new fabric.Rect({
    //   width: 10,
    //   height: 10,
    //   top: 100,
    //   left: 200,
    //   backgroundColor: "black",
    // });

    const options = {
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
        [
          { text: "F" },
          { text: "G" },
          { text: "H" },
          { text: "I" },
          { text: "K" },
        ],
        [
          { text: "L" },
          { text: "M" },
          { text: "N" },
          { text: "O" },
          { text: "P" },
        ],
        [
          { rowspan: 2, text: "8" },
          { text: "Q" },
          { text: "R" },
          { text: "S" },
          { text: "T" },
          { text: "U" },
        ],
        [
          { text: "V" },
          { text: "W" },
          { text: "X" },
          { text: "Y" },
          { text: "Z" },
        ],
      ],
    };

    // const table = new FabricTable({
    //   ...options,
    //   stroke: "#f5f5f5",
    //   strokeDashArray: [2, 2],
    //   backgroundColor: "pink",
    //   strokeWidth: 2,
    //   cornerSize: 8,
    //   lockRotation: true,
    // });

    const table = new FabricTable([], {});

    console.log("==>table", table);
    store.canvasStore.canvas?.add(table);
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
        <Button onClick={handleTable}>画表格</Button>
      </div>
    </div>
  );
};

export default observer(MJHeader);
