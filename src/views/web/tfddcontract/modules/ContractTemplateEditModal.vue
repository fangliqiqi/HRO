<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="保存"
      :maskClosable="false"
      :destroyOnClose="true"
      :width="800"
    > 
      <a-spin :spinning="confirmLoading">
        <a-form
          :form="form"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="地区" class="stepFormText">
                <a-select
                  showSearch
                  placeholder="选择省份"
                  optionFilterProp="children"
                  style="width: 200px"
                  v-decorator="['province', validatorRules.province ]"
                  @change="handleBelongProvinceChange"
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                >
                  <a-select-option
                    v-for="item in areaTrees"
                    :key="'provice'+item.id"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-select
                  showSearch
                  placeholder="选择城市"
                  optionFilterProp="children"
                  style="width: 200px"
                  v-decorator="['city', validatorRules.city ]"
                  :getPopupContainer="triggerNode => triggerNode.parentNode"
                >
                  <a-select-option
                    v-for="item in belongAreaCitys"
                    :key="'city'+item.id"
                    :value="item.id"
                  >{{ item.areaName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="stepFormText">
              <a-form-item label="员工类型">
                <a-select v-decorator="['type', validatorRules.type]" style="width:200px" placeholder="选择员工类型">
                  <a-select-option v-for="item in empTypeOptions" :value="item.value" :key="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="stepFormText">
              <a-form-item label="是否有加班工资">
                <a-radio-group v-decorator="['overtimeWageFlag', validatorRules.overtimeWageFlag]">
                  <a-radio :value="1">有</a-radio>
                  <a-radio :value="0">无</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'

  export default {
    name:'ContractTemplateEditModal',
    data() {
      return {
        title: '合同模板编辑',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          province: { rules: [{ required: true, message: '请选择省!' }] },
          city: { rules: [{ required: true, message: '请选择市!' }] },
          type: { rules: [{ required: true, message: '请选择类型!' }] },
          overtimeWageFlag: { rules: [{ required: true, message: '请选择是否有加班工资!' }] },
        },
        model:{},
        areaTrees: [],
        areaCitys: [],
        belongAreaCitys: [],
        empTypeOptions: [],
        saveMethod:'post'
      }
    },
    created(){
      this.areaTrees = this.$ls.get('glob_area')
    },
    methods: {
      add(){
        this.visible = true
      },
      show(record) {
        this.model = record
        for(const c of this.areaTrees[this.model.province - 1].children) {
          this.belongAreaCitys.push(c)
        }
        this.visible = true
        this.$nextTick(() => {
          this.model.overtimeWageFlag = Number(this.model.overtimeWageFlag)
          this.form.setFieldsValue(pick(this.model, 'province', 'city','type','overtimeWageFlag'))
        })
      },
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            values.id = this.model.id
            httpAction('/hrBase/fddcontracttemplate', values, this.saveMethod).then((res) => {
              if(res.code == 200){
                this.$message.success('保存成功!')
                this.close()
                this.$emit('ok')
              } else {
                this.$message.warning(res.msg)
              }
            }).finally(() => {
              this.confirmLoading = false
            })
          }
        })
      },
      
      handleBelongProvinceChange(value){
        this.belongAreaCitys = []
        for(const c of this.areaTrees[value - 1].children) {
          this.belongAreaCitys.push(c);
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({city:undefined},'city'))
        })
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.visible = false
        this.belongAreaCitys = []
      }
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
  }
}
</style>

