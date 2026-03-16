import { useId, useRef, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'

type Props = {
  value?: string | null
  emptyText: string
  previewAlt: string
  onChange: (value?: string) => void
}

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function ImageUploadField({ value, emptyText, previewAlt, onChange }: Props) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError('Image is too large. Please choose a file smaller than 2MB.')
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, GIF, and WebP images are allowed.')
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = (event) => {
      onChange(event.target?.result as string)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="sr-only-input"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            handleFileChange(file)
          }
        }}
      />
      <div
        className="upload-dropzone"
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
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
      {error ? <div className="upload-error">{error}</div> : null}
    </div>
  )
}
