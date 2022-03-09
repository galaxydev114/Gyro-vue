import { Store } from 'vuex'

export default {
  title: 'Tournament'
}

export const TournamentSingle = () => ({
  title: 'TournamentSingle',
  components: {
    'tournament-item': () => import('@/components/tournaments/days-list/tournament')
  },
  computed: {
    item () {
      return {
        eventId: 'epicgames_S17_CashCupExtraDH_EU',
        eventWindowId: 'S17_CashCupExtraDH_EU_Event3',
        date: '2021-08-25T17:00:00.000Z',
        title: 'Cash Cup Extra Presented by Dreamhack',
        location: [
          'EU'
        ],
        type: 'UPCOMING',
        image: 'https://cdn2.unrealengine.com/16br-comp-in-game-cashcupextra-poster-front-750x1080-8553c0c3bbe4.jpg',
        platforms: [
          'XboxOneGDK',
          'PS4',
          'XboxOne',
          'XSX',
          'Android',
          'PS5',
          'Switch',
          'Windows'
        ],
        requirements: []
      }
    }
  },
  template: `
    <div>
    <div class="row q-pa-lg">
      <div class="col-12 q-mb-lg">
        <tournament-item :image="item.image"
                         :title="item.title"
                         :date="item.date"
                         :location="item.location"
                         :requirements="item.requirements"
                         :platforms="item.platforms"
                         :type="item.type"
        />
      </div>
      <div class="col-12">
        <tournament-item :image="item.image"
                         :title="item.title"
                         :date="item.date"
                         :location="item.location"
                         :requirements="item.requirements"
                         :platforms="item.platforms"
                         :type="item.type"
                         small
        />
      </div>
    </div>
    </div>`
})

export const TournamentFilter = () => ({
  title: 'TournamentFilter',
  components: {
    'tournament-filter': () => import('@/components/tournaments/days-list/filter')
  },
  computed: {
    regions () {
      return ['UA', 'EU', 'USA']
    }
  },
  template: `
    <div>
    <div class="row q-pa-lg">
      <div class="col-12 q-mb-lg">
        <tournament-filter :options="regions"/>
      </div>
    </div>
    </div>`,
  store: new Store({
    modules: {
      tournaments: {
        state: {
          filters: {
            typeSelected: 'ALL'
          }
        },
        mutations: {
          setFilterSelect () {}
        }
      }
    }
  })
})

export const TournamentAdd = () => ({
  title: 'TournamentAdd',
  components: {
    'tournament-add': () => import('@/components/tournaments/days-list/add')
  },
  template: `
    <div>
    <div class="row q-pa-lg">
      <div class="col-12 q-mb-lg">
        <tournament-add/>
      </div>
    </div>
    </div>`
})

export const TournamentEmpty = () => ({
  title: 'TournamentEmpty',
  components: {
    'tournament-empty-list': () => import('@/components/tournaments/days-list/empty-list')
  },
  template: `
    <div>
    <div class="row q-pa-lg">
      <div class="col-12 q-mb-lg">
        <tournament-empty-list/>
      </div>
    </div>
    </div>`
})

