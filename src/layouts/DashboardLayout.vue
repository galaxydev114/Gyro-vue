<template>
  <q-layout v-if="!hideIfPublic || currentUser"
            view="hHh lpR fFf"
            class="n-dashboard"
            :class="{
                'n-dashboard--full-screen': isFullScreenMode,
                'non-selectable': !$q.platform.is.ios,
                }">
    <q-header reveal
              v-if="!isFullScreenMode"
              :reveal-offset="10"
              @reveal="drop = false"
              class="no-background q-px-sm-md q-px-xl-lg">
      <q-toolbar class="q-py-md items-center">
        <div class="col-12 text-right d-flex justify-end items-center">

          <div class="row items-center no-wrap q-mr-auto" style="flex-basis: 60px; width: 60px">
            <q-btn v-if="$q.screen.lt.md"
                   flat round dense icon="menu"
                   @click="leftDrawerOpen = !leftDrawerOpen" />
            <router-link v-else to="/training-plan">
              <img src="@/assets/trainingPlan/logo-sm.svg" class="float-left" :width="$q.screen.lt.sm ? '50px' : '60px'" />
            </router-link>
          </div>

          <div v-if="!$q.screen.lt.md" class="block full-width overflow-hidden" style="padding-left: 140px">
            <div class="flex items-center no-wrap full-width">
              <vue-roll-up class="marquee-container full-width"
                          :roll-list="computedUpdates"
                          use-slot
                          width="100%"
                          :height=45
                          :duration="3000"
                          :speed="2000"
                          :color="'white'" >
                <template v-slot="{ marquee }">
                  <div class="marquee-item flex items-center full-width text-no-wrap no-wrap q-px-md"
                      @click="updatesClickHandler(marquee.link)">
                    <div class="flex items-center no-wrap">
                      <c-skill-icons v-slot="{ getIcon }" style="margin-right: 10px;">
                        <img :src="getIcon(marquee.type)" width="20px" height="20px"/>
                      </c-skill-icons>
                      {{marquee.title}}
                    </div>
                    <div class="text-dark-pink q-px-sm overflow-hidden cursor-pointer" style="text-overflow: ellipsis;">{{marquee.routineTitle}}</div>
                    <div>{{marquee.dateString}}</div>
                  </div>
                </template>
              </vue-roll-up>
            </div>
          </div>

          <div v-if="!$q.screen.lt.md && currentUser" class="text-no-wrap">
            <c-btn class="q-pr-lg" color="indigo">
              <router-link
                to="/friend-group"
                class="fg-join-btn-link"
                >
                  Join a Friends Group
              </router-link>
            </c-btn>
          </div>

          <div v-if="!$q.screen.lt.md && currentUser" class="text-no-wrap float-right">
            <c-day-activities/>
          </div>

          <div
            v-if="currentUser"
            class="user-info q-pl-lg q-ml-sm-lg d-flex items-center justify-end text-no-wrap"
            @mouseleave="drop = false"
          >
            <div class="q-mr-md">
              <div class="text-h4 text-weight-bold">
                {{ computedUserDisplayName }}
              </div>
              <div>
                <div v-if="!isAllowedToUsePlatform" style="display: flex">
                  <div class="text-yellow" style="display:flex">Upgrade now <div class="text-white"> &nbsp;|&nbsp;</div> </div>
                  <a @click="setPayWallMethod('upgrade after finish trial', 'upgrade Click', true)" class="text-dark-pink text-weight-bold text-h5 cursor-clickable">
                    Upgrade
                  </a>
                </div>
              </div>
            </div>
            <div class="relative-position">
              <user-avatar
                :pointer="true"
                :emailAddress="currentUser.email"
                :userName="currentUser.fortniteNickname"
                :size="$q.screen.lt.md ? 40 : 56"
                @click="avatarClick"
              />
              <div class="user-mobile-nav shadow-4" v-if="drop">
                <div class="user-mobile-nav__item"
                    v-if="!isPaidUser"
                    @click="setPayWallMethod(`upgrade ${trialDaysLeft > 0 ? 'before' : 'after'} finish trial`, 'upgrade Click', true)">
                  Upgrade
                </div>
                <div class="user-mobile-nav__item"
                    @click="onJoinFriend"
                    v-if="$q.screen.lt.sm">
                  Join a Friends Group
                </div>
                <div class="user-mobile-nav__item"
                    @click="showSubscriptionModal"
                    v-if="isPaidUser">
                  View subscription
                </div>
                <div class="user-mobile-nav__item"
                    @click="setShowModalReferrals(true)"
                    v-if="isInReferralProgram">
                  Invite a friend
                </div>
                <div class="user-mobile-nav__item"
                    @click.stop="showSupport = true">
                  Support
                </div>
                <div class="user-mobile-nav__item"
                    @click="showUnlinkEpicModal"
                    v-if="computedCurrentUserEpicId">
                  Unlink Epic account
                </div>
                <div class="user-mobile-nav__item"
                    @click="trackAction('Settings: link epic account'); $router.push({ name: 'LinkEpic' })"
                    v-else-if="!computedCurrentUserEpicId">
                  Link Epic account
                </div>
                <div class="user-mobile-nav__item"
                    :disabled="!currentUser"
                    @click="currentUser ? userAvatarNavLogout() : ()=>{}">
                  Logout
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <c-btn color="dark-pink" @click="joinNovosIfPublic" :bold="false">
              {{ $q.screen.xs ? 'Join NOVOS' : 'Want more? Click here to sign up' }}
            </c-btn>
          </div>

          <div class="support-block support-block--mobile"
              :class="{'support-block--active': showSupport}"
              v-outside-click="() => (showSupport = false)">
            <n-feedback />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="!isFullScreenMode"
      :overlay="$q.screen.lt.sm"
      :class="{ 'no-background': $q.screen.gt.xs }"
      :content-class="{ 'no-background': $q.screen.gt.xs }"
      v-model="leftDrawerOpen"
      :dark="false"
      show-if-above
      no-swipe-open
      no-swipe-close
      no-swipe-backdrop
      :behavior="$q.screen.lt.sm ? 'mobile' : 'desktop'"
      :width="$q.screen.gt.lg ? 240 : $q.screen.gt.xs ? 210 : $q.screen.width">
      <div class="fit q-py-xl q-px-lg column no-wrap" style="padding-top:38px !important">
        <div class="n-dashboard-nav__close-btn"
            @click="leftDrawerOpen = false"
            v-if="$q.screen.lt.sm">
          <c-icon icon="closeCircle" width="24px"/>
        </div>
        <div v-if="$q.screen.lt.sm" class="n-dashboard-nav items-center q-mb-lg user-info--mobile">
          <template v-if="currentUser">
            <user-avatar
              :pointer="isAllowedToUsePlatform || $q.screen.lt.md"
              :emailAddress="currentUser.email"
              :userName="currentUser.fortniteNickname"
              :size=92
            />
            <div class="q-my-lg text-center">
              <div class="text-h4 text-weight-bold">
                Hello,
              </div>
              <div class="text-h4 text-weight-bold">
                {{ computedUserDisplayName }}
              </div>
            </div>
          </template>
        </div>
        <div class="n-dashboard-nav">
          <div @click="leftBarItemClick('plan')" class="q-mb-md">
            <router-link
              :is="currentUser ? 'router-link' : 'span'"
              to="/training-plan"
              class="n-dashboard-nav__item"
              @click="joinNovosIfPublic"
            >
              <img src="@/assets/trainingPlan/icons/calendar.svg">
              <div class="n-dashboard-nav__item-label q-ml-md">
                <div class="text-h5">
                  Training
                </div>
              </div>
            </router-link>
          </div>

          <div @click="leftBarItemClick('Progress')" class="q-mb-md">
            <router-link
              :is="currentUser ? 'router-link' : 'span'"
              to="/progress"
              class="n-dashboard-nav__item"
              @click="joinNovosIfPublic"
            >
              <img src="@/assets/trainingPlan/icons/progress.svg">
              <div class="n-dashboard-nav__item-label q-ml-md">
                <div class="text-h5">
                  Progress
                </div>
              </div>
            </router-link>
          </div>

          <div @click="leftBarItemClick('tournament')" class="q-mb-md">
            <router-link
              :is="currentUser ? 'router-link' : 'span'"
              to="/tournaments"
              class="n-dashboard-nav__item"
              @click="joinNovosIfPublic"
            >
              <img src="@/assets/icons/trophy.svg">
              <div class="n-dashboard-nav__item-label q-ml-md">
                <div class="text-h5">
                  Tournaments
                </div>
              </div>
            </router-link>
          </div>

          <!-- No need for now - Uncooment for 2.0-->
          <!-- <div @click="leftBarItemClick('Friends group')" class="q-mb-md" style="position:relative">
            <router-link
              class="n-dashboard-nav__item"
              :is="'span'"
              @click="fgJoinClick"
            >
              <img src="@/assets/trainingPlan/icons/friends-group.svg">
              <div class="n-dashboard-nav__item-label q-ml-md">
                <div class="n-dashboard-nav__item-ticker">
                  <div class="text-pink">
                    NEW
                  </div>
                </div>
                <div class="text-h5 text-white">
                  Friends Group
                </div>
              </div>
            </router-link>
          </div> -->

          <div @click="leftBarItemClick('Workshops')" class="q-mb-md" style="position:relative">
            <router-link
              to="/workshops"
              class="n-dashboard-nav__item"
              :is="currentUser ? 'router-link' : 'span'"
              @click="joinNovosIfPublic"
            >
              <img src="@/assets/icons/puzzle-piece-white.svg">
              <div class="n-dashboard-nav__item-label q-ml-md">
                <div class="text-h5 text-white">
                  Workshops
                </div>
              </div>
            </router-link>
          </div>

          <div @click="leftBarItemClick('Notepad')" class="q-mb-md">
            <router-link
              :is="currentUser ? 'router-link' : 'span'"
              to="/notes"
              class="n-dashboard-nav__item"
              @click="joinNovosIfPublic"
            >
              <img src="@/assets/trainingPlan/icons/notepad.svg">
              <div class="n-dashboard-nav__item-label q-ml-md">
                <div class="text-h5">
                  Notepad
                </div>
              </div>
            </router-link>
          </div>

          <div @click="leftBarItemClick('Knowledge')" class="q-mb-md" data-intercom-target="Workshops Sidebar button">
            <router-link
            :is="currentUser ? 'router-link' : 'span'"
              to="/knowledge"
              class="n-dashboard-nav__item"
              @click="joinNovosIfPublic"
            >
              <img src="@/assets/trainingPlan/icons/knowledge.svg">
              <div class="n-dashboard-nav__item-label q-ml-md">
                <div class="text-h5">
                  Knowledge
                </div>
              </div>
            </router-link>
          </div>

          <div @click="leftBarItemClick('Discovery')" class="q-mb-md" style="position:relative">
            <router-link
              to="/discovery"
              class="n-dashboard-nav__item"
              :is="currentUser ? 'router-link' : 'span'"
              @click="joinNovosIfPublic"
            >
              <img src="@/assets/trainingPlan/icons/discovery.svg">
              <div class="n-dashboard-nav__item-label q-ml-md">
                <div class="text-h5 text-white">
                  Discover
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div class="n-dashboard-nav col-grow">
        </div>
        <div class="n-dashboard-nav">
          <div class="support-block"
                :class="{'support-block--active': showSupport}">
            <n-feedback />
          </div>
          <!-- <div @click="leftBarItemClick('support')"
               @mouseover="showSupport = true"
               @mouseleave="showSupport = false"
               class="q-mb-md"
               v-if="$q.screen.gt.xs"
          >
            <div class="n-dashboard-nav__item">
              <img src="@/assets/trainingPlan/icons/help.svg" />
              <div class="n-dashboard-nav__item-label q-ml-md">
                <div class="text-h5">
                  Support
                </div>
              </div>
            </div>
          </div>
          <div @click="onUserLogout()"
            class="n-dashboard-nav__item q-mb-sm-none q-mb-md"
            :class="{
              'n-dashboard-nav__item--disabled': !currentUser,
              'n-dashboard-nav__item--thin': $q.screen.lt.sm
            }"
          >
            <img v-if="$q.screen.gt.xs" src="@/assets/icons/logout.svg" width="24px" />
            <div class="n-dashboard-nav__item-label q-ml-md">
              <div :class="[ $q.screen.lt.sm ? 'text-h3' : 'text-h5' ]">
                Logout
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="n-dashboard__loader" v-if="!pageLoaded">
        <q-circular-progress
          indeterminate
          size="80px"
          color="dark-pink"
          track-color="mid-tone"
        />
      </div>

      <div class="n-dashboard__content bg-dark full-width full-height" :computed="computedFireworks" v-show="pageLoaded">
        <transition name="fade" mode="out-in">
          <router-view @loadedAfterRepeatOnboarding="onLoadedAfterRepeatOnboarding" @loaded="onPageLoad"></router-view>
        </transition>
      </div>

      <oops-modal />

      <modal-sign-up
        :visible="isSignWallVisible"
        @sign-up="showAuthModal"
        @close="hideSignWallModal"
      />

      <modal-upgrade
        v-if="shouldShowUpgradeModalForThisRoute"
        :visible="showModalUpgrade"
        @checkout="checkout"
        @close="setPayWallOff('Close button with trial left')"
      />

      <modal-upgrade-congrats
        :visible="showModalUpgradeCongrats"
        @close="onCloseModalUpgradeCongrats"
      />

      <modal-subscription-details
        v-if="showModalSubscriptions"
        :visible="showModalSubscriptions"
        :referralsData="referralsData"
        @show-referrals="trackAction('Referrals: Click from subscription details'); setShowModalReferrals(true)"
        @close="setShowUserSubscriptions(false)"
        @cancelSubscription="confirmCancelSubscription"
        @open-support="setShowUserSubscriptions(false); showSupport = true"
      />

      <modal-referrals
        v-if="isInReferralProgram"
        :visible="showModalReferrals"
        :referralLink="referralLink"
        :referralsData="referralsData"
        @close="setShowModalReferrals(false)"
      />

      <modal-confirmation
        :visible="showModalConfirmation"
        cancelText="no"
        confirmText="yes"
        @cancel="dontCancelSubscription"
        @confirm="doCancelSubscription"
      >
        Are you sure you want to cancel your subscription?
        <q-input v-model="feedbackModel"
          type="textarea"
          outlined
          placeholder="Please share your feedback"/>
      </modal-confirmation>

      <modal-confirmation
        :visible="showModalUnlinkEpicSuccess"
        :hideCancelButton="true"
        confirmText="OK"
        @confirm="showModalUnlinkEpicSuccess = false"
      >
        <div style="display: flex;flex-direction: column;align-items: center;">
          <c-icon icon="done" :width="$q.screen.xs ? '140px' : '160px'" />
          Unlinked your epic account Successfully
        </div>
      </modal-confirmation>

      <modal-confirmation
        :visible="showModalUnlinkEpic"
        cancelText="no"
        confirmText="yes"
        @cancel="dontUnlinkEpic"
        @confirm="doUnlinkEpic"
      >
        Are you sure you want to unlink your epic account?
      </modal-confirmation>

      <modal-oops-payment
        :visible="isOopsModalVisible"
        @try-again="openModalCheckout"
        @back="goToPlan"
      />

      <modal-platform-news/>

      <n-notes v-if="notesWidgetAvailable && ($q.screen.gt.xs || !leftDrawerOpen)" />

      <modal-tracking-question @confirm="onConfirmTrackingModal" :visible="showModalTracking" />
    </q-page-container>

    <q-drawer
      class="no-background"
      content-class="no-background"
      side="right"
      v-if="$slots.right && $q.screen.width > 800 && pageLoaded"
      :dark="false"
      show-if-above
      :width="340">
      <q-scroll-area class="fit">
        <slot name="right" />
      </q-scroll-area>
    </q-drawer>
  </q-layout>
  <q-layout v-else view="lHh Lpr lFf"
            class="n-dashboard-collaboartor"
            :class="{
                'non-selectable': !$q.platform.is.ios,
                }">
    <q-page-container>
      <modal-sign-up
        :visible="isSignWallVisible"
        @sign-up="showAuthModal"
        @close="hideSignWallModal"
      />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import { Fireworks } from 'fireworks-js'
