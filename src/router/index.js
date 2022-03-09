import Vue from 'vue'
import VueRouter from 'vue-router'
import * as LocalStorageService from '@/services/localstorageservice'
import routes from './routes'
import { routeNames } from '@/router/routeNames'
import { sendSegmentEvent } from '@/services/segment'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ store }) {
  const Router = new VueRouter({
    scrollBehavior (to, _, savedPosition) {
      return new Promise(resolve => {
        setTimeout(() => {
          if (to.hash !== undefined && to.hash !== '') {
            const el = document.getElementById(to.hash.substring(1))

            if (el !== null) {
              resolve({ x: 0, y: el.offsetTop - el.scrollHeight })
              return
            }
          }

          resolve(savedPosition || { x: 0, y: 0 })
        }, 100)
      })
    },
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(m => m.meta.requireLogin)) {
      const loggedIn = store.getters['user/isLoggedIn']
      if (!loggedIn) {
        return store.dispatch('user/authorizeUserStored', null, { root: true })
          .then(() => {
            if (!to.matched.some(route => route.name === 'Onboarding') &&
              !store.state.user.completedOnboarding) {
              return next({ name: 'Onboarding' })
            } else {
              return next()
            }
          })
          .catch(() => {
            LocalStorageService.pushLoginReferrer(to)
            next('/login')
          })
      }
    }

    const redirectTarget = to.matched.find(route => route.meta.redirectAuthorizedOnly)
    if (redirectTarget) {
      const isUserLoggedIn = store.getters['user/isLoggedIn']
      if (!isUserLoggedIn) {
        return store.dispatch('user/authorizeUserStored', null, { root: true })
          .then(() => {
            const isAllowedToUsePlatform = store.getters['user/isAllowedToUsePlatform']
            if (!isAllowedToUsePlatform) {
              return next()
            }
            const redirectTo = redirectTarget.meta.redirectTo
            if (typeof redirectTo === 'function') {
              next(redirectTo(to))
            } else if (typeof redirectTo === 'string') {
              next(redirectTo)
            } else {
              if (!redirectTo) {
                console.warn('No target for authorized redirect')
                // Check the router meta config
                // Continue anyway, will just go to original route without redirecting
              }
              next({ ...to, ...redirectTo })
            }
          })
          .catch(() => { next() })
      }
    }
    if (to.matched.some(m => m.meta.optionalLogin)) {
      const loggedIn = store.getters['user/isLoggedIn']
      if (!loggedIn) {
        return store.dispatch('user/authorizeUserStored', null, { root: true })
          .then(() => { next() })
          .catch(() => { next() })
      }
    }
    next()
  })

  Router.beforeEach((to, from, next) => {
    const admin = store.getters['user/isAdmin'] || store.getters['user/isReadonlyAdmin']
    if (to.matched.some(route => route.meta.requireAdmin)) {
      if (admin) {
        next()
      } else {
        next({ path: '/notfound' })
      }
    } else {
      next()
    }
  })

  Router.beforeEach(async (to, from, next) => {
    if (to.matched.some(route => route.name === 'Tournaments')) {
      if (!store.state.tournaments.tournaments.length) {
        store.commit('common/togglePageLoaded', false)
        store.dispatch('tournaments/getTournaments')
          .finally(() => { store.commit('common/togglePageLoaded', true) })
      }
    }

    next()
  })

  const restrictedList = ['KnowledgeAll', 'WorkshopAll', 'Discovery', 'Progress', 'Notes', 'Tournaments']
  Router.beforeEach((to, from, next) => {
    if (!store.getters['user/isAllowedToUsePlatform']) {
      if (to.matched.some(route => restrictedList.includes(route.name))) {
        store.commit('payments/setPaywall', { show: true })
        return next({ name: 'TrainingPlan' })
      }
    }

    next()
  })

  // Handle notification analytics
  Router.beforeEach((to, from, next) => {
    if (to.matched.some(route => route.name === routeNames.TRAINING_PLAN_ROOT)) {
      const { track, trackSource } = to.query

      if (track && trackSource) {
        const source = trackSource.charAt(0).toUpperCase() + trackSource.slice(1)
        if (track === 'training-reminder') {
          sendSegmentEvent(`${source}: Come from reminder in order to continue training`)
        } else if (track === 'generate-new-tp-reminder') {
          sendSegmentEvent(`${source}: Come from reminder in order to generate new training plan`)
        }
      }
    }

    next()
  })

  return Router
}
