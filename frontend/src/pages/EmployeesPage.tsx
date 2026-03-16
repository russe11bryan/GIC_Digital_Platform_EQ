import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { App, Alert, Button, Card, Empty, Input, Modal, Space, Spin, Tag, Typography } from 'antd'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmployeeFormModal } from '../components/EmployeeFormModal'
import { useCafes } from '../hooks/useCafes'
import { useCreateEmployee, useDeleteEmployee, useEmployees, useUpdateEmployee } from '../hooks/useEmployees'
import type { CreateEmployeePayload, Employee, UpdateEmployeePayload } from '../types/models'
import { getErrorMessage } from '../utils/getErrorMessage'

export function EmployeesPage() {
  const { message } = App.useApp()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('cafe') ?? '')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const employeesQuery = useEmployees('')
  const cafesQuery = useCafes('')
  const createEmployeeMutation = useCreateEmployee()
  const updateEmployeeMutation = useUpdateEmployee()
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
          setSelectedEmployee((current) => (current?.id === employee.id ? null : current))
          setEditingEmployee((current) => (current?.id === employee.id ? null : current))
        } catch (error) {
          message.error(getErrorMessage(error))
        }
      },
    })
  }, [deleteEmployeeMutation, message])

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) {
      return employeesQuery.data ?? []
    }

    return (employeesQuery.data ?? []).filter(
      (employee) =>
        employee.id.toLowerCase().includes(term) ||
        employee.name.toLowerCase().includes(term) ||
        employee.emailAddress.toLowerCase().includes(term) ||
        employee.phoneNumber.toLowerCase().includes(term) ||
        (employee.cafe ?? '').toLowerCase().includes(term),
    )
  }, [employeesQuery.data, search])

  const cafeIdByName = useMemo(() => {
    const map = new Map<string, string>()
    for (const cafe of cafesQuery.data ?? []) {
      map.set(cafe.name, cafe.id)
    }
    return map
  }, [cafesQuery.data])

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
                setSelectedEmployee(data)
                setEditingEmployee(data)
                setEditOpen(true)
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
    [confirmDeleteEmployee],
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
            placeholder="Search anything on Employees"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
          <Button onClick={() => void employeesQuery.refetch()} loading={employeesQuery.isFetching && !employeesQuery.isLoading}>
            Refresh
          </Button>
          <Button
            disabled={!selectedEmployee}
            onClick={() => {
              setEditingEmployee(selectedEmployee)
              setEditOpen(true)
            }}
          >
            Edit Selected
          </Button>
          <Button danger disabled={!selectedEmployee} onClick={() => {
            if (!selectedEmployee) {
              return
            }

            confirmDeleteEmployee(selectedEmployee)
          }}>
            Delete Selected
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
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
                rowData={filteredEmployees}
                columnDefs={columnDefs}
                rowHeight={64}
                defaultColDef={{
                  resizable: true,
                }}
                rowSelection="single"
                suppressCellFocus
                loading={employeesQuery.isFetching}
                onRowClicked={(event) => {
                  const clickedEmployee = event.data ?? null
                  setSelectedEmployee((previousEmployee) => {
                    if (previousEmployee?.id === clickedEmployee?.id) {
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
        title="Add New Employee"
        onCancel={() => setCreateOpen(false)}
        onSubmit={async (payload: CreateEmployeePayload | UpdateEmployeePayload) => {
          try {
            await createEmployeeMutation.mutateAsync(payload as CreateEmployeePayload)
            message.success('Employee created successfully')
            setCreateOpen(false)
          } catch (error) {
            message.error(getErrorMessage(error))
          }
        }}
      />

      <EmployeeFormModal
        cafes={cafesQuery.data ?? []}
        open={editOpen}
        loading={updateEmployeeMutation.isPending}
        title="Edit Employee"
        initialValues={
          editingEmployee
            ? {
                id: editingEmployee.id,
                name: editingEmployee.name,
                emailAddress: editingEmployee.emailAddress,
                phoneNumber: editingEmployee.phoneNumber,
                gender: editingEmployee.gender,
                cafeId: editingEmployee.cafeId ?? (editingEmployee.cafe ? cafeIdByName.get(editingEmployee.cafe) : undefined),
              }
            : undefined
        }
        onCancel={() => {
          setEditOpen(false)
          setEditingEmployee(null)
        }}
        onSubmit={async (payload: CreateEmployeePayload | UpdateEmployeePayload) => {
          try {
            await updateEmployeeMutation.mutateAsync(payload as UpdateEmployeePayload)
            message.success('Employee updated successfully')
            setEditOpen(false)
            setEditingEmployee(null)
          } catch (error) {
            message.error(getErrorMessage(error))
          }
        }}
      />
    </Space>
  )
}
