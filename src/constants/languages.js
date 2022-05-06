export const LANGS = {
  ENGLISH: {
    code: 'en',
    name: 'English'
  },
  SPANISH: {
    code: 'sp',
    name: 'Spanish'
  },
  FRENCH: {
    code: 'fr',
    name: 'French'
  }
}

const _LANGUAGES_CODE_MAP = {}
const _LANGUAGES_MAP = {}

for (const key in LANGS) {
  _LANGUAGES_CODE_MAP[LANGS[key].code] = LANGS[key].name
  _LANGUAGES_MAP[LANGS[key].name] = LANGS[key].code
}

export const getLangCodeForName = (name) => {
  return _LANGUAGES_MAP[name]
}

export const getLangNameForCode = (code) => {
  return _LANGUAGES_CODE_MAP[code]
}
