import { Button, Form, Modal, Space } from 'antd'
import { useEffect } from 'react'
import { FormTextField } from './FormTextField'
import { ImageUploadField } from './ImageUploadField'
import type { CreateCafePayload, UpdateCafePayload } from '../types/models'

type CafeFormValues = {
  name: string
  description: string
  logo?: string
  location: string
}

type Props = {
  open: boolean
  loading: boolean
  title: string
  initialValues?: UpdateCafePayload
  onCancel: () => void
  onSubmit: (payload: CreateCafePayload | UpdateCafePayload) => Promise<void>
}

export function CafeFormModal({ open, loading, title, initialValues, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm<CafeFormValues>()
  const logoValue = Form.useWatch('logo', form)

  useEffect(() => {
    if (!open) {
      return
    }

    form.setFieldsValue({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      location: initialValues?.location ?? '',
      logo: initialValues?.logo ?? undefined,
    })
  }, [form, initialValues, open])

  const handleSubmit = async () => {
    const values = await form.validateFields()

    if (initialValues) {
      await onSubmit({
        id: initialValues.id,
        ...values,
      })
      return
    }

    await onSubmit(values)
  }

  return (
    <Modal
      key={initialValues?.id ?? 'create-cafe'}
      open={open}
      destroyOnHidden
      title={title}
      onCancel={onCancel}
      footer={[
        <Space key="footer">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={() => void handleSubmit()} loading={loading}>
            Submit
          </Button>
        </Space>,
      ]}
    >
      <Form form={form} layout="vertical">
        <FormTextField
          label="Name"
          name="name"
          placeholder="Enter cafe name"
          rules={[{ required: true }, { min: 6, max: 10, message: 'Name must be 6-10 characters' }]}
        />

        <FormTextField
          label="Description"
          name="description"
          placeholder="Describe the cafe"
          rows={4}
          rules={[{ required: true }, { max: 256, message: 'Description must be 256 characters or fewer' }]}
        />

        <ImageUploadField
          label="Logo"
          value={logoValue}
          emptyText="Upload logo (max 2MB)"
          previewAlt="Cafe logo preview"
          onChange={(value) => form.setFieldValue('logo', value)}
        />

        <FormTextField
          label="Location"
          name="location"
          placeholder="Enter cafe location"
          rules={[{ required: true, message: 'Location is required' }]}
        />
      </Form>
    </Modal>
  )
}
