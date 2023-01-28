<template>
  <div>
    <a-select
      allowClear
      showSearch
      optionFilterProp="children"
      placeholder="选择省份"
      :style="{width:style.width}"
      @change="handleProvinceChange"
      :dropdownMatchSelectWidth="false"
      v-model="province"
    >
      <a-select-option
        v-for="(item, index) in areaTrees"
        :key="index"
        :value="item.id"
      >{{ item.areaName }}</a-select-option>
    </a-select>
    <a-select
      allowClear
      showSearch
      optionFilterProp="children"
      placeholder="选择城市"
      :style="style"
      @change="handleCityChange"
      :dropdownMatchSelectWidth="false"
      v-model="city"
    >
      <a-select-option
        v-for="(item, index) in citys"
        :key="index"
        :value="item.id"
      >{{ item.areaName }}</a-select-option>
    </a-select>
    <a-select
      allowClear
      showSearch
      optionFilterProp="children"
      placeholder="选择区县"
      :style="style"
      :dropdownMatchSelectWidth="false"
      @change="handleTownChange"
      v-model="town"
      v-if="count != 2"
    >
      <a-select-option
        v-for="(item, index) in towns"
        :key="index"
        :value="item.id"
      >{{ item.areaName }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
/**
 * 使用方法
 * import SelectArea from '@/components/jeecg/SelectArea'
 * <select-area
    :areaTrees="areaTrees"
    :id="'id'"
  ></select-area>
 */
  import Vue from 'vue'

  export default {
    name: 'SelectArea',
    props: {
      count:{
        type: Number,
        default:3,
        required: false
      },
      areaTrees:{
        type: Array,
        default:()=>Vue.ls.get('glob_area'),
        required: false
      },
      value:{
        type: String,
        default:undefined,
        required: false
      },
      triggerChange:{
        type: Boolean,
        required: false,
        default: false,
      }
    },
    data(){
      return {
        citys:[], //市
        towns:[], //县
        province:undefined,
        city:undefined,
        town:undefined,
        style:{
          width:'30%',
          marginLeft:'2%'
        }
      }
    },
    created() {
      if(this.count == 2){
        this.style.width = '45%'
      }
    },
    watch: {
      value: function () {
        this.seletedValue = this.value
      },
    },
    methods: {
      // 省切换
      handleProvinceChange(value) {
        this.citys = []
        this.towns = []
        if (value) {
          for (var c of this.areaTrees[value - 1].children) {
            this.citys.push(c)
          }
          this.city = undefined
          this.town = undefined
        }
        if(this.triggerChange){
          this.$emit('change', String(value),1);
        }else{
          this.$emit('input', String(value));
        }
      },
      // 城市切换
      handleCityChange(value) {
        this.towns = []
        if (value) {
          for (const c of this.citys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (const t of c.children) {
                  this.towns.push(t)
                }
              }
            break
            }
          }
          this.town = undefined
        }
        if(this.triggerChange){
          this.$emit('change', String(value),2);
        }else{
          this.$emit('input', String(value));
        }
      },
      handleTownChange(value){
        if(this.triggerChange){
          this.$emit('change', String(value),3);
        }else{
          this.$emit('input', String(value));
        }
      },
      clearSelect(){
        this.province = undefined
        this.city = undefined
        this.town = undefined
      }
      // onChange (selectedValue) {
      //   if(this.triggerChange){
      //     this.$emit('change', selectedValue);
      //   }else{
      //     this.$emit('input', selectedValue);
      //   }
      // },
    }
  };
</script>
