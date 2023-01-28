<template>
  <a-modal
    :title="title"
    :width="500"
    placement="right"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="预览"
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
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="开始月份"
              class="stepFormText"
            >
              <a-month-picker
                :disabledDate="disabledStartDate"
                style="width:250px"
                format="YYYYMM"
                v-decorator="['startMonth', validatorRules.startMonth]"
                placeholder="请选择开始月份"
                @openChange="handleStartOpenChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="结束月份"
              class="stepFormText"
            >
              <a-month-picker
                :disabledDate="disabledEndDate"
                format="YYYYMM"
                style="width:250px"
                placeholder="请选择结束月份"
                v-decorator="['endMonth', validatorRules.endMonth]"
                :open="endOpen"
                @openChange="handleEndOpenChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="计算类型"
              class="stepFormText"
            >
              <a-select
                style="width:250px"
                v-decorator="['sumType',{initialValue:'0'}]"
              >
                <a-select-option value="0">实发平均</a-select-option>
                <a-select-option value="1">应发平均</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="单位全称"
              class="stepFormText"
            >
              <a-select
                style="width:250px"
                showSearch
                optionFilterProp="children"
                mode="combobox"
                @select="changeSelect"
                v-decorator="['unitName',validatorRules.unitName]"
              >
                <a-select-option
                  v-for="(item,index) in companyList"
                  :key="index"
                  :value="item.unitName"
                >
                  {{ item.unitName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="单位地址"
              class="stepFormText"
            >
              <a-input
                style="width:250px"
                placeholder="请输入单位地址"
                v-decorator="['unitAddr',validatorRules.unitAddr]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="固定电话"
              class="stepFormText"
            >
              <a-input
                style="width:250px"
                placeholder="请输入固定电话"
                v-decorator="['phone',validatorRules.phone]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="证明用途"
              class="stepFormText"
            >
              <a-textarea
                rows="3"
                style="width:250px;resize:none;"
                placeholder="请输入证明用途"
                v-decorator="['purpose',validatorRules.purpose]"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>

    <!--预览弹出框-->
    <a-modal
      :title="titlePreview"
      :width="'80%'"
      :centered="true"
      @cancel="closePreview"
      :visible="isOpen"
      :maskClosable="false"
    >
      <div
        id="printContent"
      >
        <div
          id="content"
          ref="print"
        >
          <a-row>
            <a-col
              :span="3"
              :offset="1"
            ><img src="/proveSalaryLogo.jpg" alt="logo"></a-col>
            <a-col
              style="color:#000"
              :span="5"
              :offset="15"
            >编号：{{ subData.no || '' }}</a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <h2 class="center">工作收入证明</h2>
            </a-col>
            <a-col
              :span="22"
              :offset="1"
            >
              <div class="proveInfo">
                <div
                  class="syContent"
                  v-if="type == 1"
                >
                  兹有<span>{{ subData.employeeName }}</span>，身份证号码<span>{{ subData.employeeIdCard }}</span>，入职时间为:<span>{{ subData.entryDate || '&nbsp;' }}</span>
                  ，试用期工资为¥<span>{{ subData.proveSalary }}</span>元，
                  (大写)<span>{{ subData.capital }}</span>，特此证明。
                </div>
                <div
                  class="zsContent"
                  v-if="type == 0"
                >
                  <form
                    :form="detailForm"
                    layout="inline"
                  >
                    兹有<span>{{ subData.employeeName }}</span>，身份证号码<span>{{ subData.employeeIdCard }}</span>，系我单位聘用员工，现任职部门及工作岗位：<span>{{ subData.employeeSettleDepartName }}</span>
                    <span v-if="subData.post">{{ subData.post }}</span>
                    <span v-else>
                      <a-form-item
                        label=""
                        class="lineLabel"
                      >
                        <a-input
                          class="inputStyle"
                          id="post"
                          type="text"
                          v-decorator="['post',myValidatorRules.post]"
                        />
                      </a-form-item>
                    </span>，
                    <template v-if="subData.contractType == 2">劳动合同为无固定期限合同</template>
                    <template v-else>
                      劳动合同期至
                      <span v-if="subData.contractEndDate">{{ moment(subData.contractEndDate).format("YYYY") }}</span>
                      <span v-else>
                        <a-form-item
                          label=""
                          class="lineLabel"
                        >
                          <a-input
                            style="border:none;color: #000;position: relative;top:2px;height: 24px;width:80px;font-size:16px;"
                            id="year"
                            v-decorator="['year',myValidatorRules.year]"
                          />
                        </a-form-item>

                      </span>年
                      <span v-if="subData.contractEndDate">{{ moment(subData.contractEndDate).format("MM") }}</span>
                      <span v-else>
                        <a-input
                          style="border:none;color: #000;position: relative;top:2px;height: 24px;width:50px;font-size:16px;"
                          id="month"
                          v-decorator="['month',myValidatorRules.month]"
                        />
                      </span>月，
                    </template>

                    其近<span>{{ subData.mouthCount }}</span>个月月均¥<span>{{ subData.proveSalary }}</span>元，（大写）<span>{{ subData.capital }}</span>
                    ，特此证明。
                  </form>
                </div>
                <ul>
                  <li>本单位申明</li>
                  <li>1、本证明仅用于当事人的工作收入证明，不作为我单位对当事人任何形式的经济担保；</li>
                  <li>2、本工作收入证明复印无效。</li>
                </ul>
              </div>
            </a-col>
            <a-col
              :span="9"
              :offset="15"
              class="chapter"
            >
              <p>{{ subData.unitName }}（章）：</p>
              <p><span>{{ moment(subData.creatDate).format("YYYY") }}</span>年<span>{{ moment(subData.creatDate).format("MM") }}</span>月<span>
                {{ moment(subData.creatDate).format("DD") }}</span>日&nbsp;&nbsp;&nbsp;&nbsp;</p>
            </a-col>
            <a-col
              :span="22"
              :offset="1"
            >
              <ul class="remark">
                <li>备注</li>
                <li>1、单位全称：<span>{{ subData.unitName }}</span></li>
                <li>2、地址：<span>{{ subData.unitAddr }}</span></li>
                <li>3、联系电话（固定电话）：<span>{{ subData.phone }}</span></li>
              </ul>
            </a-col>
          </a-row>
        </div>
      </div>

      <template slot="footer">
        <div style="height:33px">
          <a-button
            type="primary"
            icon="printer"
            @click="printer(1)"
          >打印</a-button>
          <a-button
            type="primary"
            icon="download"
            @click="printer(2)"
          >导出</a-button>
          <a-button @click.stop="()=>{isOpen=false}">返回</a-button>
        </div>
      </template>
    </a-modal>

  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'

export default {
  name: 'ProveIncomeModal',
  data() {
    return {
      title: '试用期员工收入证明',
      visible: false,
      endOpen: false,
      isOpen: false, //工资证明预览框
      iframeSrc:'', //预览地址
      iframeSrcTemp:'',
      titlePreview:'',
      optionId:'', //单位记录id
      subData:{}, //提交的数据
      companyList:[{
        unitName:"安徽皖信人力资源管理有限公司",
        unitAddr:"置地广场c座8楼811",
        phone:"0551-63432400"
      }], //公司相关信息
      model: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      detailForm: this.$form.createForm(this),
      type:0, //1试用期0正式员工
      validatorRules: {
        startMonth: { rules: [{ required: true, message: '请选择开始月份!' }] },
        endMonth: { rules: [{ required: true, message: '请选择结束月份!' }] },
        unitName: { rules: [{ required: true, message: '请选择单位全称!' }] },
        unitAddr: { rules: [{ required: true, message: '请输入单位地址!' }] },
        phone: { rules: [{ required: true, message: '请输入固定电话!' }] },
        purpose: { rules: [{ required: true, message: '请输入证明用途!' }] },
      },
      myValidatorRules:{
        post:{ rules: [{ required: true, message: '请填写岗位!' }] },
        year:{ rules: [{ required: true, message: '请填写年份!' },{pattern:/^[12][0-9]{3}$/,message:'请填写正确的年份!'}] },
        month:{ rules: [{ required: true, message: '请填写月份!' },{pattern:/^0?[0-9]$|^1[0-2]$/,message:'请填写正确的月份!'}] },
      },
      url: {
        getUnit:'/hrBase/lunitinfoforprove/ownList',
        preview: '/hrBase/salaryProve/prove', //试用期员工收入证明预览
      },
    }
  },
  created() {
    httpAction(this.url.getUnit, null, 'get').then((res) => {
      if(res.code == 200 && res.data.length){
        this.companyList = res.data
      }
    })
  },
  mounted(){
    const _this = this
    window.closeIframe = function(){
      _this.iframeSrc = _this.optionId = ''
      _this.subData = {}
      _this.isOpen = false
      _this.visible = false
    }
  },
  methods: {
    moment,
    show(record) {
      this.model = record
      this.form.resetFields()
      this.visible = true
      this.titlePreview = (this.type == 0) ? '正式员工收入证明预览' : '试用期员工收入证明预览'
    },
    //点击option触发
    changeSelect(val,option){
      let obj = {
        unitAddr:this.companyList[option.data.key].unitAddr,
        phone:this.companyList[option.data.key].phone,
      }
      this.optionId = (this.companyList[option.data.key]) ? this.companyList[option.data.key].id : ''
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(obj, 'unitAddr','phone'))
      })
    },
    disabledStartDate (startMonth) {
      const endMonth = this.form.getFieldValue('endMonth');
      if (!endMonth || !startMonth) {
        return false;
      }
      return startMonth.valueOf() > endMonth.valueOf();
    },
    disabledEndDate (endMonth) {
      const startMonth =  this.form.getFieldValue('startMonth');
      if (!endMonth || !startMonth) {
        return false;
      }
      return startMonth.valueOf() >= endMonth.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    validatePost(){
      if(document.getElementById('post')){
        const post = document.getElementById('post').value
        if(!post){
          this.$message.warning('岗位不能为空')
          return false
        }else{
          this.subData.post = post
        }
      }
      return true
    },
    validateDate(){
      if(document.getElementById('year') && document.getElementById('month')){
        const year = document.getElementById('year').value
        let month = document.getElementById('month').value
        if(year && month){
          month = ((!/^0/.test(month)) && month < 10) ? (`0${month}`) : month
          if(!/^[12][0-9]{3}$/.test(year) || !/^0?[0-9]$|^1[0-2]$/.test(month)){
            this.$message.warning('合同截止年月格式不正确')
            return false
          }else{
            this.subData.contractEndDate = `${year}-${month}-01`
            return true
          }
        }else{
          this.$message.warning('合同截止年月不能为空')
          return false
        }
      }
      return true
    },
    getData(){
      this.subData.year = (this.subData.creatDate) ? moment(this.subData.creatDate).format('YYYY') : ''
      this.subData.month = (this.subData.creatDate) ? moment(this.subData.creatDate).format('MM') : ''
      this.subData.day = (this.subData.creatDate) ? moment(this.subData.creatDate).format('DD') : ''
      this.subData.contractYear = (this.subData.contractEndDate) ? moment(this.subData.contractEndDate).format('YYYY') : ''
      this.subData.contractMonth = (this.subData.contractEndDate) ? moment(this.subData.contractEndDate).format('MM') : ''
    },
    printer(type){
      // this.$print(this.$refs.print)
      if(String(this.type) === '0'){
        if(!this.validatePost() || !this.validateDate()){
          return
        }
      }
      if(!this.subData.contractEndDate){
        delete this.subData.contractEndDate
      }
      // type 1打印2导出
      const url = 'hrBase/salaryProve/proveRecord'
      httpAction(url,this.subData,'post').then((res)=>{
        if(res.code === 200){
          // this.iframeSrc = this.iframeSrcTemp + '&obj='+JSON.stringify(this.subData) + '&no='+res.data+'&isShowNo=1&otype='+type

          this.subData.no = res.data
          this.getData()
          if(String(type) === '2'){
            this.exportWord()
          }else{
            const _this = this
            setTimeout(function(){
              _this.$print(_this.$refs.print)
            },1000)
          }
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    closePreview(){
      this.isOpen = false
    },
    handleOk() { //预览
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          values.employeeInfo = _this.model.id
          values.employeeIdCard = _this.model.empIdcard
          values.proveType = _this.type //0正式员工证明1试用期员工证明
          values.startMonth = moment(values.startMonth).format("YYYYMM")
          values.endMonth = moment(values.endMonth).format("YYYYMM")
          values.settleDomain = _this.model.settleDomain
          values.id = _this.optionId
          httpAction(_this.url.preview, values, 'post').then((res) => {
            if (res.code === 200) {
              _this.subData = res.data
              // _this.iframeSrc = _this.iframeSrcTemp + '&obj='+JSON.stringify(res.data)
              _this.isOpen = true
            } else {
              _this.$message.warning(res.msg)
            }
          }).finally(() => {
            _this.confirmLoading = false
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.iframeSrc = this.optionId = ''
      this.subData = {}
      this.$emit('close');
      this.visible = false;
    },
    // 点击导出word
    exportWord: function() {
      const _this = this
      let template = (this.type == 0) ? '/templates/proveSalaryZs.docx' : '/templates/proveSalarySy.docx'
      
      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent(template, function(error, content) {
        // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
          throw error;
        }

        // 创建一个PizZip实例，内容为模板的内容
        let zip = new PizZip(content);
        // 创建并加载docxtemplater实例对象
        let doc = new docxtemplater().loadZip(zip);
        console.log(_this.subData)
        // 设置模板变量的值
        doc.setData(_this.subData);

        try {
          // 用模板变量的值替换所有模板变量
          doc.render();
        } catch (error) {
          // 抛出异常
          // let e = {
          //   message: error.message,
          //   name: error.name,
          //   stack: error.stack,
          //   properties: error.properties
          // };
          throw error;
        }

        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        let out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, _this.subData.employeeName+"的工作收入证明.docx");
      });
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

.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}

.lineLabel {
  :global(.ant-form-item-control) {
    line-height: 30px;
  }
}

.ant-upload-drag-icon {
  width: 250px;
  text-align: center;
}
.center {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.proveInfo {
  font-size: 16px;
  padding: 20px 0px;
  color: #000;
}
.proveInfo span {
  display: inline-block;
  padding: 0px 15px;
  border-bottom: 1px solid;
  height: 30px;
}
.proveInfo ul {
  font-size: 14px;
  list-style: none;
  font-weight: bold;
  margin-top: 40px;
  padding: 0px;
  line-height: 26px;
}
.zsContent {
  line-height: 30px;
}
.remark {
  color: #000;
  list-style: none;
  font-size: 14px;
  padding: 0px;
  line-height: 26px;
}
.chapter {
  color: #000;
  text-align: right;
  :global(.ant-input-number) {
    text-align: center;
    border: none;
    color: #000;
    position: relative;
    top: 0px;
    height: 20px;
  }
}
.remark span,
.chapter span {
  display: inline-block;
  padding: 0px 10px;
  border-bottom: 1px solid;
}
.inputStyle {
  border: none;
  position: relative;
  top: -2px;
  height: 24px;
  color: #000;
}
@media print {
  .ant-modal-header,
  .ant-modal-mask,
  .ant-modal-close {
    display: none;
  }
}
</style>