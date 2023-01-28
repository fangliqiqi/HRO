<template>
  <div>
    <a-select
      :style="styleDefault"
      :placeholder="placeholder"
      showSearch
      :value="value"
      @change="onChange"
      @search="handleSearch"
      @select="handleSelect"
      optionFilterProp="children"
      :allowClear="allowClear"
      :dropdownMatchSelectWidth="false"
      :disabled="disabled"
      :default-active-first-option="false"
      :getPopupContainer="getPopupContainerFun"
      :notFoundContent="fetching ? undefined : null"
      :mode="modeType"
      :labelInValue="labelInValue"
    >
      <a-spin
        v-if="fetching"
        slot="notFoundContent"
      />
      <div
        slot="dropdownRender"
        slot-scope="menu"
      >
        <v-nodes :vnodes="menu" />
        <a-divider
          style="margin: 4px 0;"
          v-if="total > size"
        />
        <div
          @mousedown="e => e.preventDefault()"
          style="margin-bottom:4px;text-align:center"
        >
          <a-pagination
            size="small"
            :total="total"
            :defaultPageSize="size"
            :hideOnSinglePage="true"
            @change="changePage"
          />
        </div>
      </div>
      <a-select-option
        v-for="(item,index) in lists"
        :value="String(item.id)"
        :key="index"
      >{{ item.title }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
/**
 * 使用方法
 * import SelectPage from '@/components/jeecg/SelectPage'
 * <select-page
    :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
    :title="'departName'"
    :size="1"
    :id="'id'"
  ></select-page>
 */
  import { httpAction } from '@/api/manage'

  export default {
    name: 'JSelectPage',
    props: {
      placeholder:{
        type: String,
        default:'',
        required: false
      },
      value:{
        type:[Array,String],
        default:undefined,
        required: false
      },
      //查询地址
      searchUrl:{
        type: String,
        required: true,
      },
      // option显示的字段
      title:{
        type: String,
        required: true,
        default:'title',
      },
      // 查询的结果集
      resList:{
        type: Array,
        required: false,
        default:()=>[],
      },
      // 主键
      id:{
        type: String,
        required: true,
        default:'id',
      },
      
      // 样式
      styleDefault:{
        type: Object,
        required: false,
        default: ()=>{},
      },
      // 每页显示条数
      size:{
        type: Number,
        required: false,
        default:10,
      },
      triggerChange:{
        type: Boolean,
        required: false,
        default: false,
      },
      disabled:{
        type: Boolean,
        required: false,
        default: false,
      },
      // 是否可清除
      allowClear:{
        type: Boolean,
        required: false,
        default: true,
      },
      // 模式是否是多选
      modeType:{
        type: String,
        required: false,
        default:'default',
      },
      labelInValue:{
        type:Boolean,
        required:false,
        default:false
      },
      // 是否重新请求
      newRequest:{
        type:Boolean,
        required:false,
        default:false
      },

    },
    data(){
      return {
        lists:[], //查询的结果集
        total:0, //总条数
        searchKey:'',
        seletedValue: this.value,
        emptyData:{
          text:'暂无数据',
          fetching:true //加载状态
        },
        fetching:false,
        current:1,
      }
    },
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    mounted () {
      this.getRemoteData(this.searchUrl,1)
    },
    watch: {
      value: function () {
        this.seletedValue = this.value
      },
      resList(val){
        this.lists = val
        this.total = val.length
      },
      // 是否重新请求
      newRequest(val){
        if(val){
          this.searchKey = null
          let url = this.searchUrl + '&current=1'
          this.getRemoteData(url)
        }
      }
    },
    methods: {
      getPopupContainerFun(triggerNode){
        let wid = getComputedStyle(triggerNode).width
        triggerNode.setAttribute('style','width:'+wid)
        return triggerNode.parentNode
      },
      onChange (selectedValue,option) {
        if(!selectedValue){
          this.searchKey = null
          let url = this.searchUrl + '&current=1'
          this.getRemoteData(url)
        }
        if(this.triggerChange){
          this.$emit('change', selectedValue,option);
        }else{
          this.$emit('input', selectedValue,option);
        }
      },
      handleSelect(val,option){
        this.$emit('select',val,option,this.lists)
      },
      // 分页改变
      changePage(page) {
        this.current = page
        let searchKey = this.searchKey?this.searchKey:''
        let url = this.searchUrl + searchKey + '&current='+page
        this.getRemoteData(url)
      },
      // 搜索
      handleSearch(val){
        this.lists = [];
        this.searchKey = val
        let url = this.searchUrl + val
        this.getRemoteData(url)
      },
      //远程请求数据 type 1初始化
      getRemoteData(url,type){
        if(type && this.resList.length){
          this.lists = this.resList
          this.$emit('okList',this.lists)
        }else{
          this.fetching = true
          url = encodeURI(url + '&size='+this.size)
          httpAction(url ,null,'GET').then((res) => {
            if(res.code == 200 ) {
              this.lists = this.formatResult(res.data.records)
              this.total = res.data.total
              this.$emit('okList',this.lists)
            }
          }).finally(()=>{
            this.fetching = false
          })
        }
      },
      //格式化结果集
      formatResult(arr){
        const _this = this
        return arr.map(item => {
          return {
            id:item[_this.id],
            title:_this.getField(item),
            item:item
          }
        });
      },
      getField(item){
        const arr = this.title.split(',')
        let title = []
        arr.forEach(element => {
          title.push(item[element])
        })
        return title.join(' ')
      },
    }
  };
</script>
<style lang="less" scoped>
  /deep/ .ant-select-dropdown-content div{
    transform:none !important;
  }
</style>
