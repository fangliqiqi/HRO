<template>
  <a-modal
    title="选择自定义项"
    :width="800"
    placement="right"
    :closable="false"
    :footer="null"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :bodyStyle="{'height':'calc(100vh - 200px)'}"
  >
    <happy-scroll
      color="rgba(23, 22, 22, 0.68)"
      size="5"
      resize
      hide-horizontal
    >
      <a-spin :spinning="confirmLoading">
        <p class="title">分类检索</p>
        <ul class="anchor">
          <li
            v-for="(item,index) in paushTypeOption"
            :key="item.id"
          >
            <a :href="'#'+item.id" :class="'color-'+index">{{ item.label }}</a>
          </li>
        </ul>
        <a-divider />
        <div v-for="item in paushTypeTree" :key="item.id">
          <p class="itemTitle"><a :name="item.id">{{ item.label }}</a></p>
          <div class="list">
            <a
              v-for="list in item.children"
              :key="list.id"
              @click="selected(list.value,list.label,list.parentId)">{{ list.label }}</a>
          </div>
        </div>
      </a-spin>
    </happy-scroll>
  </a-modal>
</template>
<script>
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

export default {
  name: "SelectItemModal",
  components: {HappyScroll},
  data(){
    return {
      confirmLoading: false,
      visible:false,
      paushTypeOption:[],
      paushTypeTwoOption:[],
      paushTypeTree:[]
    }
  },
  methods: {
    show(paushTypeOption,paushTypeTwoOption) {
      this.visible = true
      this.paushTypeOption = paushTypeOption
      this.paushTypeTwoOption = paushTypeTwoOption
      this.paushTypeTree = this.getTree(paushTypeOption,paushTypeTwoOption)
    },
    selected(value,label,parentId){
      this.visible = false
      this.$emit('ok',value,label,parentId)
    },
    getTree(paushTypeOption,paushTypeTwoOption){
      return paushTypeOption.map(item=>{
        const children = []
        paushTypeTwoOption.forEach(list=>{
          if(String(list.parentId) === String(item.id)){
            children.push(list)
          }
        })
        item.children = children
        return item
      })
    }
  }
}
</script>

<style lang="less" scoped>

.title{
  color: #CCCCCC;
  font-size: 14px;
}
.anchor{
  list-style: none;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  li{
    float: left;
    a{
      font-size: 12px;
      color: #333333;
      padding:5px 12px;
      background-color: #ffbd64;
      border-radius: 3px;
      margin-right: 10px;
      margin-bottom: 10px;
      display: inline-block;
    }
  }
}
.list{
  margin-bottom: 15px;
  a{
    color: #333333;
    font-size: 14px;
    margin-right: 18px;
  }
}
.itemTitle{
  color: #CCCCCC;
  font-size: 14px;
  margin-bottom: 5px;
  a{
    color: #CCCCCC;
    cursor: auto;
  }
}
each(range(0,10,1), {
  .color-@{value} {
    background: #ff9 !important;
  }
});
each(range(10,15,1), {
  .color-@{value} {
    background: #1aad1966 !important;
  }
});
</style>
