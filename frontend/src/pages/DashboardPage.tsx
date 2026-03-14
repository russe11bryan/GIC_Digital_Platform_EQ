import { ArrowRightOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, Empty, Row, Space, Spin, Statistic, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCafes } from '../hooks/useCafes'
import { useEmployees } from '../hooks/useEmployees'
import type { Cafe, Employee } from '../types/models'
import { getErrorMessage } from '../utils/getErrorMessage'

type CafeRow = {
  key: string
  name: string
  location: string
  employees: number
}

type EmployeeRow = {
  key: string
  name: string
  cafe: string
  daysWorked: number
}

export function DashboardPage() {
  const navigate = useNavigate()
  const cafesQuery = useCafes('')
  const employeesQuery = useEmployees('')

  const totalCafes = (cafesQuery.data ?? []).length
  const totalEmployees = (employeesQuery.data ?? []).length

  const averageDaysWorked = useMemo(() => {
    if (!employeesQuery.data || employeesQuery.data.length === 0) {
      return 0
    }

    const total = employeesQuery.data.reduce((sum, employee) => sum + employee.daysWorked, 0)
    return Math.round(total / employeesQuery.data.length)
  }, [employeesQuery.data])

  const unassignedEmployees = useMemo(
    () => (employeesQuery.data ?? []).filter((employee) => !employee.cafe).length,
    [employeesQuery.data],
  )

  const topCafes = useMemo<CafeRow[]>(() => {
    return (cafesQuery.data ?? [])
      .slice()
      .sort((a: Cafe, b: Cafe) => b.employees - a.employees)
      .slice(0, 5)
      .map((cafe) => ({
        key: cafe.id,
        name: cafe.name,
        location: cafe.location,
        employees: cafe.employees,
      }))
  }, [cafesQuery.data])

  const topEmployees = useMemo<EmployeeRow[]>(() => {
    return (employeesQuery.data ?? [])
      .slice()
      .sort((a: Employee, b: Employee) => b.daysWorked - a.daysWorked)
      .slice(0, 5)
      .map((employee) => ({
        key: employee.id,
        name: employee.name,
        cafe: employee.cafe ?? 'Unassigned',
        daysWorked: employee.daysWorked,
      }))
  }, [employeesQuery.data])

  const cafesColumns: ColumnsType<CafeRow> = [
    {
      title: 'Cafe',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      key: 'employees',
      render: (value: number) => <Tag className={value > 0 ? 'soft-chip chip-positive' : 'soft-chip'}>{value}</Tag>,
    },
  ]

  const employeesColumns: ColumnsType<EmployeeRow> = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cafe',
      dataIndex: 'cafe',
      key: 'cafe',
    },
    {
      title: 'Days Worked',
      dataIndex: 'daysWorked',
      key: 'daysWorked',
      render: (value: number) => {
        const cls = value >= 30 ? 'soft-chip chip-positive' : value >= 14 ? 'soft-chip chip-warning' : 'soft-chip'
        return <Tag className={cls}>{value} Days</Tag>
      },
    },
  ]

  return (
    <Space className="page-wrap" direction="vertical" size={16} style={{ width: '100%' }}>
      <Space className="dashboard-title-row" align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title className="page-title" level={3} style={{ margin: 0 }}>
          Dashboard
        </Typography.Title>
        <Space>
          <Button icon={<ShopOutlined />} onClick={() => navigate('/cafes')}>
            View Cafes
          </Button>
          <Button type="primary" icon={<TeamOutlined />} onClick={() => navigate('/employees')}>
            View Employees
          </Button>
        </Space>
      </Space>

      {(cafesQuery.isError || employeesQuery.isError) && (
        <Alert
          type="error"
          showIcon
          message="Failed to load dashboard data"
          description={getErrorMessage(cafesQuery.error ?? employeesQuery.error)}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card className="summary-card">
            <Statistic title="Total Cafes" value={totalCafes} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="summary-card">
            <Statistic title="Total Employees" value={totalEmployees} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="summary-card">
            <Statistic title="Avg Days Worked" value={averageDaysWorked} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="summary-card">
            <Statistic title="Unassigned Employees" value={unassignedEmployees} />
          </Card>
        </Col>
      </Row>

      {cafesQuery.isLoading || employeesQuery.isLoading ? (
        <div className="page-state">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card className="dashboard-list-card" title="Top Cafes by Employees" extra={<Button type="link" onClick={() => navigate('/cafes')}>Open <ArrowRightOutlined /></Button>}>
              {topCafes.length === 0 ? (
                <Empty description="No cafes yet" />
              ) : (
                <Table<CafeRow>
                  className="dashboard-mini-table"
                  columns={cafesColumns}
                  dataSource={topCafes}
                  pagination={false}
                  size="small"
                />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card className="dashboard-list-card" title="Top Employees by Days Worked" extra={<Button type="link" onClick={() => navigate('/employees')}>Open <ArrowRightOutlined /></Button>}>
              {topEmployees.length === 0 ? (
                <Empty description="No employees yet" />
              ) : (
                <Table<EmployeeRow>
                  className="dashboard-mini-table"
                  columns={employeesColumns}
                  dataSource={topEmployees}
                  pagination={false}
                  size="small"
                />
              )}
            </Card>
          </Col>
        </Row>
      )}
    </Space>
  )
}
