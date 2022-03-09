<template>
  <article>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :searchOptions="{
        enabled: true,
        placeholder: 'Type to search',
        skipDiacritics: true
       }"
    >
      <template slot="table-row" slot-scope="props">
        <div v-if="props.column.field === 'actions'">
          <q-icon @click="previewNews(props.row)" name="open_in_new" size="24px"/>
          <q-icon style="cursor:pointer" @click="deleteCurrentPlatformNews(props.row.id)" name="delete" size="24px"/>
        </div>
      </template>
    </vue-good-table>

    <modal-platform-news
      :is-visible="preview.isModalVisible"
      :content="$q.platform.is.mobile ? preview.mobileContent : preview.content"
      :cta-name="preview.ctaName"
      :background-color="preview.backgroundColor"
      @close="() => preview.isModalVisible = false"
    />
  </article>
</template>

<script>
import { VueGoodTable } from 'vue-good-table'
import ModalPlatformNews from 'components/common/modal/modal-platform-news/modal-platform-news'
import { getAllPlatformNews, deletePlatformNews } from '@/services/api'

export default {
  components: {
    VueGoodTable,
    ModalPlatformNews
  },

  data () {
    return {
      preview: {
        isModalVisible: false,
        content: '',
        mobileContent: null,
        backgroundColor: 'dark-pink',
        ctaName: 'Close'
      },
      columns: [
        { label: 'Content', field: 'content' },
        { label: 'Mobile Content', field: 'mobileContent' },
        { label: 'Styles', field: 'styles' },
        { label: 'CTA Name', field: 'ctaName' },
        { label: 'Created At', field: 'createdAt' },
        { label: 'Actions', field: 'actions' }
      ],
      rows: []
    }
  },

  created () {
    this.getAllNews()
  },

  methods: {
    async getAllNews () {
      const response = await getAllPlatformNews()
      this.rows = response.data.platformNews
    },

    previewNews (row) {
      this.preview = {
        content: row.content,
        mobileContent: row.mobileContent || row.content,
        ctaName: row.ctaName,
        backgroundColor: row.backgroundColor,
        isModalVisible: true
      }
    },
    async deleteCurrentPlatformNews (platformNewsId) {
      if (!window.confirm('Delete?')) return
      await deletePlatformNews(platformNewsId)
      await this.getAllNews()
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  max-width: 800px;
  width: 100%;
  color: #fff;
  background: #424242;
  background: var(--q-color-dark);
}
</style>
