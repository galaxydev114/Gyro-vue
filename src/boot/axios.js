import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_SERVER_BASE_URL
})
export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance
}
export { axiosInstance }
