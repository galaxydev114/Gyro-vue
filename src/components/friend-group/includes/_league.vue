<template>
  <div class="col scores-container scores-container--show">
    <div class="text-center q-mt-lg-xl q-mt-md-md q-mt-sm-md q-mt-xs-sm justify-center d-flex q-mb-lg">
      <div style="max-width: 1200px">
        <div class="row items-stretch justify-between q-mb-lg">
          <div v-for="cat of categoryItems" :key="cat.label" class="col-md col-12 q-pa-lg-md q-pa-md-sm q-py-sm">
            <div class="q-py-lg bordered items-center cat-item"
              :class="{'selected': selectedLeague === cat.name, 'row q-px-md': $q.screen.lt.sm, 'column justify-center': $q.screen.gt.xs }"
              @click="onToggle(cat.name)" >
              <c-skill-icons v-slot="{ getIcon }">
                <img
                  :src="getIcon(cat.icon)"
                  :width="$q.screen.gt.xs ? 64: 48"
                  :height="$q.screen.gt.xs ? 64: 48"/>
              </c-skill-icons>
              <span class="q-mt-lg-lg q-mt-md-md q-mt-sm-sm text-h2 text-uppercase" :class="{'q-ml-sm': $q.screen.lt.sm}">
                {{ cat.label }}
              </span>
            </div>
          </div>
        </div>
        <div class="row items-stretch justify-between q-mb-lg gt-sm">
          <div class="col-md col-12">
            <div class="q-ma-lg-sm q-ma-md-sm q-my-sm ">
              <img :src="openBgIcon" class="q-mt-sm full-width" alt="open-league" />
            </div>
          </div>
          <div class="col-md col-12">
            <div class="q-ma-lg-sm q-ma-md-sm q-my-sm ">
              <img :src="contenderBgIcon" class="q-mt-sm full-width" alt="contender-league" />
            </div>
          </div>
          <div class="col-md col-12">
            <div class="q-ma-lg-sm q-ma-md-sm q-my-sm ">
              <img :src="championBgIcon" class="q-mt-sm full-width" alt="champion-league" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row full-width q-mt-lg q-px-lg-lg q-px-sm-none q-pb-md q-pb-md-none text-right justify-center mt-fixed-bottom">
      <div class="col-6 q-px-lg-none q-pr-sm">
        <c-btn outline
              class="btn-join-fg"
              :bold="false"
              :class="{'full-width': $q.screen.lt.sm, 'btn-previous': $q.screen.gt.xs}"
              color="light-pink"
              @click="$emit('previous')">
          Previous
        </c-btn>
      </div>
      <div class="col-6 q-px-lg-none q-pl-sm">
        <q-btn unelevated
             class="q-px-md btn-join-fg"
             :class="{'full-width': $q.screen.lt.sm, 'btn-next': $q.screen.gt.xs}"
             color="dark-pink"
             :disable="!selectedLeague"
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
      type: String,
      default: null
    }
  },
  data () {
    return {
      categoryItems: [
        {
          step: 1,
          name: 'open',
          icon: 'fg_lg_open',
          label: 'Open League'
        },
        {
          step: 2,
          name: 'contender',
          icon: 'fg_lg_contender',
          label: 'Contender League'
        },
        {
          step: 3,
          name: 'champion',
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
    onToggle (league) {
      this.$emit('selected', league)
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
    height: 100%;
    &:hover {
      border: 1.5px solid $dark-pink;
    }
    &.selected {
      background: linear-gradient(151.27deg, rgba(217, 39, 121, 0.32) 18.81%, rgba(124, 39, 126, 0.8) 85.12%);
      border: 1.5px solid $dark-pink;
    }
  }
</style>
