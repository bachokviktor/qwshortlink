import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Attach Authorization header to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token")

    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Automatically refresh the access token
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      // Don't get into a loop
      originalRequest._retry = true

      try {
	const refreshToken = localStorage.getItem("refresh-token")

	const response = await api.post("token/refresh/", { refresh: refreshToken })
	const token = response.data.access

	localStorage.setItem("access-token", token)
	originalRequest.headers.Authorization = `Bearer ${token}`

	return api(originalRequest)
      } catch (error) {
	localStorage.clear()
      }
    }

    return Promise.reject(error)
  }
)

export default api
