<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item>
          <a-textarea
            placeholder="请输入未回款反馈原因"
            :autoSize="false"
            :rows="3"
            v-decorator="['noPayBackResion', validatorRules.noPayBackResion ]"
            :allowClear="true"
          />
        </a-form-item>
      </a-form>
      <h3 class="remark">历史备注:</h3>
      <a-list size="small" :data-source="dataSource" :locale="{emptyText:'暂无数据'}">
        <div
          slot="loadMore"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
        >
          <a-pagination size="small" :total="total" @change="changePage"/>
        </div>
        <a-list-item slot="renderItem" slot-scope="item">
          {{ sysUsers[item.createUser] }} 在 {{ item.createTime }} 备注了：{{ item.remark }}
        </a-list-item>
      </a-list>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'AdvancePaymentFeedback',
  data() {
    return {
      title: '',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules:{
        noPayBackResion: {rules: [{ required: true, message: '请输入未回款反馈原因!' },{max:300,message:'最多300个字符!'}]},
      },
      dataSource: [],
      url: {
        feedbackRecord: '/hrApproval/tadvancepaymentremark',
      },
      recordId: '',
      total: 0,
    }
  },
  methods: {
    show(record,users) {
      this.visible = true
      this.recordId = record.id
      this.sysUsers = users
      this.getData(1)
    },
    getData(page){
      httpAction(`/hrApproval/tadvancepaymentremark/page?paymentId=${this.recordId}&orders%5B0%5D.asc=false&orders%5B0%5D.column=create_time&current=${page}`,null,'get').then((res) => {
        if(res.code === 200){
          this.dataSource = res.data.records
          this.total = res.data.total
        }else{
          this.$message.warn(res.msg)
        }
      })
    },
    changePage(page) {
      this.getData(page)
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const params = {
            paymentId: this.recordId,
            remark: values.noPayBackResion,
          }
          httpAction(this.url.feedbackRecord, params, 'post').then((res) => {
            if (res.code === 200) {
              this.$message.success('反馈成功!')
              this.$emit('ok')
            } else {
              this.$message.warning(res.msg)
              this.$emit('error')
            }
          }).finally(() => {
            this.confirmLoading = false
            this.close()
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.dataSource = []
      this.total = 0
      this.form.resetFields()
    },
  },
}
</script>

<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
<style lang="less" scoped>
.remark{
  margin-top:15px;
  font-size: 15px;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>
