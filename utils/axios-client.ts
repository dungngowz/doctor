import axios from 'axios'
import { getCookie } from 'cookies-next'
import queryString from 'query-string'

// Get access token
const ISSERVER = typeof window === 'undefined'
let accessToken = getCookie('erpAccessToken')

if (!ISSERVER) {
  if (!accessToken) {
    accessToken = sessionStorage.getItem('erpAccessToken')
  }
}

/* Creating a new axios client with the baseURL, headers, and paramsSerializer. */
export const axiosClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken,
  },
  paramsSerializer: (params) => queryString.stringify(params),
})

/* Intercepting the response and returning the data. */
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

//////////////////////////////////////////////////////////////////////////////////////////////////////

/* Creating a new axios client with the baseURL, headers, and paramsSerializer. */
export const axiosClientFormData = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: 'Bearer ' + accessToken,
  },
  paramsSerializer: (params) => queryString.stringify(params),
})

/* Intercepting the response and returning the data. */
axiosClientFormData.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
