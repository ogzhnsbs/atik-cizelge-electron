import './App.css';
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { Layout, Menu, MenuItemProps } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import {
  FileAddOutlined,
  FileSearchOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import classes from './app.module.css';
import Home from './home/Home';
import NewTable from './home/NewTable';
import Report from './home/Report';

const { Content, Sider } = Layout;

type MenuItemType = {
  title: string;
  icon?: any;
  navigateTo: string;
  menuItemProps?: MenuItemProps;
};

const mainMenuOptions = [
  { title: 'Tüm Çizelgeler', icon: <FileSearchOutlined />, navigateTo: '/' },
  { title: 'Yeni Çizelge', icon: <FileAddOutlined />, navigateTo: '/new' },
  { title: 'Rapor', icon: <FileDoneOutlined />, navigateTo: '/report' },
] as MenuItemType[];

function MainMenu() {
  return (
    <Menu theme="dark" mode="inline">
      {mainMenuOptions.map((item) => {
        return (
          <Menu.Item key={item.title} icon={item.icon} {...item.menuItemProps}>
            <Link to={item.navigateTo}>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
}

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (_collapsed: boolean) => {
    setCollapsed(_collapsed);
  };

  return (
    <Router>
      <Layout className={classes.layout}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          className={classes.sider}
        >
          <div className={classes.wrapper}>
            <MainMenu />
          </div>
        </Sider>
        <StyleProvider hashPriority="high">
          <Layout>
            <Content className="overflow-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<NewTable />} />
                <Route path="/report" element={<Report />} />
              </Routes>
            </Content>
          </Layout>
        </StyleProvider>
      </Layout>
    </Router>
  );
};

export default App;
