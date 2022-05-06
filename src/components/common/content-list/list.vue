<template>
  <div class="list">
    <q-resize-observer @resize="resizeList"/>
    <div class="row q-col-gutter-md">
      <div v-for="(item, index) in items"
        :key="`list-item-${index}`"
        :class="cardTilingClass"
      >
        <slot v-bind:item="item">
          <!-- default content -->
          <n-routine-card
            class="list__item"
            v-bind="item"
            shortApproved
            @click="$emit('select-item', 'routine', $event)"
          />
        </slot>
      </div>
    </div>

    <div v-if="pagination.enabled && pagination.infinite" class="row items-center q-mt-lg">
      <div class="fake-line col" />
      <c-btn
        flat
        textColor="dark-pink"
        :disabled="pagination.blockShowMore && currentPage === pagination.numPages"
        :bold="false"
        @click="$emit('page')"
      >
        Show More
      </c-btn>
      <div class="fake-line col" />
    </div>
    <div v-else-if="pagination.enabled" class="row q-gutter-sm q-mt-lg justify-center justify-sm-end no-wrap-xs">
      <c-btn
        outline
        color="white"
        :size="$q.screen.lt.sm ? 'sm' : 'md'"
        :noWidth="$q.screen.lt.sm"
        :disabled="currentPage === 1"
        :bold="false"
        @click="$emit('page', currentPage - 1)"
      >
        Previous
      </c-btn>
      <c-btn v-for="n in pagination.numPages" :key="`page-${n}`"
        outline dense
         :size="$q.screen.lt.sm ? 'sm' : 'md'"
        :textColor="currentPage === n ? 'dark-pink' : 'white'"
        :bold="false"
        class="list__page-button--number"
        @click="$emit('page', n)"
      >
        {{n}}
      </c-btn>
      <c-btn
        outline
        color="white"
        :size="$q.screen.lt.sm ? 'sm' : 'md'"
        :noWidth="$q.screen.lt.sm"
        :disabled="currentPage === pagination.numPages"
        :bold="false"
        @click="$emit('page', currentPage + 1)"
      >
        Next
      </c-btn>
    </div>
  </div>
</template>

<script>
import _clamp from '@/util/clamp'

/** Example:
 * ```
 * <n-list
 *   :items="activityList"
 *   :paginationOptions="{
 *     enabled: true,
 *     numPages: 6,
 *     blockShowMore: true
 *   }"
 *   :page="page"
 * />
 * ```
 */
export default {
  components: {
    'n-routine-card': () => import('@/components/training-routine/card')
    // TODO: support knowledge cards also
    // 'n-video-item': () => import('@/components/knowledge/list/item')
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    paginationOptions: {
      type: Object,
      default: () => ({})
    },
    page: {
      type: Number,
      default: 1
    },
    maxInRow: {
      type: Number
    }
  },
  data () {
    return {
      cardTilingClass: null
    }
  },
  computed: {
    pagination () {
      return {
        enabled: false,
        infinite: false,
        numPages: 1,
        ...this.paginationOptions
      }
    },
    currentPage () {
      return _clamp(this.page, 1, this.pagination.numPages)
    }
  },
  methods: {
    resizeList (e) {
      // NOTE: HACK: due to fat design of card, we need custom breakpoints just
      // for this list to prevent card footer tags from sticking out the right
      // TODO: revisit responsive card design
      const { width } = e
      const blockWidth = Math.floor(width / 300)

      switch (blockWidth) {
        case 0:
        case 1:
          this.cardTilingClass = 'col-12'
          break
        case 2:
        case 3:
          this.cardTilingClass = 'col-6'
          break
        default:
          if (this.maxInRow) {
            this.cardTilingClass = 'col-' + 12 / this.maxInRow
          } else {
            this.cardTilingClass = 'col-3'
          }
          break
      }
    }
  },
  mounted () {
    const width = this.$q.screen.width < 768 ? this.$q.screen.width : this.$q.screen.width - 250
    this.resizeList({ width })
  }
}
</script>

<style lang="scss" scoped>
.list{
  width: 100%;

  &__item {
    height: 100%;
  }

  &__page-button {
    &--number {
      width: 32px;
      /deep/ button {
        height: 100%;
      }
    }
  }
}

.fake-line{
  height: 1px;
  width: 100%;
  background: $soft-tone;
  margin: 30px 0;
  @media all and (max-width: $breakpoint-xs-max){
    margin: 5px 0 20px;
  }
}
</style>
