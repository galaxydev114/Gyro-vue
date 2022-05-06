<template>
  <div class="activity-page" ref="activityPage">
    <div class="activity-page__sidebar"
         :class="{
            'overflow-hidden': showMenu,
            'active': showInfo,
          }">
<!--      Navigation block-->
      <div class="activity-page__sidebar-nav">
        <div v-if="isLoggedIn" class="flex items-center text-weight-bold text-h5 cursor-pointer"
             @click="goBack">
          <c-icon icon="leftArrowRounded"
                  class="q-mr-sm"/>
          <span class="opacity-25">{{backButtonName}}</span>
        </div>
        <div v-else>
          <c-btn color="dark-pink"
                 size="xs"
                 @click="joinNovosIfPublic"
                 :bold="false">
            {{ $q.screen.xs ? 'Join NOVOS' : 'Want more? Sign up to NOVOS' }}
          </c-btn>
        </div>
        <div class="flex items-center">
          <div class="cursor-pointer" v-if="isLoggedIn" @click="showDropdown = !showDropdown" data-intercom-target="Routine menu">
            <c-btn outline :bold="false" paddingX="5px" noWidth size="sm">
              <q-icon name="more_horiz" class="float-left" color="dark-pink" size="32px" />
            </c-btn>
          </div>
          <div class="activity-page__sidebar-drop-content" v-if="showDropdown"
            @click="showDropdown = false"
            v-outside-click="() => { showDropdown = false }">
            <div v-if="isInActivity" class="cursor-pointer" @click="pickAnotherRoutine">
              Replace Activity
            </div>
            <div class="cursor-pointer">
              <a target="_blank"
                :href="`https://novos.typeform.com/to/BB8F6AKH#type=routine&title=${title}&id=${routineId}&email=${userEmail}`">
                Report inaccurate/outdated
              </a>
            </div>
          </div>
          <!-- <div class="q-ml-md cursor-pointer" @click="setMenu('support')">
            <q-tooltip anchor="top left"
                       v-if="!isResponsive"
                       self="bottom middle"
                       max-width="240px"
                       content-style="background-color: #382B4B; font-size: 14px"
                       :offset="[10, 10]">
              Activity support
            </q-tooltip>
            <c-icon icon="supportPink" class="float-left" width="18px" />
          </div> -->
          <!-- <div class="q-ml-md cursor-pointer" @click="$emit('share')">
            <q-tooltip anchor="top left"
                       v-if="!isResponsive"
                       self="bottom middle"
                       max-width="240px"
                       content-style="background-color: #382B4B; font-size: 14px"
                       :offset="[10, 10]">
              Share
            </q-tooltip>
            <c-icon icon="sharePink" class="float-left" width="18px" />
          </div> -->
          <!-- <div class="q-ml-md cursor-pointer">
            <q-tooltip anchor="top left"
                       v-if="!isResponsive"
                       self="bottom middle"
                       max-width="240px"
                       content-style="background-color: #382B4B; font-size: 14px"
                       :offset="[10, 10]">
              Rate this activity
            </q-tooltip>
            <c-icon icon="starPink" class="float-left" width="18px" />
          </div> -->
          <div v-if="!isSingleSession" class="q-ml-sm cursor-pointer" @click="setMenu('activity')">
            <c-btn outline :bold="false" widthAuto noWidth size="xs" data-intercom-target="Session list button">Session Menu</c-btn>
          </div>
        </div>
      </div>
