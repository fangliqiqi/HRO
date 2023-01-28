<template>
  <a-modal
    :title="title"
    :width="800"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
    <div class="box">
      <detail-list :col="2">
        <detail-list-item
          v-for="(item, index) in saiList"
          :key="index"
          :term="item.cnName"
        >
          <template v-if="Number(salaryType) === 0">
            {{ (item.salaryMoney === '' || item.salaryMoney === null)?item.textValue:item.salaryMoney }}
          </template>
          <template v-else>
            {{ (item.salaryMoney === '' || item.salaryMoney === null)?'-':item.salaryMoney }}
          </template>
        </detail-list-item>
      </detail-list>
    </div>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  components:{
    DetailListItem,
    DetailList,
  },
  data(){
    return {
      description: '工资报表详情',
      title: '报表详情',
      confirmLoading: false, // 点击保存或编辑按钮加载动画
      visible: false,
      salaryType:0, // 薪酬类型，0:普通薪资 1:工程工资 2:非扣税类，默认普通薪资
      saiList:[], // 报表详情数据
    }
  },
  methods:{
    show(){
      this.visible = true
    },
    handleCancel(){
      this.confirmLoading = false
      this.visible = false
      this.salaryType = 0
      this.saiList = []
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  box-sizing: border-box;
  padding: 15px 0 0 20px;
  border: 1px dashed #cecece;
}
</style>
