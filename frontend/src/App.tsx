import { Layout, Menu, Typography } from 'antd'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CafesPage } from './pages/CafesPage'
import { EmployeesPage } from './pages/EmployeesPage'

const { Header, Content } = Layout

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
          Cafe Employee Manager
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={[
            { key: '/cafes', label: 'Cafes' },
            { key: '/employees', label: 'Employees' },
          ]}
          onClick={(event) => navigate(event.key)}
          style={{ minWidth: 260 }}
        />
      </Header>
      <Content style={{ padding: 24 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/cafes" replace />} />
          <Route path="/cafes" element={<CafesPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
        </Routes>
      </Content>
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
