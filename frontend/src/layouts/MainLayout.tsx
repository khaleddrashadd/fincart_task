import { Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCredential } from '@/store/useCredential'

const MainLayout = () => {
  const { setToken } = useCredential()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setToken(token)
  }, [setToken])

  return (
    <div>
      <div>header</div>
      <Outlet />
      <div>footer</div>
    </div>
  )
}
export default MainLayout
