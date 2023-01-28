<template>
  <a-modal
    :title="title"
    :width="600"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >确定</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row v-if="isBatch">
          <a-col :span="12">
            <a-form-item
              label="原单位名称"
              class="stepFormTextInfo"
            >
              <a-tooltip
                placement="topLeft"
                :title="unitAndSettleDomain.customerName ? unitAndSettleDomain.customerName : '-'"
              >
                {{ unitAndSettleDomain.customerName ? unitAndSettleDomain.customerName : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="原结算主体"
              class="stepFormTextInfo"
            >
              <a-tooltip
                placement="topLeft"
                :title="unitAndSettleDomain.departName ? unitAndSettleDomain.departName : '-'"
              >
                {{ unitAndSettleDomain.departName ? unitAndSettleDomain.departName : '-' }}
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              label="单位名称"
              class="stepFormText"
            >
              <!-- <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择单位"
                v-decorator="['unitId', validatorRules.unitId]"
                :dropdownMatchSelectWidth="false"
                @change="handleUnitChange"
                style="width: 180px"
              >
                <a-select-option
                  v-for="(value, key) in unitBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.customerName }}</a-select-option>
              </a-select> -->
              <select-page
                placeholder="请选择单位"
                style="width: 180px"
                v-decorator="['unitId',validatorRules.unitId]"
                :searchUrl="'/hrBase/customerBusiness/customerInfo/getCustomerOwnerPage?customerName='"
                :title="'customerName'"
                :allowClear="false"
                @select="handleUnitChange"
                :id="'customerId'"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择结算主体"
                v-decorator="['settleDomainId', validatorRules.settleDomainId]"
                :dropdownMatchSelectWidth="false"
                style="width: 180px"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="划转月份"
              class="stepFormText"
            >
              <a-month-picker
                :format="dateFormat"
                placeholder="请选择划转月份"
                v-decorator="['effectTime', validatorRules.effectTime]"
                style="width: 180px"
              /><span style="margin-left: 10px">注：划转预估的</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'EmployeeSettleDomainChangeModal',
    components: {
      SelectPage
    },
    data() {
      return {
        empId: '',
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        dateFormat: "YYYYMM",
        isBatch: true,  // 是否批量划转
        unitBelongs: [],  // 单位和结算主体
        settleDomainBelongs: [], // 结算主体
        unitAndSettleDomain: {},  // 现在单位结算主体信息
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          effectTime: {rules: [{ required: true, message: '请选择划转月份！' }]},
          unitId: {rules: [{ required: true, message: '请选择单位！' }]},
          settleDomainId: {rules: [{ required: true, message: '请选择结算主体！' }]},
        },
        url: {
          add: 'hrBase/temployeeinfo/settleDomainChangeByIds',
        },
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            httpurl += this.url.add
            const method = 'post'
            let formData = Object.assign(this.model, values)
            formData.effectTime = formData.effectTime.format(this.dateFormat)  // 时间转换
            httpurl += `?effectTime=${formData.effectTime}&unitId=${formData.unitId}&settleDomainId=${formData.settleDomainId}&ids=${this.empId}`
            httpAction(httpurl, '', method, 60000).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.msg || res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      // 单位选择变化
      handleUnitChange(value) {
        if (value) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({'unitId': value,settleDomainId: undefined}, 'unitId','settleDomainId'))
          })
          httpAction(`/hrBase/customerBusiness/customerInfo/getSettleDomain/${value}`, {}, 'get').then((res) => {
            if(res.code === 200){
              this.settleDomainBelongs = res.data
            }else{
              this.settleDomainBelongs = []
            }
          })
        } else {
          this.settleDomainBelongs = []
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({'settleDomainId': undefined,'unitId':undefined}, 'settleDomainId','unitId'))
          })
        }
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.empId = ''
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.isBatch = true  // 是否批量划转
        this.unitBelongs = []  // 单位和结算主体
        this.settleDomainBelongs = [] // 结算主体
        this.unitAndSettleDomain = {}  // 现在单位结算主体信息
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
  }
}
.stepFormTextInfo {
  :global(.ant-form-item-label) {
    width: 80px;
  }
  :global(.ant-form-item-control .ant-form-item-children) {
    width: 180px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}
</style>

<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
