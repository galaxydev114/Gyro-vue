import * as api from '@/services/api'

export async function validateAccessCode ({ commit }, accessCode) {
  const accessCodeObject = (await api.validateAccessCode(accessCode))?.data
  if (accessCodeObject?.isAccessCodeValid) {
    commit('setAccessCode', accessCodeObject.code)
    commit('setAccessCodeRole', accessCodeObject.role)
    commit('setAccessCodeValid', true)
    return accessCodeObject.isAccessCodeValid
  }
  return false
}

export async function attachAccessCode ({ commit, dispatch }, { accessCode, userId }) {
  const accessCodeVaildated = await dispatch('validateAccessCode', accessCode)
  if (accessCodeVaildated) {
    await api.attachAccessCode(accessCode, { userId })
  } else {
    throw new Error(`attachAccessCode: failed to attach: ${accessCode} user${userId}`)
  }
  return accessCodeVaildated
}

export async function fetchAccessCodes ({ commit }, secret) {
  const accessCodes = (await api.fetchAccessCodes(secret))?.data?.accessCodes
  commit('setAccessCodes', accessCodes)
  return accessCodes
}

export async function createAccessCode ({ commit }, accessCode) {
  const resposne = await api.createAccessCode(accessCode)

  const newAccessCode = resposne.data?.accessCode
  return newAccessCode
}

export async function updateAccessCode ({ commit }, { id, data }) {
  await api.updateAccessCode(id, data)
}
