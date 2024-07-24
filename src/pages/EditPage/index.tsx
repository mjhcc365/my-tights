import { Layout, Select } from "antd";
import { observer } from "mobx-react-lite";

import MJHeader from "./Header";
import MainContent from "./Content";
import LeftSiderBox from "./Menu/LeftSiderBox";
import "@/assets/iconfont/iconfont.js";
import "./index.less";
import { CanvasStoreContext, CanvasStore } from "@/store/canvas";
import { layoutStyle, headerStyle, siderStyle, contentStyle } from "./styles";

const { Header, Sider, Content } = Layout;

const HomePage = () => {
  return (
    <CanvasStoreContext.Provider value={new CanvasStore()}>
      <div className="main">
        <Layout style={layoutStyle}>
          <Header style={headerStyle}>
            <MJHeader />
          </Header>
          <Layout style={{ height: "calc(100vh - 64px)" }}>
            <Sider width={58} style={siderStyle}>
              <LeftSiderBox />
            </Sider>
            <div
              className="w-72"
              // style={{ width: 160, background: "#fff" }}
            ></div>
            <Content style={contentStyle}>
              <MainContent />
            </Content>
          </Layout>
        </Layout>
      </div>
    </CanvasStoreContext.Provider>
  );
};

export default observer(HomePage);
