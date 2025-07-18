import { axiosInstance } from '@/lib/axios'

type Body = {
  email: string
  password: string
  confirmPassword: string
  role: string
  firstName: string
  lastName: string
}
export const registerService = async (data: Body) => {
  const res = await axiosInstance.post('/register', {
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    role: data.role,
    firstName: data.firstName,
    lastName: data.lastName,
  })
  return res.data.data
}
