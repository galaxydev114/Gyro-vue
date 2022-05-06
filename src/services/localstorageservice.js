export function setLocalstorage (name, token) {
  localStorage.setItem(name, token)
}

export function getLocalstorage (name) {
  return localStorage.getItem(name)
}

export function removeLocalstorage (name) {
  return localStorage.removeItem(name)
}

// TODO: store token only in http cookies
export function setUserToken (tokenObj) {
  localStorage.setItem('userToken', tokenObj.access.token)
  localStorage.setItem('refreshToken', tokenObj.refresh.token)
}

export function getAccessToken () {
  const tokenSession = sessionStorage.getItem('userToken')
  const tokenLocal = localStorage.getItem('userToken')
  return tokenSession || tokenLocal
}

export function getRefreshToken () {
  return localStorage.getItem('refreshToken')
}

export function clearToken () {
  localStorage.removeItem('userToken')
  localStorage.removeItem('refreshToken')
}

export function pushLoginReferrer (routerTarget) {
  localStorage.setItem('loginReferrer', JSON.stringify(routerTarget))
}

export function popLoginReferrer () {
  const ref = localStorage.getItem('loginReferrer')
  localStorage.removeItem('loginReferrer')
  if (ref) {
    return JSON.parse(ref)
  } else {
    return null
  }
}
