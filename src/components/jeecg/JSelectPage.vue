<template>
  <div
    class="select"
    v-clickoutside="outsideClose"
    ref="sel"
  >
    <div class="input">
      <input
        type="text"
        :placeholder="placeholder"
        :value="val"
        @input="inputEvent"
        @focus="showSel"
      />
      <div
        class="selectVal"
        v-show="showSelect"
        @click="hideSelected"
      >{{ selectVal }}</div>
    </div>
    <div
      class="option"
      v-show="show"
    >
      <p 
        v-for="(item,index) in listOption"
        :class="{'li':true,'li-selected':item.class}"
        :key="index"
        :title="item.title"
        @click="selected"
      >{{ item.title }}</p>

      <div class="opage">
        <a-pagination
          :total="50"
          :itemRender="itemRender"
          :showLessItems="true"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { httpAction } from '@/api/manage'

  export default {
    name: 'JSelectPage',
    props: {
      placeholder:{
        type: String,
        default:'请输入支行关键字查询',
        required: false
      },
      value:{
        type: String,
        default:'',
        required: false
      },
      readOnly:{
        type: Boolean,
        required: false,
        default: false
      },
      // options:{
      //   type: Array,
      //   required: true
      // },
      triggerChange:{
        type: Boolean,
        required: false,
        default: false
      }
    },
    directives: {
      clickoutside: {
        bind(el, binding) {
          function documentHandler(e) {
            if (el.contains(e.target)) {
              return false
            }
            if (binding.expression) {
              binding.value(e)
            }
          }

          function KeyUp(e) {
            if (e.keyCode == 27) {
              if (binding.expression) {
                binding.value(e)
              }
            }
          }
          el.__vueClickOutSize__ = documentHandler
          el.__vueKeyup__ = KeyUp
          
          document.addEventListener('keyup', KeyUp)
          document.addEventListener('click', documentHandler)
        },
        unbind(el) {
          document.removeEventListener('click', el.__vueClickOutSize__)
          delete  el.__vueClickOutSize__

          document.removeEventListener('keyup', el.__vueKeyup__)
          delete  el.__vueKeyup__
        }
      }
    },
    data(){
      return {
        show:false,
        showSelect:false,
        val:'',
        selectVal:'',
        listOption:[{
          id:1,
          class:false,
          title:'超长选项超长选项超长选项超长选项超长选项'
        },{
          id:1,
          class:false,
          title:'123'
        },{
          id:1,
          class:false,
          title:'456'
        }]
      }
    },
    watch:{
      val(){
        // const _this = this
        // this.listOption.forEach((item,index,arr)=>{
        //   if(item.title == value){
        //     _this.$set(_this.listOption[index],`class`,true)
        //     return true
        //   }else{
        //     _this.$set(_this.listOption[index],`class`,false)
        //   }
        // })
      }
    },
    methods:{
      itemRender(current, type, originalElement) {
        // console.log(current, type, originalElement)
        
        return originalElement;
      },
      outsideClose() {
        this.show = false
      },
      showSel(){
        this.show = true
      },
      inputEvent(e){
        this.val = e.target.value 
        if(e.target.value.length){
          httpAction('/hrBase/tbankinfo/page?branchName='+e.target.value,null,'get').then((res)=>{
            if(res.code == 200){
              this.listOption = res.data.records
            }else{
              // this.listOption = []
            }
          })
          this.showSel()
        }
      },
      selected(e){
        // this.val = e.target.innerHTML 
        this.show = false
        this.showSelect = true
        this.selectVal = e.target.innerHTML

      },
      hideSelected(){
        this.showSelect = false
        this.showSel()
      },
        
      
    }
  }
</script>

<style lang="scss">
.select {
  position: relative;
  display: inline-block;
  width: 200px;
  .input {
    input {
      display: block;
      width: 100%;
      background-color: #fff;
      border: 1px solid #d9d9d9;
      border-top-width: 1.02px;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      outline: none;
      padding: 0px 10px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    input:hover{
      border-color: #40a9ff;
      border-right-width: 1px !important;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
    input::-webkit-input-placeholder {
      color: #bfbfbf;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 200px;
    }
    .selectVal {
      height: 32px;
      vertical-align: middle;
      line-height: 32px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border: 1px solid #d9d9d9;
      border-top-width: 1.02px;
      border-radius: 4px;
      padding: 0px 10px;
      width: 200px;
      position: absolute;
      top: 0px;
      background: #fff;
    }
    .selectVal:hover {
      border-color: #40a9ff;
      border-right-width: 1px !important;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
  .option {
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    font-variant: initial;
    background-color: #fff;
    border-radius: 4px;
    outline: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: absolute;
    top: 32px;
    left: 0px;
    z-index: 99;
    padding: 0px;
    max-height: 160px;
    overflow-y: scroll;
    .li,
    .opage {
      list-style-type: none;
      padding: 0px 10px;
      height: 32px;
      line-height: 32px;
      margin: 0px;
    }
    .li {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .li-selected{
      background-color: #e6f7ff;
    }
    .opage {
      margin-top: 5px;
      padding: 0px;
      text-align: center;
    }
    .li:hover {
      background-color: #e6f7ff;
      cursor: pointer;
    }
  }
}
</style>

