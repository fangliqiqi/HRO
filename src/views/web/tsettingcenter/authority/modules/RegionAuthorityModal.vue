<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="保存"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirm-loading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="10">
            <a-form-item
              label="用户"
              class="stepFormLabel"
            >
              <select-page
                :searchUrl="'admin/user/page/wxhr?nickname='"
                :title="'nickname'"
                :placeholder="'请输入用户姓名'"
                :triggerChange="true"
                :id="'userId'"
                :resList="resList"
                v-decorator="['userId',validatorRules.userId]"
                @select="selectOption"
                style="width:200px;"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="14">
            <a-form-item
              class="stepFormLabel"
              label="区域"
            >
              <a-select
                showSearch
                placeholder="选择省份"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['province', validatorRules.province ]"
                @change="handleProvinceChange"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTrees"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                placeholder="选择城市"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['city', validatorRules.city ]"
                @change="handleCityChange"
                :dropdownMatchSelectWidth="false"
                :allowClear="true"
              >
                <a-select-option
                  v-for="(item, index) in areaCitys"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                placeholder="选择区县"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['town']"
                :allowClear="true"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option
                  v-for="(item, index) in areaTowns"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>

          </a-col>
          <a-col :span="8">
            <a-form-item
              label="是否作用社保"
              class="stepFormText"
            >
              <a-radio-group v-decorator="['socialFlag',validatorRules.socialFlag]">
                <a-radio-button value="0">是</a-radio-button>
                <a-radio-button value="1">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="是否作用公积金"
              class="stepFormText"
            >
              <a-radio-group v-decorator="['fundFlag',validatorRules.fundFlag]">
                <a-radio-button value="0">是</a-radio-button>
                <a-radio-button value="1">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="是否作用档案"
              class="stepFormText"
            >
              <a-radio-group v-decorator="['fileFlag',validatorRules.fileFlag]">
                <a-radio-button value="0">是</a-radio-button>
                <a-radio-button value="1">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </a-spin>

  </a-modal>
</template>

<script>
import SelectPage from '@/components/jeecg/SelectPage'
import pick from 'lodash.pick'
import Vue from 'vue'

import { httpAction } from '@/api/manage'

export default {
  name: 'RegionAuthorityModal',
  components:{
    SelectPage
  },
  data() {
    return {
      title: '地区授权',
      visible: false,
      confirmLoading: false,
      areaTrees:[],
      areaCitys:[],
      areaTowns:[],
      resList:[],
      id:'',
      form: this.$form.createForm(this),
      method:'POST',
      validatorRules: {
        userId: { rules: [{ required: true, message: '请选择用户!' }] },
        province: { rules: [{ required: true, message: '请选择区域!' }]},
        socialFlag: { rules: [{ required: true, message: '请选择是否作用社保!' }],initialValue:'0'},
        fundFlag: { rules: [{ required: true, message: '请选择是否作用公积金!' }],initialValue:'0'},
        fileFlag: { rules: [{ required: true, message: '请选择是否作用档案!' }],initialValue:'0'},
      },
      url: {
        submit:'/hrBase/muserarea',
      }
    }
  },
  created() {
    this.areaTrees = Vue.ls.get('glob_area')
  },
  methods: {
    edit(record) {
      this.visible = true
      if(record){
        this.id = record.id
        this.resList.push({
          id:record.userId,
          title:record.nickname,
        })
        if(record.city){
          this.areaCitys = []
          for(let c of this.areaTrees[record.province - 1].children) {
            this.areaCitys.push(c)
          }
        }
        if(record.town){
          this.areaTowns = [];
          for(var c of this.areaCitys) {
            if(c.id == record.city) {
              if(c.children.length > 0) {
                for(var t of c.children) {
                  this.areaTowns.push(t);
                }
              }
            }
          }
        }
        setTimeout(()=>{
          this.$nextTick(() => {
            this.form.setFieldsValue(
              pick(record,'userId','province','city','town','socialFlag','fundFlag','fileFlag')
            )
          })
        },500)
      }
    },
    selectOption(val){
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({userId:val}, 'userId'))
      })
    },
    handleProvinceChange(value){
      this.areaCitys= [];
      this.areaTowns = [];
      for(var c of this.areaTrees[value - 1].children) {
        this.areaCitys.push(c);
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({city:undefined,town:undefined}, 'city','town'))
      })
    },
    handleCityChange(value){
      this.areaTowns = [];
      for(var c of this.areaCitys) {
        if(c.id == value) {
          if(c.children.length > 0) {
            for(var t of c.children) {
              this.areaTowns.push(t);
            }
          }
        }
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({town:undefined},'town'))
      })
    },
    handleOk(){
      this.form.validateFields((err,values) => {
        if (!err) {
          if(this.id) values.id = this.id
          this.confirmLoading = true
          httpAction(this.url.submit, values, this.method).then((res) => {
            if(res.code == 200){
              this.$message.success("操作成功！")
              this.handleCancel()
              this.$emit('ok')
            }else{
              this.$message.warning(res.msg)
            }
          }).finally(()=>{
            this.confirmLoading = false
          })
        }
      });
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.resList = []
      this.method = 'POST'
      this.id = ''
      this.visible = false
      this.form.resetFields()
    },
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
    width: 120px;
  }
}
.stepFormLabel {
  :global(.ant-form-item-label) {
    width: 80px;
  }
}
</style>