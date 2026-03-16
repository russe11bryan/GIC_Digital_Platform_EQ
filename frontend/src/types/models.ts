export type Cafe = {
  id: string
  name: string
  description: string
  employees: number
  logo: string | null
  location: string
}

export type Employee = {
  id: string
  name: string
  emailAddress: string
  phoneNumber: string
  daysWorked: number
  cafe: string | null
  avatar: string | null
}

export type CreateCafePayload = {
  name: string
  description: string
  logo?: string | null
  location: string
}

export type UpdateCafePayload = CreateCafePayload & {
  id: string
}

export type CreateEmployeePayload = {
  name: string
  emailAddress: string
  phoneNumber: string
  gender: 'Male' | 'Female'
  cafeId: string
  avatar?: string | null
}

export type UpdateEmployeePayload = CreateEmployeePayload & {
  id: string
}
