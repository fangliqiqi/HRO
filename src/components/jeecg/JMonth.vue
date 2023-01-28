/* eslint-disable no-irregular-whitespace */
<template>
  <a-month-picker
    :disabled="readOnly"
    :placeholder="placeholder"
    @change="handleDateChange"
    :value="momVal"
    :format="dateFormat"
    :disabledDate="disabledDate"
  />
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'JMonth',
    props: {
      placeholder:{
        type: String,
        default: '',
        required: false
      },
      value:{
        type: String,
        default: '',
        required: false
      },
      disabledDate:{
        type: Function,
        default: ()=>{},
        required: false
      },
      dateFormat:{
        type: String,
        default: 'YYYYMM',
        required: false
      },
      triggerChange:{
        type: Boolean,
        required: false,
        default: false
      },
      readOnly:{
        type: Boolean,
        required: false,
        default: false
      },
    },
    data () {
      let dateStr = this.value;
      return {
        decorator:"",
        momVal:!dateStr?null:moment(dateStr,this.dateFormat)
      }
    },
    watch: {
      value (val) {
        if(!val){
          this.momVal = null
        }else{
          this.momVal = moment(val,this.dateFormat)
        }
      }
    },
    methods: {
      moment,
      handleDateChange(mom,dateStr){
        if(this.triggerChange){
          this.$emit('change', dateStr);
        }else{
          this.$emit('input', dateStr);
        }
      }
    }
  }
  //note: do not set the prop value one default property
</script>
