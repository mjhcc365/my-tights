
import { Layout, } from 'antd';
import { useEffect, useRef } from "react"
import "@/assets/iconfont/iconfont.js"

import MJHeader from "./MJHeader"
import TopTools from "./TopTools"
import { useCanvas, MainContext } from "../store/useCanvas"
import { layoutStyle, headerStyle, siderStyle, contentStyle } from "./styles"
import LeftSiderBox from "@/pages/LeftSiderBox";
import "./index.less"

const { Header, Sider, Content } = Layout;

const HomePage = () => {
  const {
    canvas,
    setCanvas,
    canvasRef,
    activeObject,
    setActiveObject,
    init,
    zoomRatio,
    temporaryStorage
  } = useCanvas();


  const canvasBoxRef = useRef<HTMLInputElement>(null)


  const handleEnter = () => {
    console.log("-->", canvas)
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
    const newCanvas = init()
    document.addEventListener('keydown', onKeyDown)
    newCanvas?.on("mouse:down", () => {
      console.log("==>mouse:down")
      setActiveObject(newCanvas?.getActiveObject()?.toObject() || null)
    })
    setCanvas(() => newCanvas)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, []);


  return (
    <MainContext.Provider value={{ zoomRatio, canvas, activeObject, setActiveObject, temporaryStorage }}>
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
                <TopTools />
                <canvas ref={canvasRef} />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </MainContext.Provider>

  );
}


export default HomePage