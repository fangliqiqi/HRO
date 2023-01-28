<template>
  <a-modal
    :title="title"
    :width="700"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="提交"
    :visible="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="选择状态"
              class="stepFormText"
            >
              <a-radio-group
                placeholder="请选择状态"
                v-decorator="['handleStatus',validatorRules.handleStatus]"
              >
                <a-radio :value="0">办理</a-radio>
                <a-radio :value="1">不办理</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <!-- <a-textarea
                :rows="3"
                :cols="50"
                placeholder="请选择或填写备注"
                v-decorator="['remark',validatorRules.remark]"
              /> -->
              <a-select
                style="width:250px"
                placeholder="请选择或填写备注"
                optionFilterProp="children"
                showSearch
                mode="combobox"
                v-decorator="['remark',validatorRules.remark]"
              >
                <a-select-option
                  v-for="(item,index) in remarkList"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>

            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'

  export default {
    name: 'InsuranceHandleModal',
    components: {
    },
    data() {
      return {
        ids: '',
        model: {},
        title: '办理',
        visible: false,
        remarkList:[
          '员工未提交资料，无法办理',
          '员工已离职，未提交材料，无法办理',
          '前家单位未停保/欠费，无法办理',
          '员工个人未停保/欠费，无法办理',
          '客户单位要求撤单不办',
          '派单信息有误，退回重派',
          '员工在领失业金，无法办理',
        ],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          handleStatus: { rules: [{ required: true, message: '请选择状态!' }] },
          remark: { rules: [{ required: true, message: '请选择或填写备注!' }] },
        },
        url: {
          subUrl: '/busiInsurance/tinsurancenonemessage/handle', //商险结算
        }
      }
    },
    methods: {
      edit(record) {
        this.model = Object.assign({}, record)
        this.visible = true
      },
      // 保存按钮
      handleOk() {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            let httpurl = _this.url.subUrl
            let method = 'put'
            values.id = _this.model.id
            httpAction(httpurl, values, method).then((res) => {
              let msg = res.msg || res.message
              if (res.code === 200) {
                this.$message.success("操作成功！")
                _this.$emit('ok')
                _this.close()
              } else {
                _this.$message.warning(msg)
              }
            }).finally(() => {
              _this.confirmLoading = false
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.form.resetFields()
        this.$emit('close')
        this.visible = false
      }
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
</style>