import axiosPrivateInstance from '@/lib/axios'

export const deleteServiceService = async (id: number) => {
  const res = await axiosPrivateInstance.delete(`/services/${id}`)
  return res.data
}
