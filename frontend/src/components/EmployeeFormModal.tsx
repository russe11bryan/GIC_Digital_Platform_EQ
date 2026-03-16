import { Form, Input, Modal, Select, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
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

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function EmployeeFormModal({ cafes, open, loading, title, initialValues, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm<EmployeeFormValues>()
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>()

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        emailAddress: initialValues.emailAddress,
        phoneNumber: initialValues.phoneNumber,
        gender: initialValues.gender,
        cafeId: initialValues.cafeId,
      })
      setAvatarBase64(initialValues.avatar ?? undefined)
      return
    }

    if (open) {
      form.resetFields()
      setAvatarBase64(undefined)
    }
  }, [form, initialValues, open])

  const handleFileChange = async (file: File) => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      message.error('File size must be less than 2MB')
      return false
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      message.error('Only image files (JPG, PNG, GIF, WebP) are allowed')
      return false
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      setAvatarBase64(base64String)
    }
    reader.readAsDataURL(file)

    return false // Prevent automatic upload
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    if (initialValues) {
      await onSubmit({
        id: initialValues.id,
        ...values,
        avatar: avatarBase64,
      })
      return
    }

    await onSubmit({
      ...values,
      avatar: avatarBase64,
    })
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

        <Form.Item label="Avatar" name="avatar">
          <Upload
            maxCount={1}
            beforeUpload={handleFileChange}
            accept="image/*"
            listType="picture"
            showUploadList={false}
          >
            <div style={{ 
              padding: '16px', 
              border: '1px dashed #d9d9d9', 
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'center',
              background: avatarBase64 ? '#fafafa' : undefined
            }}>
              {avatarBase64 ? (
                <>
                  <img src={avatarBase64} alt="Avatar preview" style={{ maxWidth: '100%', maxHeight: '120px', marginBottom: '8px' }} />
                  <div style={{ fontSize: '12px', color: '#666' }}>Click to change avatar</div>
                </>
              ) : (
                <>
                  <UploadOutlined style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
                  <div>Click to upload avatar (max 2MB)</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Supported: JPG, PNG, GIF, WebP</div>
                </>
              )}
            </div>
          </Upload>
        </Form.Item>

        <Form.Item 
          label="Cafe" 
          name="cafeId" 
          rules={initialValues ? [] : [{ required: true }]}
          tooltip={initialValues ? "Leave empty to unassign from cafe" : ""}
        >
          <Select
            allowClear
            placeholder="Select a cafe or leave empty to unassign"
            options={cafes.map((cafe) => ({ value: cafe.id, label: cafe.name }))}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
