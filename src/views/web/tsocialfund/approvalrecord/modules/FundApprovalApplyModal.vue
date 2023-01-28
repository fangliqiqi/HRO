<template>
  <a-modal
    :title="title"
    :width="550"
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
              label="公积金户"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请选择公积金户"
                v-decorator="['organId', validatorRules.organId]"
                style="width: 332px"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(value, key) in organizationBelongs"
                  :key="key"
                  :value="value.id"
                >{{ value.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="所属地市"
              class="stepFormText"
            >
              <a-select
                showSearch
                placeholder="选择省份"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['province', { rules: [{ required: true, message: '选择省份！' }] }]"
                @change="handleProvinceChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTrees"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                placeholder="选择城市"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['city', { rules: [{ required: true, message: '选择城市！' }] }]"
                @change="handleCityChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                allowClear
                showSearch
                placeholder="选择区县"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['town', {}]"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="包含区县"
              class="stepFormText"
            >
              <a-radio-group v-decorator="['haveContain', {initialValue:1}]">
                <a-radio :value="0">包含</a-radio>
                <a-radio :value="1">不包含</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="省公积金结算"
              class="stepFormText"
            >
              <a-radio-group v-decorator="['settleProvince', {initialValue:1}]">
                <a-radio :value="0">结算</a-radio>
                <a-radio :value="1">不结算</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="生成月份"
              class="stepFormText"
            >
              <a-month-picker
                :format="dateFormat"
                placeholder="请选择生成月份"
                v-decorator="['createMonth', validatorRules.createMonth]"
                style="width: 332px"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注说明"
              class="stepFormText"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写备注说明"
                v-decorator="['remark', {}]"
                style="width: 332px"
              />
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
    name: 'FundApprovalApplyModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        areaTrees: [],
        areaCitys: [],
        areaTowns: [],
        dateFormat: 'YYYYMM',  // 时间格式化类型
        organizationBelongs: [],  // 社保户（单位）
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          organId: { rules: [{ required: true, message: '请选择公积金户！' }] },
          createMonth: { rules: [{ required: true, message: '请选择生成月份！' }] },
        },
        url: {
          add: 'hrSocial/tprovidentaprovalform/saveFundAproval',
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
            let httpurl = this.url.add
            const method = 'post'
            let formData = Object.assign(this.model, values)
            formData.createMonth = formData.createMonth ? formData.createMonth.format(this.dateFormat) : null
            formData.province = (formData.province && Array.isArray(formData.province)) ? null : formData.province
            formData.city = (formData.city && Array.isArray(formData.city)) ? null : formData.city
            formData.town = (formData.town && Array.isArray(formData.town)) ? null : formData.town
            httpurl += `?organId=${formData.organId}&createMonth=${formData.createMonth}&haveContain=${formData.haveContain}&settleProvince=${formData.settleProvince}`
            if (formData.remark != null) {
              httpurl += `&remark=${formData.remark}`
            }
            if (formData.province != null) {
              httpurl += `&province=${formData.province}`
            }
            if (formData.city != null) {
              httpurl += `&city=${formData.city}`
            }
            if (formData.town != null) {
              httpurl += `&town=${formData.town}`
            }
            httpAction(httpurl, '', method, 600000).then((res) => { // 10分钟
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message || res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      // 省份切换
      handleProvinceChange(value) {
        this.areaCitys = []
        this.areaTowns = []
        for (const c of this.areaTrees[value - 1].children) {
          this.areaCitys.push(c)
        }
        this.model.city = []
        this.model.town = []
        this.form.setFieldsValue(pick(this.model, 'city', 'town'))
      },
      // 城市切换
      handleCityChange(value) {
        this.areaTowns = []
        for (const c of this.areaCitys) {
          if (String(c.id) === String(value)) {
            if (c.children.length > 0) {
              for (const t of c.children) {
                this.areaTowns.push(t)
              }
            }
          break
          }
        }
        this.model.town = []
        this.form.setFieldsValue(pick(this.model, 'town'))
      },
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 关闭功能与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.confirmLoading = false
        this.areaTrees = []
        this.organizationBelongs = []
      }
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
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
