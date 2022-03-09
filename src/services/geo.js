import { getLocalstorage, setLocalstorage, removeLocalstorage } from '@/services/localstorageservice'

export default {

  regions: {
    eu: ['italy', 'germany'],
    oce: ['australia'],
    naw: ['canada'],
    nae: ['usa'],
    br: [],
    asia: [],
    me: []
  },

  get userCountry () {
    return getLocalstorage('userCountry')
  },

  get userRegion () {
    return getLocalstorage('userRegion')
  },

  async fetchUserCountry () {
    const response = await fetch('https://extreme-ip-lookup.com/json/')
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`
      throw new Error(message)
    }

    const res = await response.json()
    setLocalstorage('userCountry', res.country)
    return true
  },

  setUserRegion (overrideRegion) {
    let region = 'eu'
    if (!overrideRegion) {
      const country = this.userCountry
      Object.keys(this.regions).forEach((regionKey) => {
        if (this.regions[regionKey].includes(country.toLowerCase())) {
          region = regionKey
        }
      })
    } else {
      if (this.regions[overrideRegion.toLowerCase()]) {
        region = overrideRegion.toLowerCase()
      } else {
        region = 'eu'
      }
    }
    setLocalstorage('userRegion', region)
  },

  async init () {
    if (!this.userRegion) {
      await this.fetchUserCountry()
      this.setUserRegion()
    }
  },

  clear () {
    removeLocalstorage('userCountry')
    removeLocalstorage('userRegion')
  }
}
