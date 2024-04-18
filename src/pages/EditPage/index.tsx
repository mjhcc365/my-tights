import { Layout } from "antd";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import MJHeader from "./Header";
import MainContent from "./Content";
import LeftSiderBox from "./Menu/LeftSiderBox";

import "./index.less";

import "@/assets/iconfont/iconfont.js";

import { stores } from "@/store/main";

const { Header, Sider, Content } = Layout;

export const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  paddingInline: 48,
  backgroundColor: "#fff",
  borderBottom: "1px solid #f5f5f5",
};

export const contentStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#0958d9",
};

export const siderStyle: React.CSSProperties = {
  textAlign: "center",
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
};

export const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
};

const HomePage = () => {
  const handleUnload = () => {
    console.log("==>unload");
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

// class TestStore {
//   show: boolean = false;

//   constructor() {
//     makeObservable(this, {
//       show: observable
//     })
//   }

//   setShow = () => {
//     this.show = !this.show
//   }
// }

// const testStore = new TestStore()

// const Comp = () => {
//   return <div>{testStore.show ? "show" : "noshow"}</div>
// }

// const Test = () => {
//   return <>
//     <div>
//       <Button onClick={() => {
//         console.log("==>点击")
//         testStore.setShow()
//       }}>按钮</Button>
//     </div>
//     <div>{testStore.show ? "show" : "noshow"}</div>
//     <Comp />
//   </>
// }

// export default observer(Test)
