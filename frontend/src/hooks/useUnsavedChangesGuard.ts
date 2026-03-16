import { useCallback } from 'react'
import { useBeforeUnload } from 'react-router-dom'

export function useUnsavedChangesGuard(hasUnsavedChanges: boolean) {
  useBeforeUnload((event) => {
    if (!hasUnsavedChanges) {
      return
    }

    event.preventDefault()
    event.returnValue = ''
  })

  return useCallback(() => {
    if (!hasUnsavedChanges) {
      return true
    }

    return window.confirm('You have unsaved changes. Leave this page?')
  }, [hasUnsavedChanges])
}
