import axios from 'axios'

/**
 * @param callback axios request
 * @returns {(...args) => Promise<import('axios'.AxiosResponse)>}
 */
export default function withCancelToken (callback) {
  let cancelToken

  return function execute (...args) {
    // eslint-disable-next-line eqeqeq
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel('Opearion was canceled due to new request')
    }
    cancelToken = axios.CancelToken.source()

    return callback(cancelToken.token, ...args).catch((err) => {
      if (!axios.isCancel(err)) { throw err }
    })
  }
}
