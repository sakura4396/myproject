<template>
  <div ref="myChart"></div>
</template>

<script>
export default {
  name: 'echarts',
  props: ['type', 'width', 'height', 'options'],
  data () {
    return {
      init: false,
      opts: null
    }
  },
  watch: {
    opts (val) {
      const echarts = require('echarts/lib/echarts')
      require('echarts/lib/chart/bar')
      require('echarts/lib/chart/line')
      require('echarts/lib/chart/pie')
      require('echarts/lib/chart/radar')
      require('echarts/lib/chart/funnel')
      require('echarts/lib/chart/gauge')
      require('echarts/lib/chart/map')
      require('echarts/lib/component/tooltip')
      require('echarts/lib/component/title')
      require('echarts/lib/component/legend')
      let myChart
      if (this.init) {
        myChart = echarts.getInstanceByDom(this.$refs.myChart)
      } else {
        myChart = echarts.init(this.$refs.myChart, 'echartsStyle')
        this.init = true
      }
      myChart.setOption(val, true)
    },
    options (val) {
      this.opts = val
    }
  },
  mounted () {
    this.opts = this.options
    this.$refs.myChart.style.width = this.width + 'px'
    this.$refs.myChart.style.height = this.height + 'px'
  }
}
</script>
