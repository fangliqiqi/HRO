<template>
  <a-modal
    :title="title"
    :width="1200"
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
      >导出</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form  margin-left-explain"
      >
        <!---
          <a-row>
          <a-col :span="24">
            <a-form-item>
              <a-checkbox
                style="margin-left: 20px;"
                :indeterminate="checkState.indeterminate"
                @change="onCheckAllChange"
                :checked="checkState.checkAll"
              >全选</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        -->
        <a-row>
          <a-alert
            message="拖拽可排序"
            type="info"
            show-icon
          />
          <a-col :span="24">
            <a-form-item>
              <a-checkbox
                style="margin-left: 20px;"
                :indeterminate="indeterminate"
                v-model="checkAll"
                @change="onCheckAllChange"
              >全选</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item>
              <a-checkbox-group
                v-model="checkedFields"
                @change="onChange"
              >
                <draggable
                  draggable=".item"
                  :list="exportFields"
                >
                  <a-checkbox
                    v-for="(value) in exportFields"
                    :class="{'stepFormText':true,'item':checkedFields.find(v=>v==value)}"
                    :key="value"
                    :value="value"
                    style="margin-left: 20px; line-height: 30px;"
                  >{{ value }}</a-checkbox>
                </draggable>
              </a-checkbox-group>

              <!--
                <a-checkbox-group
                @change="onChange"
                class="checkbox-group-style"
                v-decorator="['checked', {initialValue: this.checkState.checkedList, rules: [{required: true, message: '请选择一项！'}]}]"
              >
                <a-checkbox
                  v-for="(value, key) in exportFields"
                  :key="key"
                  :value="value"
                > <span :title="value">{{ value }}</span>
                </a-checkbox> 
              </a-checkbox-group>
              -->
              
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  // import pick from 'lodash.pick'
  import { downFilePost } from '@/api/manage'
  //import { filterDictText } from '@/components/dict/JDictSelectUtil'
  import { getAreaName } from '@/utils/common'
  import draggable from "vuedraggable"

  export default {
    name: 'EmployeeExportModal',
    components:{
      draggable
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        exportFields: [], // 表头数据
        exportHeader:[],
        areaTrees: [],  // 地区
        areaCitys: [],  // 档案城市
        areaTowns: [],  // 档案区县
        socialCitys: [], // 社保城市
        socialTowns: [], // 社保区县
        fundCitys: [], // 公积金城市
        fundTowns: [], // 公积金区县
        sexOptions: [], // 性别
        unitOptions: [], // 单位和结算主体
        bankOptions: [],  // 开户行
        unitSearchOptions: [], // 单位和结算主体
        empTypeOptions: [], // 员工类型
        workTypeOptions: [],  // 工作类型
        empMarriOptions: [],  // 婚姻状况
        educationOptions: [], // 学历级别
        politicalOptions: [], // 政治面貌
        obtainTypeOptions: [],  // 获取方式
        settleDomainItems: [],  // 结算主体数组
        empNationalOptions: [], // 民族
        settleDomainOptions: {},  // 结算主体
        workingHoursOptions: [], // 工时制
        empRegisTypeOptions: [],  // 户口性质
        situationTypeOptions: [], // 签订情况
        educationTypeOptions: [], // 学历类型
        employeeLableOptions: [],  // 员工标签
        settleDomainDisabled: true,  // 结算主体不可选择
        allSettleDomainOptions: {}, // 所有结算主体与单位
        educationSystemOptions: [], // 学制类型
        disabilityLevelOptions: [], // 伤残等级
        relationshipSelfOptions: [],  // 与本人关系
        qualificationTypeOptions: [], // 资格类型
        qualificationLevelOptions: [],  // 资格等级
        employeeContractTypeOptions: [], // 员工合同类型
        employData: [],
        handleStatus:{'0':'待办理','1':'已办理','2':'办理失败','3':'已派减'},
        checkedFields:[],
        indeterminate: false,
        checkAll: true,
        url: {
          exportXlsUrl:'',
        },
      }
    },
    computed:{
      computedCheckedFields(){
        return [].concat(this.checkedFields).sort((n,m)=>{
          return (this.exportFields).findIndex(v=>v==n) - (this.exportFields).findIndex(v=>v==m) 
        })
      }
    },
    watch:{
      checkedFields(){
        this.exportFields.sort((n,m)=>{
          return  !!this.checkedFields.find(v=>v==m)  - !!this.checkedFields.find(v=>v==n)
        })
      }
    },
    methods: {
      getAreaName,
      // 添加
      add() {
        this.edit({})
      },
      // 编辑
      edit() {
        // this.form.resetFields()
        this.visible = true
        this.checkedFields = this.exportFields ? ([].concat(this.exportFields)) : [];
      },
      //保存按钮
      handleOk() {
        if(this.computedCheckedFields.length == 0){
          this.$message.warning('至少选择一项');
          return false
        }
        const that = this
          that.confirmLoading = true
          let httpurl = this.url.exportXlsUrl
          let formData = Object.assign(this.computedCheckedFields)
          
          downFilePost(httpurl, formData).then((res) => {
            if (res.size > 0) {
              var blob = new Blob([res], {type: 'application/vnd.ms-excel;charset=utf-8'}); // application/vnd.ms-excel这里表示xls类型
              var downloadElement = document.createElement('a')
              var href = window.URL.createObjectURL(blob) // 创建下载的链接
              downloadElement.href = href
              downloadElement.download = `${that.title}.xls` // 下载后文件名
              document.body.appendChild(downloadElement)
              downloadElement.click() // 点击下载
              document.body.removeChild(downloadElement) // 下载完成移除元素
              window.URL.revokeObjectURL(href) // 释放掉blob对象

              that.$message.success(`${that.title}成功！`)
              that.$emit('ok')
              that.close()
            } else {
              that.$message.warning(`${(res.msg || res.message)} 失败！`)
            }
          }).finally(() => {
            that.confirmLoading = false
          })
      },
      // 保存按钮
      // handleOk() {
      //   let that = this
      //   // 触发表单验证
      //   this.form.validateFields((err, values) => {
      //     if (!err) {
      //       this.confirmLoading = true
      //       let formData = Object.assign(this.model, values)
      //       let exportNowFields = [];
      //       let exportNowHeader = [];
      //       for(let c of formData.checked){
      //         for(let d in this.exportFields){
      //           if(this.exportFields[d] == c){
      //             for(let f in this.exportHeader){
      //               if(f == d){
      //                 exportNowFields.push(this.exportFields[d])
      //                 exportNowHeader.push(this.exportHeader[f])
      //                 continue
      //               }
      //             }
      //             continue
      //           }
      //         }
      //       }
      //       httpAction(that.url.exportXlsUrl,{},'GET',60000).then((res) => {
      //         if(res.code == 200){
      //           let exportArr = []
      //           for(let c in res.data){
      //             let exportData = {}

      //             let isHave = 0
      //             for(let d of exportNowHeader){
      //               if(res.data[c]['contractInfo']){
      //                 if(res.data[c]['contractInfo'].hasOwnProperty(d)){
      //                   isHave = 1
      //                   exportData[d] = res.data[c]['contractInfo'][d]
      //                   continue
      //                 }
      //               }
                    
      //               if(res.data[c]['employeeInfoVo'].hasOwnProperty(d)){
      //                 isHave = 1
      //                 exportData[d] = res.data[c]['employeeInfoVo'][d]
      //                 continue
      //               }

      //               if(res.data[c]['fund']){
      //                 if(res.data[c]['fund'].hasOwnProperty(d)){
      //                   isHave = 1
      //                   exportData[d] = res.data[c]['fund'][d]
      //                   continue
      //                 }
      //                 if(res.data[c]['fund'].hasOwnProperty('handleStatus')){
      //                   isHave = 1
      //                   exportData['fundhandleStatus'] = res.data[c]['fund']['handleStatus']
      //                   continue
      //                 }
      //               }
      //               if(res.data[c]['social']){
      //                 if(res.data[c]['social'].hasOwnProperty(d)){
      //                   isHave = 1
      //                   exportData[d] = res.data[c]['social'][d]
      //                   continue
      //                 }
      //                 if(res.data[c]['social'].hasOwnProperty('handleStatus')){
      //                   isHave = 1
      //                   exportData['socialhandleStatus'] = res.data[c]['social']['handleStatus']
      //                   continue
      //                 }
      //               }
      //               if(isHave == 0){
      //                 exportData[d] = ''
      //               }
      //             }
      //             exportArr.push(exportData)
      //           }
      //           for(let d in exportArr){
      //             exportArr[d]['empSex'] = exportArr[d]['empSex'] ? filterDictText(this.sexOptions,exportArr[d]['empSex']) : ''  // 性别
      //             exportArr[d]['empMarriStatu'] = exportArr[d]['empMarriStatu'] ? filterDictText(this.empMarriOptions,exportArr[d]['empMarriStatu']) : ''  // 婚姻
      //             exportArr[d]['empNational'] = exportArr[d]['empNational'] ? filterDictText(this.empNationalOptions,exportArr[d]['empNational']) : '' //民族
      //             exportArr[d]['politicalStatus'] = exportArr[d]['politicalStatus'] ? filterDictText(this.politicalOptions,exportArr[d]['politicalStatus']) : '' //政治面貌
      //             exportArr[d]['empType'] = exportArr[d]['empType'] ? filterDictText(this.employeeLableOptions,exportArr[d]['empType']) : '' //员工类型
      //             exportArr[d]['empRegisType'] = exportArr[d]['empRegisType'] ? filterDictText(this.empRegisTypeOptions,exportArr[d]['empRegisType']) : '' //户口性质
      //             exportArr[d]['empLabel'] = exportArr[d]['empLabel'] ? filterDictText(this.employeeLableOptions,exportArr[d]['empLabel']) : '' //员工标签
      //             exportArr[d]['workFlag'] = exportArr[d]['workFlag'] == 1 ? '否' : '是' //在职状态
      //             exportArr[d]['lockFlag'] = exportArr[d]['lockFlag'] == 1 ? '未' : '锁' //锁定状态
      //             exportArr[d]['contractType'] = exportArr[d]['contractType'] ? filterDictText(this.employeeContractTypeOptions,exportArr[d]['contractType']) : '' //合同类型
      //             exportArr[d]['socialhandleStatus'] = this.handleStatus[exportArr[d]['socialhandleStatus']]  //社保办理状态
      //             exportArr[d]['fundhandleStatus'] =  this.handleStatus[exportArr[d]['fundhandleStatus']] //公积金办理状态
      //             exportArr[d]['settleDomain'] = exportArr[d]['settleDomain'] ? this.allSettleDomainOptions[exportArr[d]['settleDomain']]['departName'] : '' //结算主体
                  
                  
      //             exportArr[d]['socialTown'] = exportArr[d]['socialTown'] ? getAreaName(exportArr[d]['socialProvince'],exportArr[d]['socialCity'],exportArr[d]['socialTown']) : ''
      //             exportArr[d]['socialCity'] = exportArr[d]['socialCity'] ? getAreaName(exportArr[d]['socialProvince'],exportArr[d]['socialCity']) : ''
      //             exportArr[d]['socialProvince'] = exportArr[d]['socialProvince'] ? getAreaName(exportArr[d]['socialProvince']) : ''
                  
                  
      //             exportArr[d]['fundTown'] = exportArr[d]['fundTown'] ? getAreaName(exportArr[d]['fundProvince'],exportArr[d]['fundCity'],exportArr[d]['fundTown']) : ''
      //             exportArr[d]['fundCity'] = exportArr[d]['fundCity'] ? getAreaName(exportArr[d]['fundProvince'],exportArr[d]['fundCity']) : ''
      //             exportArr[d]['fundProvince'] = exportArr[d]['fundProvince'] ? getAreaName(exportArr[d]['fundProvince']) : ''
                  
                  
      //             exportArr[d]['idTown'] = exportArr[d]['idTown'] ? getAreaName(exportArr[d]['idProvince'],exportArr[d]['idCity'],exportArr[d]['idTown']) : ''
      //             exportArr[d]['idCity'] = exportArr[d]['idCity'] ? getAreaName(exportArr[d]['idProvince'],exportArr[d]['idCity']) : ''
      //             exportArr[d]['idProvince'] = exportArr[d]['idProvince'] ? getAreaName(exportArr[d]['idProvince']) : ''
                   
      //             exportArr[d]['fileTown'] = exportArr[d]['fileTown'] ? getAreaName(exportArr[d]['fileProvince'],exportArr[d]['fileCity'],exportArr[d]['fileTown']) : ''
      //             exportArr[d]['fileCity'] = exportArr[d]['fileCity'] ? getAreaName(exportArr[d]['fileProvince'],exportArr[d]['fileCity']) : ''
      //             exportArr[d]['fileProvince'] = exportArr[d]['fileProvince'] ? getAreaName(exportArr[d]['fileProvince']) : ''
                  
      //             // 获取创建人
      //             if(exportArr[d]['createUser']){
      //               for(let c in this.employData){
      //                 if(c == exportArr[d]['createUser']){
      //                   exportArr[d]['createUser'] = this.employData[c]
      //                   break
      //                 }
      //               }
      //             }
      //           }
      //           var excelDatas = [
      //             {
      //               tHeader: exportNowFields, // 表一的数据字段
      //               filterVal: exportNowHeader, // sheet表一头部
      //               tableDatas: exportArr, // 表一的整体json数据
      //               sheetName: "员工档案"// 表一的sheet名字
      //             }
                  
      //           ]
      //           this.json2excel(excelDatas, '员工档案', true, "xlsx")
      //           this.confirmLoading = false
      //           this.$message.success("导出成功")
      //         }
      //       }).finally(() => {
      //         this.confirmLoading = false
      //       })
      //     }
      //   })
      // },
      json2excel(tableJson, filenames, autowidth, bookTypes){
        var that = this
        //这个是引用插件
        import("@/vendor/EmployExport").then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (var i in tableJson) {
            tHeader.push(tableJson[i].tHeader)
            dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
            sheetnames.push(tableJson[i].sheetName)
          }
          excel.export_json_to_excel_more_sheet({
            header: tHeader,
            data: dataArr,
            sheetname: sheetnames,
            filename: filenames,
            autoWidth: autowidth,
            bookType: bookTypes
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          return v[j]
        }))
      },
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 数据重置
      close() {
        this.$emit('close')
        this.visible = this.indeterminate = false
        this.confirmLoading = false
        this.exportFields = []
        this.checkAll = true
        this.checkedFields = []
        this.url.exportXlsUrl = ''
      },
      // 全部选择
      onCheckAllChange(val) {
        this.checkedFields = val.target.checked ? ([].concat(this.exportFields)) : []
        this.indeterminate = false
      },
      // 部分选择
      onChange(checkedList) {
        this.indeterminate = !!checkedList.length && checkedList.length < this.exportFields.length;
        this.checkAll = checkedList.length === this.exportFields.length;
      },
    }
  }
</script>

<style lang="less" scoped>
.checkbox-group-style {
    :global(.ant-checkbox-wrapper) {
    margin-left: 20px;
    line-height: 30px;
    width: 102px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  
}

</style>

<style lang="less">
.margin-left-explain .has-error .ant-form-explain {
  margin-left: 20px;
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
.stepFormText {
  border: 1px dashed #eee;
  padding: 0px 0px 5px 5px;
  margin-bottom: 8px;
  white-space: nowrap;
  z-index: 10;
}
.item:hover {
  border: 1px dashed #333;
  cursor: move;
}
</style>