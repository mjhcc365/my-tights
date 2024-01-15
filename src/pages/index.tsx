
import { Layout, } from 'antd';
import { useEffect, useRef } from "react"
import { fabric } from 'fabric'; // v5
import { observer } from "mobx-react-lite"

import "@/assets/iconfont/iconfont"


import MJHeader from "./MJHeader"
import TopTools from "./TopTools"
import { useCanvas, MainContext } from "./store"
import { layoutStyle, headerStyle, siderStyle, contentStyle } from "./styles"
import LeftSiderBox from "@/pages/LeftSiderBox";
import "./index.less"

const { Header, Sider, Content } = Layout;

const HomePage = () => {
  const { canvasRef, store, activeObject, setActiveObject } = useCanvas()
  const canvasBoxRef = useRef<HTMLInputElement>(null)


  const handleEnter = () => {
    console.log("-->", store.canvas)
    if (!store.canvas) return
    const curActice = store.canvas.getActiveObject()
    // if (curActice) {
    //   store.canvas.remove(curActice)
    // }
  }

  const onKeyDown = (e: { code: any; }) => {
    const code = e.code;
    switch (code) {
      case "Enter":
        handleEnter()
        break;
      default:
        break
    }
  }

  useEffect(() => {
    const cWidth = Math.floor((80 * 5 || 0));
    const cHeight = Math.floor((120 * 5 || 0))
    const options = {
      backgroundColor: '#fff',
      width: cWidth,
      height: cHeight,
      absolutePositioned: true,
      selectable: false,
    }
    const canvas = new fabric.Canvas(canvasRef.current, options);
    store.setCanvas(canvas)
    store.init()
    document.addEventListener('keydown', onKeyDown)
    store?.canvas?.on("mouse:down", () => {
      console.log("==>mouse:down")
      setActiveObject(store.canvas?.getActiveObject()?.toObject() || null)
      // store.setAObject(store.canvas?.getActiveObject() || null)
      // store.setActiveObject(store.canvas?.getActiveObject() || null)
    })
    return () => {
      document.removeEventListener('keydown', onKeyDown)

    }
  }, []);


  return (
    <MainContext.Provider value={{ store, activeObject, setActiveObject }}>
      <div className='main'>
        <Layout style={layoutStyle}>
          <Header style={headerStyle}><MJHeader /></Header>
          <Layout style={{ height: "calc(100vh - 64px)" }}>
            <Sider width="25%" style={siderStyle}>
              <LeftSiderBox />
            </Sider>
            <Content style={contentStyle}>
              <div style={{
                width: "100%",
                height: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
                position: "relative"
              }} ref={canvasBoxRef} >
                <TopTools activeObject={activeObject} />
                <canvas ref={canvasRef} />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </MainContext.Provider>

  );
}


export default observer(HomePage)