<template>
  <a-modal
    :title="title"
    :width="600"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
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
              label="生成月份"
              class="stepFormText"
            >
              <a-month-picker
                :format="dateFormat"
                placeholder="请选择生成月份"
                v-decorator="['payMonth', validatorRules.payMonth]"
                style="width: 180px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="省市区"
              class="stepFormText"
            >
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="选择省份"
                v-decorator="['province', validatorRules.province]"
                style="width: 100px"
                @change="handleProvinceChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in AreaTrees"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="选择城市"
                v-decorator="['city', validatorRules.city]"
                style="width: 100px"
                @change="handleCityChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in AreaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="选择区县"
                v-decorator="['town']"
                style="width: 100px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in AreaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
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

  export default {
    name: 'PaymentLockModal',
    data() {
      return {
        type: '', // 类型（锁定还是解锁）
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        settleDomainDisabled: true,
        form: this.$form.createForm(this),
        dateFormat: "YYYYMM",
        settleDomainBelongs: [], // 结算主体
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          payMonth: {rules: [{ required: true, message: '请选择生成月份！' }]},
          province: {rules: [{ required: true, message: '请选择省！' }]},
          city: {rules: [{ required: true, message: '请选择市！' }]},
        },
        url: {
          batchLock: 'hrSocial/tpaymentinfo/batchLockByIds',
          batchUnLock: 'hrSocial/tpaymentinfo/batchUnlockByIds',
        },
        AreaTrees: [],
        AreaCitys: [],
        AreaTowns: [],
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
            if (String(this.type) === 'batchLock') { // 锁定
              httpurl += this.url.batchLock
            }
            if (String(this.type) === 'batchUnLock') { // 解锁
              httpurl += this.url.batchUnLock
            }

            const method = 'post'
            let formData = Object.assign(this.model, values)
            if (Array.isArray(formData.town)) {
              formData.town = null
            }

            formData.payMonth = formData.payMonth.format(this.dateFormat)  // 时间转换
            //formData.settleDomainId = formData.settleDomainId.join(",") // 转字符串
            httpurl += `?payMonth=${formData.payMonth}&province=${formData.province}&city=${formData.city}`
            if(formData.town){
              httpurl += `&town=${formData.town}`
            }
            httpAction(httpurl, '', method).then((res) => {
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
        this.settleDomainDisabled = true
        this.settleDomainBelongs = [] // 结算主体
      },
      // 社保缴纳地省份切换
      handleProvinceChange(value) {
        this.AreaCitys = []
        this.AreaTowns = []
        if (value) {
          for (var c of this.AreaTrees[value - 1].children) {
            this.AreaCitys.push(c)
          }
        }
        this.form.setFieldsValue(pick({city: [], town: []}, 'city', 'town'))
      },
      // 社保缴纳地城市切换
      handleCityChange(value) {
        this.AreaTowns = []
        if (value) {
          for (const c of this.AreaCitys) {
            if (String(c.id) === String(value)) {
              if (c.children.length > 0) {
                for (const t of c.children) {
                  this.AreaTowns.push(t)
                }
              }
            break
            }
          }
        }
        this.form.setFieldsValue(pick({town: []}, 'town'))
      },
    },
    
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 80px;
  }
  :global(.ant-form-item-control-wrapper) {
    overflow: hidden;
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
