import { useState, useCallback } from 'react'

let id = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'success') => {
    const tid = ++id
    setToasts(prev => [...prev, { id: tid, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== tid))
    }, 2500)
  }, [])

  return { toasts, show }
}
