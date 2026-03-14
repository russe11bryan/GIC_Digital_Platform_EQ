import { Form, Input, Modal, Select } from 'antd'
import { useEffect } from 'react'
import type { Cafe, CreateEmployeePayload, UpdateEmployeePayload } from '../types/models'

type EmployeeFormValues = {
  name: string
  emailAddress: string
  phoneNumber: string
  gender: 'Male' | 'Female'
  cafeId: string
}

type Props = {
  cafes: Cafe[]
  open: boolean
  loading: boolean
  title: string
  initialValues?: UpdateEmployeePayload
  onCancel: () => void
  onSubmit: (payload: CreateEmployeePayload | UpdateEmployeePayload) => Promise<void>
}

export function EmployeeFormModal({ cafes, open, loading, title, initialValues, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm<EmployeeFormValues>()

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        emailAddress: initialValues.emailAddress,
        phoneNumber: initialValues.phoneNumber,
        gender: initialValues.gender,
        cafeId: initialValues.cafeId,
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
          label="Email"
          name="emailAddress"
          rules={[{ required: true }, { type: 'email', message: 'Invalid email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phoneNumber"
          rules={[
            { required: true },
            { len: 8, message: 'Phone must be 8 digits' },
            { pattern: /^[89]\d{7}$/, message: 'Must start with 8 or 9' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
          <Select options={[{ value: 'Male' }, { value: 'Female' }]} />
        </Form.Item>

        <Form.Item label="Cafe" name="cafeId" rules={[{ required: true }]}>
          <Select
            options={cafes.map((cafe) => ({ value: cafe.id, label: cafe.name }))}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