import paymentMixin from '@/mixins/payment.mixin'
import SkillIcons from '@/components/common/skill-icons-manager'

export default {
  components: {
    'oops-modal': () => import('@/components/dashboard/modal/modal-oops'),
    'user-avatar': () => import('@/components/common/user-avatar'),
    'n-feedback': () => import('@/components/common/feedback'),
    'n-notes': () => import('@/components/notes/widget'),
    'c-day-activities': () => import('@/components/common/day-activities-info'),
    'c-skill-icons': SkillIcons,
    'modal-confirmation': () => import('components/common/modal/modal-confirmation'),
    'modal-subscription-details': () => import('components/payment/modal/modal-subscription-details'),
    'modal-referrals': () => import('@/components/referrals/modal-referrals.vue'),
    'modal-upgrade-congrats': () => import('@/components/payment/modal/modal-upgrade-congrats.vue'),
    'modal-oops-payment': () => import('@/components/dashboard/modal/modal-oops-payment'),
    'modal-upgrade': () => import('@/components/payment/modal/modal-upgrade.vue'),
    'modal-sign-up': () => import('@/components/common/modal/modal-sign-up.vue'),
    'modal-tracking-question': () => import('@/components/common/modal/modal-tracking-question.vue'),
    'modal-platform-news': () => import('components/common/modal/modal-platform-news')
  },
  mixins: [paymentMixin],
  props: {
    hideIfPublic: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      feedbackModel: '',
      searchQuery: '',
      leftDrawerOpen: this.$q.screen.gt.sm,
      showSupport: false,
      drop: false,
      transitionName: null,
      showModalConfirmation: false,
      showModalUnlinkEpic: false,
      showModalUnlinkEpicSuccess: false,
      showModalUpgradeCongrats: false,
      showModalTracking: false,
      showModalReferrals: false,
      referralsData: null,
      isModalCheckoutVisible: false,
      isOopsModalVisible: false,
      fireworks: null
    }
  },
  created () {
    setTimeout(() => {
      this.fireworksMounting()
    }, 200)
    setTimeout(() => {
      if (!this.showModalUpgrade && !this.isAllowedToUsePlatform) {
        if (this.$q.platform.is.mobile) return
        this.setPayWallMethod('OnTimeout')
      } else {
        this.finishLoadingPaymentDetails(true)
      }
    }, 1500)
  },
  mounted () {
    if (this.currentUser) {
      this.getPlatformUpdates()
    }

    if (this.$route.query.checkoutstatus === 'APPROVED') {
      this.trackAction('Payments: Show Congrats Modal')
      this.showModalUpgradeCongrats = true
    } else if (this.$route.query.checkoutstatus === 'ERROR' || this.$route.query.checkoutstatus === 'DECLINED') {
      this.trackAction('Payments: Show Oops Modal', {
        checkoutid: this.$route.query.checkoutid,
        checkoutstatus: this.$route.query.checkoutstatus
      })
      this.setHasError(true)
    }

    if (this.$route.query.referral) {
      this.joinReferralProgram(this.currentUser.id)
        .then(() => this.setShowModalReferrals(true))
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser',
      computedUserDisplayName: 'user/currentUserComputedName',
      userSubscription: 'payments/userSubscription',
      subscriptionStatus: 'payments/userSubscriptionStatus',
      subscriptionPaymentMode: 'payments/userSubscriptionPaymentMode',
      showModalUpgrade: 'payments/showPaywall',
      showModalSubscriptions: 'payments/showUserSubscriptions',
      isAllowedToUsePlatform: 'user/isAllowedToUsePlatform'
    }),
    ...mapState({
      platformUpdates: state => state.updates.platformUpdates,
      pageLoaded: state => state.common.pageLoaded,
      signupReferralCode: state => state.common.signupReferralCode,
      isSignWallVisible: state => state.common.isSignWallVisible
    }),
    computedCurrentUserEpicId () {
      return this.currentUser?.epicId || null
    },
    shouldShowUpgradeModalForThisRoute () {
      return this.showModalUpgrade && !this.$route.matched.some(route => route.meta.suppressPaywall)
    },
    isInReferralProgram () {
      return this.isPaidUser && this.subscriptionPaymentMode === 'creditcard' && this.currentUser?.referralId
    },
    referralLink () {
      return window.location.origin + this.$router.resolve({
        name: 'ReferralRedirect',
        params: { referralId: this.currentUser?.referralId }
      }).href
    },

    computedUpdates () {
      if (!this.platformUpdates || !this.platformUpdates.length) {
        return []
      } else {
        return this.platformUpdates
      }
    },
    computedFireworks  () {
      if (this.showModalUpgradeCongrats) {
        this.fireworks && this.fireworks.start()
      } else {
        this.fireworks && this.fireworks.stop()
      }
      return true
    },
    computedUserType () {
      return 'Free trial'
    },
    notesWidgetAvailable () {
      return this.$route.matched.some(route => route.meta.showNotesWidget) && !this.showModalUpgrade
    },
    isFullScreenMode () {
      return this.$route.meta.fullscreen
    },
    fgTypeformModalUrl () {
      return `https://novos.typeform.com/to/DYaze7m8#email=${this.currentUser.email}`
    }
  },
  methods: {
    ...mapActions({
      userLogout: 'user/logout',
      getPlatformUpdates: 'updates/getPlatformUpdates'
    }),
    ...mapMutations({
      toggleSignWallModal: 'common/toggleSignWallModal',
      finishLoadingPaymentDetails: 'payments/setIsPaymentDetailsFinishLoading',
      setShowPreferencesdModalString: 'common/setShowPreferencesdModalString'
    }),
    hideSignWallModal () {
      if (this.$route.path.includes('/public/routines')) {
        this.trackAction('Shared content: Open Sign UP CTA Modal: Click Not Now')
      }
      if (this.$route.path.includes('/public/workshops')) {
        this.trackAction('Workshops: Open Sign UP CTA Modal: Click Not Now')
      }
      if (this.$route.path.includes('/public/knowledge')) {
        this.trackAction('Knowledge: Open Sign UP CTA Modal: Click Not Now')
      }
      if (this.$route.path.includes('/partner')) {
        this.trackAction('Partners: Open Sign UP CTA Modal: Click Not Now')
      }

      this.toggleSignWallModal(false)
    },
    showAuthModal () {
      if (this.$route.path.includes('/public/routines')) {
        this.trackAction('Shared content: Open Sign UP CTA Modal: Click CTA')
      }
      if (this.$route.path.includes('/public/workshops')) {
        this.trackAction('Workshops: Open Sign UP CTA Modal: Click CTA')
      }
      if (this.$route.path.includes('/public/knowledge')) {
        this.trackAction('Knowledge: Open Sign UP CTA Modal: Click CTA')
      }
      if (this.$route.path.includes('/partner')) {
        this.trackAction('Partners: Open Sign UP CTA Modal: Click CTA')
      }
      this.toggleSignWallModal(false)
      this.$router.push({ path: '/', query: { promocode: this.signupReferralCode } })
    },
    showRankModal () {
      this.visible = !this.visible
      this.trackAction('TP: Click view ranks')
    },
    leftBarItemClick (type) {
      this.trackAction('TP: Click left panel ', {
        option: type
      })
    },
    onSearch () {
      this.trackAction('TP: Search')
    },
    onUserLogout () {
      if (!this.currentUser) { return }

      this.leftBarItemClick('logout')
      this.userLogout().then(() => {
        this.$router.replace('/login')
      })
    },
    userAvatarNavLogout () {
      if (!this.currentUser) { return }

      this.trackAction('User Avatar Nav Logout click')
      this.userLogout().then(() => {
        this.$router.replace('/login')
      })
    },
    onJoinFriend () {
      this.$router.replace('/friend-group')
    },
    showSubscriptionModal () {
      this.setShowUserSubscriptions(true)
    },
    setShowModalReferrals (value) {
      if (value) {
        this.trackAction('Referrals: Open referral modal')
        this.refreshReferralsData()
      } else {
        this.trackAction('Referrals: Close referral modal')
      }
      this.showModalReferrals = value
    },
    async refreshReferralsData () {
      if (this.isInReferralProgram) {
        this.referralsData = await this.getReferralsData(this.currentUser.id)
      } else {
        this.referralsData = null
      }
    },
    avatarClick () {
      this.drop = !this.drop
    },
    joinNovosIfPublic () {
      this.trackAction('Public: Show paywall modal')
      this.toggleSignWallModal(true)
    },
    updatesClickHandler (link) {
      if (link) {
        this.trackAction('TP: updates', { link })
        this.$router.push(`/${link}`)
      }
    },
    ...mapMutations({
      setHasError: 'common/setHasError',
      togglePageLoaded: 'common/togglePageLoaded'
    }),
    ...mapActions({
      joinReferralProgram: 'user/joinReferralProgram',
      getReferralsData: 'user/getReferralsData',
      getCheckoutPageUrl: 'payments/getCheckoutPageUrl',
      reloadUser: 'user/loadUser',
      unlinkUserEpicId: 'user/unlinkUserEpicId',
      cancelSubscription: 'payments/cancelSubscription'
    }),
    onPageLoad (source) {
      setTimeout(() => {
        if (!this.showModalUpgrade && !this.isAllowedToUsePlatform) {
          if (this.$q.platform.is.mobile) return
          this.setPayWallMethod('OnTimeout After loading source', source)
        }
      }, 1500)
    },
    onLoadedAfterRepeatOnboarding () {
      this.showModalTracking = true
    },
    async checkout ({ planId, couponCode }) {
      if (!planId) {
        return
      }
      this.trackAction('Payments: Click Upgrade Now', {
        paymentPlanId: planId
      })
      const url = await this.getCheckoutPageUrl({
        userId: this.currentUser.id,
        paymentPlanId: planId,
        couponCode
      })
      window.location.href = url
    },

    confirmCancelSubscription () {
      this.trackAction('Payments: Click Cancel Subscription')
      this.showModalConfirmation = true
    },

    dontCancelSubscription () {
      this.trackAction('Payments: Show Cancel Subscription: No')
      this.showModalConfirmation = false
    },
    doCancelSubscription () {
      this.trackAction('Payments: Show Cancel Subscription: Yes', { reason: this.feedbackModel })
      this.showModalConfirmation = false
      this.togglePageLoaded(false)
      this.cancelSubscription()
        .then(() => this.reloadUser())
        .finally(() => {
          this.togglePageLoaded(true)
          this.setShowUserSubscriptions(false)
        })
    },

    dontUnlinkEpic () {
      this.trackAction('Settings: Show Unlink epic modal: No')
      this.showModalUnlinkEpic = false
    },
    doUnlinkEpic () {
      this.trackAction('Settings: Show Unlink epic modal: Yes')
      this.showModalUnlinkEpic = false
      this.togglePageLoaded(false)
      this.unlinkUserEpicId({ userId: this.currentUser.id })
        .then(() => {
          this.reloadUser()
          this.showModalUnlinkEpicSuccess = true
        })
        .finally(() => this.togglePageLoaded(true))
    },

    showUnlinkEpicModal () {
      this.trackAction('Settings: doUnlinkEpic')
      this.showModalUnlinkEpic = true
    },

    fireworksMounting () {
      const container = document.querySelector('.n-dashboard__content')

      if (container) {
        this.fireworks = new Fireworks({
          target: container,
          hue: 120,
          startDelay: 1,
          minDelay: 1,
          maxDelay: 3,
          speed: 7,
          acceleration: 1.05,
          friction: 0.98,
          gravity: 1,
          particles: 150,
          trace: 1,
          explosion: 5,
          boundaries: {
            top: 50,
            bottom: container.clientHeight,
            left: (container.clientWidth / 2) - 300,
            right: (container.clientWidth / 2) + 300
          },
          sound: {
            enable: false
          }
        })
      }
    },

    openModalCheckout () {
      this.isModalCheckoutVisible = true
      this.isOopsModalVisible = false
      this.setPaywall({ show: false })
    },

    closeModalCheckout () {
      this.isModalCheckoutVisible = false
    },

    handleCheckoutStatus (isSuccess) {
      if (isSuccess) {
        this.trackAction('Payments: Show Congrats Modal')
        this.showModalUpgradeCongrats = true
      } else {
        this.trackAction('Payments: Show Oops Modal', {
          checkoutid: this.$route.query.checkoutid,
          checkoutstatus: this.$route.query.checkoutstatus
        })
        this.isOopsModalVisible = true
      }
      this.isModalCheckoutVisible = false
    },

    replaceModalFromDelayedPaymentWebhook () {
      this.hideModalUpgrade()
      this.setShowUserSubscriptions(true)
    },

    onCloseModalUpgradeCongrats () {
      this.reloadUser()
      this.showModalUpgradeCongrats = false
      this.showModalTracking = true
    },

    onConfirmTrackingModal (shouldShowPrefernces) {
      if (shouldShowPrefernces) {
        this.setShowPreferencesdModalString('main')
      }
      this.showModalTracking = false
      this.startProductWalkthrough()
    },

    startProductWalkthrough () {
      const referralCode = this.currentUser.referralLink
      this.$router.push({
        name: 'TrainingPlan',
        query: {
          start_tour: !referralCode || undefined,
          start_collaborator_tour: referralCode || undefined
        }
      })
    },

    goToPlan () {
      this.isOopsModalVisible = false
      this.$router.push('/training-plan')
    }
    // Not in use for now until we'll develope FG 2.0
    // fgJoinClick () {
    //   if (!this.isPaidUser &&
    //       this.trialDaysLeft <= 0 &&
    //       !this.isPaymentDemoUser &&
    //       this.$q.platform.is.mobile) {
    //     return this.setPayWallMethod('Click friendsgroup')
    //   }
    //   window.open(this.fgTypeformModalUrl, '_blank')
    // }
  },

  watch: {
    showModalUpgrade (val) {
      if (val) {
        this.togglePageLoaded(false)
        this.reloadUser().then(() => {
          this.togglePageLoaded(true)
          if (this.isPaidUser) {
            this.replaceModalFromDelayedPaymentWebhook()
          }
        })
      }
    },

    async showModalSubscriptions (val) {
      if (val) {
        this.refreshReferralsData()
      }
    }
  }
}
</script>

