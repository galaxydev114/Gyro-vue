<template>
  <article class="partner-details-page">
    <section>
      <form @submit.prevent.stop="addPartner">
        <div class="form__item">
          <q-input label="name" v-model="partner.name"/>
        </div>
        <div class="form__item">
          <q-input label="userId" v-model="partner.userId"/>
        </div>
        <div class="form__item">
          <q-input label="slug" v-model="partner.slug"/>
        </div>
        <div class="form__item">
          <q-input label="tagline" v-model="partner.tagline"/>
        </div>
        <div class="form__item">
          <q-input label="quote" v-model="partner.quote"/>
        </div>

        <div class="form__item form__item--grouped">
          <h4 class="no-margin">Achievements</h4>
          <q-select color="dark-pink" label="Achievement icon" v-model="tempAchievement.icon" :options="icons"/>
          <q-input color="dark-pink" label="Achievement title" v-model="tempAchievement.title"/>
          <q-btn color="dark-pink" @click="saveTemporaryAchievement">
            {{ achievementInEditMode ? 'Edit' : 'Save' }}
          </q-btn>
          <ul>
            <draggable v-model="partner.achievements">
              <li v-for="(achievement, index) of partner.achievements" :key="achievement.title + index">
                <q-btn icon="edit" size="sm" flat round color="dark-pink" @click="editAchievement(achievement)"/>
                <q-btn icon="delete" size="sm" flat round color="dark-pink" @click="deleteAchievement(achievement)"/>
                {{ achievement.title }}
              </li>
            </draggable>
          </ul>
        </div>

        <div class="form__item form__item--grouped">
          <h4 class="no-margin">Activities</h4>
          <q-input color="dark-pink" label="Title" v-model="tempActivity.title"/>
          <q-input color="dark-pink" label="Thumbnail URL" v-model="tempActivity.thumbnailUrl"/>
          <q-input color="dark-pink" label="Content Video URL" v-model="tempActivity.videoURL"/>
          <q-toggle color="dark-pink" label="Has video ?" v-model="tempActivity.hasVideo"/>
          <html-editor label="Description" v-model="tempActivity.html"/>
          <q-input color="dark-pink" label="Activity URL" v-model="tempActivity.ctaUrl"/>
          <q-select color="dark-pink" clearable label="Tag color" :options="tagColors" v-model="tempActivity.tagColor"/>
          <q-input color="dark-pink" label="Tag text" v-model="tempActivity.tagText"/>
          <div>
            <q-toggle color="dark-pink" label="Is locked ?" v-model="tempActivity.locked"/>
          </div>
          <q-btn color="dark-pink" @click="saveTemporaryActivity">
            {{ activityInEditMode ? 'Edit' : 'Save' }}
          </q-btn>

          <ul>
            <draggable v-model="partner.activities">
              <li v-for="(activity, index) of partner.activities" :key="activity.title + index">
                <q-btn icon="edit" size="sm" flat round color="dark-pink" @click="editActivity(activity)"/>
                <q-btn icon="delete" size="sm" flat round color="dark-pink" @click="deleteActivity(activity)"/>
                {{ activity.title }}
              </li>
            </draggable>
          </ul>
        </div>
        <div class="form__item">
          <q-input label="Profile image url" v-model="partner.profileImageUrl"/>
        </div>
        <div class="form__item">
          <q-input label="Profile video title" v-model="partner.profileVideoTitle"/>
        </div>
        <div class="form__item">
          <q-input label="Profile video subtitle" v-model="partner.profileVideoSubtitle"/>
        </div>
        <div class="form__item">
          <q-input label="Profile video url" v-model="partner.profileVideoUrl"/>
        </div>
        <div class="form__item">
          <q-input label="Video thumbnail" v-model="partner.profileVideoThumbnailUrl"/>
        </div>
        <div class="form__item">
          <q-input label="Youtube link" v-model="partner.youtubeLink"/>
        </div>
        <div class="form__item">
          <q-input label="Twitch link" v-model="partner.twitchLink"/>
        </div>
        <div class="form__item">
          <q-input label="Twitter link" v-model="partner.twitterLink"/>
        </div>
        <div class="form__item">
          <q-input label="EPIC creator code" v-model="partner.epicCreatorCode"/>
        </div>
        <div class="form__item">
          <q-toggle color="dark-pink" label="Is collaborator?" v-model="partner.isCollaborator"/>
        </div>

        <q-btn class="q-mt-lg" type="submit" color="dark-pink">Save partner</q-btn>
      </form>
    </section>
    <section>
      <partners
        partner-id="test"
        :current-collaborator="partner"
        :is-logged-in="true"
      />
    </section>
  </article>
</template>

