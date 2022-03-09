export default {
  title: 'Sliders'
}

const images = [
  'https://mir-s3-cdn-cf.behance.net/project_modules/1400/3ebf4c100695095.5f0e759456cac.jpg',
  'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/152046989/original/d8aa4a97bd9b912cfa3cfe4192e1510ee8cd9a32/do-3d-fortnite-thumbnail.jpg',
  'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/122879598/original/f559e79c2c932b2daf1732c3d3ccc4a71c3d0d54/3d-fortnite-branding-such-as-thumbnails-profile-pictures-banners-etc.jpg',
  'https://cdn141.picsart.com/332446954067201.jpg?type=webp&to=min&r=640',
  'https://i.pinimg.com/originals/90/d2/7d/90d27d2da9c69f557dc6df571499f469.png',
  'http://cdn130.picsart.com/324799355121201.jpg?type=webp&to=min&r=1024',
  'https://i.pinimg.com/originals/62/dc/37/62dc37c3238ede2cbe603394dbb8f39c.jpg',
  'https://cdn131.picsart.com/335566402072201.jpg?type=webp&to=min&r=640',
];

export const Simple = () => ({
  title: 'Simple',
  components: {
    slider: () => import('@/components/common/slider')
  },
  computed: {
    slides () {
      return images.map((img, i) => {
        return {
            img,
            title: 'Slider title ' + i,
            subTitle: 'Slider sub title ' + i,
        };
      })
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-12 q-my-md">
        <slider title="This is slider block title"
                class="full-width"
                :swiperOptions="{
                    slidesPerView: 3,
                    spaceBetween: 30
                  }"
                sliderID="simple"
                :items="slides">
          <template v-slot="{ item }">
            <div class="q-pa-md text-center bg-soft-tone">
              <div class="q-mb-md">
                <img class="full-width" alt="Profile image of collaborator" :src="item.img"/>
              </div>
              <div class="text-h4">
                {{ item.title }}
              </div>
              <div class="opacity-5 q-mt-sm">
                {{ item.subTitle }}
              </div>
            </div>
          </template>
        </slider>
      </div>
    </div>
    </div>`
})

export const Netflix = () => ({
  title: 'Netflix',
  components: {
    'n-netflix-slider': () => import('@/components/common/netflix-slider')
  },
  computed: {
    slides () {
      return images.map((img, i) => {
        return {
            img,
            title: 'Slider title ' + i
        };
      })
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-12 q-my-md">
        <n-netflix-slider @click="goToVideo"
                          :slides="slides" />
      </div>
    </div>
    </div>`
})

export const Slider3D = () => ({
  title: 'Slider 3D',
  components: {
    'n-3d-slider': () => import('@/components/3d-slider'),
    'n-slide': () => import('@/components/content-discovery/main-slider'),
  },
  computed: {
    slides () {
      return images.map((img, i) => {
        return {
          thumbnail: img,
          title: 'Slider title ' + i,
          subtitle: 'Slider subtitle ' + i
        };
      })
    }
  },
  template: `
    <div>
    <div class="row q-mb-lg">
      <div class="col-12 q-my-md">
        <n-3d-slider :records="slides">
          <template v-slot="{slide}">
            <n-slide
              :title="slide.title"
              :description="slide.subtitle"
              :image="slide.thumbnail"
            />
          </template>
        </n-3d-slider>
      </div>
    </div>
    </div>`
})
