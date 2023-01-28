<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :footer="null"
  >

    <!-- <template slot="footer">
      <a-button key="previewBill" type="primary" @click="chooseIncome">选择到款</a-button>
      <a-button key="audit" type="primary" :loading="confirmLoading" @click="handleOk">保存</a-button>
      <a-button key="back" @click="handleCancel">关闭</a-button>
    </template> -->

    <!-- <a-form :form="form">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="回款金额">
        <a-input placeholder="回款金额" :disabled="true" style="width: 300px;" v-decorator="['money', validatorRules.money ]"></a-input>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="回款日期">
        <a-date-picker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="回款日期"
          :disabled="true"
          style="width: 300px;"
          v-decorator="[ 'backDate',validatorRules.backDate]"
        />
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="回款说明">
        <a-textarea
          placeholder="回款说明"
          v-decorator="['remark', {} ]"
          :autosize="{ minRows: 2, maxRows: 2 }"
        />
      </a-form-item>
    </a-form> -->

    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :pagination="false"
      :dataSource="dataSource"
    >
    </a-table>

  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'AdvancePaymentBack',
  data() {
    return {
      title: '垫付回款记录',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      nodes: [],
      roleUser: [],
      nodeObject: {},
      advancePaymentId: '',
      approvalManName: '',
      model: {},
      isActive: true,
      dataSource:[],
      columns:[
        {
          title: '回款日期',
          align: 'center',
          dataIndex: 'backDate'
        },
        {
          title: '回款金额',
          align: 'center',
          dataIndex: 'money',
        },
        {
          title: '回款说明',
          align: 'center',
          dataIndex: 'remark',
        },
        
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      validatorRules: {
        money: {rules: [{ required: true, message: '回款金额不能为空!' }]},
        backDate: {rules: [{ required: true, message: '回款日期不能为空!' }]},
        remark: {rules: [{ required: true, message: '请填写回款说明!' }]},
      },
      url: {
        getFlows: '/hrApproval/tpaymentapprovaldefine/allNode',
        getRoleUsers: '/admin/user/getUsersByRoleId',
        doAudit: '/hrApproval/tpaymentapprovalrecord/submitAndaudit',
      }
    }
  },
  methods: {
    show(record) {
      this.dataSource = record
      this.visible = true;
    },
    handleOk() {
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = Object.assign(this.model, values)
          formData.advancePaymentId = this.advancePaymentId;
          formData.approvalManName = this.approvalManName;
          formData.flowId = this.nodeObject.flowId;
          formData.nodeId = this.nodeObject.id;

          that.confirmLoading = true
          httpAction(this.url.doAudit, formData, 'POST').then((res) => {
            if(res.code == 200){
              this.$message.success('审核成功!');
              this.$emit('ok');
            } else {
              this.$emit('error');
              this.$message.warning(res.msg);
            }
          }).finally(() => {
            this.confirmLoading = false;
            this.close();
          })
        }
      })
    },
    chooseIncome() {
      // TODO 回款
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.$emit('close')
      this.visible = false
    }
  }
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>