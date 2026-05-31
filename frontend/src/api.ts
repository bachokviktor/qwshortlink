import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Automatically refresh the access token
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("token/refresh/")
    ) {
      // Don't get into a loop
      originalRequest._retry = true

      try {
        await api.post("auth/token/refresh/")

        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
