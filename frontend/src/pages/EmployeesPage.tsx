import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { App, Alert, Avatar, Button, Card, Empty, Input, Modal, Space, Spin, Statistic, Tag, Typography } from 'antd'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useMemo, useState } from 'react'
import { EmployeeFormModal } from '../components/EmployeeFormModal'
import { useCafes } from '../hooks/useCafes'
import { useCreateEmployee, useDeleteEmployee, useEmployees, useUpdateEmployee } from '../hooks/useEmployees'
import type { CreateEmployeePayload, Employee, UpdateEmployeePayload } from '../types/models'
import { getErrorMessage } from '../utils/getErrorMessage'

export function EmployeesPage() {
  const { message } = App.useApp()
  const [search, setSearch] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [viewedEmployee, setViewedEmployee] = useState<Employee | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const employeesQuery = useEmployees('')
  const cafesQuery = useCafes('')
  const createEmployeeMutation = useCreateEmployee()
  const updateEmployeeMutation = useUpdateEmployee()
  const deleteEmployeeMutation = useDeleteEmployee()

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return employeesQuery.data ?? []
    return (employeesQuery.data ?? []).filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.emailAddress.toLowerCase().includes(term) ||
        e.phoneNumber.toLowerCase().includes(term) ||
        (e.cafe ?? '').toLowerCase().includes(term),
    )
  }, [employeesQuery.data, search])

  const cafeIdByName = useMemo(() => {
    const mapping = new Map<string, string>()
    for (const cafe of cafesQuery.data ?? []) {
      mapping.set(cafe.name, cafe.id)
    }
    return mapping
  }, [cafesQuery.data])

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      {
        headerName: 'Name',
        field: 'name',
        minWidth: 240,
        flex: 1,
        sortable: true,
        cellRenderer: ({ data }: { data?: Employee }) => {
          if (!data) {
            return null
          }

          return (
            <div className="cell-cafe">
              <Avatar size={32}>{data.name.slice(0, 1).toUpperCase()}</Avatar>
              <div>
                <div className="cell-title">{data.name}</div>
                <div className="cell-subtitle">#{data.id}</div>
              </div>
            </div>
          )
        },
      },
      {
        headerName: 'Email Address',
        field: 'emailAddress',
        minWidth: 260,
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
        headerName: 'Action',
        field: 'id',
        width: 120,
        sortable: false,
        cellRenderer: ({ data }: { data?: Employee }) => (
          <button
            type="button"
            className="row-action-btn"
            onClick={(e) => {
              e.stopPropagation()
              if (data) {
                setViewedEmployee(data)
                setViewOpen(true)
              }
            }}
          >
            View
          </button>
        ),
      },
    ],
    [],
  )

  const handleCreate = async (payload: CreateEmployeePayload | UpdateEmployeePayload) => {
    try {
      await createEmployeeMutation.mutateAsync(payload as CreateEmployeePayload)
      message.success('Employee created successfully')
      setCreateOpen(false)
    } catch (error) {
      message.error(getErrorMessage(error))
    }
  }

  const handleUpdate = async (payload: CreateEmployeePayload | UpdateEmployeePayload) => {
    try {
      await updateEmployeeMutation.mutateAsync(payload as UpdateEmployeePayload)
      message.success('Employee updated successfully')
      setEditOpen(false)
    } catch (error) {
      message.error(getErrorMessage(error))
    }
  }

  const handleDelete = () => {
    if (!selectedEmployee) {
      return
    }

    Modal.confirm({
      title: 'Delete employee',
      content: `Delete ${selectedEmployee.name}?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteEmployeeMutation.mutateAsync(selectedEmployee.id)
          message.success('Employee deleted successfully')
          setSelectedEmployee(null)
        } catch (error) {
          message.error(getErrorMessage(error))
        }
      },
    })
  }

  const selectedEmployeeCafeId = selectedEmployee?.cafe ? cafeIdByName.get(selectedEmployee.cafe) : undefined

  return (
    <Space className="page-wrap" direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title className="page-title" level={3} style={{ margin: 0 }}>
        Employees
      </Typography.Title>

      <Space className="stats-row" size={16} wrap>
        <Card>
          <Statistic title="Total Employees" value={(employeesQuery.data ?? []).length} />
          <div className="metric-trend" aria-hidden>
            <span style={{ height: 11 }} />
            <span style={{ height: 17 }} />
            <span style={{ height: 13 }} />
            <span style={{ height: 20 }} />
            <span style={{ height: 15 }} />
            <span style={{ height: 18 }} />
          </div>
        </Card>
        <Card>
          <Statistic
            title="Average Days Worked"
            value={
              (employeesQuery.data ?? []).length === 0
                ? 0
                : Math.round(
                    (employeesQuery.data ?? []).reduce((sum, employee) => sum + employee.daysWorked, 0) /
                      (employeesQuery.data ?? []).length,
                  )
            }
          />
          <div className="metric-trend" aria-hidden>
            <span style={{ height: 9 }} />
            <span style={{ height: 14 }} />
            <span style={{ height: 12 }} />
            <span style={{ height: 19 }} />
            <span style={{ height: 16 }} />
            <span style={{ height: 21 }} />
          </div>
        </Card>
      </Space>

      <Card className="toolbar-card">
        <Space className="toolbar" wrap>
          <Input
            className="pill-search"
            prefix={<SearchOutlined />}
            placeholder="Search anything on Employees"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
          <Button onClick={() => void employeesQuery.refetch()} loading={employeesQuery.isFetching && !employeesQuery.isLoading}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)} disabled={(cafesQuery.data ?? []).length === 0}>
            Add Employee
          </Button>
          <Button disabled={!selectedEmployee} onClick={() => setEditOpen(true)}>
            Edit Selected
          </Button>
          <Button danger disabled={!selectedEmployee} onClick={handleDelete}>
            Delete Selected
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
            <div className="ag-theme-alpine" style={{ height: 460, width: '100%' }}>
              <AgGridReact<Employee>
                rowData={filteredEmployees}
                columnDefs={columnDefs}
                rowHeight={72}
                defaultColDef={{
                  resizable: true,
                }}
                rowSelection="single"
                suppressCellFocus
                loading={employeesQuery.isFetching}
                onRowClicked={(event) => {
                  const clickedEmployee = event.data ?? null
                  setSelectedEmployee((prev) => {
                    const shouldUnselect = prev?.id === clickedEmployee?.id
                    if (shouldUnselect) {
                      event.node.setSelected(false)
                      return null
                    }
                    return clickedEmployee
                  })
                }}
              />
            </div>
          </div>
        )}
      </Card>

      <EmployeeFormModal
        cafes={cafesQuery.data ?? []}
        open={createOpen}
        loading={createEmployeeMutation.isPending}
        title="Create Employee"
        onCancel={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <EmployeeFormModal
        cafes={cafesQuery.data ?? []}
        open={editOpen}
        loading={updateEmployeeMutation.isPending}
        title="Update Employee"
        initialValues={
          selectedEmployee && selectedEmployeeCafeId
            ? {
                id: selectedEmployee.id,
                name: selectedEmployee.name,
                emailAddress: selectedEmployee.emailAddress,
                phoneNumber: selectedEmployee.phoneNumber,
                gender: 'Male',
                cafeId: selectedEmployeeCafeId,
              }
            : undefined
        }
        onCancel={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      <Modal
        open={viewOpen}
        title={viewedEmployee ? viewedEmployee.name : 'Employee'}
        onCancel={() => setViewOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setViewOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <div className="cafe-view-card">
          <div className="cafe-view-section">
            <Typography.Text className="cafe-view-label">Employee Details</Typography.Text>
            <div className="employee-view-grid">
              <div className="employee-view-item">
                <Typography.Text className="employee-view-key">ID</Typography.Text>
                <Typography.Text className="employee-view-value">{viewedEmployee?.id ?? '-'}</Typography.Text>
              </div>
              <div className="employee-view-item">
                <Typography.Text className="employee-view-key">Email</Typography.Text>
                <Typography.Text className="employee-view-value">{viewedEmployee?.emailAddress ?? '-'}</Typography.Text>
              </div>
              <div className="employee-view-item">
                <Typography.Text className="employee-view-key">Phone</Typography.Text>
                <Typography.Text className="employee-view-value">{viewedEmployee?.phoneNumber ?? '-'}</Typography.Text>
              </div>
              <div className="employee-view-item">
                <Typography.Text className="employee-view-key">Cafe</Typography.Text>
                <Typography.Text className="employee-view-value">{viewedEmployee?.cafe ?? 'Unassigned'}</Typography.Text>
              </div>
            </div>
          </div>

          <div className="cafe-view-section">
            <Typography.Text className="cafe-view-label">Work Summary</Typography.Text>
            <div className="cafe-view-value">
              <Tag
                className={
                  (viewedEmployee?.daysWorked ?? 0) >= 30
                    ? 'soft-chip chip-positive'
                    : (viewedEmployee?.daysWorked ?? 0) >= 14
                      ? 'soft-chip chip-warning'
                      : 'soft-chip'
                }
              >
                {viewedEmployee?.daysWorked ?? 0} Days Worked
              </Tag>
            </div>
          </div>
        </div>
      </Modal>
    </Space>
  )
}
