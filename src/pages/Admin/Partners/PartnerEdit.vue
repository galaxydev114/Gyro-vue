<template>
  <partner-details
    v-if="initialPartnerData"
    :initialPartnerData="initialPartnerData"
    @save="updatePartner"
  />
</template>

<script>
import PartnerDetails from 'pages/Admin/Partners/PartnerDetails'
import { getPartnerById, updatePartner } from '@/services/api'
export default {
  name: 'PartnerEdit',
  components: { PartnerDetails },
  data: () => ({
    initialPartnerData: undefined
  }),
  created () {
    this.fetchPartnerById()
  },
  methods: {
    async fetchPartnerById () {
      const response = await getPartnerById(this.$route.params.partnerId)
      this.initialPartnerData = response.data.collaborator
    },

    async updatePartner (partner) {
      await updatePartner(this.$route.params.partnerId, partner)
      this.$q.notify({ message: 'Partner was updated successfully' })
      this.$router.push({ name: 'AdminPartnerList' })
    }
  }
}
</script>

<style scoped>

</style>