<!--      Sidebar content-->
      <div ref="sidebar"
           data-intercom-target="Instructions block"
           class="activity-page__sidebar-content"
           :class="{'in-animation in-animation--left': animation}">
        <div v-if="isExclusive" class="rubber-label bg-pink">
          EXCLUSiVE
        </div>
        <!--      Level on mobile-->
        <div class="q-mb-md" v-if="isResponsive && !isMobile">
          <n-difficulty :difficulty="difficulty"/>
        </div>
        <!--      Category name and time-->
        <div class="flex items-center q-mb-lg q-sm-pt-lg activity-page__sidebar-top">
          <div class="text-gray">
            <routine-category :uppercase="false"
                              :category="category"
                              :small="!isResponsive"
                              :xsmall="isResponsive"
                              :size="isResponsive ? '20px' : '28px'"
                              bold/>
          </div>
          <div class="vertical-line q-mx-md"></div>
          <div class="flex items-center">
            <c-icon icon="timer" :width="isResponsive ? '20px' : '28px'" />
            <div class="text-h5 q-ml-sm text-gray">
              {{ isSession ? duration : computedRoutineDuration }} min
            </div>
          </div>
        </div>
        <!--      title and subtitle-->
        <div class="text-h2">
          {{ title }}
        </div>
        <div class="q-mt-sm paragraph-medium" v-if="subtitle">
          {{ subtitle }}
        </div>
        <!--      Shared event -->
        <div class="flex items-center q-mt-lg q-mt-md-xl" v-if="isShared">
          <div class="row full-width q-pb-lg items-center">
            <c-btn @click="$emit('subscribe-to-event')" noWidth v-if="!isUserGoing">
              <c-icon icon="bell" class="q-mr-sm" />
              <span class="q-mr-sm" >Going</span>
            </c-btn>
            <c-btn @click="$emit('unsubscribe-from-event')" noWidth outline v-else>
              <c-icon icon="check" width="14px" class="q-mr-sm" />
              <span class="q-mr-sm" >Going</span>
            </c-btn>
          </div>
          <div class="row full-width items-center justify-between">
            <n-members-going :members="members"/>
            <template v-if="!isResponsive || isMobile">
              <div class="vertical-line q-mx-md" style="height: 35px"></div>
              <n-difficulty :difficulty="difficulty"/>
            </template>
          </div>
          <template v-if="members && members.length">
            <div class="horizontal-line q-my-lg"></div>
            <n-members-list :members="members" />
          </template>
        </div>
        <!--      Author and level-->
        <template v-else>
          <div class="flex items-center q-mt-sm q-mt-md-lg">
            <div class="" data-intercom-target="approved_by">
              <approved-by :author="author" :minimal="isResponsive" />
            </div>
            <template v-if="!isResponsive">
              <div class="vertical-line q-mx-md"></div>
              <div class="">
                <n-difficulty :difficulty="difficulty"/>
              </div>
            </template>
          </div>
        </template>
        <div class="horizontal-line q-my-lg"></div>
        <!--      Timer on mobile-->
        <template v-if="isResponsive && sessionTimerDuration">
          <n-timer :seconds="sessionTimerDuration * 60"
                   :stopTime="stopTimer"
                   style="max-width: unset"
                   :id="sessionId"
                   minimal
                   @start="startTimer"/>
          <div class="horizontal-line q-my-xl"></div>
        </template>
        <!--      Instructions-->
        <template v-if="videoUrl && (isSingleSession || isSession)" >
          <div class="text-h4 text-gray">
            Instructions
          </div>
          <div class="paragraph-small opacity-75 q-mt-sm text-gray">
            Follow the steps bellow to complete this session
          </div>
          <div class="items-list">
            <div class="items-list__item text-gray"
                 v-for="(step, i) in singleSession.steps"
                 :key="`step-${i}`">
              <div class="text-pink q-mb-sm" style="font-size: 12px">
                STEP {{ i + 1 }}
              </div>
              <div class="text-h4 q-mb-xs">
                {{ step.title }}
              </div>
              <div class="paragraph-medium" v-html="step.description"></div>
            </div>
          </div>
        </template>
        <!--      Tips-->
        <template v-if="videoUrl && notes && notes.length">
          <div class="q-mt-md q-mt-md-xl text-gray">
            <div class="text-h4 flex items-center">
              <c-icon icon="tip" class="q-mr-sm" />
              Tips
            </div>
            <div class="paragraph-small opacity-75 q-mt-sm" v-html="notesSubtitle"/>
            <div class="items-list">
              <div class="items-list__item"
                   v-for="(note, i) in notes"
                   :key="`note-${i}`">
                <div class="text-yellow q-mb-sm" style="font-size: 12px">
                  TIP {{ i + 1 }}
                </div>
                <div v-html="note"></div>
              </div>
            </div>
          </div>
        </template>
        <!--      Content part on mobile-->
        <template v-if="isResponsive">
          <div class="flex">
            <div class="q-mt-md full-width" v-if="computedKovaakUrl">
              <n-kovaak-playlist :src="computedKovaakUrl"
                                 :name="computedKovaakName"
                                 minimal
                                 @click="$emit('click-playlist')"/>
            </div>
            <div class="q-mt-md full-width" v-else-if="shouldShowMap">
              <n-creative-map
                minimal
                :title="computedMap.title"
                :tooltipDescription="computedMap.tooltipDescription"
                :mapName="computedMap.mapName"
                :mapCode="computedMap.mapCode"
                @copy="$emit('copy-map-code')"
              />
            </div>
            <div class="q-mt-md full-width" v-if="showBenchmark">
              <div class="full-width bordered q-pa-sm full-height flex items-center">
                <record-select class="full-height" :records="benchmark" defaultSelected="bronze" />
              </div>
            </div>
            <div class="full-width q-mt-sm q-mt-sm" v-if="!isSession">
              <q-card class="full-height" flat>
                <q-card-section class="q-pa-none">
                  <div class="flex justify-between items-center">
                    <div class="text-h5 text-gray">
                      Routine mastery
                    </div>
                    <div class="text-pink full-width q-mt-xs">
                      {{ routineDaysCounter }}x completed
                    </div>
                  </div>
                  <n-routine-mastery :completedMasteriesNum="routineDaysCounter" />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </template>
        <!--      Tags-->
        <div class="q-mt-md q-mt-md-xl" v-if="tagsLessNewUiHack && tagsLessNewUiHack.length">
          <div class="text-h4 text-gray">Tags</div>
          <div class="q-my-md">
            <chip class="chip__tags"
                  v-for="tag of tagsLessNewUiHack"
                  :key="tag">
              {{ tag }}
            </chip>
          </div>
        </div>
        <!--      Credits-->
        <div class="q-mt-md q-mt-md-xl" v-if="credits && credits.length">
          <credits :credits="credits" @copy="copy" :minimal="isResponsive" />
        </div>
      </div>
