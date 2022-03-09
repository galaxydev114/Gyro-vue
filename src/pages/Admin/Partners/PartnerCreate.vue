<template>
  <partner-details
    @save="addPartner"
  />
</template>

<script>
import { createPartner } from '@/services/api'
import PartnerDetails from './PartnerDetails'

export default {
  name: 'PartnerCreate',
  components: { PartnerDetails },
  methods: {
    async addPartner (partner) {
      await createPartner(partner)
      this.$q.notify({ message: 'Partner was created successfully' })
    }
  }
}
</script>

<style scoped>

</style>
