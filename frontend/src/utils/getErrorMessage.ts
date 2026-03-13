import axios from 'axios'

type ValidationError = {
  field: string
  message: string
}

type ErrorResponse = {
  message?: string
  errors?: ValidationError[]
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const apiMessage = error.response?.data?.message
    const validationErrors = error.response?.data?.errors

    if (validationErrors && validationErrors.length > 0) {
      return validationErrors.map((item) => `${item.field}: ${item.message}`).join(', ')
    }

    if (apiMessage) {
      return apiMessage
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}