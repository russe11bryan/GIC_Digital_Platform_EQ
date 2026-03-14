import { SettingOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, Select, Space, Switch, Typography, message } from 'antd'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography

export function SettingsPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async (values: any) => {
    setLoading(true)
    try {
      // Simulate saving settings
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Settings saved:', values)
      message.success('Settings saved successfully')
    } catch (error) {
      message.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="page-header-content">
          <SettingOutlined className="page-icon" />
          <div className="page-title-section">
            <Title level={2} className="page-title">
              Settings
            </Title>
            <Text type="secondary">Manage application preferences and configurations</Text>
          </div>
        </div>
      </div>

      <div className="settings-container">
        {/* Appearance Settings */}
        <Card className="settings-card">
          <Title level={4}>Appearance</Title>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              theme: 'light',
              compactMode: false,
              animationsEnabled: true,
            }}
            onFinish={handleSave}
          >
            <Form.Item label="Theme" name="theme">
              <Select
                options={[
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' },
                  { label: 'Auto', value: 'auto' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Compact Mode" name="compactMode" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Enable Animations" name="animationsEnabled" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Card>

        {/* Notifications Settings */}
        <Card className="settings-card">
          <Title level={4}>Notifications</Title>
          <Form
            layout="vertical"
            initialValues={{
              emailNotifications: true,
              browserNotifications: false,
              dailyDigest: true,
            }}
            onFinish={handleSave}
          >
            <Form.Item label="Email Notifications" name="emailNotifications" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Browser Notifications" name="browserNotifications" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="Daily Digest" name="dailyDigest" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Card>

        {/* Regional Settings */}
        <Card className="settings-card">
          <Title level={4}>Regional</Title>
          <Form
            layout="vertical"
            initialValues={{
              language: 'en',
              timezone: 'UTC',
              dateFormat: 'DD/MM/YYYY',
            }}
            onFinish={handleSave}
          >
            <Form.Item label="Language" name="language">
              <Select
                options={[
                  { label: 'English', value: 'en' },
                  { label: 'Chinese (Simplified)', value: 'zh-cn' },
                  { label: 'Chinese (Traditional)', value: 'zh-tw' },
                  { label: 'Malay', value: 'ms' },
                  { label: 'Tamil', value: 'ta' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Timezone" name="timezone">
              <Select
                options={[
                  { label: 'UTC', value: 'UTC' },
                  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
                  { label: 'Malaysia (MYT)', value: 'Asia/Kuala_Lumpur' },
                  { label: 'Hong Kong (HKT)', value: 'Asia/Hong_Kong' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Date Format" name="dateFormat">
              <Select
                options={[
                  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
                ]}
              />
            </Form.Item>
          </Form>
        </Card>

        {/* Account Settings */}
        <Card className="settings-card">
          <Title level={4}>Account</Title>
          <Form
            layout="vertical"
            initialValues={{
              email: 'admin@cafemanager.com',
              username: 'admin',
            }}
            onFinish={handleSave}
          >
            <Form.Item label="Email" name="email">
              <Input type="email" />
            </Form.Item>

            <Form.Item label="Username" name="username">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Account
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Data Management */}
        <Card className="settings-card">
          <Title level={4}>Data Management</Title>
          <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
            Manage your application data and cache
          </Paragraph>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button danger ghost block>
              Clear Cache
            </Button>
            <Button danger block>
              Export Data
            </Button>
            <Button danger block>
              Reset to Defaults
            </Button>
          </Space>
        </Card>

        {/* About */}
        <Card className="settings-card">
          <Title level={4}>About</Title>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Text strong>Application Version</Text>
              <Paragraph type="secondary">1.0.0</Paragraph>
            </div>
            <div>
              <Text strong>Last Updated</Text>
              <Paragraph type="secondary">March 15, 2026</Paragraph>
            </div>
            <Divider />
            <Paragraph type="secondary" style={{ fontSize: '12px' }}>
              © 2026 CafeManager. All rights reserved.
            </Paragraph>
          </Space>
        </Card>

        {/* Save Button */}
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <Space>
            <Button>Cancel</Button>
            <Button type="primary" loading={loading} onClick={() => form.submit()}>
              Save All Settings
            </Button>
          </Space>
        </div>
      </div>

      <style>{`
        .settings-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .settings-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .settings-card .ant-form-item {
          margin-bottom: 16px;
        }

        .settings-card .ant-form-item:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}
