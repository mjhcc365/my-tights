import { Layout } from "antd";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import MJHeader from "./Header";
import MainContent from "./Content";
import LeftSiderBox from "./Menu/LeftSiderBox";
import "@/assets/iconfont/iconfont.js";
import "./index.less";
import { stores } from "@/pages/EditPage/store/main";
import { layoutStyle, headerStyle, siderStyle, contentStyle } from "./styles";

const { Header, Sider, Content } = Layout;

const HomePage = () => {
  const handleUnload = () => {
    stores.dexieStore.clear();
  };

  useEffect(() => {
    window.addEventListener("unload", handleUnload);
    return window.removeEventListener("unload", handleUnload);
  }, []);

  return (
    <div className="main">
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <MJHeader />
        </Header>
        <Layout style={{ height: "calc(100vh - 64px)" }}>
          <Sider width={58} style={siderStyle}>
            <LeftSiderBox />
          </Sider>
          <Content style={contentStyle}>
            <MainContent />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default observer(HomePage);
