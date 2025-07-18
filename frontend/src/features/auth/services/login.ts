import { axiosInstance } from '@/lib/axios'

type Body = {
  email: string
  password: string
}
export const loginService = async (data: Body) => {
  const res = await axiosInstance.post('/login', {
    email: data.email,
    password: data.password,
  })
  return res.data.data
}
