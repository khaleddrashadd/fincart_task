import { Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import Header from './Header'
import { useCredential } from '@/store/useCredential'

const MainLayout = () => {
  const { setToken } = useCredential()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setToken(token)
  }, [setToken])

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
export default MainLayout
