<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart :forceFit="true" :height="height" :data="dataSource" :padding="padding">
      <v-tooltip/>
      <v-axis/>
      <v-bar position="x*y"/>
    </v-chart>
  </div>
</template>

<script>
  import { triggerWindowResizeEvent } from '@/utils/util'

  export default {
    name: 'Bar',
    props: {
      dataSource: {
        type: Array,
        required: true
      },
      title: {
        type: String,
        default: ''
      },
      height: {
        type: Number,
        default: 254
      }
    },
    data() {
      return { 
        padding: ['auto', 'auto', '50', '100'],
      }
    },
    mounted() {
      triggerWindowResizeEvent()
    }
  }
</script>