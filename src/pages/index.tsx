import { calc } from 'antd/es/theme/internal';
import yayJpg from '../assets/yay.jpg';
import "./index.less"

import LeftSiderBox from "@/components/LeftSiderBox"

import { Layout } from 'antd';
const { Header, Sider, Content } = Layout;

export default function HomePage() {

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    paddingInline: 48,
    backgroundColor: '#4096ff',
  };

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#0958d9',
  };

  const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#1677ff',
  };
  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
  };

  const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
  };

  return (
    <div className='main'>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>Header</Header>
        <Layout style={{ height: "calc(100vh - 64px)" }}>
          <Sider width="25%" style={siderStyle}>
            <LeftSiderBox />
          </Sider>
          <Content style={contentStyle}>Content</Content>
          <Sider width="25%" style={siderStyle}>
            Sider
          </Sider>
        </Layout>
      </Layout>
    </div>
  );
}
