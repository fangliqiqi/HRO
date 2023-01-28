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
      >保存</a-button>
    </template>
    <a-form
      :form="form"
      class="ant-disabled-form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-item
        label="城市"
        class="stepFormText"
        style="margin-bottom:0;"
      >
        <a-form-item class="formItemInline">
          <a-select
            showSearch
            placeholder="选择省份"
            optionFilterProp="children"
            style="width: 100px"
            v-decorator="['province', {rules: [{required: true, message: '请选择省份！'}]}]"
            :dropdownMatchSelectWidth="false"
            @change="handleSocialProvinceChange"
          >
            <a-select-option
              v-for="(item, index) in provinceList"
              :key="index"
              :value="String(item.id)"
            >{{ item.areaName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="formItemInline">
          <a-select
            showSearch
            placeholder="选择城市"
            optionFilterProp="children"
            style="width: 100px"
            v-decorator="['city', {}]"
            @change="handleSocialCityChange"
            :dropdownMatchSelectWidth="false"
          >
            <a-select-option
              v-for="(item, index) in cityList"
              :key="index"
              :value="String(item.id)"
            >{{ item.areaName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="formItemInline">
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
              v-for="(item, index) in areaList"
              :key="index"
              :value="String(item.id)"
            >{{ item.areaName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <a-form-item
        label="截止日期"
        class="stepFormText"
      >
        <a-select
          allowClear
          optionFilterProp="children"
          placeholder="请选择截止日期"
          v-decorator="['day',{rules: [{ required: true, message: '请选择截止日期！' }]}]"
          :dropdownMatchSelectWidth="false"
        >
          <a-select-option
            v-for="count in 31"
            :key="count"
            :value="count"
          >{{ `${count}号` }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="isEdit" :wrapper-col="{ span: 17, offset: 3 }">
        <div>
          <a-icon
            type="exclamation-circle"
            style="color:#E60808;margin-right:5px;"
          />
          <span>注：修改前的逻辑不变，仅适用于修改后的派单数据</span>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'
import { httpAction } from '@/api/manage'

export default {
  data() {
    return {
      description: '预派限制添加或编辑',
      title: '添加预派限制关系',
      form: this.$form.createForm(this),
      confirmLoading: false, // 点击保存或编辑按钮加载动画
      visible: false,
      isEdit: false, // 是否是编辑状态，默认是添加
      provinceList: [], // 所有地区
      cityList: [], // 社保城市
      areaList: [], // 社保区县
      url:{
        addOrEdit:'/hrSocial/tdispatchdayconf', // 新增、修改
      }
    }
  },
  methods: {
    // 显示
    show() {
      this.visible = true
    },
    // 编辑修改
    edit(record){
      this.isEdit = true
      this.eidtRecord = record
      // 地址
      for (const province of this.provinceList) {
        if (String(province.id) === String(record.province)) {
          this.cityList = province.children
          for (const city of this.cityList) {
            if (String(city.id) === String(record.city)) {
              this.areaList = city.children
              break
            }
          }
        break
        }
      }
      this.show()
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(record, 'province', 'city', 'town', 'day'))
      })
    },
    // 关闭。取消
    handleCancel() {
      this.form.resetFields()
      this.confirmLoading = false
      this.isEdit = false
      this.visible = false
    },
    // 社保缴纳地省份切换
    handleSocialProvinceChange(value) {
      this.cityList = []
      this.areaList = []
      for (const c of this.provinceList[value - 1].children) {
        this.cityList.push(c)
      }
      const modelData = {
        city:[],
        town:[]
      }
      this.form.setFieldsValue(pick(modelData, 'city', 'town'))
    },
    // 社保缴纳地城市切换
    handleSocialCityChange(value) {
      this.areaList = []
      for (const city of this.cityList) {
        if (String(city.id) === String(value)) {
          if (city.children.length > 0) {
            for (const town of city.children) {
              this.areaList.push(town)
            }
          }
          break
        }
      }
      const modelData = {}
      modelData.town = []
      this.form.setFieldsValue(pick(modelData, 'town'))
    },
    // 点击编辑、添加
    handleOk() {
       const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          const httpurl = that.url.addOrEdit
          const method = that.isEdit?'PUT':'POST'
          const formData = {
            province:values.province,
            day:values.day
          }
          if(values.city && !Array.isArray(values.city)){
            formData.city = values.city
          }
          if(values.town && !Array.isArray(values.town)){
            formData.town = values.town
          }
          if(that.isEdit){
            formData.id = that.eidtRecord.id || ''
          }
          that.confirmLoading = true
          httpAction(httpurl, formData, method).then((res) => {
            if (Number(res.code) === 200) {
              that.$message.success(`${that.title}成功！`)
              that.$emit('ok')
              that.handleCancel()
            } else {
              that.$message.warning(res.msg || '操作失败！')
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.stepFormText .formItemInline {
  display: inline-block;
  &:not(:last-child){
    margin-right: 10px;
  }
}
</style>
