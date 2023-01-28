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
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="单位名称"
            >
              <select-page
                placeholder="请选择单位名称"
                style="width:360px"
                v-decorator="['unitId',validatorRules.unitId]"
                :searchUrl="'/hrBase/customerBusiness/customerInfo/getCustomerOwnerPage?customerName='"
                :title="'customerName'"
                :allowClear="false"
                @select="handleUnitChange"
                @okList="okList"
                :id="'customerId'"
              ></select-page>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="结算主体"
            >
              <a-select
                allowClear
                showSearch
                mode="multiple"
                :disabled="settleDomainDisabled"
                optionFilterProp="children"
                placeholder="请选择结算主体（可多选）"
                v-decorator="['settleDomainIds', validatorRules.settleDomainIds]"
                :dropdownMatchSelectWidth="false"
                style="width:360px"
                @change="changeSettle"
              >
                <a-select-option
                  v-for="(value, key) in settleDomainBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.departName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-checkbox-group
                @change="onCheckBoxChange"
                :disabled="settleDomainDisabled"
                v-decorator="['checked', {}]"
              >
                <a-checkbox value="1" :indeterminate="indeterminate">全选</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="结算月份"
            >
              <a-month-picker
                allowClear
                placeholder="请选择结算月份"
                v-decorator="['settleMonth', validatorRules.settleMonth]"
                style="width: 360px"
                format="YYYYMM"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="生成月份"
            >
              <a-select
                mode="multiple"
                allowClear
                placeholder="请选择生成月份（可多选）"
                v-decorator="['createMonths', validatorRules.createMonth]"
                :dropdownMatchSelectWidth="false"
                style="width: 360px"
              >
                <a-select-option
                  v-for="(value, key) in yearMonthArrBelongs"
                  :key="key"
                  :value="value"
                >{{ value }}</a-select-option>
              </a-select>
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
    name: 'FinancialBillsAddModal',
    components: {
      SelectPage
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        loading:false,
        indeterminate:false,
        settleDomainDisabled: true,
        form: this.$form.createForm(this),
        dateFormat: 'YYYYMM', // 时间格式化
        unitBelongs: [],  // 单位和结算主体
        settleDomainBelongs: [], // 结算主体
        yearMonthArrBelongs: [],  // 年和月组成的字符串的数组
        validatorRules: {
          unitId: {rules: [{ required: true, message: '请选择单位名称！' }]},
          createMonth: {rules: [{ required: true, message: '请选择生成月份！' }]},
          settleMonth: {rules: [{ required: true, message: '请选择账单月份！' }]},
          settleDomainIds: {rules: [{ required: true, message: '请选择结算主体！' }]},
        },
        url: {
          addUrl: '/hrSocial/tfinancebill/doCreate',//生成接口
          checkUrl:'/hrSocial/tfinancebill/doCreateCheck',//检测接口
        },
      }
    },
    methods: {
      show() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
      },
      filterOption(input,option){
        // console.log(option)
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      // 保存按钮
     handleOk() {
        const that = this
        // 触发表单验证
       this.form.validateFields(async (err, values) => {
          if (!err) {
            that.confirmLoading = true
            that.loading = true
            let httpurl = ''
            let method = 'post'
            let formData = {}
            
            let departs = []   //结算主体
            for(let c of values.settleDomainIds){
              for(let d of this.settleDomainBelongs){
                if(c == d.id){
                  departs.push({'id':d.id,'departName': d.departName, 'departNo': d.departNo})
                }
              }
            }
            formData.departs = departs
            for(let c of this.unitBelongs){
              if(values.unitId == c.id){
                // console.log(c);
                let {customerId,customerName,customerCode} = c.item
                formData.unit = {'id': customerId, 'customerName': customerName, 'customerCode': customerCode}
              }
            }
            // return false
            formData.createMonths = values.createMonths.join(',')   //创建时间转字符串
            formData.settleMonth = values.settleMonth.format(this.dateFormat)   // 结算月份格式
           
            httpurl += this.url.addUrl
            let checkRes = await httpAction(this.url.checkUrl, formData, method,10000*6)
            if(checkRes.code==200){
              if(checkRes.data){
                that.createFun(httpurl,formData,method)
              }else{
                that.$confirm({
                  title: '提示：',
                  content: `原结算方式为：${checkRes.msg}合并结算，新组合将会归集所有关联的结算主体的历史差余额，请谨慎操作，是否确定？`,
                  okText: '确认',
                  cancelText: '取消',
                  onOk: function() {
                    that.createFun(httpurl,formData,method)
                  },
                  onCancel() {
                    that.confirmLoading = false
                    that.loading = false
                  }
                })
              }
            }else{
              that.$message.warning(checkRes.msg || checkRes.message)
            }
          }
        })
      },

      // 生成函数
      createFun(httpurl,formData,method){
        httpAction(httpurl, formData, method,10000*6).then((res) => {
              if (res.code === 200) {
                this.$message.success(`${this.title}成功！`)
                this.$emit('ok')
                this.close()
              } else {
                this.$message.warning(res.msg || res.message)
              }
            }).finally(() => {
              this.confirmLoading = false
              this.loading = false
            })
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.type = '' // 类型（锁定还是解锁）
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.indeterminate = false
        this.settleDomainDisabled = true
        this.unitBelongs = []  // 单位和结算主体
        this.settleDomainBelongs = [] // 结算主体
        this.yearMonthArrBelongs = [] // 年和月组成的字符串的数组
      },

      // 得到selecePage组件当前页面的数据
      okList(val){
        // console.log(val);
        this.unitBelongs = val
      },
      // 单位选择变化 得结算主体
      handleUnitChange(value) {
        console.log(value);
        this.$nextTick(() => {
          let unitId = undefined
          this.settleDomainBelongs = []
          if(value){
            unitId = value
            httpAction(`/hrBase/customerBusiness/customerInfo/getSettleDomain/${value}`, {}, 'get').then((res) => {
              if(res.code === 200){
                this.settleDomainDisabled = false
                this.settleDomainBelongs = res.data
                // 默认全选中
                let settleDomainOptions = []
                for (const item of this.settleDomainBelongs) {
                  settleDomainOptions.push(item.id)
                }
                this.indeterminate = false
                this.form.setFieldsValue(pick({settleDomainIds: settleDomainOptions, checked: ['1']}, 'settleDomainIds', 'checked'))
              }else{
                this.form.setFieldsValue(pick({settleDomainIds: [], checked: ['0']}, 'settleDomainIds', 'checked'))
              }
            })
          }else{
            this.form.setFieldsValue(pick({settleDomainIds: [], checked: ['0']}, 'settleDomainIds', 'checked'))
          }

          this.form.setFieldsValue(pick({unitId:unitId}, 'unitId'))
        })
      },
       // 结算主体选择
      changeSettle(value){
        if(value.length==0){
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({checked:[]},'checked'))
          })
        }else if(value.length < this.settleDomainBelongs.length){
          this.indeterminate = true
        }else{
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({checked:['1']},'checked'))
          })
        }
      },
      // 全选功能
      onCheckBoxChange(checked) {
        if (checked.length === 1) {  // 全选
          let settleDomainOptions = []
          for (const item of this.settleDomainBelongs) {
            settleDomainOptions.push(item.id)
          }
          this.$nextTick(() => {
             this.indeterminate = false
            this.form.setFieldsValue(pick({settleDomainIds: settleDomainOptions}, 'settleDomainIds'))
          })
        } else {  // 取消
          this.$nextTick(() => {
            this.indeterminate = false
            this.form.setFieldsValue(pick({settleDomainIds: []}, 'settleDomainIds'))
          })
        }
      },
    }
  }
</script>

<style lang="less" scoped>

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