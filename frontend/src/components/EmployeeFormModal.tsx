import { Button, Form, Modal, Radio, Select, Space } from 'antd'
import { useMemo } from 'react'
import { FormTextField } from './FormTextField'
import type { Cafe, CreateEmployeePayload, UpdateEmployeePayload } from '../types/models'

type EmployeeFormValues = {
  name: string
  emailAddress: string
  phoneNumber: string
  gender: 'Male' | 'Female'
  cafeId?: string
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
  const selectedGender = Form.useWatch('gender', form)
  const selectedCafeId = Form.useWatch('cafeId', form)
  const formValues = useMemo(
    () => ({
      name: initialValues?.name ?? '',
      emailAddress: initialValues?.emailAddress ?? '',
      phoneNumber: initialValues?.phoneNumber ?? '',
      gender: initialValues?.gender ?? undefined,
      cafeId: initialValues?.cafeId ?? undefined,
    }),
    [initialValues],
  )

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
      key={initialValues?.id ?? 'create-employee'}
      open={open}
      destroyOnHidden
      title={title}
      onCancel={onCancel}
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          return
        }

        form.resetFields()
        queueMicrotask(() => {
          form.setFieldsValue(formValues)
        })
      }}
      footer={[
        <Space key="footer">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={() => void handleSubmit()} loading={loading}>
            Submit
          </Button>
        </Space>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={formValues} preserve={false}>
        <FormTextField
          label="Name"
          name="name"
          placeholder="Enter employee name"
          rules={[{ required: true }, { min: 6, max: 10, message: 'Name must be 6-10 characters' }]}
        />

        <FormTextField
          label="Email Address"
          name="emailAddress"
          placeholder="name@example.com"
          rules={[{ required: true }, { type: 'email', message: 'Invalid email address' }]}
        />

        <FormTextField
          label="Phone Number"
          name="phoneNumber"
          placeholder="81234567"
          rules={[
            { required: true },
            { len: 8, message: 'Phone number must be exactly 8 digits' },
            { pattern: /^[89]\d{7}$/, message: 'Phone number must start with 8 or 9' },
          ]}
        />

        <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Gender is required' }]}>
          <Radio.Group
            value={selectedGender}
            onChange={(event) => form.setFieldValue('gender', event.target.value)}
          >
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Assigned Cafe" name="cafeId" rules={[{ required: true, message: 'Assigned cafe is required' }]}>
          <Select
            value={selectedCafeId}
            placeholder="Select a cafe"
            options={cafes.map((cafe) => ({ value: cafe.id, label: cafe.name }))}
            showSearch
            optionFilterProp="label"
            onChange={(value) => form.setFieldValue('cafeId', value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
