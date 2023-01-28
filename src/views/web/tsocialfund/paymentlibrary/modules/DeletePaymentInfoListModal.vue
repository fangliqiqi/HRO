<template>
  <a-modal
    :title="title"
    :width="800"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="reset">清空</a-button>
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" @click="handleOk" :loading="confirmLoading">确定</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form" layout="inline" class="ant-advanced-search-form">
        <a-row>
          <a-col :span="24">
            <a-form-item label="类型">
              <a-radio-group
                buttonStyle="solid"
                v-decorator="['type', {initialValue:'0', rules:[{required: true, message: '请选择类型！'}]}]"
              >
                <a-radio-button value="0" style="margin-right: 10px;border-radius: 4px;">全部删除</a-radio-button>
                <a-radio-button value="1" style="margin-right: 10px;border-radius: 4px;">删除社保</a-radio-button>
                <a-radio-button value="2" style="border-radius: 4px;">删除公积金</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="社保户">
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择社保户查询"
                v-model="deleteParam.socialHouseId"
                :dropdownMatchSelectWidth="false"
                style="width:170px"
              >
                <a-select-option
                  v-for="(value, key) in householdOptions"
                  :key="key"
                  :value="value.id"
                >{{ value.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="公积金户">
              <a-select
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择公积金户查询"
                v-model="deleteParam.fundHouseId"
                :dropdownMatchSelectWidth="false"
                style="width:165px"
              >
                <a-select-option
                  v-for="(value, key) in householdOptions"
                  :key="key"
                  :value="value.id"
                >{{ value.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="身份证号">
              <a-input
                placeholder="请输入身份证号"
                v-model="deleteParam.empIdCard"
                style="width:165px"
                allowClear
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="结算主体">
              <select-page
                style="min-width:260px"
                :id="'id'"
                :title="'departName'"
                placeholder="请选择结算主体查询"
                v-model="deleteParam.settleDepartId"
                :searchUrl="'/hrBase/tsettledomain/noStatus/page?selectType=0&departName='"
              ></select-page>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单位名称">
              <select-page
                style="min-width:260px"
                :id="'id'"
                :title="'customerName'"
                placeholder="请选择单位名称查询"
                v-model="deleteParam.unitId"
                :searchUrl="'/hrBase/tcustomerinfo/page?selectType=0&customerName='"
              ></select-page>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import SelectPage from '@/components/jeecg/SelectPage'
import { getUnitSelectVos, getHouseHold } from '@/api/api'
export default {
  name: 'DeletePaymentInfoListModal',
  components: {
    SelectPage,
  },
  data() {
    return {
      model: {},
      title: '操作',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        delete: 'hrSocial/tpaymentinfo/removeBatchByIdsAndType',
      },
      /*过滤条件参数 全部都是可选 */
      deleteParam: {
        empIdCard: undefined, //身份证ID
        unitId: undefined, //单位ID
        settleDepartId: undefined, //结算主体ID
        fundHouseId: undefined, //公积金ID
        socialHouseId: undefined, //社保户ID
      },
      // 组件默认请求数据
      unitOptions: [],
      settleDomainOptions: [],
      householdOptions: [],
    }
  },
  methods: {
    /* 组件外部调用这个方法 */
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
    },
    //  拼接需要删除的条件ID参数
    concactURL(url) {
      for (const i in this.deleteParam) {
        if (this.deleteParam[i] !== undefined&&this.deleteParam[i] !== '') {
          url=`${url}&${i}=${this.deleteParam[i]}`
        }
      }
      return url
    },
    // 保存按钮
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = this.url.delete
          let method = 'post'
          let formData = Object.assign(this.model, values)
          httpurl = `${httpurl}?type=${formData.type}`
          httpurl = this.concactURL(httpurl)
          httpAction(httpurl, {}, method,300000)
            .then((res) => {
              if (res.code === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message || res.msg)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.confirmLoading = false
    },
    //清空过滤条件
    reset() {
      this.deleteParam = {}
    },
  },
  created() {
    // 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
    getUnitSelectVos().then((res) => {
      if (res.code === 200) {
        this.unitOptions = res.data
      } else {
        this.$message.error('单位信息数据请求失败！')
      }
    })
    // 结算主体和所属单位
    // getAllSettleDomainSelectVos().then((res) => {
    //   if (res.code === 200) {
    //     this.settleDomainOptions = res.data
    //   } else {
    //     this.$message.error('结算主体和所属单位数据请求失败！')
    //   }
    // })
    // 获取社保户、公积金户
    getHouseHold().then((res) => {
      if (res.code === 200) {
        this.householdOptions = res.data
      } else {
        this.$message.error('社保户数据请求失败！')
      }
    })
  },
}
</script>

<style lang="less" scoped>
.stepFormText {
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