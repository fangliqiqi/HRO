<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    cancelText="关闭"
  >

    <a-form
      :form="form"
      layout="inline"
      class="ant-advanced-search-form"
    >
      <a-row :gutter="24">
        <!-- <a-col :span="12">
          <a-form-item class="stepFormText" label="选择流程">
            <a-select
              placeholder="请选择流程"
              optionFilterProp="children"
              style="width: 180px;"
              v-decorator="['flowId', validatorRules.flowId ]"
            >
              <a-select-option v-for="item in flows" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
        <a-col :span="12">
          <a-form-item
            class="stepFormText"
            label="选择节点"
          >
            <a-select
              placeholder="请选择流程节点"
              showSearch
              optionFilterProp="children"
              style="width: 180px;"
              @change="nodeChange"
              v-decorator="['nodeId', validatorRules.nodeId ]"
            >
              <a-select-option
                v-for="item in nodes"
                :key="item.id"
              >{{ item.nodeName }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            class="stepFormText"
            label="审核人"
          >
            <a-select
              placeholder="请选择审核人"
              showSearch
              optionFilterProp="children"
              style="width: 180px;"
              @change="approvalManChange"
              v-decorator="['approvalMan', validatorRules.approvalMan ]"
            >
              <a-select-option
                v-for="item in roleUser"
                :key="item.userId"
              >{{ item.nickname }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'

export default {
  name: 'BeforeAduitModule',
  data() {
    return {
      title: '提交审核',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      model: {},
      flows: [],
      nodes: [],
      roleUser: [],
      advancePaymentPojo: {},
      type:1, // 1垫付审批2成本支出
      validatorRules: {
        flowId: { rules: [{ required: true, message: '请选择流程!' }] },
        nodeId: { rules: [{ required: true, message: '请选择节点!' }] },
        approvalMan: { rules: [{ required: true, message: '请选择审核人!' }] },
      },
      url: {
        getFlows: '/hrApproval/tpaymentapprovaldefine/allNode',
        getRoleUsers: '/admin/user/getUsersByRoleId',
        submit: '/hrApproval/tpaymentapprovalrecord/submit',
      }
    }
  },
  created() {
    // this.getFlows();
  },
  methods: {
    show(record,type) {
      this.getFlows(type)
      this.type = type
      this.advancePaymentPojo = record;
      this.visible = true;
    },
    handleOk() {
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          const formData = Object.assign(that.model, values)
          formData.flowId = that.type
          formData.advancePaymentId = that.advancePaymentPojo.id;
          formData.oldType = 1
          httpAction(that.url.submit, formData, 'POST').then((res) => {
            if(res.code == 200){
              that.$message.success('提交成功!');
              that.$emit('ok');
              that.close();
            } else {
              that.$message.warning(res.msg);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }
      })
    },
    getFlows(type) {
      this.flows = [];
      httpAction(this.url.getFlows+'?id='+type,null,'POST').then((res) => {
        if(res.data && res.data != null) {
          let flow = new Object();
          flow.name = res.data.name;
          flow.id = res.data.id;
          this.flows.push(flow);
          this.nodes = res.data.paymentApprovalNode;
        }
      });
    },
    // eslint-disable-next-line no-unused-vars
    approvalManChange(v,t) {
      this.model.approvalManName = t.componentOptions.children[0].text;
    },
    nodeChange(v) {
      for (let i = 0; this.nodes.length > 0 && i < this.nodes.length; i++) {
        if(this.nodes[i].id == v) {
          httpAction(this.url.getRoleUsers + "?clienId=wxhr&roleId=" + this.nodes[i].rulesDataId,null,'GET').then((res) => {
            if (res.data) {
              this.roleUser = res.data;
              // approvalMan
              this.form.setFieldsValue(pick({approvalMan:undefined},'approvalMan'))
            }
          });
          break;
        }
      }
      //getRoleUsers
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
    width: 80px;
  }
}
</style>