<template>
  <q-layout class="admin-panel">
    <div class="admin-panel__left">
      <div class="admin-nav">

        <div class="admin-nav__section">
          <div class="admin-nav__section-header">
            Routines
          </div>
          <router-link :to="{name: 'RoutineDashboard'}">
            Dashboard
          </router-link>
          <router-link :to="{name: 'RoutineList'}">
            List
          </router-link>
          <router-link :to="{name: 'RoutineCreate'}" v-if="isAdmin">
            Add
          </router-link>
        </div>

        <div class="admin-nav__section">
          <div class="admin-nav__section-header">
            Sessions
          </div>
          <router-link :to="{name: 'SessionList'}">
            List
          </router-link>
          <router-link :to="{name: 'SessionCreate'}" v-if="isAdmin">
            Add
          </router-link>
        </div>

        <div class="admin-nav__section">
          <div class="admin-nav__section-header">
            Knowledge Time Videos
          </div>
          <router-link :to="{name: 'KnowledgeList'}">
            List
          </router-link>
          <router-link :to="{name: 'KnowledgeCreate'}" v-if="isAdmin">
            Add
          </router-link>
          <router-link :to="{name: 'KnowledgeThumbnails'}" v-if="isAdmin">
            Thumbnails
          </router-link>
        </div>
        <div class="admin-nav__section">
          <div class="admin-nav__section-header">
            Workshops
          </div>
          <router-link :to="{name: 'WorkshopsList'}">
            List
          </router-link>
          <router-link :to="{ name: 'WorkshopCreate' }">
            Workshops
          </router-link>
        </div>

        <div class="admin-nav__section">
          <div class="admin-nav__section-header">
            Tournaments
          </div>
          <router-link :to="{name: 'TournamentsList'}">
            List
          </router-link>
          <router-link :to="{ name: 'TournamentCreate' }">
            Add
          </router-link>
        </div>

        <div class="admin-nav__section" v-if="isAdmin">
          <div class="admin-nav__section-header">
            Videos
          </div>
          <router-link :to="{name: 'VideosMuxHelp'}">
            Mux videos
          </router-link>
        </div>

        <div class="admin-nav__section" v-if="isAdmin">
          <div class="admin-nav__section-header">
            Access Codes
          </div>
          <router-link :to="{name: 'AccessCodeList'}">
            Manage
          </router-link>
        </div>

        <div class="admin-nav__section" v-if="isAdmin">
          <div class="admin-nav__section-header">
            Notifications
          </div>
          <router-link :to="{name: 'Notifications'}">
            Test
          </router-link>
        </div>

        <div class="admin-nav__section" v-if="isAdmin">
          <div class="admin-nav__section-header">Partners</div>
          <router-link :to="{ name: 'AdminPartnerList' }">List</router-link>
          <router-link :to="{ name: 'AdminPartnerCreate' }">Create</router-link>
          <router-link :to="{ name: 'AdminPartnerThumbnails' }">Thumbnails</router-link>
        </div>

        <div class="admin-nav__section" v-if="isAdmin">
          <div class="admin-nav__section-header">Refund</div>
          <router-link :to="{ name: 'AdminRefund' }">Main</router-link>
        </div>

        <div class="admin-nav__section" v-if="isAdmin">
          <div class="admin-nav__section-header">Platform news</div>
          <router-link :to="{ name: 'AdminPlatformNews' }">Create</router-link>
          <router-link :to="{ name: 'AdminPlatformNewsList' }">List</router-link>
        </div>

        <div class="admin-nav__section" v-if="isAdmin">
          <div class="admin-nav__section-header">Pretend zone</div>
          <router-link :to="{ name: 'AdminPretendUser' }">User</router-link>
        </div>

        <div class="admin-nav__section" v-if="isAdmin">
          <div class="admin-nav__section-header">Friends' Groups</div>
          <router-link :to="{ name: 'AdminFriendGroups' }">List</router-link>
          <router-link :to="{ name: 'AdminUserFriendGroupApplications' }">Applications</router-link>
        </div>

      </div>
    </div>

    <div class="admin-panel__right">
      <router-view style="height: 100vh" />
    </div>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      isAdmin: 'user/isAdmin'
    })
  }
}
</script>

<style lang="scss">
@import url('~vue-good-table/dist/vue-good-table.css');

.admin-nav__section {
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  &:first-child {
    margin-top: 0;
  }
}

.admin-nav__section-header {
  padding: 10px 15px;
  margin-bottom: 15px;
  background: $soft-tone;
  border-radius: 6px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-weight: bold;
}

.admin-panel {
  display: flex;
  flex-direction: row;
  position: relative;

  &__left{
    height: 100vh;
    position: sticky;
    top: 0;
    width: 250px;
    padding: 40px 25px 25px;
    overflow-y: auto;
    background-color: $dark;

    a {
      text-transform: uppercase;
      color: $pink;
      font-size: 1rem;
      line-height: 120%;
      text-decoration: none;
      padding: 10px 0 10px 20px;

      &:hover{
        text-decoration: revert;
      }
      &.router-link-exact-active{
        background: black;
      }
    }
  }

  &__right{
    height: 100vh;
    width: calc(100% - 250px);
    padding-left: 25px;
    background-color: $dark-sec;
  }
}
</style>
