import axiosPrivateInstance from '@/lib/axios'

type Service = {
  id: string
  title: string
  description: string
  price: string
  duration: string
  provider: {
    firstName: string
    lastName: string
  }
}

type Data = {
  services: Array<Service>
}

export const servicesService = async (): Promise<Data> => {
  const res = await axiosPrivateInstance.get('/services')
  return res.data.data
}
