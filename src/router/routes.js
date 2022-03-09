import Loading from '@/components/common/loading'
import { routeNames } from '@/router/routeNames'

/**
 * WARN: This will break beforeRoute router hooks. Do not use if
 * beforeRouteEnter, etc are defined on the component
 */
function lazyLoadView (AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    loading: Loading,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400
  })

  return Promise.resolve({
    functional: true,
    render (h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    }
  })
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => lazyLoadView(import('pages/Login/index.vue')) }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login/index.vue') }
    ]
  },
  {
    path: '/referral/:referralId',
    name: 'ReferralRedirect',
    redirect: route => ({
      path: '/',
      query: { referral: route.params.referralId }
    })
  },
  {
    path: '/collaborators',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'collabLogin',
        component: () => lazyLoadView(import('pages/Collaborators/Login/index.vue'))
      },
      {
        path: 'dashboard',
        component: () => import('layouts/CollaboratorLayout.vue'),
        children: [
          {
            path: '',
            name: 'collabDashboard',
            component: () => lazyLoadView(import('pages/Collaborators/Dashboard/index.vue'))
          }
        ]
      }
    ]
  },
  {
    path: '/onboarding',
    meta: {
      requireLogin: true
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Onboarding',
        component: () => lazyLoadView(import('pages/Onboarding/index.vue'))
      }
    ]
  },
  {
    path: '/onboarding-repeat',
    meta: {
      requireLogin: true
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => lazyLoadView(import('pages/OnboardingRepeat/index.vue')) },
      {
        path: 'link-epic-account',
        name: 'LinkEpic',
        component: () => import('@/pages/OnboardingRepeat/LinkEpic.vue')
      }
    ]
  },
  {
    path: '/training-plan',
    name: routeNames.TRAINING_PLAN_ROOT,
    meta: {
      requireLogin: true,
      showNotesWidget: true
    },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: routeNames.TRAINING_PLAN_INDEX,
        component: () => lazyLoadView(import('pages/TrainingPlan/index'))
      },
      {
        path: 'routines/:id',
        meta: {
          widgetOption: 'routine',
          fullscreen: true
        },
        component: () => lazyLoadView(import('layouts/SimpleLayout.vue')),
        children: [
          {
            path: '',
            meta: {
              fullscreen: true
            },
            name: 'RoutineDetailsNew',
            component: () => import('pages/TrainingRoutineNew'),
            props: route => ({ routineId: route.params.id, userRoutineId: route.query.userTrainingActivityId })
          },
          {
            path: 'sessions/:sessionId',
            meta: {
              fullscreen: true
            },
            name: 'SessionDetailsNew',
            component: () => import('pages/TrainingRoutineNew'),
            props: route => ({
              routineId: route.params.id,
              userRoutineId: route.query.userTrainingActivityId,
              sessionId: route.params.sessionId
            })
          }
        ]
      },
      {
        path: 'knowledge',
        meta: {
          showNotesWidget: true
        },
        component: () => import('layouts/SimpleLayout.vue'),
        children: [
          {
            path: ':id',
            name: 'Knowledge',
            component: () => lazyLoadView(import('pages/Knowledge/index.vue')),
            children: [
              {
                path: ':subid',
                name: 'InVideo',
                component: () => import('pages/Knowledge/_id')
              }
            ]
          }
        ]
      },
      {
        path: 'workshops',
        meta: {
          showNotesWidget: true
        },
        component: () => import('layouts/SimpleLayout.vue'),
        children: [
          {
            path: '',
            name: 'WorkshopTrainingPlanAll',
            component: () => lazyLoadView(import('pages/Workshops/index.vue'))
          },
          {
            path: ':workshopId',
            name: 'TrainingPlanWorkshopDetails',
            component: () => lazyLoadView(import('pages/Workshops/WorkshopDetails.vue')),
            props: route => ({ workshopId: route.params.workshopId })
          }
        ]
      }
    ]
  },
  {
    path: '/knowledge',
    meta: {
      requireLogin: true,
      showNotesWidget: true
    },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'KnowledgeAll',
        component: () => lazyLoadView(import('pages/Knowledge/index.vue')),
        children: [
          {
            path: ':subid',
            name: 'InVideo2',
            component: () => import('pages/Knowledge/_id')
          }
        ]
      }
    ]
  },
  {
    path: '/workshops',
    name: routeNames.WORKSHOP_ROOT,
    meta: {
      showNotesWidget: true,
      requireLogin: true
    },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: routeNames.WORKSHOP_INDEX,
        component: () => lazyLoadView(import('pages/Workshops/index.vue'))
      },
      {
        path: ':workshopId',
        name: 'WorkshopDetails',
        component: () => lazyLoadView(import('pages/Workshops/WorkshopDetails.vue')),
        props: route => ({ workshopId: route.params.workshopId })
      }
    ]
  },
  {
    path: '/discovery',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requireLogin: true
    },
    children: [
      {
        path: '',
        name: 'Discovery',
        component: () => lazyLoadView(import('pages/ContentDiscovery/index.vue'))
      },
      {
        path: 'routines/:id',
        component: () => lazyLoadView(import('layouts/SimpleLayout.vue')),
        meta: {
          widgetOption: 'routine',
          fullscreen: true
        },
        children: [
          {
            path: '',
            name: 'DiscoveryRoutineDetails',
            component: () => import('pages/TrainingRoutineNew'),
            meta: {
              fullscreen: true
            },
            props: route => ({ routineId: route.params.id, userRoutineId: route.query.userTrainingActivityId })
          },
          {
            path: 'sessions/:sessionId',
            name: 'DiscoverySessionDetails',
            component: () => import('pages/TrainingRoutineNew'),
            meta: {
              fullscreen: true
            },
            props: route => ({
              routineId: route.params.id,
              userRoutineId: route.query.userTrainingActivityId,
              sessionId: route.params.sessionId
            })
          }
        ]
      }
    ]
  },
  {
    path: '/progress',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requireLogin: true
    },
    children: [
      {
        path: '',
        name: 'Progress',
        component: () => (import('pages/Progress'))
      }
    ]
  },
  {
    path: '/public',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      showNotesWidget: false,
      suppressPaywall: true,
      requireLogin: false
    },
    children: [
      {
        path: 'workshops/:workshopId',
        name: 'WorkshopPublicDetails',
        component: () => lazyLoadView(import('pages/Workshops/WorkshopDetails.vue')),
        meta: {
          redirectAuthorizedOnly: true,
          redirectTo: { name: 'WorkshopDetails' }
        },
        props: route => ({ workshopId: route.params.workshopId })
      },
      {
        path: 'knowledge/:knowledgeId',
        name: 'PublicKnowledge',
        component: () => lazyLoadView(import('pages/Knowledge/indexPublic.vue')),
        meta: {
          redirectAuthorizedOnly: true,
          redirectTo: route => ({ name: 'InVideo2', params: { subid: route.params.knowledgeId } })
        },
        props: route => ({ knowledgeId: route.params.knowledgeId })
      },
      {
        path: 'routines/:id',
        component: () => lazyLoadView(import('layouts/SimpleLayout.vue')),
        meta: {
          redirectAuthorizedOnly: true,
          redirectTo: to => ({
            path: to.fullPath.replace('public', 'discovery'),
            replace: true
          }),
          fullscreen: true
        },
        children: [
          {
            path: '',
            name: 'PublicRoutineDetails',
            component: () => import('pages/TrainingRoutineNew'),
            meta: {
              fullscreen: true
            },
            props: route => ({ routineId: route.params.id, userRoutineId: route.query.userTrainingActivityId })
          },
          {
            path: 'sessions/:sessionId',
            name: 'PublicSessionDetails',
            component: () => import('pages/TrainingRoutineNew'),
            meta: {
              fullscreen: true
            },
            props: route => ({
              routineId: route.params.id,
              userRoutineId: route.query.userTrainingActivityId,
              sessionId: route.params.sessionId
            })
          }
        ]
      }
    ]
  },
  {
    path: '/partner',
    meta: {
      requireLogin: false,
      optionalLogin: true,
      suppressPaywall: true,
      showNotesWidget: false
    },
    component: () => import('layouts/DashboardLayout.vue'),
    props: { hideIfPublic: true },
    children: [
      {
        path: ':id',
        name: 'Partner',
        component: () => lazyLoadView(import('pages/Partners/index')),
        props: route => ({ partnerId: route.params.id })
      }
    ]
  },
  {
    path: '/activities',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: {
      requireLogin: true
    },
    children: [
      {
        path: '',
        name: 'Activities',
        component: () => lazyLoadView(import('pages/Activities'))
      },
      {
        path: ':id',
        name: 'PlayerActivities',
        component: () => lazyLoadView(import('pages/Activities/single')),
        props: route => ({ partnerId: route.params.id })
      }
    ]
  },
  /* ========= CONTENT end ========= */

  {
    path: '/notes',
    meta: {
      requireLogin: true
    },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'Notes',
        component: () => lazyLoadView(import('pages/Notes/index.vue')),
        children: [
          {
            path: ':noteId',
            name: 'NoteDetails',
            component: () => import('pages/Notes/NoteDetails.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/tournaments',
    meta: {
      requireLogin: true
    },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'Tournaments',
        component: () => lazyLoadView(import('pages/Tournaments'))
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: {
      requireLogin: true,
      requireAdmin: true
    },
    children: [
      {
        path: '',
        name: 'AdminIndex',
        component: () => import('pages/Admin/index.vue')
      },
      {
        path: 'routines',
        component: () => import('layouts/SimpleLayout.vue'),
        children: [
          {
            path: 'dashboard',
            name: 'RoutineDashboard',
            component: () => import('pages/Admin/Routine/RoutineDashboard.vue')
          },
          {
            path: '',
            name: 'RoutineList',
            component: () => import('pages/Admin/Routine/RoutineList.vue')
          },
          {
            path: 'create',
            name: 'RoutineCreate',
            component: () => import('pages/Admin/Routine/RoutineCreate.vue')
          },
          {
            path: ':routineId',
            name: 'RoutineEdit',
            component: () => import('pages/Admin/Routine/RoutineEdit.vue')
          }
        ]
      },
      {
        path: 'sessions',
        component: () => import('layouts/SimpleLayout.vue'),
        children:
          [
            {
              path: '',
              name: 'SessionList',
              component: () => import('pages/Admin/Session/SessionList.vue')
            },
            {
              path: 'create',
              name: 'SessionCreate',
              component: () => import('pages/Admin/Session/SessionCreate.vue')
            },
            {
              path: ':sessionId',
              name: 'SessionEdit',
              component: () => import('pages/Admin/Session/SessionEdit.vue')
            }
          ]
      },
      {
        path: 'knowledge',
        component: () => import('layouts/SimpleLayout.vue'),
        children:
          [
            {
              path: '',
              name: 'KnowledgeList',
              component: () => import('pages/Admin/KnowledgeTime/KnowledgeList.vue')
            },
            {
              path: 'create',
              name: 'KnowledgeCreate',
              component: () => import('pages/Admin/KnowledgeTime/KnowledgeCreate.vue')
            },
            {
              path: ':knowledgeTimeId',
              name: 'KnowledgeEdit',
              component: () => import('pages/Admin/KnowledgeTime/KnowledgeEdit.vue')
            },
            {
              path: 'thumbnails',
              name: 'KnowledgeThumbnails',
              component: () => import('pages/Admin/KnowledgeTime/Thumbnails.vue')
            }
          ]
      },
      {
        path: 'videos',
        component: () => import('layouts/SimpleLayout.vue'),
        children: [
          {
            path: '',
            name: 'VideosMuxHelp',
            component: () => import('pages/Admin/Videos/mux.vue')
          }
        ]
      },
      {
        path: 'accessCode',
        component: () => import('layouts/SimpleLayout.vue'),
        children: [
          {
            path: '',
            name: 'AccessCodeList',
            component: () => import('pages/Admin/AccessCode/AccessCodeList.vue')
          }
        ]
      },
      {
        path: 'notifications',
        component: () => import('layouts/SimpleLayout.vue'),
        children: [
          {
            path: '',
            name: 'Notifications',
            component: () => import('pages/Admin/Notifications.vue')
          }
        ]
      },
      {
        path: 'workshops',
        component: () => import('layouts/SimpleLayout.vue'),
        children: [
          {
            path: 'create',
            name: 'WorkshopCreate',
            component: () => import('pages/Admin/Workshops/edit.vue'),
            props: { isCreate: true }
          },
          {
            path: 'edit/:workshopId',
            name: 'WorkshopEdit',
            component: () => import('pages/Admin/Workshops/edit.vue'),
            props: { isCreate: false }
          },
          {
            path: '',
            name: 'WorkshopsList',
            component: () => import('pages/Admin/Workshops/List.vue')
          }
        ]
      },
      {
        path: 'tournaments',
        component: () => import('layouts/SimpleLayout.vue'),
        children: [
          {
            path: 'create',
            name: 'TournamentCreate',
            component: () => import('pages/Admin/Tournaments/Create.vue')
          },
          {
            path: 'edit/:id',
            name: 'TournamentEdit',
            component: () => import('pages/Admin/Tournaments/Edit.vue')
          },
          {
            path: '',
            name: 'TournamentsList',
            component: () => import('pages/Admin/Tournaments/List.vue')
          }
        ]
      },
      {
        path: 'partners',
        component: () => import('@/layouts/SimpleLayout'),
        children: [
          {
            path: '',
            name: 'AdminPartnerList',
            component: () => import('@/pages/Admin/Partners/PartnerList')
          },
          {
            path: 'create',
            name: 'AdminPartnerCreate',
            component: () => import('@/pages/Admin/Partners/PartnerCreate')
          },
          {
            path: 'edit/:partnerId',
            name: 'AdminPartnerEdit',
            component: () => import('@/pages/Admin/Partners/PartnerEdit')
          },
          {
            path: 'thumbnails',
            name: 'AdminPartnerThumbnails',
            component: () => import('pages/Admin/Partners/Thumbnails')
          }
        ]
      },
      {
        path: 'refund',
        component: () => import('@/layouts/SimpleLayout'),
        children: [
          {
            path: '',
            name: 'AdminRefund',
            component: () => import('@/pages/Admin/Refund/index')
          }
        ]
      },
      {
        path: 'news',
        component: () => import('@/layouts/SimpleLayout'),
        children: [
          {
            path: '',
            name: 'AdminPlatformNews',
            component: () => import('@/pages/Admin/PlatformNews/index')
          },
          {
            path: 'list',
            name: 'AdminPlatformNewsList',
            component: () => import('@/pages/Admin/PlatformNews/List')
          }
        ]
      }
    ]
  },
  {
    path: '/friend-group',
    meta: {
      requireLogin: true
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'FriendGroup',
        component: () => lazyLoadView(import('pages/FriendGroup/index.vue'))
      }
    ]
  },
  {
    path: '/404',
    component: () => import('pages/404')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

export default routes
