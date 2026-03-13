import { PlusOutlined } from '@ant-design/icons'
import { App, Alert, Button, Card, Empty, Input, Modal, Space, Spin, Statistic, Typography } from 'antd'
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
  const [cafeFilter, setCafeFilter] = useState('')
  const [appliedCafeFilter, setAppliedCafeFilter] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const employeesQuery = useEmployees(appliedCafeFilter)
  const cafesQuery = useCafes('')
  const createEmployeeMutation = useCreateEmployee()
  const updateEmployeeMutation = useUpdateEmployee()
  const deleteEmployeeMutation = useDeleteEmployee()

  const cafeIdByName = useMemo(() => {
    const mapping = new Map<string, string>()
    for (const cafe of cafesQuery.data ?? []) {
      mapping.set(cafe.name, cafe.id)
    }
    return mapping
  }, [cafesQuery.data])

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      { headerName: 'Employee ID', field: 'id', width: 140 },
      { headerName: 'Name', field: 'name', width: 150 },
      { headerName: 'Email', field: 'emailAddress', flex: 1 },
      { headerName: 'Phone', field: 'phoneNumber', width: 130 },
      { headerName: 'Days Worked', field: 'daysWorked', width: 130 },
      { headerName: 'Cafe', field: 'cafe', width: 140 },
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
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Employees
      </Typography.Title>

      <Space size={16} wrap>
        <Card>
          <Statistic title="Total Employees" value={(employeesQuery.data ?? []).length} />
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
        </Card>
      </Space>

      <Card>
        <Space wrap>
          <Input
            placeholder="Filter by cafe name"
            value={cafeFilter}
            onChange={(event) => setCafeFilter(event.target.value)}
            style={{ width: 220 }}
          />
          <Button onClick={() => setAppliedCafeFilter(cafeFilter.trim())}>Apply Filter</Button>
          <Button onClick={() => {
            setCafeFilter('')
            setAppliedCafeFilter('')
          }}>
            Clear
          </Button>
          <Button onClick={() => void employeesQuery.refetch()} loading={employeesQuery.isFetching && !employeesQuery.isLoading}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)} disabled={(cafesQuery.data ?? []).length === 0}>
            Add Employee
          </Button>
          <Button disabled={!selectedEmployee || !selectedEmployeeCafeId} onClick={() => setEditOpen(true)}>
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

      <Card>
        {employeesQuery.isLoading ? (
          <div className="page-state">
            <Spin size="large" />
          </div>
        ) : (employeesQuery.data ?? []).length === 0 ? (
          <div className="page-state">
            <Empty description="No employees found" />
          </div>
        ) : (
          <div className="ag-theme-alpine" style={{ height: 460, width: '100%' }}>
            <AgGridReact<Employee>
              rowData={employeesQuery.data ?? []}
              columnDefs={columnDefs}
              rowSelection="single"
              loading={employeesQuery.isFetching}
              onRowClicked={(event) => setSelectedEmployee(event.data ?? null)}
            />
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
    </Space>
  )
}
