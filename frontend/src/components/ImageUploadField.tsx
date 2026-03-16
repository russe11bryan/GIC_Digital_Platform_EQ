import { Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

type Props = {
  label: string
  value?: string | null
  emptyText: string
  previewAlt: string
  onChange: (value?: string) => void
}

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function ImageUploadField({ label, value, emptyText, previewAlt, onChange }: Props) {
  const handleFileChange = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      message.error('File size must be less than 2MB')
      return false
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      message.error('Only image files (JPG, PNG, GIF, WebP) are allowed')
      return false
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      onChange(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    return false
  }

  return (
    <div>
      <div className="form-label">{label}</div>
      <Upload maxCount={1} beforeUpload={handleFileChange} accept="image/*" listType="picture" showUploadList={false}>
        <div className="upload-dropzone" role="button" tabIndex={0}>
          {value ? (
            <>
              <img src={value} alt={previewAlt} className="upload-preview" />
              <div className="upload-caption">Click to replace image</div>
            </>
          ) : (
            <>
              <UploadOutlined className="upload-icon" />
              <div>{emptyText}</div>
              <div className="upload-caption">Supported: JPG, PNG, GIF, WebP</div>
            </>
          )}
        </div>
      </Upload>
    </div>
  )
}
