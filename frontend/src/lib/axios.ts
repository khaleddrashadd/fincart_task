import axios from 'axios'
import { router } from './tanstackRouter'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
})

const axiosPrivateInstance = axios.create({
  baseURL,
  withCredentials: true,
})
axiosPrivateInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosPrivateInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { response } = error
    if (response && response.status === 401) {
      router.navigate({
        to: '/login',
        replace: true,
      })
    }
    return Promise.reject(error)
  },
)

export default axiosPrivateInstance
