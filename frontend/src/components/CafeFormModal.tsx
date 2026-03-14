import { Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
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

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        description: initialValues.description,
        logo: initialValues.logo ?? undefined,
        location: initialValues.location,
      })
      return
    }

    if (open) {
      form.resetFields()
    }
  }, [form, initialValues, open])

  const handleOk = async () => {
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
    <Modal open={open} title={title} onCancel={onCancel} onOk={handleOk} confirmLoading={loading}>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true }, { min: 6, max: 50, message: 'Name must be 6-50 characters' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }, { max: 256, message: 'Description must be <= 256 characters' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Logo URL" name="logo">
          <Input />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
