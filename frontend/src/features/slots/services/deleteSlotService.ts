import axiosPrivateInstance from '@/lib/axios'

export const deleteSlotService = async (id: number) => {
  const res = await axiosPrivateInstance.delete(`/slots/${id}`)
  return res.data
}
