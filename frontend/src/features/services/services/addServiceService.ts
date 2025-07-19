import axiosPrivateInstance from '@/lib/axios'

export const addService = async (data: {
  title: string
  price: string
  duration: string
  description: string
}) => {
  const res = await axiosPrivateInstance.post('/services', data)
  return res.data
}
