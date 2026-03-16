import { App, Button, Card, Form, Radio, Select, Space, Spin, Typography } from 'antd'
import { useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FormTextField } from '../components/FormTextField'
import { useCafes } from '../hooks/useCafes'
import { useCreateEmployee, useEmployees, useUpdateEmployee } from '../hooks/useEmployees'
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard'
import type { CreateEmployeePayload, UpdateEmployeePayload } from '../types/models'
import { getErrorMessage } from '../utils/getErrorMessage'

type EmployeeFormValues = {
  name: string
  emailAddress: string
  phoneNumber: string
  gender: 'Male' | 'Female'
  cafeId?: string
}

function normalizeValues(values: Partial<EmployeeFormValues>) {
  return {
    name: values.name ?? '',
    emailAddress: values.emailAddress ?? '',
    phoneNumber: values.phoneNumber ?? '',
    gender: values.gender ?? '',
    cafeId: values.cafeId ?? '',
  }
}

export function EmployeeFormPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isEdit = Boolean(id)
  const [form] = Form.useForm<EmployeeFormValues>()
  const employeesQuery = useEmployees('')
  const cafesQuery = useCafes('')
  const createEmployeeMutation = useCreateEmployee()
  const updateEmployeeMutation = useUpdateEmployee()
  const selectedEmployee = useMemo(
    () => (employeesQuery.data ?? []).find((employee) => employee.id === id),
    [employeesQuery.data, id],
  )
  const watchedValues = Form.useWatch([], form)

  useEffect(() => {
    if (!isEdit) {
      const preselectedCafe = searchParams.get('cafeId') ?? undefined
      form.setFieldsValue({
        name: '',
        emailAddress: '',
        phoneNumber: '',
        gender: undefined,
        cafeId: preselectedCafe,
      })
      return
    }

    if (!selectedEmployee) {
      return
    }

    const nextValues = {
      name: selectedEmployee.name,
      emailAddress: selectedEmployee.emailAddress,
      phoneNumber: selectedEmployee.phoneNumber,
      gender: selectedEmployee.gender,
      cafeId: selectedEmployee.cafeId ?? undefined,
    }

    form.setFieldsValue(nextValues)
  }, [form, isEdit, searchParams, selectedEmployee])

  const initialSnapshot = useMemo(
    () =>
      normalizeValues(
        isEdit && selectedEmployee
          ? {
              name: selectedEmployee.name,
              emailAddress: selectedEmployee.emailAddress,
              phoneNumber: selectedEmployee.phoneNumber,
              gender: selectedEmployee.gender,
              cafeId: selectedEmployee.cafeId ?? undefined,
            }
          : {
              cafeId: searchParams.get('cafeId') ?? undefined,
            },
      ),
    [isEdit, searchParams, selectedEmployee],
  )

  const currentSnapshot = useMemo(
    () =>
      normalizeValues({
        ...watchedValues,
      }),
    [watchedValues],
  )

  const hasUnsavedChanges = JSON.stringify(currentSnapshot) !== JSON.stringify(initialSnapshot)
  useUnsavedChangesGuard(hasUnsavedChanges)

  const handleSubmit = async () => {
    const values = await form.validateFields()

    try {
      if (isEdit && selectedEmployee) {
        await updateEmployeeMutation.mutateAsync({
          id: selectedEmployee.id,
          ...values,
          cafeId: values.cafeId,
        } as UpdateEmployeePayload)
        message.success('Employee updated successfully')
      } else {
        await createEmployeeMutation.mutateAsync({
          ...values,
          cafeId: values.cafeId,
        } as CreateEmployeePayload)
        message.success('Employee created successfully')
      }

      navigate('/employees')
    } catch (error) {
      message.error(getErrorMessage(error))
    }
  }

  if (isEdit && (employeesQuery.isLoading || cafesQuery.isLoading)) {
    return (
      <div className="page-state">
        <Spin size="large" />
      </div>
    )
  }

  if (isEdit && !selectedEmployee) {
    return (
      <Card className="form-page-card">
        <Typography.Title level={4}>Employee not found</Typography.Title>
        <Button onClick={() => navigate('/employees')}>Back to Employees</Button>
      </Card>
    )
  }

  return (
    <Card className="form-page-card">
      <div className="form-page-header">
        <Typography.Title level={3} style={{ margin: 0 }}>
          {isEdit ? 'Edit Employee' : 'Add Employee'}
        </Typography.Title>
        <Typography.Text type="secondary">
          {isEdit ? 'Update an existing employee record.' : 'Create a new employee record.'}
        </Typography.Text>
      </div>

      <Form form={form} layout="vertical">
        <FormTextField
          label="Name"
          name="name"
          placeholder="Enter employee name"
          rules={[{ required: true }, { min: 6, max: 10, message: 'Name must be 6-10 characters' }]}
        />

        <FormTextField
          label="Email Address"
          name="emailAddress"
          placeholder="name@example.com"
          rules={[{ required: true }, { type: 'email', message: 'Invalid email address' }]}
        />

        <FormTextField
          label="Phone Number"
          name="phoneNumber"
          placeholder="81234567"
          rules={[
            { required: true },
            { len: 8, message: 'Phone number must be exactly 8 digits' },
            { pattern: /^[89]\d{7}$/, message: 'Phone number must start with 8 or 9' },
          ]}
        />

        <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Gender is required' }]}>
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Assigned Cafe" name="cafeId" rules={[{ required: true, message: 'Assigned cafe is required' }]}>
          <Select
            placeholder="Select a cafe"
            options={(cafesQuery.data ?? []).map((cafe) => ({ value: cafe.id, label: cafe.name }))}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Space size={12}>
          <Button
            type="primary"
            onClick={() => void handleSubmit()}
            loading={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
          >
            Submit
          </Button>
          <Button onClick={() => navigate('/employees')}>Cancel</Button>
        </Space>
      </Form>
    </Card>
  )
}
