import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://search-api.tracker.network'
})

export const getUserNames = (prefix = '') => axiosClient.get('/search/fortnite', {
  params: {
    advanced: 1,
    q: prefix
  }
})
