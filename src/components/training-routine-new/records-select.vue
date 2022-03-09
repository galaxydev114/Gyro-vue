<template>
  <div class="records-select full-width">
    <div class="text-h5 text-gray q-pb-sm">
      Benchmark
    </div>
    <div class="flex align-center justify-between full-width">
      <ul>
        <template v-for="item in list">
          <li v-if="records[item]"
              :key="item" v-bind:class="{ active: item === currentActiveItem}" @mouseenter="activeItem=item">
            <img :src="images[item]" />
            <span>
            > {{ records[item] }}
          </span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    records: {
      type: Object
    },
    defaultSelected: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      images: {
        bronze: require('@/assets/icons/bronze-icon.webp'),
        silver: require('@/assets/icons/silver-icon.webp'),
        gold: require('@/assets/icons/gold-icon.webp'),
        platinum: require('@/assets/icons/platinum-icon.webp'),
        diamond: require('@/assets/icons/diamond-icon.webp')
      },
      activeItem: null
    }
  },
  computed: {
    currentActiveItem () {
      return this.defaultSelected !== null ? (this.activeItem !== null ? this.activeItem : this.defaultSelected) : null
    },
    list () {
      return [
        'bronze',
        'silver',
        'gold',
        'platinum',
        'diamond'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.records-select{
  display: flex;
  flex-wrap: wrap;
  ul{
    padding: 0;
    margin: auto 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    li{
      list-style: none;
      overflow: hidden;
      background: transparent;
      width: 36px;
      height: 36px;
      max-width: 36px;
      padding: 2px;
      border: 2px solid transparent;
      display: flex;
      align-items: center;
      border-radius: 20px;
      transition: all 0.2s linear;
      span{
        margin-left: 6px;
        font-weight: bold;
        padding-right: 10px;
        white-space: nowrap;
      }
      img{
        width: 28px;
        float: left;
      }
      // &:hover,
      &.active{
        background: $soft-tone;
        border-color: $dark-pink;
        max-width: 120px;
        width: auto;
        cursor: pointer;
      }
    }
  }
}
</style>