<style lang="scss">
.q-page-container{
  min-height: var(--app-height);
}
.n-dashboard-collaboartor{
  width: 100%;
  height: var(--app-height);
  min-height: var(--app-height) !important;
  &.non-selectable{
    * {
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
    }
  }
}
.n-dashboard{
  $root: &;
  background: var(--app-bg);
  background-size: cover;
  background-attachment: fixed;
  overflow: hidden;
  width: 100%;
  height: var(--app-height);
  min-height: var(--app-height) !important;
  &.non-selectable{
    * {
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
    }
  }
  @media (max-width: $breakpoint-xs-max) {
    background: $dark;
    height: auto;
    .q-header{
      background: $dark!important;
      border-bottom: 1px solid $soft-tone;
    }
  }
  .q-drawer{
    background: none;
    @media (max-width: $breakpoint-xs-max) {
      background: $dark;
    }
  }
  &__loader{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(var(--app-height) - 200px)!important;
  }
  &__content{
    height: calc(var(--app-height) - 80px)!important;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, .3);
    overflow: hidden;

    & > div {
      height: 100%;
    }

    @media (max-width: $breakpoint-xs-max) {
      overflow: auto;
      height: auto!important;
      border-radius: 0;
    }
    @media (max-width: $breakpoint-sm-max) {
      box-shadow: none;
    }
  }
  &-nav{
    display: flex;
    flex-direction: column;

    &__close-btn {
      position: absolute;
      cursor: pointer;
      top: 21px;
      right: 20px;
      z-index: 99;
      @media (max-width: $breakpoint-xs-max) {
        top: 18px;
      }
    }

    &__item{
      width: 100%;
      height: 50px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-radius: 12px;
      padding: 10px;
      &--thin {
        div {
          font-weight: initial;
        }
      }
      &-ticker {
        position: absolute;
        top: -12px;
        right: -20%;
        font-size:12px;
      }
      &-label {
        position: relative;
        color: white;
      }
      &:hover{
        background: $soft-tone;
        cursor: pointer;
        text-decoration: none;
      }
      &.router-link-active{
        background: $dark-pink;
        opacity: 1;
        cursor: pointer;
        pointer-events: all;
      }
      &--disabled, &.disabled{
        opacity: .5;
        cursor: not-allowed;
      }
    }
    @media (max-width: $breakpoint-md-max) {
      &__item{
        height: 45px;
        img{
          width: 20px;
        }
      }
    }
    @media (max-width: $breakpoint-xs-max) {
      &__item{
        height: 50px;
        background: $mid-tone;
        img {
          margin-left: calc(50% - 60px);
        }
        &--thin {
          background: none;
          border: 1.5px solid $soft-tone;
          border-radius: 6px;
        }
        &--thin &-label {
          color: $light-pink;
          margin: 0 auto;
          text-align: center;
        }
        &.router-link-active &-label {
          color: $dark-pink;
        }
        &.router-link-active{
          background: $mid-tone;
          border: 1.5px solid $dark-pink;
        }
      }
    }
  }
  .user-info{
    border-left: 2px solid $soft-tone;
    @media (max-width: $breakpoint-xs-max) {
      font-size: 12px;
      .text-h5{
        font-size: 12px;
        line-height: 18px;
      }
      .text-h4{
        font-size: 16px;
      }
    }
    &--mobile{
      @media (max-width: $breakpoint-410-max) {
        display: flex;
        align-items: center;
        text-align: left;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: center;
        .text-center{
          text-align: left;
          margin-left: 10%;
        }
      }
    }
  }
  .score-block{
    display: flex;
    position: relative;
    margin: 0 auto;
    &__info{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &-goal{
        width: 70%;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid $soft-tone;
      }
    }
  }
  .premium-square{
    text-align: center;
    &--active {
      background: rgba(221, 38, 120, 0.3);
      border: 1.5px solid $bright-pink;
    }
    &--cancelled {
      background: rgba(255, 166, 0, 0.3);
      border: 1.5px solid $orange-4;
    }
    border-radius: 6px;
    width: 85px;
    font-size: 12px;
    cursor: pointer;
  }
  .user-mobile-nav{
    position: absolute;
    top: 100%;
    right: 0;
    background: $mid-tone;
    border-radius: 6px;
    z-index: 10;
    width: 200px;
    overflow: hidden;
    border: 1px solid $soft-tone;
    div{
      padding: 10px;
      font-size: 14px;
      overflow: hidden;
      cursor: pointer;
      color: #fff;
      text-align: left;
      border-bottom: 1px solid $dark-one;
      &:hover{
        color: $dark-pink;
        background: $soft-tone;
      }
    }
  }
  .support-block{
    position: fixed;
    left: 20px;
    bottom: 20px;
    z-index: 20;
    transition: all .2s ease-in-out;
    width: 390px;
    transform: translateY(150%);

    &--mobile{
      left: initial;
      bottom: initial;
      right: 20px;
      top: 20px;
      width: 90%;
      max-width: 330px;
      transform: translateY(-150%);
      @media (min-width: $breakpoint-sm-min) {
        display: none;
      }
    }

    &--active{
      box-shadow: 4px 4px 16px rgba(0, 0, 0, .3);
      transform: translateY(0);
    }
  }

  &--full-screen{
    #{$root}__content{
      height: var(--app-height)!important;
    }
  }
}

.marquee-container{
  background: $soft-tone;
  width: 518px !important;
  height: 45px !important;
  border-radius: 6px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s, transform .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(10px);
}
.fg-join-btn-link {
  color: #fff !important;
  text-transform: none !important;
  &:hover{
    cursor: pointer;
    text-decoration: none;
  }
  @media (max-width: $breakpoint-sm-max) {
    padding-left: 1px;
  }
}
</style>
