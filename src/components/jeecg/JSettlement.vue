
<template>
  <a-select
    :placeholder="placeholder"
    showSearch
    @search="handleSearch"
    optionFilterProp="children"
    :value="value"
    @change="onChange"
    :notFoundContent="null"
    :allowClear="true"
    :showArrow="false"
    :dropdownMatchSelectWidth="false"
    :getPopupContainer="getPopupContainerFun"
  >
    <a-select-option
      v-for="(item, key) in settleDomains"
      :key="key"
      :value="item.id"
    >{{ item.departName }}</a-select-option>
  </a-select>

</template>
<script>
  import { httpAction } from '@/api/manage'

  export default {
    name: 'JSettlement',
    props: {
      placeholder:{
        type: String,
        default: '请输入结算主体',
        required: false
      },
      value:{
        type: String,
        default: undefined,
        required: false
      },
      readOnly:{
        type: Boolean,
        required: false,
        default: false
      },
      triggerChange:{
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        settleDomains:[], //结算主体
        getSettleDomainList: '/hrBase/tsettledomain/getSettleDomainSelectVosDomainNameOrCode', //根据权限查询结算主体
      }
    },
    methods: {
      getPopupContainerFun(triggerNode){
        let wid = getComputedStyle(triggerNode).width
        triggerNode.setAttribute('style','width:'+wid)
        return triggerNode.parentNode
      },
      handleSearch(val){
        this.settleDomains = [];
        let parm = val.replace(/\+/g, '%2B')
        httpAction(this.getSettleDomainList + "?departName=" + parm + '&departNo=' + parm ,null,'GET').then((res) => {
          if(res.code == 200 ) {
            this.settleDomains = res.data
          }
        })
      },
      onChange (selectedValue) {
        if(this.triggerChange){
          this.$emit('change', selectedValue)
        }else{
          this.$emit('input', selectedValue)
        }
      },
    }
  }
</script>
