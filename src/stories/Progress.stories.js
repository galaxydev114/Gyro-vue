export default {
  title: 'ProgressPage'
}

export const CategoriesList = () => ({
  title: 'CategoriesList',
  components: {
    'c-cat-list': () => import('@/components/progress/categories-list'),
  },
  computed: {
    cat() {
      return [
        'AIMING',
        'EDITING',
        'BUILDING',
        'FIGHTING',
        'GAMESENSE',
        'WORKSHOP',
        'BR',
        'VOD Review',
        'REST',
        'KNOWLEDGE',
        'WARM UP'
      ].map((cat) => {
        return {
          name: cat,
          value: Math.floor(Math.random() * (50 - 2)) + 2
        }
      })
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-4">
        <c-cat-list :categories="cat"/>
      </div>
    </div>
    </div>`
})

export const WeekData = () => ({
  title: 'WeekData',
  components: {
    'c-week': () => import('@/components/progress/week'),
  },
  computed: {
    week() {
      return [
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
        'Su',
        'Mo',
      ].map((day) => {
        return {
          short: day,
          value: Math.floor(Math.random() * (110 - 50)) + 50
        }
      });
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-4">
        <c-week :week="week" />
      </div>
    </div>
    </div>`
})

export const PlayCalendar = () => ({
  title: 'PlayCalendar',
  components: {
    'c-play-calendar': () => import('@/components/progress/calendar'),
  },
  computed: {
    activities() {
      return [
        {
          date: '08-03-21',
          value: 40
        },
        {
          date: '08-02-21',
          value: 100
        },
        {
          date: '08-11-21',
          value: 80
        },
        {
          date: '08-22-21',
          value: 10
        },
        {
          date: '08-15-21',
          value: 60
        },
        {
          date: '08-20-21',
          value: 70
        },
        {
          date: '08-21-21',
          value: 90
        }
      ];
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-4">
        <c-play-calendar :activities="activities"/>
      </div>
    </div>
    </div>`
})

export const EmptyBox = () => ({
  title: 'Empty',
  components: {
    'c-empty': () => import('@/components/progress/_empty'),
    'c-empty-box': () => import('@/components/common/empty-state/box'),
  },
  template: `
    <div>
    <div class="row q-mb-lg q-col-gutter-lg">
      <div class="col-6">
        <div class="text-h4 q-mb-lg">
          Simple
        </div>
        <c-empty />
      </div>
      <div class="col-6">
        <div class="text-h4 q-mb-lg">
          With slot
        </div>
        <c-empty-box>
          <div class="q-pa-xl">
            <c-icon icon="progress" class="q-mb-md" width="32px" />
            <div class="text-h2 text-soft-tone q-mb-md">
              For us to track your in-game progress, please link your Epic account.
            </div>
          </div>
        </c-empty-box>
      </div>
    </div>
    </div>`
})