<!--      Activity menu-->
      <div class="activity-menu"
           v-if="sessions"
           :class="{'activity-menu--active': showMenu}">
        <template v-if="showMenu === 'activity'">
          <div class="row align-center justify-between">
            <div class="text-h4 q-mb-md q-mb-sm-lg">
              Activity menu
            </div>
            <div class="cursor-pointer" data-intercom-target="Close session list">
              <c-icon
                icon="closeCircle"
                width="24px"
                @click="showMenu = false"
              />
            </div>
          </div>
          <c-btn class="full-width" @click="overviewRoutine">
            overview
          </c-btn>
          <div class="text-h4 q-mt-md q-mt-sm-lg">
            Sessions
          </div>
          <ul data-intercom-target="Session list">
            <li v-for="(session, i) in sessions"
                :class="{
                  'is-completed': !!session.isCompleted,
                  'is-current': session.id === sessionId
                  }"
                @click="clickSession(session)"
                :key="`session-${i}`">
              <div class="index">
                {{ i + 1 }}
              </div>
              <div class="text-h5">
                {{ session.title }}
              </div>
              <div class="opacity-5 q-mt-xs">
                {{ session.duration }} minutes
              </div>
            </li>
          </ul>
        </template>
        <template v-if="showMenu === 'support'">
          <div class="row align-center justify-between">
            <div class="text-h4 q-mb-lg">
              Activity support
            </div>
            <div class="cursor-pointer">
              <c-icon
                icon="closeCircle"
                width="24px"
                @click="showMenu = false"
              />
            </div>
          </div>
          <div class="text-grey-6">
            Did you found a bug or a problem with this activity?
            <span class="text-pink">Please report the issue here</span>
          </div>
          <div class="text-h4 q-mt-lg">
            Questions & Answers
          </div>
          <q-list class="full-height">
            <ul>
              <li class="p-none">
                <q-expansion-item default-opened expand-icon-class="q-pr-none">
                  <div class="text-h5 full-width flex items-center" slot="header">
                    Who is the author of this routine?
                  </div>
                  <q-card class="q-pt-none">
                    <div class="text-gray text-weight-regular q-px-md q-pb-md" style="font-size: 16px">
                      Want to win more fights in-game? This routine will help you do that.
                      A lot of techniques need to be executed during a fight. To make sure
                      you don’t mess up your edits and come prepared for your next battle you have to practice your skills.
                    </div>
                  </q-card>
                </q-expansion-item>
              </li>
              <li class="p-none">
                <q-expansion-item expand-icon-class="q-pr-none">
                  <div class="text-h5 full-width flex items-center" slot="header">
                    Who is the author of this routine?
                  </div>
                  <q-card class="q-pt-none">
                    <div class="text-gray text-weight-regular q-px-md q-pb-md" style="font-size: 16px">
                      Want to win more fights in-game? This routine will help you do that.
                      A lot of techniques need to be executed during a fight. To make sure
                      you don’t mess up your edits and come prepared for your next battle you have to practice your skills.
                    </div>
                  </q-card>
                </q-expansion-item>
              </li>
              <li class="p-none">
                <q-expansion-item expand-icon-class="q-pr-none">
                  <div class="text-h5 full-width flex items-center" slot="header">
                    How can this activity help me improove my gameplay?
                  </div>
                  <q-card class="q-pt-none">
                    <div class="text-gray text-weight-regular q-px-md q-pb-md" style="font-size: 16px">
                      Want to win more fights in-game? This routine will help you do that.
                      A lot of techniques need to be executed during a fight. To make sure
                      you don’t mess up your edits and come prepared for your next battle you have to practice your skills.
                    </div>
                  </q-card>
                </q-expansion-item>
              </li>
            </ul>
          </q-list>
        </template>
      </div>
    </div>

    <div class="activity-page__content"
         :class="{'in-animation in-animation--right': animation,
         'activity-page__content-youtube': isYoutubeUrl(videoUrl)}"
         ref="content">
      <div class="media-container" v-if="videoUrl" >
        <n-tracking-progress
          v-if="isMeasure"
          :key="sessionId"
          @submit="trackAction('Trackable Session: Session Graph Empty State: click submit score'); requestScore()"
          @edit-score-request="$emit('score-submit-request')"
          @graph-hover="trackAction('Trackable Session: Session Graph: hover over graph')"
          @toggle-graph="handleGraphToggle"
          :initialActive="isInitialActive"
          :data="trainingSessionStats"
          :submittedScore="currentSessionScore"
          :showEditScore="isMeasure && !isScoreFlowProcessNeeded"
          ref="trackingProgress"
        />
        <q-resize-observer @resize="resizeVideoPlayer"/>
        <div class="media-container-bg-overlay"
          :style="{ ...thumbnail ? { '--bg-url': `url(${thumbnail})` } : {} }"/>
        <div ref="video">
          <n-multimedia :src="videoUrl"
                        :key="`${sessionId || routineId}-${videoUrl}`"
                        :resizable="false"
                        noBorder
                        data-intercom-target="Session video section"
                        :thumbnail="thumbnail"
                        class="media-container-media-inner"
                        @click="$emit('click-video')"
                        @provide-controller="saveVideoPlayerController"
          />
        </div>
      </div>
      <div class="text-container" v-if="!videoUrl">
        <div class="text-container__content">
          <div class="text-h2 q-pb-xl">
            {{ title }}
          </div>
          <div v-html="content" class="q-pb-xl"></div>
          <!--      Instructions-->
          <template v-if="isSingleSession || isSession" >
            <div class="text-h4 text-gray">
              Instructions
            </div>
            <div class="paragraph-small opacity-75 q-mt-sm text-gray">
              Follow the steps bellow to complete this session
            </div>
            <div class="items-list">
              <div class="items-list__item text-gray"
                   v-for="(step, i) in singleSession.steps"
                   :key="`step-${i}`">
                <div class="text-pink q-mb-sm" style="font-size: 12px">
                  STEP {{ i + 1 }}
                </div>
                <div class="text-h4 q-mb-xs">
                  {{ step.title }}
                </div>
                <div class="paragraph-medium" v-html="step.description"></div>
              </div>
            </div>
          </template>
          <!--      Tips-->
          <template v-if="notes && notes.length">
            <div class="tips-block q-mt-md q-mt-md-xl text-gray">
              <div class="text-h4 flex items-center">
                <c-icon icon="tip" class="q-mr-md" />
                Tips
              </div>
              <div class="paragraph-small opacity-75 q-mt-sm" style="padding-left: 36px" v-html="notesSubtitle"/>
              <div class="items-list" style="padding-left: 36px">
                <div class="items-list__item"
                     v-for="(note, i) in notes"
                     :key="`note-${i}`">
                  <div v-html="note"></div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="activity-page__content-part">
        <div class="row q-col-gutter-md items-stretch">
          <div class="col-6 col-md-4" v-if="sessionTimerDuration">
            <div class="full-width bordered q-px-lg full-height flex items-center">
              <n-timer :seconds="sessionTimerDuration * 60"
                       :stopTime="stopTimer"
                       style="max-width: unset"
                       :id="sessionId"
                       @start="startTimer"/>
            </div>
          </div>
          <div class="col-6 col-md-4" v-if="showBenchmark">
            <div class="full-width bordered q-pa-lg full-height flex items-center">
              <record-select class="full-height" :records="benchmark" defaultSelected="bronze"/>
            </div>
          </div>
          <div class="col-6 col-md-4" v-if="shouldShowKovaak">
            <n-kovaak-playlist :src="computedKovaakUrl"
                               :name="computedKovaakName"
                               @click="$emit('click-playlist')"/>
          </div>
          <div class="col-6 col-md-4" v-else-if="shouldShowMap">
            <n-creative-map
              :title="computedMap.title"
              :tooltipDescription="computedMap.tooltipDescription"
              :mapName="computedMap.mapName"
              :mapCode="computedMap.mapCode"
              @copy="$emit('copy-map-code')"
            />
          </div>
          <div class="col-6 col-md-4" v-if="!isSession">
            <q-card bordered class="full-height">
              <q-card-section class="q-pb-sm full-height">
                <div class="flex justify-between items-center">
                  <div class="text-h5 text-gray">
                    Routine mastery
                  </div>
                  <div class="text-pink">
                    {{ routineDaysCounter }}x completed
                  </div>
                </div>
                <n-routine-mastery :completedMasteriesNum="routineDaysCounter" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="activity-page__bottom q-px-xl">
      <div class="tracking-progress-toggle-container" v-if="$q.platform.is.mobile"></div>
      <div class="info text-left text-weight-bold">
        <div class="font-rift text-subtitle text-uppercase opacity-25" v-if="isSession">
          session {{ currentSessionIndex + 1 }}
        </div>
        <div class="font-rift text-subtitle text-uppercase opacity-25" v-else>
          Overview
        </div>
        <div class="text-h5">
          {{ title }}
        </div>
        <div class="opacity-25 text-weight-regular" style="font-size: 12px">
          {{ isSession ? duration : computedRoutineDuration }} minutes
        </div>
      </div>
      <div class="progress text-center" v-if="!nonCompletable">
        <div class="font-rift text-subtitle text-weight-bold text-uppercase opacity-25">
          ACTIVITY PROGRESS
        </div>
        <div class="text-h4 q-my-sm">
          <q-linear-progress
            size="md"
            :value="completingProgress"
            rounded
            color="green"
            track-color="light-tone"
          />
        </div>
        <div class="opacity-25 text-weight-regular" style="font-size: 12px">
          {{ completedSessions }}/{{ sessions.length }} completed
        </div>
      </div>
      <div class="mobile-info text-grey-7 text-weight-regular" v-if="isResponsive">
        <template v-if="isSession">
          Session<br />
          {{ currentSessionIndex + 1 }} of {{ sessions.length }}
        </template>
        <template v-else>
          Activity<br />
          overview
        </template>
      </div>
      <div :class="`action ${$q.platform.is.mobile ? 'q-pr-lg' : ''}`">
        <template v-if="isSession">
          <c-btn outline
                 class="prev-btn"
                 :flat="$q.screen.lt.sm"
                 :dense="$q.screen.lt.sm"
                 v-if="isSession && sessions.length > 1"
                 :disabled="currentSessionIndex <= 0"
                 @click="prevSession"
                 noWidth>
            <c-icon icon="leftArrowRounded" width="32px" class="lt-sm"/>
            <span class="gt-xs">
              PREVIOUS
            </span>
          </c-btn>
          <c-btn noWidth
                 v-if="isSession && sessions.length > 1 && !isLastSession"
                 :style="{ opacity: !isAnimationPlaying ? 1 : 0, transition: 'opacity 1s' }"
                 data-intercom-target="Next"
                 :outline="!!isDone"
                 :flat="$q.screen.lt.sm"
                 :dense="$q.screen.lt.sm"
                 @click="handleSessionNextDone"
                 class="q-ml-sm next-btn relative-position">
            <c-icon icon="rightArrowRounded" width="32px" class="lt-sm"/>
            <span class="gt-xs">
                {{isScoreFlowProcessNeeded ? 'Submit score' : 'Next'}}
            </span>
          </c-btn>
          <c-btn noWidth
                 :dense="$q.screen.lt.sm"
                 v-else-if="isRoutineCompleted || nonCompletable"
                 @click="goBack"
                 class="q-ml-sm">
            <span class="q-px-sm q-px-sm-none">Go Back</span>
          </c-btn>
          <div
            v-else
            class="relative-position"
          >
            <lottie-animation
              v-if="!$q.platform.is.mobile"
              path="lottie-animations/MarkAsDone_Button.json"
              :loop="false"
              :autoPlay="false"
              :width="160"
              :height="100"
              class="absolute"
              style="top: -27px; left: 3px;"
              @AnimControl="saveAnimationReference"
            />
            <c-btn noWidth
                   data-intercom-target="Mark As Done"
                   :style="{ opacity: !isAnimationPlaying ? 1 : 0 }"
                   :flat="$q.screen.lt.sm"
                   :dense="$q.screen.lt.sm"
                   @click="handleRoutineMarkDone"
                   class="q-ml-sm">
              <c-icon icon="checkRound" width="32px" class="lt-sm"/>
              <span class="gt-xs">{{isScoreFlowProcessNeeded ? 'Submit score' : 'Mark As Done'}}</span>
            </c-btn>
          </div>
        </template>
        <c-btn v-else-if="isRoutineCompleted"
               noWidth
               data-intercom-target="Go back"
               :dense="$q.screen.lt.sm"
               @click="goBack"
               class="q-sm-ml-auto">
          <span class="q-px-sm q-px-sm-none">Go Back</span>
        </c-btn>
        <div v-else-if="isSingleSession"
             class="relative-position"
        >
          <lottie-animation
            v-if="!$q.platform.is.mobile"
            path="lottie-animations/MarkAsDone_Button.json"
            :loop="false"
            :autoPlay="false"
            :width="160"
            :height="100"
            class="absolute"
            style="top: -27px; left: -5px;"
            @AnimControl="saveAnimationReference"
          />
          <c-btn noWidth
                 data-intercom-target="Mark As Done"
                 :style="{ opacity: !isAnimationPlaying ? 1 : 0 }"
                 :dense="$q.screen.lt.sm"
                 @click="handleRoutineMarkDone"
                 class="q-sm-ml-auto">
            <span class="q-px-sm q-px-sm-none">{{isScoreFlowProcessNeeded ? 'Submit score' : 'Mark As Done'}}</span>
          </c-btn>
        </div>
        <c-btn v-else
               noWidth
               data-intercom-target="Start routine"
               :dense="$q.screen.lt.sm"
               :disabled="isRoutineCompleted"
               @click="startRoutine"
               class="q-sm-ml-auto">
          <span v-if="isRoutineStarted && !isRoutineCompleted">Continue routine</span>
          <span v-else-if="!isLoggedIn || !isInActivity">Go to first session</span>
          <span v-else>Start routine</span>
        </c-btn>
      </div>
    </div>
  </div>
