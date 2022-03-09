export default {
  methods: {
    convertTableToCsv () {
      const items = this.$refs.table.filteredRows[0].children
      const replacer = (key, value) => value === null ? '' : value
      let fields = Object.keys(items[0])
      const columns = fields.map(field => this.$refs.table.getColumnForField(field))
      let header = columns.map(column => column?.label)
      fields = fields.filter((_, idx) => !!header[idx])
      header = header.filter(x => x)
      const csv = items.map(row => fields.map((fieldName, colIdx) => {
        const formatFn = columns[colIdx].formatFn
        const value = formatFn ? formatFn(row[fieldName]) : row[fieldName]
        return JSON.stringify(value, replacer)
      }).join(','))
      csv.unshift(header.join(','))
      return csv.join('\r\n')
    },

    makeDownloadBlob (data, filename) {
      const file = new Blob([data], { type: 'text/plain' })
      // IE10+
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename)
      } else { // Others
        const a = document.createElement('a')
        const url = URL.createObjectURL(file)
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function () {
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }, 0)
      }
    },

    exportTable () {
      const data = this.convertTableToCsv()
      this.makeDownloadBlob(data, 'data.csv')
    }
  }
}
