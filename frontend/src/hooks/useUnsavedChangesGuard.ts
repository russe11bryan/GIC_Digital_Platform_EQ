import { useEffect } from 'react'
import { useBeforeUnload, useBlocker } from 'react-router-dom'

export function useUnsavedChangesGuard(hasUnsavedChanges: boolean) {
  const blocker = useBlocker(hasUnsavedChanges)

  useBeforeUnload((event) => {
    if (!hasUnsavedChanges) {
      return
    }

    event.preventDefault()
    event.returnValue = ''
  })

  useEffect(() => {
    if (blocker.state !== 'blocked') {
      return
    }

    if (window.confirm('You have unsaved changes. Leave this page?')) {
      blocker.proceed()
      return
    }

    blocker.reset()
  }, [blocker])
}
