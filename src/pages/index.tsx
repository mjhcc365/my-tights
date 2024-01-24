
import { Layout, Button } from 'antd';

import MJHeader from "./Header/MJHeader"
import MainContent from "./Content"
import LeftSiderBox from "./Menu/LeftSiderBox"
import "./index.less"
import "@/assets/iconfont/iconfont.js"
import { MainStoreContext, stores } from '@/store/main';
import { createContext } from 'react';

import { observable, action, makeObservable } from 'mobx';
import { observer } from "mobx-react-lite"
// import { observer } from "mobx-react"

const { Header, Sider, Content } = Layout;

export const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  paddingInline: 48,
  backgroundColor: '#fff',
  borderBottom: "1px solid #f5f5f5"
};

export const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#0958d9',
};

export const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#fff',
  display: "flex",
  flexDirection: "column"
};

export const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
};



const HomePage = () => {
  return (
    <div className='main'>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}><MJHeader /></Header>
        <Layout style={{ height: "calc(100vh - 64px)" }}>
          <Sider width="25%" style={siderStyle}>
            <LeftSiderBox />
          </Sider>
          <Content style={contentStyle}>
            <MainContent />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default observer(HomePage)

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