</template>

<script>
import ApprovedBy from 'components/training-routine/approved-by'
import Difficulty from 'components/training-routine/difficulty'
import urlTypes from '@/mixins/urlType.mixins'
import { copyToClipboard } from 'quasar'

export default {
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    subtitle: {
      type: String
    },
    category: {
      type: String,
      required: true,
      default: ''
    },
    author: {
      type: String,
      default: 'N/A'
    },
    difficulty: {
      type: String,
      required: true,
      default: ''
    },
    tags: {
      type: Array,
      default: () => []
    },
    routineTags: {
      type: Array,
      default: () => []
    },
    content: {
      type: String,
      default: ''
    },
    notesSubtitle: {
      type: String,
      default: ''
    },
    notes: {
      type: Array,
      default: () => []
    },
    credits: {
      type: [Object, Array],
      default: () => []
    },
    videoUrl: {
      type: String
    },
    thumbnail: {
      type: String
    },
    sessions: {
      type: Array,
      default: () => []
    },
    routineDaysCounter: {
      type: Number,
      default: 0
    },
    isRoutineCompleted: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number
    },
    sessionId: {
      type: String
    },
    routineId: {
      type: String
    },
    map: {
      type: Object
    },
    benchmark: {
      type: Object
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    isInActivity: {
      type: Boolean,
      default: false
    },
    isRoutineStarted: {
      type: Boolean,
      default: false
    },
    isDone: {
      type: [Boolean, String],
      default: false
    },
    animation: {
      type: Boolean,
      default: false
    },
    backButtonName: {
      type: String,
      default: 'Go back'
    },
    userEmail: {
      type: String
    },
    isExclusive: {
      type: Boolean,
      default: true
    },
    trainingSessionStats: {
      type: Object
    },
    isRoutineMeasurable: {
      type: Boolean,
      default: null
    },
    currentSessionScore: {
      type: Number,
      default: null
    },
    nonCompletable: {
      type: Boolean,
      default: false
    },
    participants: {
      type: Array,
      default: () => []
    },
    isUserGoing: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    sessionId: function () {
      this.$refs.activityPage.scrollTop = 0
      this.$refs.sidebar.scrollTop = 0
    },
    routineId: function () {
      this.$refs.activityPage.scrollTop = 0
      this.$refs.sidebar.scrollTop = 0
    }
  },
  components: {
    'routine-category': () => import('@/components/common/activity-category'),
    'approved-by': ApprovedBy,
    'n-difficulty': Difficulty,
    chip: () => import('@/components/training-routine/chip'),
    credits: () => import('@/components/common/credits'),
    'n-multimedia': () => import('@/components/common/multimedia'),
    'n-timer': () => import('@/components/common/timer/squareHorizontalFullTimer'),
    'record-select': () => import('@/components/training-routine-new/records-select'),
    'n-kovaak-playlist': () => import('@/components/training-routine-new/kovaak-playlist'),
    'n-creative-map': () => import('@/components/training-routine-new/creative-map'),
    'n-routine-mastery': () => import('./routine-mastery'),
    'n-tracking-progress': () => import('@/components/tracking-progress'),
    'n-members-list': () => import('@/components/members-list'),
    'n-members-going': () => import('@/components/members-going')
  },
  data () {
    return {
      showMenu: null,
      showDropdown: false,
      showInfo: null,
      stopTimer: 0,
      player: null,

      animationReference: null,
      isAnimationPlaying: false,
      trackingData: [],
      toggledMembersList: false
    }
  },
  mixins: [urlTypes],
  computed: {
    members () {
      return this.participants?.map(participant => ({
        name: participant.discordUserName,
        avatar: participant.avatarUrl
      })) || []
    },
    isInitialActive () {
      return Boolean(this.isDone) || this.trainingSessionStats.dailyAttemptsCompleted > 0
    },
    isMeasure () {
      return this.isRoutineMeasurable && this.isSession
    },
    isScoreFlowProcessNeeded () {
      return this.isMeasure && !this.isDone
    },
    computedRoutineDuration () {
      return this.sessions.reduce((duration, session) => {
        duration += session.duration
        return duration
      }, 0)
    },
    sessionTimerDuration () {
      return this.isSingleSession ? this.singleSession.duration : this.duration
    },
    isSingleSession () {
      return this.sessions.length === 1
    },
    singleSession () {
      return this.isSingleSession ? this.sessions[0] : this.sessions[this.currentSessionIndex]
    },
    isSession () {
      return this.$route.path.includes('session')
    },
    completedSessions () {
      return this.sessions.filter((s) => s.isCompleted).length
    },
    completingProgress () {
      return ((this.completedSessions * 100) / this.sessions.length) / 100
    },
    shouldShowKovaak () {
      const firstKovaakUrl = this.computedKovaakUrl
      if (!firstKovaakUrl) return false
      const filteredSessions = this.sessions.filter(session => session?.kovaakUrl === firstKovaakUrl)
      return filteredSessions.length === this.sessions.length
    },
    showBenchmark () {
      return this.isSession && this.benchmark && Object.values(this.benchmark).some(Boolean)
    },

    tagsLessNewUiHack () {
      // TEMP(ui-migration): prevent new ui flag from being shown - remove tags from database
      return this.tags.filter(t => t.toLowerCase() !== 'new and updated')
    },

    computedMap () {
      return this.isSingleSession || (!this.isSingleSession && this.currentSessionIndex !== false) ? this.map : null
    },
    computedKovaakUrl () {
      return this.sessions[this.currentSessionIndex]?.kovaakUrl
    },
    computedKovaakName () {
      return this.sessions[this.currentSessionIndex]?.kovaakName
    },
    currentSessionIndex () {
      const currentSessionObj = this.sessions.find(({ id }) => this.sessionId === id)
      return this.isSession && this.sessions.indexOf(currentSessionObj)
    },
    isLastSession () {
      const currentSessionObj = this.sessions.find(({ id }) => this.sessionId === id)
      return this.isSession && this.sessions.indexOf(currentSessionObj) === this.sessions.length - 1
    },
    isResponsive () {
      return this.$q.screen.width <= 1279
    },
    isMobile () {
      return this.$q.screen.width <= 576
    },
    shouldShowMap () {
      const firstMap = this.computedMap
      if (!firstMap?.mapCode || (firstMap?.mapCode === '0000-0000-0000')) return false
      return true
    },
    isShared () {
      const { name } = this.$route
      return name && name.includes('FriendGroup')
    }
  },
  methods: {
    trackAction () {
      this.$emit('analytics', ...arguments)
    },
    requestScore () {
      this.$emit('score-submit-request')
    },
    handleGraphToggle (toggleToGraph) {
      this.pauseVideoPlayback()
      if (toggleToGraph) {
        this.trackAction('Trackable Session: Toggle to graph')
      } else {
        this.trackAction('Trackable Session: Toggle to video')
      }
    },
    async handleRoutineMarkDone () {
      if (this.isScoreFlowProcessNeeded) {
        this.requestScore()
      } else {
        this.doneRoutine()
      }
    },
    async handleSessionNextDone () {
      if (this.isScoreFlowProcessNeeded) {
        this.pauseVideoPlayback()
        this.requestScore()
      } else {
        if (this.isDone) {
          this.nextSession()
        } else {
          // not getting called for measure flow
          this.doneSession()
        }
      }
    },
    saveAnimationReference (reference) {
      this.animationReference = reference
    },
    playAnimation () {
      return new Promise((resolve) => {
        this.isAnimationPlaying = true
        setTimeout(() => {
          // Waiting for opacity transition to be finished
          if (this.animationReference) {
            this.animationReference.play()
          }
          setTimeout(() => {
            resolve()
          }, 1800)
        }, 300)
      }).finally(() => {
        if (this.animationReference) {
          this.animationReference.stop()
        }
        this.isAnimationPlaying = false
      })
    },
    resizeVideoPlayer (event) {
      const { width, height } = event
      const videoElStyle = this.$refs?.video?.style
      if (!videoElStyle) {
        return
      }
      const heightRationValue = height / 9
      const widthRationValue = width / 16
      if (this.$q.screen.width <= 576) {
        videoElStyle.width = '100%'
        if (!this.isYoutubeUrl(this.videoUrl)) {
          videoElStyle.height = 'auto'
        } else {
          videoElStyle.height = '100%'
        }
        return
      }
      if (heightRationValue === widthRationValue) { // if ratio is 16/9
        videoElStyle.width = width + 'px'
        videoElStyle.height = height + 'px'
      } else if (heightRationValue < widthRationValue) { // if height is < than width (in proportion)
        videoElStyle.width = heightRationValue * 16 + 'px'
        videoElStyle.height = height + 'px'
      } else { // if width is < height width (in proportion)
        videoElStyle.width = width + 'px'
        videoElStyle.height = widthRationValue * 9 + 'px'
      }
    },
    toggleInfo () {
      this.showInfo = !this.showInfo
    },
    tryTurnOrientation () {
      window.screen.orientation.lock('landscape')
        .catch(() => {})
    },
    setMenu (type) {
      this.showMenu = type
    },
    clickSession (session) {
      this.showMenu = null
      this.$emit('click-session', session)
    },
    overviewRoutine () {
      this.showMenu = null
      this.$emit('overview-routine')
    },
    goBack () {
      this.$emit('back')
    },
    startRoutine () {
      this.$emit('start-routine', this.routineId)
    },
    nextSession () {
      this.$emit('next', this.sessionId)
    },
    prevSession () {
      this.$emit('prev', this.sessionId)
    },
    async doneSession () {
      this.$emit('doneSession', this.sessionId)
    },
    async doneRoutine () {
      if (!this.$q.platform.is.mobile && !this.isScoreFlowProcessNeeded) {
        await this.playAnimation()
      }
      this.$emit('doneRoutine', this.isSingleSession)
    },
    pickAnotherRoutine () {
      this.$emit('pick-another-routine')
    },
    startTimer () {
      this.$emit('start-timer')
    },
    copy (text) {
      copyToClipboard(text)
        .then(() => {
          this.$emit('copy-credits')
          this.$q.notify({
            type: 'positive',
            message: 'Copied!'
          })
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Oops! Something went wrong (('
          })
        })
    },
    saveVideoPlayerController (controller) {
      this.player = controller
    },
    pauseVideoPlayback () {
      if (this.player) {
        this.player.pause()
      }
    },
    joinNovosIfPublic () {
      this.$emit('join-novos-if-public')
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.activityPage.scrollTop = 0
    }, 500)
  }
}
</script>

