<template>
  <a-modal
    title="报表制作"
    :width="1200"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="excelLoading"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="handleOk" v-if="showImportBtn" :disabled="isDisabled">开始导入</a-button>
      <a-button type="primary" :loading="confirmLoading" v-if="showNextBtn" @click="nextStep">下一步</a-button>
    </template>
    <a-spin
      :spinning="confirmLoading"
      :tip="!showNextBtn?'姓名身份证校验中，请勿退出':'加载中...'"
    >
      <a-card
        :bordered="false"
        style="background:#f5f5f5"
      >
        <a-form
          :form="form"
          layout="inline"
          class="ant-advanced-search-form"
        >
          <a-row>
            <a-col :span="8">
              <a-form-item
                label="选择结算主体"
                style="margin-left: 28px"
              >
                <select-page
                  :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                  :title="'departName'"
                  :placeholder="'请选择结算主体'"
                  :id="'id'"
                  :triggerChange="true"
                  v-decorator="['settleDepart', validatorRules.settleDepart ]"
                  @change="handleIdSettlement"
                  style="width:200px;"
                ></select-page>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="选择报表配置方案"
                style="margin-left: 0px"
              >
                <a-select
                  v-decorator="['configId', validatorRules.configId ]"
                  @change="handleIdSettlementConfig"
                  style="width: 191px"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="(item, index) in configsalaryList"
                    :key="index"
                    :value="item.id"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="报表类型"
                style="margin-left: 0px"
              >
                <a-select
                  :disabled="formDisable"
                  v-decorator="['salaryType', validatorRules.salaryType ]"
                  @change="handleIdFormType"
                  style="width: 191px"
                >
                  <a-select-option
                    v-for="(item, index) in formTypeList"
                    :key="index"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-card>
            <a-row>
              <a-col :span="6">工资月份</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.salaryMonth }}</a-col>
              <a-col :span="6">结算月份</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.settleMonth }}</a-col>
            </a-row>
            <a-row>
              <a-col :span="6">社保月份</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.socialMonth }}</a-col>
              <a-col :span="6">公积金月份</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.fundMonth }}</a-col>
            </a-row>
            <a-row>
              <a-col :span="6">社保优先级</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.socialPriority }}</a-col>
              <a-col :span="6">优先数据源</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.fundPriority }}</a-col>
            </a-row>
            <a-row>
              <a-col :span="6">发放方式</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.grantType }}</a-col>
              <a-col :span="6">年终奖扣税</a-col>
              <a-col
                :span="6"
                style="font-weight:bold"
              >{{ configDetail.annualBonusType }}</a-col>
            </a-row>
          </a-card>
          <a-row style="margin-top:20px">
            <a-col
              :span="3"
              align="left"
            >
              <a-form-item>
                <a-upload
                  :disabled="uploadDisabled"
                  name="file"
                  :showUploadList="false"
                  :beforeUpload="beforeUploadExcel"
                  :multiple="false"
                  @change="handleImportSalaryExcel"
                  accept=".xls,.xlsx"
                >
                  <a-button
                    type="primary"
                    icon="import"
                  >选择文件</a-button>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col
              :span="4"
              align="left"
            >
              <a-form-item
                label=""
                style="margin-left: 0px"
              >
                <a-select
                  v-decorator="['excelSheetName', validatorRules.excelSheetName ]"
                  @change="handleIdExcelSheetName"
                  style="width: 191px"
                >
                  <a-select-option
                    v-for="(item, index) in sheetData"
                    :key="index"
                    :value="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col
              :span="8"
              style="color:#bfbfbf"
            >
              请选择要导入的工资报表 Sheet ，再开始导入
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-spin>
    <salary-export-list-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></salary-export-list-modal>
    <error-modal ref="errorModal" @checked="checkedFlag"></error-modal>
    <export-fields-list-modal ref="ExportFieldsListModalForm" @ok="fieldListOk"></export-fields-list-modal>
  </a-modal>
  
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction, postActionHeader } from '@/api/manage'
  import { handleImportData,handleImportFail} from '@/utils/common'
  //import { getSettlementAuthorityByUser } from '@/api/api'
  import {mapGetters} from 'vuex'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import SalaryExportListModal from './SalaryExportListModal'
  import ExportFieldsListModal from './ExportFieldsListModal'
  import ErrorModal from './ErrorModal'
  import SelectPage from '@/components/jeecg/SelectPage'
  //import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import XLSX from 'xlsx'

  export default {
    name: 'SalaryStandardModal',
    components: {
      SalaryExportListModal,
      ErrorModal,
      SelectPage,
      ExportFieldsListModal
    },
    //mixins: [JeecgListMixin],
    data() {
      return {
        moment,
        model: {
          settleDepart:'',
          configId:'',
          salaryType :'',
          jsonString:''
        },
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        settlementList: [],
        formTypeList: [],
        configsalaryList:[],
        excelLoading:false,
        dateFormat: "YYYY-MM-DD",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        validatorRules: {
          settleDepart: { rules: [{ required: true, message: '请选择结算主体!' }] },
          configId: { rules: [{ required: true, message: '请选择报表配置方案!' }] },
          salaryType : { rules: [{ required: true, message: '请选报表类型!' }] },
          excelSheetName: { rules: [{ required: true, message: '请选要导入的工资报表类型!' }] },
        },
        configDetail:{},
        needMonth:'',
        url: {
          importUrl: '/salary/salary/upload',
          configsalaryList:"/salary/tconfigsalary/getTConfigSalaryList",
          salaryAccountNumUrl:"/salary/tsalaryaccount/getSalaryAccoutNum",
          checkIdCardUrl:"/checks/tcheckidcard/checkSalaryIdCard",
        },
        fileList:[],
        excelOptionsData:[],
        sheetData:[], // sheet数据
        excelOptions:[],
        excelSheetName:'',
        formDisable:true,
        uploadDisabled:false,
        showImportBtn:true,
        showNextBtn:false,
        settleDepartInfo:{},
        isPre:false,
        endRow:[],
        isDisabled:true,//开始导入是否禁用取决于身份证校验是否通过
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      add() {
        this.edit({})
      },
      edit() {
        this.form.resetFields()
        this.settlementList = []
        this.formTypeList = []
        this.formDisable = true
        this.configsalaryList = []
        //this.loadSettlementList()
        this.loadFormType()
        this.visible = true
        this.model.settleDepart = ''
        this.model.configId = ''
        this.model.salaryType = ''
        this.model.jsonString = ''
        this.excelOptionsData = []
        this.configDetail = {}
        this.confirmLoading = false
        this.loading = false
      },
      nextStep(){
        const _this = this
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = _this.excelLoading = true
            let excelData = {}
            for (const sheet in _this.excelOptionsData) {
              if(sheet == values.excelSheetName){
                excelData = _this.excelOptionsData[sheet]
              }
            }
            // eslint-disable-next-line
            const initExcelData = _.cloneDeep(excelData)
            // 查找表头并确定数据行数范围
            const range = this.getRangeRow(initExcelData)
            initExcelData['!ref'] = range.ref
            const data = XLSX.utils.sheet_to_json(initExcelData,{defval:'',blankrows:true,header:range.header})
            
            // 去除空行
            data.forEach((item,index)=>{
              const temp = Object.values(item).some(val => {
                return val && String(val).replace(/(^\s*)|(\s*$)/g, "") !== ''
              })
              if(!temp){
                data.splice(index)
              }
            })
            if(data.length === 0){
              this.$message.warning('导入的文件中无数据!请添加数据后再导入')
              _this.confirmLoading = _this.excelLoading = false
              return false
            }
            _this.$refs.ExportFieldsListModalForm.show(data,range.header,_this.settleDepartInfo,_this.form.getFieldsValue())
            _this.confirmLoading = _this.excelLoading = false
          }
        })
      },
      //获取员工姓名所在行
      getNameRow(data){
        for(const key in data){
          if(key.indexOf('!')===-1 && data[key].v === '员工姓名'){
            return key.match(/\d*\d$/)[0]
          }
        }
      },
      
      safe_decode_range(range) {
        var o = {s:{c:0,r:0},e:{c:0,r:0}};
        var idx = 0, i = 0, cc = 0;
        var len = range.length;
        for(idx = 0; i < len; ++i) {
          if((cc=range.charCodeAt(i)-64) < 1 || cc > 26) break;
          idx = 26*idx + cc;
        }
        o.s.c = --idx;

        for(idx = 0; i < len; ++i) {
          if((cc=range.charCodeAt(i)-48) < 0 || cc > 9) break;
          idx = 10*idx + cc;
        }
        o.s.r = --idx;

        if(i === len || range.charCodeAt(++i) === 58) { o.e.c=o.s.c; o.e.r=o.s.r; return o; }

        for(idx = 0; i != len; ++i) {
          if((cc=range.charCodeAt(i)-64) < 1 || cc > 26) break;
          idx = 26*idx + cc;
        }
        o.e.c = --idx;

        for(idx = 0; i != len; ++i) {
          if((cc=range.charCodeAt(i)-48) < 0 || cc > 9) break;
          idx = 10*idx + cc;
        }
        o.e.r = --idx;
        return o;
      },
      // 根据所在行获取表头
      getHeaders(arr,row){
        const r = this.safe_decode_range(arr['!ref'])
        const header = []
        for(let i = r.s.c; i <= r.e.c; ++i) {
          const index = XLSX.utils.encode_col(i)
          if(arr[`${index}${row}`]){
            header[i] = arr[`${index}${row}`].v
          }
        }
        return header
      },
      // lastRowMerge(data,start,last){
      //   // 先判断最后一行是否为空行
      //   if(!this.removeRow(data,last)){ // 是
      //     last--
      //   }
      //   // 从标题行向下查找合并单元格，若查出则以上一行作为数据最后一行
      //   // this.endRow.push(last)
      //   data['!merges'].forEach(item=>{
      //     if(item.e.r == last){
      //       this.endRow.push(item.s.r-1)
      //       this.lastRowMerge(data,start,last-1)
      //     }
      //   })
      //   last = Math.min.apply(null, this.endRow)
      //   return (last >= start) ? last : start
      // },
      removeRow(data,last){
        const arr = []
        // 判断最后一行是否为空行
        for(const key in data){
          if(key.indexOf('!')===-1 && key.match(/\d*\d$/)[0] === String(last)){
            arr.push(data[key])
          }
        }
        return arr.some(val => {
          return val && String(val.v).replace(/(^\s*)|(\s*$)/g, "") !== ''
        })
      },
      getLastRow(merges,last,start,data){
        this.endRow.push(last)
        if(last <= start){
          return start
        }
        // 先判断最后一行是否为空行
        if(!this.removeRow(data,last+1)){ // 是
          return this.getLastRow(merges,last-1,start,data)
        }
        // 是否存在上下合并单元格
        const upDown = merges.filter(item=> item.s.r == last && item.e.r != item.s.r && item.s.r>= start && item.s.r <= last)
        // 是否存在左右合并单元格
        const leftRight = merges.filter(item=> item.s.r == last && item.e.r == item.s.r && item.s.r>= start && item.s.r <= last)
        const arr = upDown.concat(leftRight)
        if(arr.length){
          // 最小行数
          const temp = Math.min.apply(Math, arr.map(item=>item.s.r))
          last = Math.min.apply(Math, [temp,last])
          return this.getLastRow(merges,last-1,start,data)
        }else{
          return Math.min.apply(null, this.endRow)
        }

      },
      handleMerge(data,row,arr){
        const merges = data['!merges']
        const res = {titMerge:false,last:0,start:Number(row)+1}
        // 根据!ref获取最后一行并去掉空行
        const last = arr[1].match(/\d*\d$/)[0]-1
        this.endRow = [last]
        res.titMerge = merges.some(item=>{
          // 标题行存在合并单元格
          return item.s.r == (row-1) || item.e.r == (row-1)
        })

        if(res.titMerge){
          const start = [0]
          merges.forEach(item=>{
            if(item.s.c == item.e.c && item.s.r == (row-1)){
              start.push(item.e.r-item.s.r) // 标题行向下合并几行
            }
          })
          res.start += Math.max.apply(null, start)
          merges.forEach(item=>{
            if(item.s.c != item.e.c && item.s.r == (row-1)){
              // 横向合并单元格个数
              for(let j=0;j<=(item.e.c-item.s.c);j++){
                // 合并单元格的值
                const temp = String.fromCharCode(65+item.s.c+j)+row
                for(let i=0;i<Math.max.apply(null, start);i++){
                  if(data[temp] && data[temp].h){
                    data[temp].v = data[temp].h + data[String.fromCharCode(65+item.s.c)+(Number(row)+1+j)].v
                  }else{
                    data[temp] = {v:data[String.fromCharCode(65+item.s.c)+row].h+data[String.fromCharCode(65+item.s.c+j)+(Number(row)+j)].v}
                  }
                }
              }
            }
          })
          res.last = this.getLastRow(merges,last,res.start,data)+1
        }else{
          res.last = this.getLastRow(merges,last,res.start,data)
        }
        
        return res
      },
      getRangeRow(data){
        let header = []
        let ref = data['!ref']
        const arr = data['!ref'].split(':')
        // 存在合并单元格
        if(data['!merges']){
          const row = this.getNameRow(data)
          if(row === undefined){
            this.$message.warning('必须要有`员工姓名`一列')
            return false
          }
          const range = {s:arr[0].replace(/[0-9]*\d$/ig,""),e:arr[1].replace(/[0-9]*\d$/ig,"")} // 列范围
          // 查看表头所在行是否存在合并单元格
          const res = this.handleMerge(data,row,arr)
          header = this.getHeaders(data,row)
          ref = `${range.s}${res.start}:${range.e}${res.last}`
          
        }else{
          // 以第一行为表头
          const range = {s:arr[0],e:arr[1].replace(/[0-9]*\d$/ig,"")} // 最后一列
          const row = range.s.match(/\d*\d$/)[0] // 表头所在行
          ref = "A2:"+arr[1]
          header = this.getHeaders(data,row)
        }
        return {header:header,ref:ref}
      },
      // 是否允许重复导入
      checkedFlag(data){
        if(data){
          this.importData(1)
        }
      },
      // 数据导入  
      importData(repeatFlag){
        let that = this
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            that.excelLoading = true
            const contextType = {'Content-Type': 'application/json;charset=UTF-8'};
            let formData = Object.assign(this.model, values)
            const url = this.url.importUrl + "?settleDepart=" + formData.settleDepart + "&configId=" + formData.configId +
            "&salaryType=" + formData.salaryType + "&repeatFlag=" + repeatFlag
            setTimeout(() => {
                let excelData = {}
                let failData  = []
                for (const sheet in this.excelOptionsData) {
                  if(sheet == formData.excelSheetName){
                    excelData =  [].concat(XLSX.utils.sheet_to_json(this.excelOptionsData[sheet],{defval:'',blankrows:true}))
                    //获取原表单
                    failData = handleImportFail(excelData)
                    // 去除空格
                    excelData = handleImportData(excelData)
                  }
                }
                const requestTimeOut = 1000*60*5  // 请求过期时间
                postActionHeader(url, JSON.stringify(excelData),contextType,requestTimeOut).then((res) => {
                  this.excelLoading = false
                  if(Number(res.code) === 200){
                    this.$refs.modalForm.show(res.data)
                  }
                  if(res.code == 1){
                    if(res.data){
                      this.$refs.errorModal.showModal(res.data,failData,'普通薪资')
                    }else{
                      this.$message.error(res.msg);
                    }
                  }
                  that.confirmLoading = false
                  that.excelLoading = false
                })
              }, 500);
              // 获取excel数据

          }
        })
      },
      // 保存按钮
      handleOk() {
        //触发表单验证
        // let that = this
        this.excelLoading = true
        this.importData(0)
      },
      handleCancel() {
        this.close()
        this.$emit('ok')
      },
      modalFormOk() {
        this.close()
        this.$emit('ok')
      },
      fieldListOk(flag){
        if(flag){
          this.isPre = true
        }else{
          this.visible = false
          this.$emit('ok')
          this.showImportBtn = true
          this.showNextBtn = this.isPre = false
          this.settleDepartInfo = {}
        }
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.showImportBtn = true
        this.showNextBtn = this.isPre = false
        this.confirmLoading = this.excelLoading = false
        this.settleDepartInfo = {}
        this.endRow = []
        this.isDisabled = false
        
      },
      loadSettlementList() {
        // getSettlementAuthorityByUser({}).then((res) => {
        //   console.log(res)
        //   this.settlementList = res.data
        // })
      },
      loadFormType() {
        //报表类型
        initDictOptions('form_type').then((res) => {
          if (Number(res.code) === 200) {
            this.formTypeList = res.data
            this.showNextBtn?this.formTypeList.splice(2,1):this.formTypeList
          }
        })
      },
      handleIdSettlement(value,option) {
        const info = option.context.lists[option.key]
        this.settleDepartInfo = {
          settleId:value,
          settleName:info.title,
          settleNo:info.item.departNo
        }
        this.model.configId = ''
        this.form.resetFields() //在选择时把其他数据清空了
        this.configsalaryList = []
        this.model.settleDepart = value
        if(this.model.configId != '' && this.model.configId != 0){
          this.formDisable = false
        }else{
          this.formDisable = true
        }
        httpAction(this.url.configsalaryList + '?settleDepart=' + value,null,'POST').then((res) => {
          if(res.data.length == 0){
            this.$message.error("暂时没有配置,请到薪酬服务-薪酬配置,创建新配置。")
            this.model.configId = 0
          }else{
            this.configsalaryList = res.data
            this.model.configId = res.data[0].id
          }

        })
      },
      handleIdSettlementConfig(value) {
        this.model.configId = value
        if(this.model.settleDepart != '' && value != 0){
          this.formDisable = false
        }else{
          this.formDisable = true
        }
        for(var c of this.configsalaryList){
          if(value == c.id){
            this.getNeedMonth(c.salaryMonth)
            this.configDetail.salaryMonth = this.needMonth
            this.getNeedMonth(c.settleMonth)
            this.configDetail.settleMonth = this.needMonth
            this.getNeedMonth(c.socialMonth)
            this.configDetail.socialMonth = this.needMonth
            this.getNeedMonth(c.fundMonth)
            this.configDetail.fundMonth = this.needMonth
            if(c.socialPriority == 0){
              this.configDetail.socialPriority = '生成'
            }
            if(c.socialPriority == 1){
              this.configDetail.socialPriority = '缴纳'
            }
            if(c.fundPriority == 0){
              this.configDetail.fundPriority = '生成'
            }
            if(c.fundPriority == 1){
              this.configDetail.fundPriority = '缴纳'
            }
            if(c.grantType == 0){
              this.configDetail.grantType = '现金'
            }
            if(c.grantType == 1){
              this.configDetail.grantType = '转账'
            }
            if(c.annualBonusType == 0){
              this.configDetail.annualBonusType = '合并'
            }
            if(c.annualBonusType == 1){
              this.configDetail.annualBonusType = '单独'
            }
            if(c.annualBonusType == 2){
              this.configDetail.annualBonusType = '自动计算'
            }
          }
        }
      },
      handleIdFormType() {
        for(var d of this.configsalaryList){
          if(d.id == this.model.configId){
            this.getNeedMonth(d.settleMonth)
          }
        }
        // let url = this.url.salaryAccountNumUrl + '?salaryType=' + value + '&settleDepart=' + this.model.settleDepart + '&settleMonth=' + this.needMonth
        // httpAction(url,null,'POST').then((res) => {
        //   if(value < 2){
        //     if(res.data > 0){
        //       this.$message.error('一月只能导入一次');
        //       this.uploadDisabled = true
        //     }else{
        //       this.uploadDisabled = false
        //     }
        //   }else{
        //     this.uploadDisabled = false
        //   }
        // })
      },
      getNeedMonth(value) {
        switch(value){
          // 前4月
          case -6:
            this.needMonth = moment(moment().month(moment().month() - 6).startOf('month').valueOf()).format('YYYYMM');
            break;
          // 前4月
          case -5:
            this.needMonth = moment(moment().month(moment().month() - 5).startOf('month').valueOf()).format('YYYYMM');
            break;
          // 前4月
          case -4:
            this.needMonth = moment(moment().month(moment().month() - 4).startOf('month').valueOf()).format('YYYYMM');
            break;
          // 前3月
          case -3:
            this.needMonth = moment(moment().month(moment().month() - 3).startOf('month').valueOf()).format('YYYYMM');
            break;
          // 前2月
          case -2:
            this.needMonth = moment(moment().month(moment().month() - 2).startOf('month').valueOf()).format('YYYYMM');
            break;
          //上月
          case -1:
            this.needMonth = moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format('YYYYMM');
            break;
          case 0:
            this.needMonth = moment(moment().month(moment().month()).startOf('month').valueOf()).format('YYYYMM');
            break;
          case 1:
            this.needMonth = moment(moment().month(moment().month() + 1).startOf('month').valueOf()).format('YYYYMM');
            break;
          default:
            this.needMonth = '';
            break;
        }
      },
      beforeUploadExcel() {
        // this.fileList = []
        // this.form.validateFields([this.validatorRules.settleDepart,this.validatorRules.configId,this.validatorRules.salaryType],(err) => {
        //   if(!err){
        //     this.fileList = [...this.fileList, file]
        //     return false
        //   }
        // })
        // 上面这种写法 会照成数据上传触发3次，因为需要进行身份证校验（花钱）所以不合适进行更改
        return false
      },
      handleImportSalaryExcel(file) {
        this.fileList = [file.file]
        this.form.validateFields([this.validatorRules.settleDepart,this.validatorRules.configId,this.validatorRules.salaryType],(err) => {
          if(!err){
            this.confirmLoading = true
            const { fileList } = this
            const formData = new FormData()
            fileList.forEach((file) => {
              formData.append('files[]', file)
            })
            this.uploadFilesChange(fileList[0])
          }
        })
      },
      uploadFilesChange(file) {
        this.isPre = false
        // 通过FileReader对象读取文件
        const fileReader = new FileReader()
        fileReader.onload = event => {
          try {
            const { result } = event.target
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' })
            // 存储获取到的数据
            //let data = {}
            let arr = []
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
              arr.push(sheet)
            }
      
            this.excelOptionsData = workbook.Sheets
            this.sheetData = arr
            this.model.excelSheetName = arr[0]
            this.form.setFieldsValue(pick(this.model,'excelSheetName'))
            this.excelSheetName = arr[0]
            this.confirmLoading = false

            if(!this.showNextBtn){
              // 校验身份证逻辑
              this.confirmLoading = true
              let excelData = []
              for (const sheet in this.excelOptionsData) {
                if(sheet == this.model.excelSheetName){
                  excelData =  [].concat(XLSX.utils.sheet_to_json(this.excelOptionsData[sheet],{defval:'',blankrows:true}))
                  // 去除空格
                  excelData = handleImportData(excelData)
                }
              }
              let idcardData = []
              excelData.map(item=>{
                idcardData.push({name:item['姓名'],idCard:item['身份证号']})
              })
              const contextType = {'Content-Type': 'application/json;charset=UTF-8'};
              const url = this.url.checkIdCardUrl
              const requestTimeOut = 1000*60*5  // 请求过期时间
              
              postActionHeader(url, JSON.stringify(idcardData),contextType,requestTimeOut).then((res) => {
                if(Number(res.code) === 200){
                  this.isDisabled = false
                  this.$message.success('身份证信息全部校验通过');
                }
                if(res.code == 1){
                  this.isDisabled = true
                  if(res.data){
                    this.$refs.errorModal.showModal(res,[],'普通薪资身份证校验',true)
                  }else{
                    this.$message.error(res.msg);
                  }
                }
              }).catch(() => {
                this.isDisabled = true
                this.$message.error('身份证信息校验失败');
              })
              .finally(() => {
                this.confirmLoading = false
              })
            }
          } catch (e) {
            console.log(e);
            // 这里可以抛出文件类型错误不正确的相关提示
            this.$message.error('文件上传错误！')
          }
        }
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file)
      },
      handleIdExcelSheetName(value){
        this.excelSheetName = value
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
// .ant-btn {
//   margin-left: 30px;
//   margin-bottom: 30px;
//   float: right;
// }
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}
</style>