import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { App, Alert, Button, Card, Empty, Input, Modal, Space, Spin, Tag, Typography } from 'antd'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDeleteEmployee, useEmployees } from '../hooks/useEmployees'
import type { Employee, EmployeeEditState } from '../types/models'
import { getErrorMessage } from '../utils/getErrorMessage'

export function EmployeesPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [cafeInput, setCafeInput] = useState(searchParams.get('cafe') ?? '')
  const cafeFilter = searchParams.get('cafe') ?? ''
  const employeesQuery = useEmployees(cafeFilter)
  const deleteEmployeeMutation = useDeleteEmployee()

  const confirmDeleteEmployee = useCallback((employee: Employee) => {
    Modal.confirm({
      title: 'Delete employee',
      content: `Delete ${employee.name}?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteEmployeeMutation.mutateAsync(employee.id)
          message.success('Employee deleted successfully')
        } catch (error) {
          message.error(getErrorMessage(error))
        }
      },
    })
  }, [deleteEmployeeMutation, message])

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      {
        headerName: 'Employee Id',
        field: 'id',
        minWidth: 150,
        width: 160,
        sortable: true,
      },
      {
        headerName: 'Name',
        field: 'name',
        minWidth: 180,
        flex: 1,
        sortable: true,
      },
      {
        headerName: 'Email Address',
        field: 'emailAddress',
        minWidth: 240,
        flex: 1.1,
        sortable: true,
      },
      {
        headerName: 'Phone Number',
        field: 'phoneNumber',
        minWidth: 180,
        width: 190,
        sortable: true,
      },
      {
        headerName: 'Days Worked',
        field: 'daysWorked',
        width: 160,
        sortable: true,
        cellRenderer: ({ value }: { value?: number }) => {
          const days = value ?? 0
          const cls = days >= 30 ? 'soft-chip chip-positive' : days >= 14 ? 'soft-chip chip-warning' : 'soft-chip'
          return <Tag className={cls}>{days} Days</Tag>
        },
      },
      {
        headerName: 'Cafe',
        field: 'cafe',
        width: 220,
        sortable: true,
        cellRenderer: ({ value }: { value?: string | null }) =>
          value ? <Tag className="soft-chip chip-neutral">{value}</Tag> : <Tag className="soft-chip">Unassigned</Tag>,
      },
      {
        headerName: 'Actions',
        field: 'id',
        width: 180,
        sortable: false,
        cellRendererParams: {
          suppressMouseEventHandling: () => true,
        },
        cellRenderer: ({ data }: { data?: Employee }) => (
          data ? (
            <Space size={8}>
              <Button size="small" onClick={(event) => {
                event.stopPropagation()
                navigate(`/employees/${data.id}/edit`, {
                  state: {
                    employee: data,
                  } satisfies EmployeeEditState,
                })
              }}>
                Edit
              </Button>
              <Button size="small" danger onClick={(event) => {
                event.stopPropagation()
                confirmDeleteEmployee(data)
              }}>
                Delete
              </Button>
            </Space>
          ) : null
        ),
      },
    ],
    [confirmDeleteEmployee, navigate],
  )

  return (
    <Space className="page-wrap page-wrap-bottom-table" direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title className="page-title" level={3} style={{ margin: 0 }}>
        Employees
      </Typography.Title>

      <Card className="toolbar-card">
        <Space className="toolbar" wrap>
          <Input
            className="pill-search"
            prefix={<SearchOutlined />}
            placeholder="Filter by cafe"
            value={cafeInput}
            onChange={(e) => setCafeInput(e.target.value)}
            allowClear
          />
          <Button
            type="primary"
            onClick={() => {
              const value = cafeInput.trim()
              navigate(value ? `/employees?cafe=${encodeURIComponent(value)}` : '/employees')
            }}
          >
            Apply Filter
          </Button>
          <Button onClick={() => {
            setCafeInput('')
            navigate('/employees')
          }}>
            Clear
          </Button>
          <Button onClick={() => void employeesQuery.refetch()} loading={employeesQuery.isFetching && !employeesQuery.isLoading}>
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/employees/new')}
          >
            Add New Employee
          </Button>
        </Space>
      </Card>

      {employeesQuery.isError && (
        <Alert
          type="error"
          message="Failed to load employees"
          description={getErrorMessage(employeesQuery.error)}
          showIcon
        />
      )}

      <Card className="grid-card">
        {employeesQuery.isLoading ? (
          <div className="page-state">
            <Spin size="large" />
          </div>
        ) : (employeesQuery.data ?? []).length === 0 ? (
          <div className="page-state">
            <Empty description="No employees found" />
          </div>
        ) : (
          <div className="grid-shell">
            <div className="ag-theme-alpine grid-fill-height" style={{ width: '100%' }}>
              <AgGridReact<Employee>
                rowData={employeesQuery.data ?? []}
                columnDefs={columnDefs}
                rowHeight={64}
                defaultColDef={{
                  resizable: true,
                }}
                suppressCellFocus
                loading={employeesQuery.isFetching}
              />
            </div>
          </div>
        )}
      </Card>
    </Space>
  )
}