<style lang="scss" scoped>

.activity-page{
  $root: &;
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding-bottom: 105px;
  &__sidebar{
    width: 460px;
    height: 100%;
    border-right: 1px solid $soft-tone;
    float: left;
    position: relative;
    overflow: hidden;
    padding-top: 80px;
    &-nav{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: $dark-one;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px 0 60px;
      z-index: 999;
    }
    &-content{
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 40px 60px;
      position: relative;
      transition: all 0.3s ease-in-out;
      &::-webkit-scrollbar {
        width: 3px;
        background-color: #f9f9fd;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $soft-tone;
      }
      &::-webkit-scrollbar-track {
        background-color: $dark-sec;
      }
    }
    &-drop-content {
      position: absolute;
      top: 50px;
      right: 10px;
      background: $mid-tone;
      border-radius: 6px;
      z-index: 10;
      width: 200px;
      overflow: hidden;
      border: 1px solid $soft-tone;
      div{
        padding: 6px 10px;
        font-size: 14px;
        overflow: hidden;
        cursor: pointer;
        color: #fff;
        font-weight: normal;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 46px;
        &:hover{
          color: $dark-pink;
          background: $soft-tone;
        }
      }
      a, a:hover{
        text-decoration: none;
        color: inherit;
      }
    }
  }
  &__content{
    width: calc( 100% - 460px);
    height: 100%;
    float: right;
    overflow: auto;
    transition: all 0.3s ease-in-out;

    &::-webkit-scrollbar {
      width: 3px;
      background-color: #f9f9fd;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $soft-tone;
    }
    &::-webkit-scrollbar-track {
      background-color: $dark-sec;
    }

    .media-container{
      width: 100%;
      height: calc( 100% - 200px);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 80;
      &-bg-overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        // filter: blur(4px);
        // background-image: var(--bg-url, url('../../assets/trainingRoutine/routine-title-background.png'));
        // background-size: cover;
        // background-position: center center;
        background-color: black;
      }
      &-media-inner {
        position: relative;
        height: 100%;
      }
    }
    .text-container{
      height: calc( 100% - 200px);
      background-color: $dark-sec;
      padding: 80px 0 40px;
      overflow: auto;
      &__content{
        display: block;
        margin: 0 auto;
        max-width: 650px;
        width: 90%;
        img{
          display: block;
          margin: 25px auto;
          width: 90%;
          max-width: 450px;
        }
        .items-list__item{
          padding: 25px 0;
          border: none;
        }
        .tips-block{
          background: $mid-tone;
          padding: 20px;
          .items-list__item{
            padding: 12px 0 12px 24px;
            position: relative;
            &:before{
              content: "";
              width: 5px;
              height: 5px;
              position: absolute;
              left: 6px;
              top: 20px;
              border-radius: 100%;
              display: block;
              background: #fff;
            }
          }
        }
      }
    }
    &-part{
      padding: 40px 60px;
      display: flex;
      justify-content: center;
      .row{
        max-width: 1100px;
        min-width: 100%;
      }
    }
  }
  &__bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: $dark-sec;
    box-shadow: 0 0 10px rgba(0, 0, 0, .6);
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 9;
    padding: 20px 115px 20px 60px;
    .info{
      flex-basis: 320px;
      width: 360px;
      .text-h5{
        margin: 5px 0;
      }
    }
    .progress{
      padding: 0 25px;
      flex-grow: 1;
      max-width: 400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .action{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-basis: 430px;
      width: 430px;
      white-space: nowrap;
    }
  }

  .rubber-label{
    position: absolute;
    top: 15px;
    width: 120px;
    text-align: center;
    transform: rotate(45deg);
    right: -35px;
    font-size: 8px;
    padding: 4px 0;
    font-weight: 700;
    letter-spacing: 1px;
  }

  @media (max-width: $breakpoint-tablet-max) {
    padding: 60px 0 0;
    .rubber-label{
      top: 14px
    }
    .horizontal-line{
      margin: 20px 0;
    }
    .vertical-line{
      margin: 0 10px;
    }
    #{$root}__sidebar {
      float: right;
      width: 250px;
      border-right: none;
      border-left: 1px solid $soft-tone;
      height: 100%;
      padding-top: 0;
      &-nav{
        position: fixed;
        margin: 0;
        left: 0;
        right: 0;
        padding: 0 20px;
        height: 60px;
      }
      &-top{
        margin-bottom: 12px;
        .text-h5{
          font-size: 12px
        }
      }
      &-content{
        padding: 20px 20px 40px;
      }
      .text-h2{
        font-size: 18px;
        font-family: "Roboto", sans-serif!important;
        text-transform: unset
      }
      .paragraph-medium{
        font-size: 14px;
      }
      .approved-by{
        .avatar{
          display: none;
        }
      }
    }
    #{$root}__content {
      float: left;
      width: calc( 100% - 250px);
      padding-bottom: 85px;
      &-part{
        display: none;
      }
    }
    #{$root}__bottom {
      right: 250px;
      box-shadow: none;
      max-height: 85px;
      padding: 20px;
      .info{
        display: none;
      }
      .progress{
        display: none;
      }
      .action{
        width: 100%;
      }
    }
    .media-container{
      height: 100%;
    }

    .text-container{
      height: 100%;
    }

    .activity-menu{
      width: 100%;
      z-index: 9999;
      padding: 30px;
    }
  }

  @media (max-width: $breakpoint-565-max) {
    flex-wrap: wrap;
    overflow: auto;
    display: flex;
    padding-bottom: 60px;
    #{$root}__sidebar{
      order: 2;
      width: 100%;
      height: auto;
      z-index:70;
      background-color: $dark;
      border: none;
      overflow: hidden;
    }
    #{$root}__content{
      order: 1;
      width: 100%;
      height: unset;
      padding-bottom: 0;
      position: sticky;
      top: 0;
      z-index: 69;
    }
    #{$root}__content-youtube{
      .media-container {
          height: calc(100vw * 720 / 1280);
      }
    }
    #{$root}__bottom{
      width: 100%;
      right: 0;
      left: 0;
      z-index: 90;
      position: fixed;
      height: 60px;
      .mobile-info{
        display: none;
      }
      .action{
        margin: 0 auto;
        justify-content: space-between;
        div{
          order: 2;
          &.prev-btn{
            order: 1;
          }
          &.next-btn{
            order: 3;
          }
        }
      }
    }

    .text-container{
      padding: 20px 0;
    }

    .activity-menu{
      padding: 20px;
      height: auto;
    }
  }
}

