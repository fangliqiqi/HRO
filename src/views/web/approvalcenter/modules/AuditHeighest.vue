<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    cancelText="关闭"
  >

    <a-form :form="form">
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="是否通过"
      >
        <a-select
          placeholder="是否通过"
          optionFilterProp="children"
          style="width: 300px;"
          @change="approvalResultChange"
          v-decorator="['approvalResult', validatorRules.approvalResult ]"
        >
          <a-select-option value="0">是</a-select-option>
          <a-select-option value="1">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="审核意见"
      >
        <a-textarea
          placeholder="审核意见"
          v-decorator="['approvalOpinion', validatorRules.approvalOpinion ]"
          :autosize="{ minRows: 2, maxRows: 2 }"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="下一步环节"
        v-if="nodes.length > 0 && isActive"
      >
        <a-select
          placeholder="下一步环节"
          optionFilterProp="children"
          style="width: 300px;"
          @change="nodeChange"
          v-decorator="['nodeId', validatorRules.nodeId ]"
        >
          <a-select-option
            v-for="item in nodes"
            :key="item.id"
          >{{ item.nodeName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="下一步审核人"
        v-if="nodes.length > 0 && isActive"
      >
        <a-select
          placeholder="下一步审核人"
          optionFilterProp="children"
          style="width: 300px;"
          @change="approvalManChange"
          v-decorator="['approvalMan', validatorRules.approvalMan ]"
        >
          <a-select-option
            v-for="item in roleUser"
            :key="item.userId"
            :value="item.userId"
          >{{ item.nickname }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'AuditHeighest',
  data() {
    return {
      title: '审核',
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
      isRequire: false,

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      validatorRules: {
        approvalResult: {rules: [{ required: true, message: '请选择是否通过!' }]},
        approvalOpinion: {rules: [{ required: true, message: '请填写审核意见!' }]},
        approvalMan: {rules: [{ required: true, message: '请选择下一步审核人!' }]},
        nodeId: {rules: [{ required: true, message: '请选择下一步审核环节!' }]},
      },
      url: {
        getFlows: '/hrApproval/tpaymentapprovaldefine/allNode',
        getRoleUsers: '/admin/user/getUsersByRoleId',
        doAudit: '/hrApproval/tpaymentapprovalrecord/submitAndaudit',
      }
    }
  },
  methods: {
    show(nodes) {
      this.nodes = nodes;
      this.visible = true;
    },
    handleOk() {
      // console.log(this.nodeObject)
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
              this.$message.success('提交成功!');
              this.$emit('ok');
            } else {
              this.$message.warning(res.msg);
            }
          }).finally(() => {
            this.confirmLoading = false;
            this.close();
          })
        }
      })
    },
    nodeChange(v) {
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({approvalMan:undefined}, 'approvalMan'))
        this.approvalManName = ''
      })
      for (let i = 0; this.nodes.length > 0 && i < this.nodes.length; i++) {
        if(this.nodes[i].id == v) {
          this.nodeObject = this.nodes[i];
          httpAction(this.url.getRoleUsers + "?clienId=wxhr&roleId=" + this.nodes[i].rulesDataId,null,'GET').then((res) => {
            if (res.data) {
              this.roleUser = res.data;
              this.$nextTick(() => {
                this.form.setFieldsValue(pick({approvalMan:res.data[0].userId}, 'approvalMan'))
                this.approvalManName = res.data[0].nickname
              })
            }
          });
          break;
        }
      }
    },
    approvalResultChange(v) {
      if(v == 1){
        this.isActive = false
        this.validatorRules.approvalOpinion = {rules: [{ required: true, message: '请填写审核意见!' }]}
      }else{
        this.isActive = true
        this.validatorRules.approvalOpinion = {rules: [{ required: false, message: '请填写审核意见!' }]}
      }
      // this.isActive = (v == 1) ? false : true
    },
    // eslint-disable-next-line no-unused-vars
    approvalManChange(v,t) {
      this.approvalManName = t.componentOptions.children[0].text;
    },
    handleCancel() {
      this.close();
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.isActive = true
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