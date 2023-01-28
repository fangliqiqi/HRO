<template>
  <a-modal
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="保存"
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
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="客户名称"
            >
              <a-input
                style="width: 180px"
                placeholder="请填写客户公司名称"
                v-decorator="['customerName', validatorRules.customerName ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="上级机构"
            >
              <select-page
                :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                :title="'customerName'"
                placeholder="请选择上级机构"
                :id="'id'"
                style="width: 180px"
                :triggerChange="true"
                @change="handleChange"
                :resList="resList"
                :disabled="isDisable"
                v-decorator="['parentId']"
              ></select-page>

              <!-- <a-tree-select
                showSearch
                style="width: 180px"
                :allowClear="true"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                placeholder="请选择上级机构"
                treeNodeFilterProp="title"
                :disabled="isDisable"
                treeDefaultExpandAll
                v-decorator="['parentId',{}]"
              >
              </a-tree-select> -->
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="行业类型"
            >
              <a-select
                showSearch
                placeholder="请选择行业类型"
                optionFilterProp="children"
                style="width: 180px"
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

          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="行业细分"
            >
              <a-select
                showSearch
                placeholder="请选择行业细分"
                optionFilterProp="children"
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
            <a-form-item
              class="stepFormText"
              label="客户地址"
            >
              <a-select
                showSearch
                placeholder="选择省份"
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
                v-decorator="['address', validatorRules.address ]"
                style="width: 220px;"
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
              <a-select
                showSearch
                placeholder="选择省份"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['belongProvince', validatorRules.belongProvince ]"
                @change="handleBelongProvinceChange"
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
                v-decorator="['belongCity', validatorRules.belongCity ]"
                @change="handleBelongCityChange"
              >
                <a-select-option
                  v-for="(item, index) in belongAreaCitys"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-select
                showSearch
                placeholder="选择区县"
                optionFilterProp="children"
                style="width: 100px"
                v-decorator="['belongTown',validatorRules.belongTown]"
              >
                <a-select-option
                  v-for="(item, index) in belongAreaTowns"
                  :key="index"
                  :value="item.id"
                >{{ item.areaName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              class="stepFormText"
              label="客户性质"
            >
              <a-select
                showSearch
                placeholder="请选择客户性质"
                optionFilterProp="children"
                style="width: 180px"
                v-decorator="['nature', validatorRules.nature ]"
              >
                <a-select-option
                  v-for="item in customerNatures"
                  :key="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户类型">
              <a-select
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
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import SelectPage from '@/components/jeecg/SelectPage'

  export default {
    name: 'CustomerUnitModal',
    components: {
      SelectPage
    },
    data() {
      return {
        title: '客户新增',
        visible: false,
        isDisable: false,
        treeData:[],
        industryBelongs:[],
        customerNatures:[],
        industrySub:[],
        model: {},
        areaTrees: [],
        areaCitys: [],
        areaTowns: [],
        belongAreaCitys: [],
        belongAreaTowns: [],
        resList:[],
        defaultArea:{},
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
        provinceChecked: false,
        cityChecked: false,

        validatorRules: {
          customerName: { rules: [{ required: true, message: '请输入客户名称!' },{max:50,message:'客户名称最多50个字符!'}] },
          nature: { rules: [{ required: true, message: '请选择客户性质!' }] },
          industryBelong: { rules: [{ required: true, message: '请选择行业类型!' }] },
          industrySub: { rules: [{ required: true, message: '请选择行业细分!' }] },
          province: { rules: [{ required: true, message: '省份不能为空!' }] },
          belongProvince: { rules: [{ required: true, message: '省份不能为空!' }] },
          belongCity: { rules: [{ required: true, message: '市不能为空!' }] },
          belongTown: { rules: [{ required: true, message: '县不能为空!' }] },
          city: { rules: [{ required: true, message: '城市不能为空!' }] },
          address: { rules: [{ required: true, message: '所在地不能为空!' },{max:100,message:'最多100个字符!'}] }
        },
        url: {
          add: '/hrBase/tcustomerinfo',
          edit: '/hrBase/tcustomerinfo',
          getIndustrySub:'/admin/dict/getByParentId?parentId=',
        }
      }
    },

    methods: {
      add() {
        this.resList = []
        this.edit({})
      },
      handleChange(val){
        this.$nextTick(()=>{
          this.form.setFieldsValue(pick({ parentId: val }, 'parentId'))
        })
      },
      // 行业细分
      changeIndustryBelong(){
        // value,option
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
        for(const c of this.areaTrees[value - 1].children) {
          this.areaCitys.push(c);
        }
        this.model.city = this.areaCitys[0].id;
        for(const t of this.areaCitys[0].children) {
          this.areaTowns.push(t);
        }
        this.model.town = this.areaTowns[0].id;
        this.form.setFieldsValue(pick(this.model,'province','city','town'))
      },
      handleCityChange(value) {
        this.areaTowns = [];
        for(const c of this.areaCitys) {
          if(String(c.id) === String(value)) {
            if(c.children.length > 0) {
              for(const t of c.children) {
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
      handleBelongProvinceChange(value){
        this.belongAreaCitys = []
        this.belongAreaTowns = [];
        this.form.setFieldsValue(pick({belongCity:undefined,belongTown:undefined},'belongCity','belongTown'))
        for(const c of this.areaTrees[value - 1].children) {
          this.belongAreaCitys.push(c);
        }
      },
      handleBelongCityChange(value){
        this.belongAreaTowns = [];
        this.form.setFieldsValue(pick({belongTown:undefined},'belongTown'))
        for(const c of this.belongAreaCitys) {
          if(String(c.id) === String(value)) {
            if(c.children.length > 0) {
              for(var t of c.children) {
                this.belongAreaTowns.push(t);
              }
            }
          }
        }
      },
      edit(record) {
        this.areaCitys = [];
        this.areaTowns = [];
        this.form.resetFields()
        this.model = Object.assign({}, record)
        if(this.model.id){
          this.isDisable = true
          for(const item of this.areaTrees) {
            if(String(item.id) === String(this.model.belongProvince)) {
              this.belongAreaCitys = item.children;
              for(const items of this.belongAreaCitys) {
                if(String(items.id) === String(this.model.belongCity)) {
                  this.belongAreaTowns = items.children;
                }
              }
            }
          }
          if(Number(this.model.parentId)){
            httpAction(`hrBase/tcustomerinfo/${this.model.parentId}`,null,'get').then(res=>{
              if(res.code === 200){
                this.resList = [{id:res.data.id,title:res.data.customerName}]
              }else{
                this.resList = []
              }
            })
          }else{
            this.model.parentId = ''
          }
        }else{
          //默认服务归属地
          for(const item of this.areaTrees) {
            if(String(item.id) === String(this.defaultArea.belongProvince)) {
              this.belongAreaCitys = item.children;
              for(const items of this.belongAreaCitys) {
                if(String(items.id) === String(this.defaultArea.belongCity)) {
                  this.belongAreaTowns = items.children;
                }
              }
            }
          }
        }
        // if(this.model.industryBelong){
        //   this.model.industryBelong = String(this.model.industryBelong)
        //   this.model.industrySub = String(this.model.industrySub)
        //   // 行业细分
        //   this.changeIndustryBelong(this.model.industryBelong)
        // }
        
        this.visible = true
        this.$nextTick(() => {
          if(this.model.id){
            this.form.setFieldsValue(pick(this.model, 'customerName', 'parentId','industryBelong','industrySub','province',
            'city','town','address','nature','belongProvince','belongCity','belongTown',"customerType","parentId"))
          }else{
            this.form.setFieldsValue(pick(this.defaultArea, 'belongProvince','belongCity','belongTown'))
          }
        })
        for(const p of this.areaTrees) {
          if(String(p.id) === String(this.model.province)) {
            this.areaCitys = p.children;
            for(const c of this.areaCitys) {
              if(String(c.id) === String(this.model.city)) {
                this.areaTowns = c.children;
              }
            }
          }
        }
      },
      //去掉当前的客户
      formatTree(tree,val){
        const arr = [];
        let obj = {};
        tree.forEach(router => {
          const tmp = { ...router }
          if (tmp.children) {
            String(tmp.value) === String(val) ? tmp.disabled = true : tmp.disabled = false
            tmp.children = this.formatTree(tmp.children,val)
            obj = {
              parentId: tmp.parentId,
              title: tmp.title,
              children: tmp.children,
              value: tmp.value,
              key: tmp.key,
              type: tmp.type,
              disabled: tmp.disabled,
            }
          }
          arr.push(obj)
        })
        return arr
      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            let formData = Object.assign(this.model, values)
            delete formData.contractVoList;
            delete formData.settleDomainList;
            if(typeof(formData.parentId) == "undefined") {
              formData.parentId = 0;
            }
            httpAction(httpurl, formData, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
              } else {
                that.$message.warning(res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close');
        this.visible = this.isDisable = false
        this.disableSubmit = false
        this.treeData = []
        this.resList = []
        this.model = {}
        this.industryBelongs = []
        this.defaultArea = {}
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
