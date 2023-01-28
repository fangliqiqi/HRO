<template>
  <div class="antv-chart-mini">
    <div
      class="chart-wrapper"
      :style="{ height: 46 }"
    >
      <v-chart
        :force-fit="true"
        :height="height"
        :data="data"
        :scale="scale"
        :padding="[36, 0, 18, 0]"
      >
        <v-tooltip />
        <v-smooth-area position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
  import moment from 'dayjs'

  const sourceData = []
  const beginDay = new Date().getTime()
  
  //社保派增统计数据
  for (let i = 0; i < 20; i++) {
    sourceData.push({
      x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
      y: Math.round(Math.random() * 100)
    })
  }

  export default {
    name: 'MiniArea',
    props: {
      dataSource: {
        type: Array,
        default: () => []
      },
      // x 轴别名
      x: {
        type: String,
        default: 'x'
      },
      // y 轴别名
      y: {
        type: String,
        default: '派增量'
      }
    },
    data() {
      return {
        data: [],
        height: 100
      }
    },
    computed: {
      scale() {
        return [
          { dataKey: 'x', title: this.x, alias: this.x },
          { dataKey: 'y', title: this.y, alias: this.y }
        ]
      }
    },
    created() {
      // if (this.dataSource.length === 0) {
      //   this.data = sourceData
      // } else {
      //   this.data = this.dataSource
      // }
      this.data = this.dataSource
    }
  }
</script>

<style lang="scss" scoped>
@import 'chart';
</style>