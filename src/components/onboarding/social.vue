<template>
  <div class="social-list mt-10">
    <div class="social-list__title" v-if="showTitle">
      Follow us
    </div>
    <ul>
      <li v-for="(social) in Object.keys(socialUrls)" :key="social">
        <a :href="socialUrls[social]" target="_blank" rel="noopener noreferrer">
          <img :src="images[social]" :alt="social" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { socialUrls } from '@/constants'

export default {
  props: {
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      images: {
        instagram: require('@/assets/socials/instagram.svg'),
        discord: require('@/assets/socials/discord.svg'),
        facebook: require('@/assets/socials/facebook.svg'),
        linkedin: require('@/assets/socials/linkedin.svg')
      },
      socialUrls
    }
  }
}
</script>

<style lang="scss">
.social-list{
  &__title{
    font-size: 14px;
    font-weight: bold;
    color: $soft-tone;
    text-transform: uppercase;
    text-align: left;
    margin-bottom: 10px;
  }
  ul{
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    li{
      list-style: none;
      margin-right: 20px;
      margin-bottom: 10px;
      transition: all .3s ease-in-out;
      a{
        padding: 0;
        img{
          width: 20px;
          height: 20px;
        }
      }
      &:hover{
        transform: scale(1.2);
      }
    }
  }
  @media (max-width: 576px) {
    margin-bottom: 20px;
    &__title{
      text-align: center;
    }
    ul{
      justify-content: center;
      li{
        margin: 10px;
      }
    }
  }
}
</style>
