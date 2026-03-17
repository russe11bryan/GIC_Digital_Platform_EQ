import { MenuFoldOutlined, MenuUnfoldOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, Typography } from 'antd'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CafeFormPage } from './pages/CafeFormPage'
import { CafesPage } from './pages/CafesPage'
import { EmployeeFormPage } from './pages/EmployeeFormPage'
import { EmployeesPage } from './pages/EmployeesPage'
import './App.css'

const { Sider, Content } = Layout

function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const selectedKey = location.pathname.startsWith('/employees') ? '/employees' : '/cafes'

  return (
    <Layout className="dashboard-layout">
      <Sider width={230} collapsed={collapsed} className={`dashboard-sider ${collapsed ? 'collapsed' : ''}`}>
        <div className="brand-block">
          <span className="brand-dot" />
          <Typography.Text className="brand-title">CafeManager</Typography.Text>
        </div>

        <Menu
          className="side-menu"
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(event) => navigate(event.key)}
          items={[
            { key: '/cafes', icon: <ShopOutlined />, label: 'Cafes' },
            { key: '/employees', icon: <TeamOutlined />, label: 'Employees' },
          ]}
        />

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="toggle-sidebar-btn"
        />
      </Sider>

      <Layout className="dashboard-main">
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/cafes" replace />} />
            <Route path="/cafes" element={<CafesPage />} />
            <Route path="/cafes/new" element={<CafeFormPage />} />
            <Route path="/cafes/:id/edit" element={<CafeFormPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/new" element={<EmployeeFormPage />} />
            <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
            <Route path="*" element={<Navigate to="/cafes" replace />} />
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
