export default {
  title: 'List'
}

export const ListWithPagination = () => ({
  title: 'ListWithPagination',
  components: {
    'n-list': () => import('@/components/common/content-list/list'),
  },
  computed: {
    items () {
      const arr = [];
      for(let i = 0; i < 6; i++ ){
        arr.push(`This is item ${i}`)
      }
      return arr;
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-12">
        <n-list :items="items"
                :paginationOptions="{
                  enabled: true,
                  numPages: 5
                }">
          <template v-slot="{item}">
            <q-card bordered class="q-pa-lg">
              <q-card-actions>
                {{ item }}
              </q-card-actions>
            </q-card>
          </template>
        </n-list>
      </div>
    </div>
    </div>`
})

export const ListInfiniti = () => ({
  title: 'ListInfiniti',
  components: {
    'n-list': () => import('@/components/common/content-list/list'),
  },
  computed: {
    items () {
      const arr = [];
      for(let i = 0; i < 6; i++ ){
        arr.push(`This is item ${i}`)
      }
      return arr;
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-12">
        <n-list :items="items"
                :paginationOptions="{
                  enabled: true,
                  infinite: true
                }">
          <template v-slot="{item}">
            <q-card bordered class="q-pa-lg">
              <q-card-actions>
                {{ item }}
              </q-card-actions>
            </q-card>
          </template>
        </n-list>
      </div>
    </div>
    </div>`
})
