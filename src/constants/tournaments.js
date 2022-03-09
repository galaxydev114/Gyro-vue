const tournaments = {
  platforms: [
    { values: ['Windows'], label: 'Desktop', value: 'desktop' },
    { values: ['Android'], label: 'Mobile', value: 'mobile' },
    { values: ['PS5', 'PS4'], label: 'PS', value: 'ps' },
    { values: ['XSX', 'XboxOneGDK', 'XboxOne'], label: 'Xbox', value: 'xbox' },
    { values: ['Switch'], label: 'Switch', value: 'nintendo' }
  ],
  regions: [
    'EU',
    'NAE',
    'BR',
    'NAW',
    'ASIA',
    'ME',
    'OCE'
  ],
  // Must be the same as on server side
  algorithmTypes: [
    'SOLO_CASH_CUP',
    'DUO_CASH_CUP',
    'TRIO_CASH_CUP',
    'BRAGGING_RIGHT',
    'FNCS',
    'DEFAULT'
  ]
}

export default tournaments