.mobile-notice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba($dark-one, 0.9);
  z-index: 99999;
  .icon-back {
    width: 90px;
    height: 90px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    /* Linear */
    background: linear-gradient(151.32deg, #D92779 17.68%, #7C277E 86.39%);
    /* pink shadow */
    box-shadow: 0px 20px 40px rgba(221, 38, 200, 0.3);
  }
}

.activity-menu{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 460px;
  min-height: 100vh;
  background: $dark-one;
  padding: 30px 60px 120px;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: all 0.2s ease-in-out;
  z-index: 999;
  height: 100%;
  overflow: hidden;
  &--active{
    transform: translateX(0);
  }
  ul{
    padding: 0;
    margin: 24px 0 0;
    max-height: 90%;
    overflow-y: auto;
    li{
      position: relative;
      list-style: none;
      padding: 16px 16px 16px 60px;
      border: 1px solid $soft-tone;
      border-radius: 6px;
      margin-bottom: 12px;
      font-size: 12px;
      cursor: pointer;
      .index{
        width: 34px;
        height: 34px;
        border-radius: 100%;
        border: 2px solid $soft-tone;
        background-color: $soft-tone;
        position: absolute;
        top: 20px;
        left: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
      }
      &.p-none{
        padding: 0;
      }
      &:hover{
        cursor: pointer;
        border-color: $dark-pink;
      }
      &.is-current{
        border-color: $dark-pink;
        .index{
          border-color: $dark-pink;
          color: $dark-pink;
        }
      }
      &.is-completed{
        .index{
          border-color: $dark-pink;
          background: $dark-pink url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
          background-size: 60%;
          text-indent: -9999px;
        }
      }
    }
  }
}

.items-list{
  display: block;
  width: 100%;
  margin-top: 20px;
  &__item{
    border: 1px solid $soft-tone;
    border-radius: 6px;
    padding: 20px;
    margin: 4px 0;
    display: inline-flex;
    width: 100%;
    flex-direction: column;
    /deep/ a {
      color: $dark-pink;
    }
    @media (max-width: $breakpoint-tablet-max) {
      border: none;
      padding: 0;
      margin-bottom: 16px;
      .paragraph-medium{
        font-size: 14px;
      }
      .text-h4{
        font-size: 16px;
      }
    }
  }
}

.bordered{
  border: 1.5px solid $soft-tone;
  border-radius: 6px;
}

.expansion-h{
  display: flex;
  justify-content: space-between;
}

.vertical-line{
  background-color: #433558;
  width: 2px;
  display: block;
  height: 20px;
}
.horizontal-line{
  background-color: #433558;
  width: 100%;
  display: block;
  height: 1.5px;
}

.in-animation{
  opacity: 0;
  overflow: hidden;
  &--left{
    transform: translateX(-20px);
  }
  &--right{
    transform: translateX(20px);
  }
}
</style>
