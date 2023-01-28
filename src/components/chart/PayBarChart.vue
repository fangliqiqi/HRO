<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="data">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-bar position="月份*金额" color="name" :adjust="adjust" />
    </v-chart>
  </div>
</template>

<script>
  const DataSet = require('@antv/data-set');

  export default {
    name: 'PayBarChart',
    props: {
      dataSource: {
        type: Array,
        required: true,
        default: ()=>[]
      },
      fieldList: {
        type: Array,
        default: ()=>[]
      },
    },
    created() {
      // this.sourceData = this.dataSource
    },
    mounted() {
      const dv = new DataSet.View().source(this.dataSource);
      dv.transform({
        type: 'fold',
        fields: this.fieldList,
        key: '月份',
        value: '金额',
      });
      this.data = dv.rows;
    },
    data() {
      return {
        data:"",
        height: 400,
        adjust: [{
          type: 'dodge',
          marginRatio: 1 / 32,
        }],
      };
    }
  };
</script>
