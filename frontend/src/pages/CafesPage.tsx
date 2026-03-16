import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { App, Alert, Avatar, Button, Card, Empty, Input, Modal, Space, Spin, Tag, Typography } from 'antd'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCafes, useDeleteCafe } from '../hooks/useCafes'
import type { Cafe } from '../types/models'
import { getErrorMessage } from '../utils/getErrorMessage'

export function CafesPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [locationInput, setLocationInput] = useState(searchParams.get('location') ?? '')
  const locationFilter = searchParams.get('location') ?? ''
  const cafesQuery = useCafes(locationFilter)
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
        } catch (error) {
          message.error(getErrorMessage(error))
        }
      },
    })
  }, [deleteCafeMutation, message])

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
                navigate(`/cafes/${data.id}/edit`)
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
    <Space className="page-wrap page-wrap-bottom-table" direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title className="page-title" level={3} style={{ margin: 0 }}>
        Cafes
      </Typography.Title>

      <Card className="toolbar-card">
        <Space className="toolbar" wrap>
          <Input
            className="pill-search"
            prefix={<SearchOutlined />}
            placeholder="Filter by location"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            allowClear
          />
          <Button
            type="primary"
            onClick={() => setSearchParams(locationInput.trim() ? { location: locationInput.trim() } : {})}
          >
            Apply Filter
          </Button>
          <Button onClick={() => {
            setLocationInput('')
            setSearchParams({})
          }}>
            Clear
          </Button>
          <Button onClick={() => void cafesQuery.refetch()} loading={cafesQuery.isFetching && !cafesQuery.isLoading}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/cafes/new')}>
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
            <div className="ag-theme-alpine grid-fill-height" style={{ width: '100%' }}>
              <AgGridReact<Cafe>
                rowData={cafesQuery.data ?? []}
                columnDefs={columnDefs}
                rowHeight={64}
                defaultColDef={{
                  resizable: true,
                }}
                suppressCellFocus
                loading={cafesQuery.isFetching}
              />
            </div>
          </div>
        )}
      </Card>
    </Space>
  )
}
