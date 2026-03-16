import { Form, Input } from 'antd'
import type { Rule } from 'antd/es/form'

type Props = {
  label: string
  name: string
  rules?: Rule[]
  placeholder?: string
  rows?: number
}

export function FormTextField({ label, name, rules, placeholder, rows }: Props) {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      {rows ? <Input.TextArea rows={rows} placeholder={placeholder} /> : <Input placeholder={placeholder} />}
    </Form.Item>
  )
}
