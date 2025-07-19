import axiosPrivateInstance from '@/lib/axios'

export const addSlot = async (data: {
  title: string
  price: string
  duration: string
  description: string
}) => {
  const res = await axiosPrivateInstance.post('/slots', data)
  return res.data
}
