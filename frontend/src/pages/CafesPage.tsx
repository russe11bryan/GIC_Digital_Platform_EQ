import { PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Input, Modal, Space, Typography } from 'antd'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useMemo, useState } from 'react'
import { CafeFormModal } from '../components/CafeFormModal'
import { useCafes, useCreateCafe, useDeleteCafe, useUpdateCafe } from '../hooks/useCafes'
import type { Cafe, CreateCafePayload, UpdateCafePayload } from '../types/models'

export function CafesPage() {
  const [locationFilter, setLocationFilter] = useState('')
  const [appliedLocationFilter, setAppliedLocationFilter] = useState('')
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const cafesQuery = useCafes(appliedLocationFilter)
  const createCafeMutation = useCreateCafe()
  const updateCafeMutation = useUpdateCafe()
  const deleteCafeMutation = useDeleteCafe()

  const columnDefs = useMemo<ColDef<Cafe>[]>(
    () => [
      { headerName: 'Name', field: 'name', flex: 1 },
      { headerName: 'Description', field: 'description', flex: 1.4 },
      { headerName: 'Employees', field: 'employees', width: 120 },
      { headerName: 'Location', field: 'location', width: 140 },
    ],
    [],
  )

  const handleCreate = async (payload: CreateCafePayload | UpdateCafePayload) => {
    await createCafeMutation.mutateAsync(payload as CreateCafePayload)
    setCreateOpen(false)
  }

  const handleUpdate = async (payload: CreateCafePayload | UpdateCafePayload) => {
    await updateCafeMutation.mutateAsync(payload as UpdateCafePayload)
    setEditOpen(false)
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
        await deleteCafeMutation.mutateAsync(selectedCafe.id)
        setSelectedCafe(null)
      },
    })
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        Cafes
      </Typography.Title>

      <Card>
        <Space wrap>
          <Input
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            style={{ width: 220 }}
          />
          <Button onClick={() => setAppliedLocationFilter(locationFilter.trim())}>Apply Filter</Button>
          <Button onClick={() => {
            setLocationFilter('')
            setAppliedLocationFilter('')
          }}>
            Clear
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

      {cafesQuery.isError && <Alert type="error" message="Failed to load cafes" showIcon />}

      <Card>
        <div className="ag-theme-alpine" style={{ height: 460, width: '100%' }}>
          <AgGridReact<Cafe>
            rowData={cafesQuery.data ?? []}
            columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow' }}
            loading={cafesQuery.isLoading}
            onRowClicked={(event) => setSelectedCafe(event.data ?? null)}
          />
        </div>
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
    </Space>
  )
}
