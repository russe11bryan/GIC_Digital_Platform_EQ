import { BellOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Card, Space, Tag, Typography } from 'antd'

const notifications = [
  {
    title: 'New employee assigned',
    description: 'Emma Tan has been assigned to Marina Cafe and starts on Monday.',
    status: 'New',
    icon: <BellOutlined />,
  },
  {
    title: 'Cafe profile updated',
    description: 'Central Brew updated its location details and logo.',
    status: 'Info',
    icon: <InfoCircleOutlined />,
  },
  {
    title: 'Validation reminder',
    description: 'Two employee profiles are missing complete phone number details.',
    status: 'Action Needed',
    icon: <WarningOutlined />,
  },
]

export function NotificationsPage() {
  return (
    <Space className="page-wrap" direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title className="page-title" level={3} style={{ margin: 0 }}>
        Notifications
      </Typography.Title>

      <Card className="detail-card">
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            Stay up to date with assignments, profile changes, and items that need attention.
          </Typography.Text>

          <div className="detail-list">
            {notifications.map((item) => (
              <div className="detail-row" key={item.title}>
                <div className="detail-row-main">
                  <Typography.Text className="detail-row-title">
                    {item.icon} {item.title}
                  </Typography.Text>
                  <Typography.Text className="detail-row-text">{item.description}</Typography.Text>
                </div>
                <Tag className={item.status === 'Action Needed' ? 'soft-chip chip-warning' : 'soft-chip chip-neutral'}>
                  {item.status}
                </Tag>
              </div>
            ))}
          </div>

          <div className="detail-actions">
            <Button type="primary" icon={<CheckCircleOutlined />}>
              Mark all as read
            </Button>
            <Button>Notification settings</Button>
          </div>
        </Space>
      </Card>
    </Space>
  )
}