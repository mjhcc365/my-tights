import { Button } from "antd";
import imgUrl from '@/assets/logo.png'

import useHistory from "@/store/useHistory";
import { stores as store } from "@/store/main";

import "./index.less"
import { observer } from "mobx-react-lite";


const MJHeader = () => {

    const handleClickPic = () => {
        var dataURL = store?.canvasStore.canvas?.toDataURL({
            format: 'png', // 指定导出格式，可以是 'png', 'jpeg', 'webp' 等
            quality: 0.8,
        })
        // 
        var downloadLink: any = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'fabric_image.png'; // 设置下载的文件名
        // 将链接添加到文档中
        document.body.appendChild(downloadLink);
        // 模拟点击链接以触发下载
        downloadLink.click();
        // 移除链接元素
        document.body.removeChild(downloadLink);
    }
    // const handleOnSave = () => {
    //     // temporaryStorage()
    //     // store
    // }

    const handleReset = () => {
        localStorage.clear()
        location.reload()
    }

    const handleClickPDF = () => {

    }

    const handleClickJson = () => {
        if (!store?.canvasStore.canvas) return
        var jsonString = JSON.stringify(store?.canvasStore.canvas.toJSON());
        // 创建一个下载链接
        var downloadLink = document.createElement('a');
        downloadLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonString);
        downloadLink.download = 'fabric_canvas.json'; // 设置下载的文件名
        // 将链接添加到文档中
        document.body.appendChild(downloadLink);
        // 模拟点击链接以触发下载
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    // 撤销 上一步
    const undo = async () => {
        const snapshot = await store.dexieStore.getPreSnapshot();
        store.dexieStore.setSnapshotCursor(store.dexieStore.snapshotCursor - 1)
        store.canvasStore.loadCanvasFormObj(snapshot)
        store.canvasStore.setActiveObj(null)
    }
    // 重做 下一步
    const redo = async () => {
        const snapshot = await store.dexieStore.getNextSnapshot();
        store.dexieStore.setSnapshotCursor(store.dexieStore.snapshotCursor + 1)
        console.log("==>snapshot", snapshot)
        await store.canvasStore.loadCanvasFormObj(snapshot)
        store.canvasStore.setActiveObj(null)
    }

    return <div className='headerBox'>
        <div className='logo-box'>
            <img width={48} height={48} src={imgUrl} />
            <span style={{ color: "#1f1f1f" }}>胡百拾</span>
        </div>
        <div className='btns-box'>
            <Button disabled={store.dexieStore.disableUndo} onClick={undo}>
                上一步
            </Button>
            <Button disabled={store.dexieStore.disableRedo} onClick={redo}>
                下一步
            </Button>
        </div>
        <div className='btns-box'>
            <Button onClick={handleClickPic}>下载图片</Button>
            <Button onClick={handleClickJson}>下载JSON</Button>
            <Button onClick={handleClickPDF}>下载PDF</Button>
            {/* <Button onClick={handleOnSave}>暂存</Button> */}
            <Button onClick={handleReset}>清除</Button>
        </div>
    </div>
}


export default observer(MJHeader)