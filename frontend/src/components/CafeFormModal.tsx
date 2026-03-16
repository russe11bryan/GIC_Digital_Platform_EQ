import { Button, Form, Modal, Space, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { FormTextField } from './FormTextField'
import type { CreateCafePayload, UpdateCafePayload } from '../types/models'

type CafeFormValues = {
  name: string
  description: string
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
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name ?? '',
          description: initialValues.description ?? '',
          location: initialValues.location ?? '',
        })
        // Use a microtask to set state after form update
        Promise.resolve().then(() => {
          setLogoBase64(initialValues.logo ?? undefined)
        })
      } else {
        form.resetFields()
        Promise.resolve().then(() => {
          setLogoBase64(undefined)
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues?.id])

  const handleFileChange = (file: File) => {
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

  const handleSubmit = async () => {
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
          rules={[{ required: true }, { max: 100, message: 'Name must be 100 characters or fewer' }]}
        />

        <FormTextField
          label="Description"
          name="description"
          placeholder="Describe the cafe"
          rows={4}
          rules={[{ required: true }, { max: 256, message: 'Description must be 256 characters or fewer' }]}
        />

        <Form.Item label="Logo">
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
