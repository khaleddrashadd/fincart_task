import axiosPrivateInstance from '@/lib/axios'

export const editServiceService = async (data: {
  title: string
  price: string
  duration: string
  description: string
  id: number
}) => {
  const res = await axiosPrivateInstance.put(`/services/${data.id}`, data)
  return res.data
}
