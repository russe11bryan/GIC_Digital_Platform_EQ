import { BookOutlined, CustomerServiceOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Space, Typography } from 'antd'

const supportItems = [
  {
    title: 'Getting started',
    description: 'Learn how to manage cafes, assign employees, and keep records up to date.',
    icon: <BookOutlined />,
  },
  {
    title: 'Common questions',
    description: 'Find quick answers to filtering, editing, deleting, and assignment workflows.',
    icon: <QuestionCircleOutlined />,
  },
  {
    title: 'Contact support',
    description: 'Reach the support team if you run into issues with data or account access.',
    icon: <CustomerServiceOutlined />,
  },
]

export function HelpSupportPage() {
  return (
    <Space className="page-wrap" direction="vertical" size={16} style={{ width: '100%' }}>
      <Typography.Title className="page-title" level={3} style={{ margin: 0 }}>
        Help & Support
      </Typography.Title>

      <Card className="detail-card">
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            Use these guides and support options to keep the dashboard running smoothly.
          </Typography.Text>

          <div className="detail-list">
            {supportItems.map((item) => (
              <div className="detail-row" key={item.title}>
                <div className="detail-row-main">
                  <Typography.Text className="detail-row-title">
                    {item.icon} {item.title}
                  </Typography.Text>
                  <Typography.Text className="detail-row-text">{item.description}</Typography.Text>
                </div>
              </div>
            ))}
          </div>

          <div className="detail-actions">
            <Button type="primary">Open documentation</Button>
            <Button>Contact support</Button>
          </div>
        </Space>
      </Card>
    </Space>
  )
}