export const TournamentDaysList = () => ({
  title: 'TournamentDaysList',
  components: {
    'tournaments-days-list': () => import('@/components/tournaments/days-list')
  },
  computed: {
    tournaments () {
      return {
        '08-25-21': [
          {
            eventId: 'epicgames_S17_CashCupExtraDH_EU',
            eventWindowId: 'S17_CashCupExtraDH_EU_Event3',
            date: '2021-08-25T17:00:00.000Z',
            title: 'Cash Cup Extra Presented by Dreamhack',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/16br-comp-in-game-cashcupextra-poster-front-750x1080-8553c0c3bbe4.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          }
        ],
        '08-23-21': [
          {
            eventId: 'epicgames_S17_CashCup_EU',
            eventWindowId: 'S17_CashCup_EU_Event7',
            date: '2021-08-23T16:00:00.000Z',
            title: 'TRIOS CASH CUP',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/17br-comp-in-game-trioscashcup-poster-front-750x1080-e5f8d0379fe3.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          },
          {
            eventId: 'epicgames_S17_HypeCup_EU',
            eventWindowId: 'S17_HypeCup_EU_Event7',
            date: '2021-08-23T16:00:00.000Z',
            title: 'HYPE CUP',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/17br-comp-in-game-hypecup-poster-front-750x1080-c33c6eefc2cd.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          }
        ],
        '08-21-21': [
          {
            eventId: 'epicgames_S17_FNCS_Qualifier3_EU',
            eventWindowId: 'S17_FNCS_Qualifier3_EU_Event3',
            date: '2021-08-21T17:00:00.000Z',
            title: 'FNCS QUALIFIER 3',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/17br-comp-fncs-in-game-poster-front-qual3-750x1080-f7efebf2ce04.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          },
          {
            eventId: 'epicgames_S17_ZoneWarsLTM_EU',
            eventWindowId: 'S17_ZoneWarsLTM_EU_Event1',
            date: '2021-08-21T16:00:00.000Z',
            title: 'LTM Tournament Zone Wars',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/16br-comp-in-game-ltmcup-poster-front-750x1080-3551abed616e.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          },
          {
            eventId: 'epicgames_S17_FNCS_Qualifier3_EU',
            eventWindowId: 'S17_FNCS_Qualifier3_EU_Event2',
            date: '2021-08-21T13:00:00.000Z',
            title: 'FNCS QUALIFIER 3',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/17br-comp-fncs-in-game-poster-front-qual3-750x1080-f7efebf2ce04.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          }
        ],
        '08-29-21': [
          {
            eventId: 'epicgames_S17_FNCS_RebootRound_EU',
            eventWindowId: 'S17_FNCS_RebootRound_EU',
            date: '2021-08-29T17:00:00.000Z',
            title: 'FNCS REBOOT ROUNDS',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/17br-comp-fncs-in-game-poster-front-reboot-750x1080-79bc33732f69.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          },
          {
            eventId: 'epicgames_S17_SoloCashCup_EU',
            eventWindowId: 'S17_SoloCashCup_EU_Event7',
            date: '2021-08-29T13:00:00.000Z',
            title: 'SOLO CASH CUP',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/17br-comp-in-game-solocashcup-poster-front-750x1080-fbc0bb9622bf.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          }
        ],
        '09-05-21': [
          {
            eventId: 'epicgames_S17_FNCS_Finals_EU',
            eventWindowId: 'S17_FNCS_Finals_EU_Round2',
            date: '2021-09-05T17:00:00.000Z',
            title: 'FNCS FINALS',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/17br-comp-fncs-in-game-poster-front-finals-750x1080-03d8ccd668c3.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          },
          {
            eventId: 'epicgames_S17_SoloCashCup_EU',
            eventWindowId: 'S17_SoloCashCup_EU_Event8',
            date: '2021-09-05T13:00:00.000Z',
            title: 'SOLO CASH CUP',
            location: [
              'EU'
            ],
            type: 'UPCOMING',
            image: 'https://cdn2.unrealengine.com/17br-comp-in-game-solocashcup-poster-front-750x1080-fbc0bb9622bf.jpg',
            platforms: [
              'XboxOneGDK',
              'PS4',
              'XboxOne',
              'XSX',
              'Android',
              'PS5',
              'Switch',
              'Windows'
            ],
            requirements: []
          }
        ]
      }
    }
  },
  template: `
    <div>
      <div class="row q-pa-lg">
        <div class="col-12 q-mb-lg" style="height: 95vh">
          <tournaments-days-list :days="tournaments" />
        </div>
      </div>
    </div>`
})

export const ModalConfirm = () => ({
  title: 'ModalConfirm',
  components: {
    'tournament-confirm-modal': () => import('@/components/tournaments/modal/modal-confirm-update')
  },
  template: `
    <div>
      <div class="row q-pa-lg">
        <div class="col-12 q-mb-lg">
          <tournament-confirm-modal visible />
        </div>
      </div>
    </div>`
})

export const ModalRemove = () => ({
  title: 'ModalRemove',
  components: {
    'tournament-remove-modal': () => import('@/components/tournaments/modal/modal-tournament-delete')
  },
  template: `
    <div>
      <div class="row q-pa-lg">
        <div class="col-12 q-mb-lg">
          <tournament-remove-modal visible />
        </div>
      </div>
    </div>`
})

export const ModalRemoveSuccess = () => ({
  title: 'ModalRemoveSuccess',
  components: {
    'tournament-remove-modal-success': () => import('@/components/tournaments/modal/modal-tournament-delete-success')
  },
  template: `
    <div>
      <div class="row q-pa-lg">
        <div class="col-12 q-mb-lg">
          <tournament-remove-modal-success visible />
        </div>
      </div>
    </div>`
})
