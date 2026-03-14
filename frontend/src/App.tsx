import {
  BellOutlined,
  DashboardOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, Layout, Menu, Typography } from 'antd'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AccountPage } from './pages/AccountPage'
import { CafesPage } from './pages/CafesPage'
import { EmployeesPage } from './pages/EmployeesPage'
import { HelpSupportPage } from './pages/HelpSupportPage'
import { NotificationsPage } from './pages/NotificationsPage'
import './App.css'

const { Sider, Header, Content } = Layout

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Layout className="dashboard-layout">
      <Sider width={230} className="dashboard-sider">
        <div className="brand-block">
          <span className="brand-dot" />
          <Typography.Text className="brand-title">CafeManager</Typography.Text>
        </div>

        <Menu
          className="side-menu"
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(event) => navigate(event.key)}
          items={[
            { key: '/cafes', icon: <ShopOutlined />, label: 'Cafes' },
            { key: '/employees', icon: <TeamOutlined />, label: 'Employees' },
            { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard (Soon)', disabled: true },
            { key: '/settings', icon: <SettingOutlined />, label: 'Settings (Soon)', disabled: true },
          ]}
        />

        <div className="sider-footer">
          <button type="button" className="sider-footer-item" onClick={() => navigate('/help-support')}>
            <QuestionCircleOutlined />
            <span>Help & Support</span>
          </button>
          <button type="button" className="sider-footer-item" onClick={() => navigate('/account')}>
            <UserOutlined />
            <span>Account</span>
          </button>
        </div>
      </Sider>

      <Layout className="dashboard-main">
        <Header className="top-header">
          <div />

          <div className="top-actions">
            <Badge dot>
              <BellOutlined className="top-icon" onClick={() => navigate('/notifications')} />
            </Badge>
            <button type="button" className="profile-chip" onClick={() => navigate('/account')}>
              <Avatar size={22} icon={<UserOutlined />} />
              <span>Admin</span>
            </button>
          </div>
        </Header>

        <Content className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/cafes" replace />} />
            <Route path="/cafes" element={<CafesPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/help-support" element={<HelpSupportPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
