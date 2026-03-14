import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { App, Alert, Avatar, Button, Card, Empty, Input, Modal, Space, Spin, Statistic, Tag, Typography } from 'antd'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useMemo, useState } from 'react'
import { CafeFormModal } from '../components/CafeFormModal'
import { useCafes, useCreateCafe, useDeleteCafe, useUpdateCafe } from '../hooks/useCafes'
import { useEmployees } from '../hooks/useEmployees'
import type { Cafe, CreateCafePayload, UpdateCafePayload } from '../types/models'
import { getErrorMessage } from '../utils/getErrorMessage'

export function CafesPage() {
  const { message } = App.useApp()
  const [search, setSearch] = useState('')
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const [viewedCafe, setViewedCafe] = useState<Cafe | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const cafesQuery = useCafes('')
  const employeesQuery = useEmployees('')
  const createCafeMutation = useCreateCafe()
  const updateCafeMutation = useUpdateCafe()
  const deleteCafeMutation = useDeleteCafe()

  const filteredCafes = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return cafesQuery.data ?? []
    return (cafesQuery.data ?? []).filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term),
    )
  }, [cafesQuery.data, search])

  const columnDefs = useMemo<ColDef<Cafe>[]>(
    () => [
      {
        headerName: 'Name',
        field: 'name',
        minWidth: 240,
        flex: 1,
        sortable: true,
        cellRenderer: ({ data }: { data?: Cafe }) => {
          if (!data) {
            return null
          }

          return (
            <div className="cell-cafe">
              <Avatar src={data.logo ?? undefined} size={32}>
                {data.name.slice(0, 1).toUpperCase()}
              </Avatar>
              <div>
                <div className="cell-title">{data.name}</div>
                <div className="cell-subtitle">#{data.id.slice(0, 8)}</div>
              </div>
            </div>
          )
        },
      },
      {
        headerName: 'Description',
        field: 'description',
        minWidth: 320,
        flex: 1.2,
        sortable: true,
        cellRenderer: ({ value }: { value?: string }) => (
          <span className="truncate-cell" title={value ?? ''}>
            {value}
          </span>
        ),
      },
      {
        headerName: 'Employees',
        field: 'employees',
        width: 170,
        sortable: true,
        cellRenderer: ({ value }: { value?: number }) => {
          const count = value ?? 0
          return <Tag className={count > 0 ? 'soft-chip chip-positive' : 'soft-chip'}>{count} Employees</Tag>
        },
      },
      {
        headerName: 'Location',
        field: 'location',
        width: 180,
        sortable: true,
        cellRenderer: ({ value }: { value?: string }) => <Tag className="soft-chip chip-neutral">{value}</Tag>,
      },
      {
        headerName: 'Action',
        field: 'id',
        width: 120,
        sortable: false,
        cellRenderer: ({ data }: { data?: Cafe }) => (
          <button
            type="button"
            className="row-action-btn"
            onClick={(e) => {
              e.stopPropagation()
              if (data) {
                setViewedCafe(data)
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

  const totalEmployees = useMemo(
    () => (cafesQuery.data ?? []).reduce((sum, cafe) => sum + cafe.employees, 0),
    [cafesQuery.data],
  )

  const viewedCafeEmployees = useMemo(() => {
    const viewedCafeName = viewedCafe?.name?.trim().toLowerCase()
    if (!viewedCafeName) {
      return []
    }

    return (employeesQuery.data ?? []).filter(
      (employee) => (employee.cafe ?? '').trim().toLowerCase() === viewedCafeName,
    )
  }, [employeesQuery.data, viewedCafe])

  const handleCreate = async (payload: CreateCafePayload | UpdateCafePayload) => {
    try {
      await createCafeMutation.mutateAsync(payload as CreateCafePayload)
      message.success('Cafe created successfully')
      setCreateOpen(false)
    } catch (error) {
      message.error(getErrorMessage(error))
    }
  }

  const handleUpdate = async (payload: CreateCafePayload | UpdateCafePayload) => {
    try {
      await updateCafeMutation.mutateAsync(payload as UpdateCafePayload)
      message.success('Cafe updated successfully')
      setEditOpen(false)
    } catch (error) {
      message.error(getErrorMessage(error))
    }
  }

  const handleDelete = () => {
    if (!selectedCafe) {
      return
    }

    Modal.confirm({
      title: 'Delete cafe',
      content: `Delete ${selectedCafe.name}? This will remove assignments under this cafe.`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteCafeMutation.mutateAsync(selectedCafe.id)
          message.success('Cafe deleted successfully')
          setSelectedCafe(null)
        } catch (error) {
          message.error(getErrorMessage(error))
        }
      },
    })
  }

  return (
    <Space className="page-wrap" direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title className="page-title" level={3} style={{ margin: 0 }}>
        Cafes
      </Typography.Title>

      <Space className="stats-row" size={16} wrap>
        <Card>
          <Statistic title="Total Cafes" value={(cafesQuery.data ?? []).length} />
          <div className="metric-trend" aria-hidden>
            <span style={{ height: 10 }} />
            <span style={{ height: 16 }} />
            <span style={{ height: 12 }} />
            <span style={{ height: 20 }} />
            <span style={{ height: 14 }} />
            <span style={{ height: 18 }} />
          </div>
        </Card>
        <Card>
          <Statistic title="Assigned Employees" value={totalEmployees} />
          <div className="metric-trend" aria-hidden>
            <span style={{ height: 12 }} />
            <span style={{ height: 18 }} />
            <span style={{ height: 11 }} />
            <span style={{ height: 22 }} />
            <span style={{ height: 15 }} />
            <span style={{ height: 19 }} />
          </div>
        </Card>
      </Space>

      <Card className="toolbar-card">
        <Space className="toolbar" wrap>
          <Input
            className="pill-search"
            prefix={<SearchOutlined />}
            placeholder="Search anything on Cafes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
          <Button onClick={() => void cafesQuery.refetch()} loading={cafesQuery.isFetching && !cafesQuery.isLoading}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Add Cafe
          </Button>
          <Button disabled={!selectedCafe} onClick={() => setEditOpen(true)}>
            Edit Selected
          </Button>
          <Button danger disabled={!selectedCafe} onClick={handleDelete}>
            Delete Selected
          </Button>
        </Space>
      </Card>

      {cafesQuery.isError && (
        <Alert type="error" message="Failed to load cafes" description={getErrorMessage(cafesQuery.error)} showIcon />
      )}

      <Card className="grid-card">
        {cafesQuery.isLoading ? (
          <div className="page-state">
            <Spin size="large" />
          </div>
        ) : (cafesQuery.data ?? []).length === 0 ? (
          <div className="page-state">
            <Empty description="No cafes found" />
          </div>
        ) : (
          <div className="grid-shell">
            <div className="ag-theme-alpine" style={{ height: 460, width: '100%' }}>
              <AgGridReact<Cafe>
                rowData={filteredCafes}
                columnDefs={columnDefs}
                rowHeight={72}
                defaultColDef={{
                  resizable: true,
                }}
                rowSelection="single"
                suppressCellFocus
                loading={cafesQuery.isFetching}
                onRowClicked={(event) => {
                  const clickedCafe = event.data ?? null
                  setSelectedCafe((prev) => {
                    const shouldUnselect = prev?.id === clickedCafe?.id
                    if (shouldUnselect) {
                      event.node.setSelected(false)
                      return null
                    }
                    return clickedCafe
                  })
                }}
              />
            </div>
          </div>
        )}
      </Card>

      <CafeFormModal
        open={createOpen}
        loading={createCafeMutation.isPending}
        title="Create Cafe"
        onCancel={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <CafeFormModal
        open={editOpen}
        loading={updateCafeMutation.isPending}
        title="Update Cafe"
        initialValues={
          selectedCafe
            ? {
                id: selectedCafe.id,
                name: selectedCafe.name,
                description: selectedCafe.description,
                logo: selectedCafe.logo,
                location: selectedCafe.location,
              }
            : undefined
        }
        onCancel={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      <Modal
        open={viewOpen}
        title={viewedCafe ? viewedCafe.name : 'Cafe'}
        onCancel={() => setViewOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setViewOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <div className="cafe-view-card">
          <div className="cafe-view-section">
            <Typography.Text className="cafe-view-label">Employees</Typography.Text>
            {employeesQuery.isLoading ? (
              <div className="cafe-view-value">
                <Spin size="small" />
              </div>
            ) : viewedCafeEmployees.length === 0 ? (
              <Typography.Paragraph className="cafe-view-empty" style={{ marginBottom: 0 }}>
                No employees assigned to this cafe.
              </Typography.Paragraph>
            ) : (
              <div className="cafe-view-employee-list">
                {viewedCafeEmployees.map((employee) => (
                  <div key={employee.id} className="cafe-view-employee-item">
                    <div className="cafe-view-employee-main">
                      <Typography.Text className="cafe-view-employee-name">{employee.name}</Typography.Text>
                      <Typography.Text className="cafe-view-employee-email">{employee.emailAddress}</Typography.Text>
                    </div>
                    <div className="cafe-view-employee-meta">
                      <Tag className="soft-chip">{employee.phoneNumber}</Tag>
                      <Tag className={employee.daysWorked >= 30 ? 'soft-chip chip-positive' : 'soft-chip chip-warning'}>
                        {employee.daysWorked} Days
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cafe-view-section">
            <Typography.Text className="cafe-view-label">Description</Typography.Text>
            <Typography.Paragraph className="cafe-view-description" style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
              {viewedCafe?.description ?? 'No description available.'}
            </Typography.Paragraph>
          </div>
        </div>
      </Modal>
    </Space>
  )
}
