import { Store } from 'vuex'

export default {
  title: 'Modals'
}

export const ModalBasic = () => ({
  title: 'Modal Basic',
  components: {
    'n-modal': () => import('@/components/dashboard/modal')
  },
  template: `
    <div>
      <n-modal visible show-close>
        <div class="full-width q-pa-xl">
          This is base modal
        </div>
      </n-modal>
    </div>`
})

export const TournamentConfirmModal = () => ({
  title: 'TournamentConfirmModal',
  components: {
    'tournament-confirm-modal': () => import('@/components/tournaments/modal/modal-confirm-update')
  },
  template: `
    <div>
      <tournament-confirm-modal visible show-close />
    </div>`
})

export const TournamentRemoveModal = () => ({
  title: 'TournamentRemoveModal',
  components: {
    'tournament-remove-modal': () => import('@/components/tournaments/modal/modal-tournament-delete')
  },
  template: `
    <div>
      <tournament-remove-modal visible show-close />
    </div>`
})

export const TournamentRemoveModalSuccess = () => ({
  title: 'TournamentRemoveModalSuccess',
  components: {
    'tournament-remove-modal-success': () => import('@/components/tournaments/modal/modal-tournament-delete-success')
  },
  template: `
    <div>
      <tournament-remove-modal-success visible show-close />
    </div>`
})

export const ModalCommingSoon = () => ({
  title: 'ModalCommingSoon',
  components: {
    'modal-comming-soon': () => import('@/components/dashboard/modal/modal-comming-soon')
  },
  template: `
    <div>
      <modal-comming-soon visible show-close />
    </div>`
})

export const ModalSupportEmail = () => ({
  title: 'ModalSupportEmail',
  components: {
    'modal-support-email': () => import('@/components/common/modal/modal-support-email')
  },
  template: `
    <div>
      <modal-support-email visible show-close />
    </div>`
})

export const ModalUpgradeCongrats = () => ({
  title: 'ModalUpgradeCongrats',
  components: {
    'modal-upgrade-congrats': () => import('@/components/payment/modal/modal-upgrade-congrats.vue')
  },
  template: `
    <div>
      <modal-upgrade-congrats visible show-close />
    </div>`
})

export const ModalConfirmation = () => ({
  title: 'ModalConfirmation',
  components: {
    'modal-confirmation': () => import('@/components/common/modal/modal-confirmation.vue')
  },
  template: `
    <div>
      <modal-confirmation visible show-close />
    </div>`
})

export const ModalSubscriptionDetails = () => ({
  title: 'ModalSubscriptionDetails',
  components: {
    'modal-subscription-details': () => import('@/components/payment/modal/modal-subscription-details.vue')
  },
  template: `
    <div>
      <modal-subscription-details visible show-close />
    </div>`,
  store: new Store({
    modules: {
      payments: {
        namespaced: true,
        getters: {
          userSubscription: () => {
            const nextChargeDate = new Date()
            const updatedAt = new Date()

            return {
              name: 'Test',
              bluesnap: {
                chargeFrequency: 10,
                recurringCharge: 9.90,
                nextChargeDate,
                updatedAt,
                autoRenew: true,
                paymentInfo: {
                  type: 'creditcard',
                  billingContactInfo: { firstName: 'Aaron', lastName: 'Cerebro' },
                  creditCard: {
                    cardType: 'Visa',
                    expirationMonth: 10,
                    expirationYear: 2030,
                    cardLastFourDigits: 1234
                  }
                }
              }
            }
          }
        }
      },
      user: {
        trialDaysLeft: () => 10
      }
    }
  })
})

export const ModalOopsPayment = () => ({
  title: 'ModalOopsPayment',
  components: {
    'modal-oops-payment': () => import('@/components/dashboard/modal/modal-oops-payment')
  },
  template: `
    <div>
      <modal-oops-payment visible show-close />
    </div>`
})

export const ModalUpgrade = () => ({
  title: 'ModalUpgrade',
  components: {
    'modal-upgrade': () => import('@/components/payment/modal/modal-upgrade.vue')
  },
  template: `
    <div>
      <modal-upgrade visible show-close />
    </div>`,
  store: new Store({
    modules: {
      payments: {
        namespaced: true,
        state: {
          plans: [{}]
        },
        actions: {
          getPaymentPlans () {
            return Promise.resolve([])
          }
        },
        getters: {
          plans (state) { return state.plans }
        }
      },

      user: {
        paymentPref: {}
      }
    }
  })
})

export const ModalSignUp = () => ({
  title: 'ModalSignUp',
  components: {
    'modal-sign-up': () => import('@/components/common/modal/modal-sign-up.vue')
  },
  template: `
    <div>
      <modal-sign-up visible show-close />
    </div>`
})

export const ModalOops = () => ({
  title: 'ModalOops',
  components: {
    'oops-modal': () => import('@/components/dashboard/modal/modal-oops')
  },
  template: `
    <div>
      <oops-modal visible show-close />
    </div>`,
  store: new Store({
    modules: {
      common: {
        namespaced: true,
        getters: {
          getHasError: () => true
        }
      }
    }
  })
})