<script>
import Partners from 'pages/Partners/Partners'
import Draggable from 'vuedraggable'
import HtmlEditor from 'components/admin/html-editor'

export default {
  name: 'PartnerDetails',
  components: { HtmlEditor, Partners, Draggable },
  props: {
    initialPartnerData: {
      type: Object
    }
  },
  data: () => ({
    partner: {
      name: null,
      userId: null,
      slug: null,
      tagline: null,
      quote: null,
      achievements: [],
      activities: [],
      profileImageUrl: null,
      profileVideoTitle: null,
      profileVideoSubtitle: null,
      profileVideoUrl: null,
      youtubeLink: null,
      twitchLink: null,
      twitterLink: null,
      epicCreatorCode: null,
      isCollaborator: true,
      profileVideoThumbnailUrl: null
    },

    tempActivity: {
      title: null,
      thumbnailUrl: null,
      hasVideo: false,
      html: '',
      ctaUrl: null,
      tagColor: null,
      tagText: null,
      locked: false,
      videoURL: null
    },
    activityInEditMode: null,

    tempAchievement: {
      icon: null,
      title: null
    },
    achievementInEditMode: null,

    tempActivityCta: {
      type: 'ROUTINE',
      activityId: null
    },

    icons: ['starTrophy', 'goldenTrophy', 'moneybag'],
    tagColors: ['red', 'green', 'pink', 'blue']
  }),
  created () {
    this.copyInitialPartnerData()
  },
  methods: {
    saveTemporaryActivity () {
      if (!this.partner.activities) {
        this.partner.activities = []
      }

      if (this.activityInEditMode) {
        this.partner.activities = this.partner.activities.map(v => {
          if (v.title === this.activityInEditMode.title) {
            return { ...this.tempActivity }
          }
          return v
        })
      } else {
        this.partner.activities = [
          ...this.partner.activities,
          this.tempActivity
        ]
      }

      this.resetTemporaryActivity()
    },

    editActivity (activity) {
      this.tempActivity = { ...activity }
      this.activityInEditMode = { ...activity }
    },

    deleteActivity (activity) {
      this.partner.activities = this.partner.activities.filter(v => v.title !== activity.title)
    },

    saveTemporaryAchievement () {
      if (!this.partner.achievements) {
        this.partner.achievements = []
      }

      if (this.achievementInEditMode) {
        this.partner.achievements = this.partner.achievements.map(v => {
          if (v.title === this.achievementInEditMode.title) {
            return { ...this.tempAchievement }
          }
          return v
        })
      } else {
        this.partner.achievements = [
          ...this.partner.achievements,
          this.tempAchievement
        ]
      }

      this.resetTemporaryAchievement()
    },

    editAchievement (achievement) {
      this.tempAchievement = { ...achievement }
      this.achievementInEditMode = { ...achievement }
    },

    deleteAchievement (achievement) {
      this.partner.achievements = this.partner.achievements.filter(v => v.title !== achievement.title)
    },

    resetTemporaryAchievement () {
      this.tempAchievement = {
        icon: null,
        title: null
      }
      this.achievementInEditMode = null
    },

    copyInitialPartnerData () {
      if (this.initialPartnerData) {
        this.partner = {
          ...this.initialPartnerData
        }
      }
    },

    resetTemporaryActivity () {
      this.tempActivity = {
        title: null,
        thumbnailUrl: null,
        hasVideo: false,
        html: '',
        ctaUrl: null,
        tagColor: null,
        tagText: null,
        locked: false,
        videoURL: null
      }
      this.activityInEditMode = null
    },

    resetPartnerForm () {
      this.resetTemporaryActivity()
      this.partner = {
        name: null,
        userId: null,
        slug: null,
        tagline: null,
        quote: null,
        achievements: [],
        activities: [],
        profileImageUrl: null,
        profileVideoTitle: null,
        profileVideoSubtitle: null,
        profileVideoUrl: null,
        youtubeLink: null,
        twitchLink: null,
        twitterLink: null,
        epicCreatorCode: null,
        isCollaborator: true,
        profileVideoThumbnailUrl: null
      }
    },

    async addPartner () {
      this.$emit('save', this.partner)
      this.resetPartnerForm()
    }
  }
}
</script>

<style scoped lang="scss">
.form__item,
.form__item--grouped > * {
  margin-top: 1rem;
  &:first-child {
    margin-top: 0;
  }
}

.form__item--grouped {
  box-sizing: border-box;
  padding-left: 2rem;
  border-left: 5px solid $pink;
  border-radius: 6px;
  margin-left: 2rem;
  margin-top: 2rem;
}

.partner-details-page {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 2fr;
}

ul li {
  cursor: grab;
}
</style>
