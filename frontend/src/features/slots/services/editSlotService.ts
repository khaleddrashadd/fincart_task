import axiosPrivateInstance from '@/lib/axios'

export const editSlotService = async (data: {
  title: string
  price: string
  duration: string
  description: string
  id: number
}) => {
  const res = await axiosPrivateInstance.put(`/slots/${data.id}`, data)
  return res.data
}
