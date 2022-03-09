import { Store } from 'vuex'

export default {
  title: 'Routine'
}

export const RoutineCard = () => ({
  title: 'RoutineCard',
  components: {
    'n-routine-card': () => import('@/components/training-routine/card')
  },
  methods: {
    textClass (align) {
      return `col-12 q-my-md text-${align}`
    }
  },
  template: `
    <div>
      <div class="row q-mb-lg">
        <div class="col-4">
          <n-routine-card id="id"
                          title="This is title"
                          subtitle="This is subtitle"
                          :counter="10"
                          approvedBy="Novos"
                          difficulty="easy"
                          :duration="30"
                          skill="aiming"
                          isNew
                          small
                          shortApproved
          />
        </div>
      </div>
    </div>`,
  store: new Store({
    modules: {
      coaches: {
        namespaced: true,
        state: {
          coaches: []
        }
      }
    }
  })
})

export const RoutineCardInline = () => ({
  title: 'RoutineCardInline',
  components: {
    'n-inline-routine': () => import('@/components/training-routine/routine')
  },
  template: `
    <div>
      <div class="row q-mb-lg">
        <div class="col-4">
          <n-inline-routine id="id"
                          title="This is title"
                          category="aiming"
                          author="Novos"
                          difficulty="easy"
                          duration="30 min"
          />
        </div>
      </div>
    </div>`,
  store: new Store({
    modules: {
      coaches: {
        namespaced: true,
        state: {
          coaches: []
        }
      }
    }
  })
})

export const List = () => ({
  title: 'List',
  components: {
    'n-list': () => import('@/components/training-routine/list')
  },
  template: `
    <div>
      <div class="row q-mb-lg">
        <div class="col-4" style="max-height: 60vh">
          <n-list title="List title"
                  description="List description">
            <q-card bordered v-for="i in 10" class="q-mb-md">
              <q-card-actions class="q-pa-lg">
                This is simple card to show list - {{ i }}
              </q-card-actions>
            </q-card>
          </n-list>
        </div>
      </div>
    </div>`
})

export const RoutineDelete = () => ({
  title: 'RoutineDelete',
  components: {
    'n-routine-delete': () => import('@/components/dashboard/modal/modal-routine-delete')
  },
  template: `
    <div>
      <n-routine-delete visible :spinner="false" />
    </div>`
})
