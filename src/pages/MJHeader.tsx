import { Button } from "antd";
import { useContext, useState } from "react";
import imgUrl from '@/assets/logo.png'
import { MainContext } from "./store";
import "./MJHeader.less"

const MJHeader = () => {
    const { store } = useContext(MainContext)
    const [showModal, setShowModal] = useState<boolean>(false)

    const handleClickPic = () => {
        var dataURL = store.canvas?.toDataURL({
            format: 'png', // 指定导出格式，可以是 'png', 'jpeg', 'webp' 等
            quality: 0.8,
        })
        // 
        var downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'fabric_image.png'; // 设置下载的文件名
        // 将链接添加到文档中
        document.body.appendChild(downloadLink);
        // 模拟点击链接以触发下载
        downloadLink.click();
        // 移除链接元素
        document.body.removeChild(downloadLink);
    }


    const handleOnSave = () => {
        store.temporaryStorage()
    }

    const handleReset = () => {
        localStorage.clear()
    }

    const handleClick = () => { }

    const handleClickJson = () => {
        var jsonString = JSON.stringify(store.canvas.toJSON());
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

    return <div className='headerBox'>
        <div className='logo-box'>
            <img width={48} height={48} src={imgUrl} />
            <span style={{ color: "#1f1f1f" }}>胡百拾</span>
        </div>
        <div>
            {/* <Button onClick={handleSizeClick}>尺寸调整</Button> */}
            {/* <Button onClick={handeAddAuxiliaryLine
            }>添加辅助线</Button> */}
        </div>
        <div className='btns-box'>
            <Button onClick={handleClick}>上一步</Button>
            <Button onClick={handleClick}>下一步</Button>
        </div>
        <div className='btns-box'>
            <Button onClick={handleClickPic}>下载图片</Button>
            <Button onClick={handleClickJson}>下载JSON</Button>
            <Button onClick={handleClick}>下载PDF</Button>
            <Button onClick={handleOnSave}>暂存</Button>
            <Button onClick={handleReset}>清除</Button>
        </div>
    </div>
}


export default MJHeader