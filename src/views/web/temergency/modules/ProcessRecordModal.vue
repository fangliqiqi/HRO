<template>
  <a-modal
    :title="title"
    :width="700"
    placement="right"
    :closable="true"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-row v-if="records.length == 0">暂无记录</a-row>
      <a-row v-if="records.length">
        <a-col :span="24">
          <a-steps
            direction="vertical"
            :current="records.length-1"
          >
            <a-step
              v-for="(item,index) in records"
              :key="index"
              :title="item.operationTime"
            >
              <span slot="description">{{ item.operationUserName }} {{ item.nodeName }} 备注:{{ item.remark || '无' }}</span>
            </a-step>
          </a-steps>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'ProcessRecordModal',
  components: {
  },
  data() {
    return {
      id:'',
      model: {},
      title: '流程记录',
      visible: false,
      confirmLoading: false,
      records:[], //记录

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      url: {
        getRecordUrl:'/hrEmergency/recordeventoperation/record',//获取记录
      }
    }
  },
  methods: {
    edit(record,type) {
      //获取附件信息
      httpAction(this.url.getRecordUrl+'?id='+record.id+'&type='+type,null,'get').then((res) => {
        if(res.code == 200 && res.data){
          this.records = res.data
          this.visible = true
        }else{
          this.$message.warning(res.msg)
        }
      });
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
</style>