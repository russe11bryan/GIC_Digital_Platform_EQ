import { Form, Input, Modal, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
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

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function CafeFormModal({ open, loading, title, initialValues, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm<CafeFormValues>()
  const [logoBase64, setLogoBase64] = useState<string | undefined>()

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        description: initialValues.description,
        location: initialValues.location,
      })
      setLogoBase64(initialValues.logo ?? undefined)
      return
    }

    if (open) {
      form.resetFields()
      setLogoBase64(undefined)
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
      setLogoBase64(base64String)
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
        logo: logoBase64,
      })
      return
    }

    await onSubmit({
      ...values,
      logo: logoBase64,
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
          label="Description"
          name="description"
          rules={[{ required: true }, { max: 256, message: 'Description must be <= 256 characters' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Logo" name="logo">
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
              background: logoBase64 ? '#fafafa' : undefined
            }}>
              {logoBase64 ? (
                <>
                  <img src={logoBase64} alt="Logo preview" style={{ maxWidth: '100%', maxHeight: '120px', marginBottom: '8px' }} />
                  <div style={{ fontSize: '12px', color: '#666' }}>Click to change logo</div>
                </>
              ) : (
                <>
                  <UploadOutlined style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} />
                  <div>Click to upload logo (max 2MB)</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Supported: JPG, PNG, GIF, WebP</div>
                </>
              )}
            </div>
          </Upload>
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
