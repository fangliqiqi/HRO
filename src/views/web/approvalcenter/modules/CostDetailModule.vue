<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    @cancel="handleCancel"
    :footer="null"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="成本名称"
              class="stepFormText"
            >
              <a-tooltip placement="topLeft">
                <template slot="title">
                  {{ model.costName }}
                </template>
                <span class="overflow">{{ model.costName }}</span>
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="申请金额"
              class="stepFormText"
            >
              {{ model.costAmount }}元
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="申请单位"
              class="stepFormText"
            >
              <a-tooltip placement="topLeft">
                <template slot="title">
                  {{ model.applyUnitName }}
                </template>
                <span class="overflow">{{ model.applyUnitName }}</span>
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <a-tooltip placement="topLeft">
                <template slot="title">
                  {{ model.departName }}
                </template>
                <span class="overflow">{{ model.departName }}</span>
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="来源类型"
              class="stepFormText"
            >
              {{ model.fromTypeName }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="客户单位"
              class="stepFormText"
            >
              <a-tooltip placement="topLeft">
                <template slot="title">
                  {{ model.customerName }}
                </template>
                <span class="overflow">{{ model.customerName }}</span>
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="付款方式"
              class="stepFormText"
            >
              {{ payTypeOption[model.payType] }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="成本结算类型"
              class="stepFormText"
            >
              {{ filterDictText(settleTypeOptions,model.settleType) }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="收款人"
              class="stepFormText"
            >
              {{ model.payee }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="收款人开户银行"
              class="stepFormText"
            >
              {{ model.payeeBankName || '--' }}
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="收款人账号"
              class="stepFormText"
            >
              {{ model.payeeBankNo || '--' }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="申请人"
              class="stepFormText"
            >
              {{ model.applyUser }}
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="申请时间"
              class="stepFormText"
            >
              {{ model.applyDate }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="用途说明"
              class="stepFormText"
            >
              {{ model.useRemark }}
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>

  </a-modal>
</template>

<script>
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'CostDetailModule',
  data() {
    return {
      title: '支出申请详情',
      visible: false,
      model: {},
      payTypeOption:['现金','银付'],
      settleTypeOptions:[],
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },
  created() {
    // 状态
    initDictOptions('cost_settle_type').then((res) => {
      if (res.code === 200) {
        this.settleTypeOptions = res.data
      }
    });
  },
  methods: {
    filterDictText,
    show(record){
      this.visible = true
      this.model = Object.assign(record,this.model)
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.visible = false
      this.model={}
    },
  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */

.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 0px;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
  :global(.ant-form-item-children .overflow) {
    display: inline-block;
    width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
}
</style>