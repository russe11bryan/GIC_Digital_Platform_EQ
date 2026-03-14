import { MailOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Space, Tag, Typography } from 'antd'

export function AccountPage() {
  return (
    <Space className="page-wrap" direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title className="page-title" level={3} style={{ margin: 0 }}>
        Account
      </Typography.Title>

      <Card className="detail-card">
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <Space size={16} align="center">
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Admin User
              </Typography.Title>
              <Typography.Text type="secondary">System administrator for cafe operations</Typography.Text>
            </div>
          </Space>

          <div className="detail-list">
            <div className="detail-row">
              <div className="detail-row-main">
                <Typography.Text className="detail-row-title">Email</Typography.Text>
                <Typography.Text className="detail-row-text">admin@cafemanager.local</Typography.Text>
              </div>
              <MailOutlined />
            </div>

            <div className="detail-row">
              <div className="detail-row-main">
                <Typography.Text className="detail-row-title">Role</Typography.Text>
                <Typography.Text className="detail-row-text">Full access to cafes, employees, and settings</Typography.Text>
              </div>
              <Tag className="soft-chip chip-positive">Administrator</Tag>
            </div>

            <div className="detail-row">
              <div className="detail-row-main">
                <Typography.Text className="detail-row-title">Security</Typography.Text>
                <Typography.Text className="detail-row-text">Two-factor authentication is recommended for production use</Typography.Text>
              </div>
              <SafetyCertificateOutlined />
            </div>
          </div>

          <div className="detail-actions">
            <Button type="primary">Edit profile</Button>
            <Button>Manage password</Button>
          </div>
        </Space>
      </Card>
    </Space>
  )
}