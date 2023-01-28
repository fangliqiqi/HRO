<template>
  <a-modal
    title="审核详情"
    :width="800"
    placement="right"
    :closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="审核"
    :visible="visible"
  >

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row :gutter="24">
          <a-col :span="10">
            <a-form-item label="客户名称">
              <a-input
                placeholder="请填写客户公司名称"
                :disabled="disabled"
                v-decorator="['customerName', validatorRules.customerName ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="上级机构">
              <a-input
                :disabled="disabled"
                v-decorator="['parentCustomerName']"
              />
              <!--<a-input placeholder="请选择上级机构" v-decorator="['parentId', {}]"/>-->
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="10">
            <a-form-item label="行业类型">
              <a-select
                showSearch
                placeholder="请选择行业类型"
                optionFilterProp="children"
                style="width: 180px"
                :disabled="disabled"
                @change="changeIndustryBelong"
                v-decorator="['industryBelong', validatorRules.industryBelong ]"
              >
                <a-select-option
                  v-for="(item, index) in industryBelongs"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="10">
            <a-form-item label="行业细分">
              <a-select
                showSearch
                placeholder="请选择行业细分"
                optionFilterProp="children"
                :disabled="disabled"
                style="width: 190px"
                v-decorator="['industrySub', validatorRules.industrySub ]"
              >
                <a-select-option
                  v-for="(item, index) in industrySub"
                  :key="index"
                  :value="String(item.id)"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col>
            <a-form-item label="客户地址">
              <a-select
                showSearch
                placeholder="选择省份"
                :disabled="disabled"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['province', validatorRules.province ]"
                @change="handleProvinceChange"
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
                :disabled="disabled"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['city', validatorRules.city ]"
                @change="handleCityChange"
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
                showSearch
                placeholder="选择区县"
                :disabled="disabled"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['town', {}]"
              >
                <a-select-option
                  v-for="(item, index) in areaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
              <a-input
                placeholder="客户详细地址"
                :disabled="disabled"
                v-decorator="['address', validatorRules.address ]"
                style="width: 155px;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              class="stepFormText"
              label="服务归属地"
            >
              {{ model.belongArea || '暂无' }}
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="10">
            <a-form-item label="客户性质">
              <a-select
                showSearch
                placeholder="请选择客户性质"
                optionFilterProp="children"
                :disabled="disabled"
                style="width: 180px"
                v-decorator="['nature', validatorRules.nature ]"
              >
                <a-select-option
                  v-for="(item, index) in natureBelongs"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户类型">
              <a-select
                :disabled="true"
                showSearch
                placeholder="客户类型"
                optionFilterProp="children"
                style="width: 180px"
                v-decorator="['customerType',{rules:[{required:true, message: '请选择客户类型' }]}]"
              >
                <a-select-option value="0">集团客户</a-select-option>
                <a-select-option value="1">重点客户</a-select-option>
                <a-select-option value="2">一般客户</a-select-option>
                <a-select-option value="3">电信客户</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>

    <audit-modal
      ref="auditModal"
      @ok="auditModalOk"
    ></audit-modal>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import AuditModal from './AuditModal'
  import { getAreaName } from '@/utils/common'

  export default {
    name: 'CustomerUnitModal',
    components: { AuditModal },
    data() {
      return {
        visible: false,
        natureBelongs:[],
        industryBelongs:[],
        industrySub:[],
        disabled: true,
        model: {},
        id: "",
        areaTrees: [],
        areaCitys: [],
        areaTowns: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },

        validatorRules: {
          customerName: { rules: [{ required: true, message: '请输入客户名称!' }] },
          nature: { rules: [{ required: true, message: '请选择客户性质!' }] },
          industryBelong: { rules: [{ required: true, message: '请选择行业类型!' }] },
          industrySub: { rules: [{ required: true, message: '请选择行业细分!' }] },
          province: { rules: [{ required: true, message: '请完善客户所在地/省份!' }] },
          city: { rules: [{ required: true, message: '请完善客户所在地/城市!' }] },
          address: { rules: [{ required: true, message: '请完善客户所在地/地址!' }] }
        },
        url: {
          add: '/hrBase/tcustomerinfo',
          edit: '/hrBase/tcustomerinfo',
          getIndustrySub:'/admin/dict/getByParentId?parentId='
        }
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      // 行业细分
      changeIndustryBelong(){
        // httpAction(this.url.getIndustrySub+value,null,'get').then((res)=>{
        //   if(res.code == 200){
        //     this.industrySub = res.data
        //   }else{
        //     this.industrySub = []
        //     this.$message.warning(res.msg)
        //   }
        // }).finally(()=>{
        //   if(option){
        //     this.$nextTick(() => {
        //       this.form.setFieldsValue(pick({industrySub:''}, 'industrySub'))
        //     })
        //   }
        // })
      },
      handleProvinceChange(value) {
        this.areaCitys= [];
        this.areaTowns = [];
        for(var c of this.areaTrees[value - 1].children) {
          this.areaCitys.push(c);
        }
        this.model.city = this.areaCitys[0].id;

        for(var t of this.areaCitys[0].children) {
          this.areaTowns.push(t);
        }
        this.model.town = this.areaTowns[0].id;
        this.form.setFieldsValue(pick(this.model,'province','city','town'))
      },
      handleCityChange(value) {
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

        if(this.areaTowns.length > 0) {
          this.model.town = this.areaTowns[0].id;
          this.form.setFieldsValue(pick(this.model,'city','town'))
        } else {
          this.model.town = -1;
          this.form.setFieldsValue(pick(this.model,'city','town'))
        }
      },
      edit(record) {
        this.areaCitys = [];
        this.areaTowns = [];
        this.visible = true
        this.form.resetFields()
        this.id = record.id;
        this.model = Object.assign({}, record)
        if(this.model.industryBelong){
          this.model.industryBelong = String(this.model.industryBelong)
          this.model.industrySub = this.model.industrySub || ''
          // 行业细分
          // this.changeIndustryBelong(this.model.industryBelong)
        }
        
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'id','customerName', 'parentCustomerName','industryBelong','industrySub','province',
                                        'city','town','address','nature','customerType'))
        })
        this.model.belongArea = getAreaName(this.model.belongProvince,this.model.belongCity,this.model.belongTown,' ')

        for(var p of this.areaTrees) {
          if(p.id == this.model.province) {
            this.areaCitys = p.children;
            for(var c of this.areaCitys) {
              if(c.id == this.model.city) {
                this.areaTowns = c.children;
              }
            }
          }
        }
      },
      handleOk() {
        this.$refs.auditModal.showModal(this.id);
      },
      auditModalOk() {
        this.$emit('ok')
        this.close()
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.industryBelongs = null;
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
</style>