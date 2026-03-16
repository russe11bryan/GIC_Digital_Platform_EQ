import { App, Button, Card, Form, Space, Spin, Typography } from 'antd'
import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FormTextField } from '../components/FormTextField'
import { ImageUploadField } from '../components/ImageUploadField'
import { useCafes, useCreateCafe, useUpdateCafe } from '../hooks/useCafes'
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard'
import type { CreateCafePayload, UpdateCafePayload } from '../types/models'
import { getErrorMessage } from '../utils/getErrorMessage'

type CafeFormValues = {
  name: string
  description: string
  location: string
  logo?: string
}

function normalizeValues(values: Partial<CafeFormValues>) {
  return {
    name: values.name ?? '',
    description: values.description ?? '',
    location: values.location ?? '',
    logo: values.logo ?? '',
  }
}

export function CafeFormPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [form] = Form.useForm<CafeFormValues>()
  const cafesQuery = useCafes('')
  const createCafeMutation = useCreateCafe()
  const updateCafeMutation = useUpdateCafe()
  const selectedCafe = useMemo(() => (cafesQuery.data ?? []).find((cafe) => cafe.id === id), [cafesQuery.data, id])
  const watchedValues = Form.useWatch([], form)
  const logoValue = Form.useWatch('logo', form)

  useEffect(() => {
    if (!isEdit) {
      form.setFieldsValue({ name: '', description: '', location: '', logo: undefined })
      return
    }

    if (!selectedCafe) {
      return
    }

    const nextValues = {
      name: selectedCafe.name,
      description: selectedCafe.description,
      location: selectedCafe.location,
      logo: selectedCafe.logo ?? undefined,
    }

    form.setFieldsValue(nextValues)
  }, [form, isEdit, selectedCafe])

  const initialSnapshot = useMemo(
    () =>
      normalizeValues(
        isEdit && selectedCafe
          ? {
              name: selectedCafe.name,
              description: selectedCafe.description,
              location: selectedCafe.location,
              logo: selectedCafe.logo ?? undefined,
            }
          : {},
      ),
    [isEdit, selectedCafe],
  )

  const currentSnapshot = useMemo(
    () =>
      normalizeValues({
        ...watchedValues,
        logo: logoValue,
      }),
    [logoValue, watchedValues],
  )

  const hasUnsavedChanges = JSON.stringify(currentSnapshot) !== JSON.stringify(initialSnapshot)
  const confirmNavigation = useUnsavedChangesGuard(hasUnsavedChanges)

  const handleSubmit = async () => {
    const values = await form.validateFields()

    try {
      if (isEdit && selectedCafe) {
        await updateCafeMutation.mutateAsync({
          id: selectedCafe.id,
          ...values,
          logo: logoValue,
        } as UpdateCafePayload)
        message.success('Cafe updated successfully')
      } else {
        await createCafeMutation.mutateAsync({
          ...values,
          logo: logoValue,
        } as CreateCafePayload)
        message.success('Cafe created successfully')
      }

      navigate('/cafes')
    } catch (error) {
      message.error(getErrorMessage(error))
    }
  }

  if (isEdit && cafesQuery.isLoading) {
    return (
      <div className="page-state">
        <Spin size="large" />
      </div>
    )
  }

  if (isEdit && !selectedCafe) {
    return (
      <Card className="form-page-card">
        <Typography.Title level={4}>Cafe not found</Typography.Title>
        <Button onClick={() => navigate('/cafes')}>Back to Cafes</Button>
      </Card>
    )
  }

  return (
    <Card className="form-page-card">
      <div className="form-page-header">
        <Typography.Title level={3} style={{ margin: 0 }}>
          {isEdit ? 'Edit Cafe' : 'Add Cafe'}
        </Typography.Title>
        <Typography.Text type="secondary">
          {isEdit ? 'Update an existing cafe record.' : 'Create a new cafe record.'}
        </Typography.Text>
      </div>

      <Form form={form} layout="vertical">
        <FormTextField
          label="Name"
          name="name"
          placeholder="Enter cafe name"
          rules={[{ required: true }, { max: 100, message: 'Name must be 100 characters or fewer' }]}
        />

        <FormTextField
          label="Description"
          name="description"
          placeholder="Describe the cafe"
          rows={4}
          rules={[{ required: true }, { max: 256, message: 'Description must be 256 characters or fewer' }]}
        />

        <Form.Item label="Logo" name="logo">
          <ImageUploadField
            value={logoValue}
            emptyText="Upload logo (max 2MB)"
            previewAlt="Cafe logo preview"
            onChange={(value) => {
              form.setFieldValue('logo', value)
            }}
          />
        </Form.Item>

        <FormTextField
          label="Location"
          name="location"
          placeholder="Enter cafe location"
          rules={[{ required: true, message: 'Location is required' }]}
        />

        <Space size={12}>
          <Button type="primary" onClick={() => void handleSubmit()} loading={createCafeMutation.isPending || updateCafeMutation.isPending}>
            Submit
          </Button>
          <Button onClick={() => {
            if (confirmNavigation()) {
              navigate('/cafes')
            }
          }}>Cancel</Button>
        </Space>
      </Form>
    </Card>
  )
}
