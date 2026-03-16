import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { App, Alert, Avatar, Button, Card, Empty, Input, Modal, Space, Spin, Tag, Typography } from 'antd'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CafeFormModal } from '../components/CafeFormModal'
import { useCafes, useCreateCafe, useDeleteCafe, useUpdateCafe } from '../hooks/useCafes'
import type { Cafe, CreateCafePayload, UpdateCafePayload } from '../types/models'
import { getErrorMessage } from '../utils/getErrorMessage'

export function CafesPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const cafesQuery = useCafes('')
  const createCafeMutation = useCreateCafe()
  const updateCafeMutation = useUpdateCafe()
  const deleteCafeMutation = useDeleteCafe()

  const confirmDeleteCafe = useCallback((cafe: Cafe) => {
    Modal.confirm({
      title: 'Delete cafe',
      content: `Delete ${cafe.name} and all employees assigned to it?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteCafeMutation.mutateAsync(cafe.id)
          message.success('Cafe deleted successfully')
          setSelectedCafe((current) => (current?.id === cafe.id ? null : current))
          setEditingCafe((current) => (current?.id === cafe.id ? null : current))
        } catch (error) {
          message.error(getErrorMessage(error))
        }
      },
    })
  }, [deleteCafeMutation, message])

  const filteredCafes = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) {
      return cafesQuery.data ?? []
    }

    return (cafesQuery.data ?? []).filter(
      (cafe) =>
        cafe.name.toLowerCase().includes(term) ||
        cafe.description.toLowerCase().includes(term) ||
        cafe.location.toLowerCase().includes(term),
    )
  }, [cafesQuery.data, search])

  const columnDefs = useMemo<ColDef<Cafe>[]>(
    () => [
      {
        headerName: 'Logo',
        field: 'logo',
        width: 110,
        sortable: false,
        cellRenderer: ({ data }: { data?: Cafe }) =>
          data ? (
            <Avatar src={data.logo ?? undefined} size={36}>
              {data.name.slice(0, 1).toUpperCase()}
            </Avatar>
          ) : null,
      },
      {
        headerName: 'Name',
        field: 'name',
        minWidth: 160,
        flex: 0.9,
        sortable: true,
      },
      {
        headerName: 'Description',
        field: 'description',
        minWidth: 260,
        flex: 1.3,
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
        width: 150,
        sortable: true,
        cellRenderer: ({ data, value }: { data?: Cafe; value?: number }) =>
          data ? (
            <Button type="link" className="grid-link-button" onClick={() => navigate(`/employees?cafe=${encodeURIComponent(data.name)}`)}>
              {value ?? 0}
            </Button>
          ) : null,
      },
      {
        headerName: 'Location',
        field: 'location',
        width: 180,
        sortable: true,
        cellRenderer: ({ value }: { value?: string }) => <Tag className="soft-chip chip-neutral">{value}</Tag>,
      },
      {
        headerName: 'Actions',
        field: 'id',
        width: 180,
        sortable: false,
        cellRendererParams: {
          suppressMouseEventHandling: () => true,
        },
        cellRenderer: ({ data }: { data?: Cafe }) => (
          data ? (
            <Space size={8}>
              <Button size="small" onClick={(event) => {
                event.stopPropagation()
                setSelectedCafe(data)
                setEditingCafe(data)
                setEditOpen(true)
              }}>
                Edit
              </Button>
              <Button size="small" danger onClick={(event) => {
                event.stopPropagation()
                confirmDeleteCafe(data)
              }}>
                Delete
              </Button>
            </Space>
          ) : null
        ),
      },
    ],
    [confirmDeleteCafe, navigate],
  )

  return (
    <Space className="page-wrap" direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title className="page-title" level={3} style={{ margin: 0 }}>
        Cafes
      </Typography.Title>

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
          <Button disabled={!selectedCafe} onClick={() => {
            setEditingCafe(selectedCafe)
            setEditOpen(true)
          }}>
            Edit Selected
          </Button>
          <Button danger disabled={!selectedCafe} onClick={() => {
            if (!selectedCafe) {
              return
            }

            confirmDeleteCafe(selectedCafe)
          }}>
            Delete Selected
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Add New Cafe
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
                rowHeight={64}
                defaultColDef={{
                  resizable: true,
                }}
                rowSelection="single"
                suppressCellFocus
                loading={cafesQuery.isFetching}
                onRowClicked={(event) => {
                  const clickedCafe = event.data ?? null
                  setSelectedCafe((previousCafe) => {
                    if (previousCafe?.id === clickedCafe?.id) {
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
        title="Add New Cafe"
        onCancel={() => setCreateOpen(false)}
        onSubmit={async (payload: CreateCafePayload | UpdateCafePayload) => {
          try {
            await createCafeMutation.mutateAsync(payload as CreateCafePayload)
            message.success('Cafe created successfully')
            setCreateOpen(false)
          } catch (error) {
            message.error(getErrorMessage(error))
          }
        }}
      />

      <CafeFormModal
        open={editOpen}
        loading={updateCafeMutation.isPending}
        title="Edit Cafe"
        initialValues={
          editingCafe
            ? {
                id: editingCafe.id,
                name: editingCafe.name,
                description: editingCafe.description,
                logo: editingCafe.logo,
                location: editingCafe.location,
              }
            : undefined
        }
        onCancel={() => {
          setEditOpen(false)
          setEditingCafe(null)
        }}
        onSubmit={async (payload: CreateCafePayload | UpdateCafePayload) => {
          try {
            await updateCafeMutation.mutateAsync(payload as UpdateCafePayload)
            message.success('Cafe updated successfully')
            setEditOpen(false)
            setEditingCafe(null)
          } catch (error) {
            message.error(getErrorMessage(error))
          }
        }}
      />
    </Space>
  )
}
