<template>
  <div class="col scores-container scores-container--show">
    <div class="text-center q-mt-lg-xl justify-center">
      <div class="row items-stretch justify-between q-mb-lg">
        <div v-for="(cat, index) in categoryItems" :key="cat.label" class="col-md col-12">
          <div class="q-py-lg bordered items-center  q-ma-lg-md q-ma-md-sm q-my-sm cat-item"
            :class="{'selected': selectedLeague === index, 'row q-px-md': $q.screen.lt.sm, 'column justify-center': $q.screen.gt.sm }"
            @click="onToggle(index)" >
            <c-skill-icons v-slot="{ getIcon }">
              <img
                :src="getIcon(cat.icon)"
                :width="64"
                :height="64"/>
            </c-skill-icons>
            <span class="q-mt-lg-lg text-h2 text-uppercase" :class="{'q-ml-md': $q.screen.lt.sm,}">
              {{ cat.label }}
            </span>
          </div>
        </div>
      </div>
      <img :src="leagueIcon" class="q-mt-md gt-sm full-width" alt="league" />
      <img :src="openBgIcon" class="q-mt-sm lt-sm full-width" alt="open-league" />
      <img :src="contenderBgIcon" class="q-mt-sm lt-sm full-width" alt="contender-league" />
      <img :src="championBgIcon" class="q-mt-sm lt-sm full-width" alt="champion-league" />
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center">
      <div class="col-6 q-px-lg-none q-pr-sm">
        <q-btn outline
              class="q-btn-main q-px-md btn-join-fg"
              :class="{'full-width': $q.screen.lt.sm, 'btn-previous': $q.screen.gt.sm}"
              color="white"
              @click="$emit('previous')">
          Previous
        </q-btn>
      </div>
      <div class="col-6 q-px-lg-none q-pl-sm">
        <q-btn unelevated
             class="q-btn-main q-px-md btn-join-fg"
             :class="{'full-width': $q.screen.lt.sm, 'btn-next': $q.screen.gt.sm}"
             color="dark-pink"
             :disable="selectedLeague === -1"
             @click="$emit('next')">
          Next
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import leagueIcon from '@/assets/friend-group/league.svg'
import openBgIcon from '@/assets/friend-group/open-league-bg.svg'
import contenderBgIcon from '@/assets/friend-group/contender-league-bg.svg'
import championBgIcon from '@/assets/friend-group/champion-league-bg.svg'

export default {
  props: {
    selectedLeague: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      categoryItems: [
        {
          step: 1,
          icon: 'fg_lg_open',
          label: 'Open League'
        },
        {
          step: 2,
          icon: 'fg_lg_contender',
          label: 'Contender League'
        },
        {
          step: 3,
          icon: 'fg_lg_champion',
          label: 'Champion League'
        }
      ],
      leagueIcon,
      openBgIcon,
      contenderBgIcon,
      championBgIcon
    }
  },
  components: {
    'c-skill-icons': () => import('@/components/common/friend-group-icons-manager')
  },
  methods: {
    onToggle (step) {
      this.selectedLeague = step
    }
  }
}
</script>

<style lang="scss">
  .cat-item {
    cursor: pointer;
    border: 1.5px solid $midGray-one;
    background: $dark-one;
    box-shadow: 4px 0px 20px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    &:hover {
      border: 1.5px solid $dark-pink;
    }
    &.selected {
      background: linear-gradient(151.27deg, rgba(217, 39, 121, 0.32) 18.81%, rgba(124, 39, 126, 0.8) 85.12%);
      border: 1.5px solid $dark-pink;
    }
  }
</style>
