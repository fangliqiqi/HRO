<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      @cancel="handleCancel"
    >
      <div style="marginTop:18px;maxHeight:450px;overflow:auto" v-if="!idFlag">
        <p
          style="padding:10px"
          v-for="(item, index) in entityList"
          :key="index"
        >{{ item.message }}</p>
      </div>
      <p style="padding:10px" v-else>表单中存在姓名与身份证不一致的数据，请核实后再次尝试！</p>
      <a-checkbox @change="onChange" :checked="defaultChecked" v-if="checkShow" style="paddingTop:10px">
        重复数据是否允许导入
      </a-checkbox>
      <template slot="footer">
        <a-button @click.stop="handleExcel" style="float:left" v-if="noNew">下载异常反馈</a-button>
        <a-button @click.stop="handleCancel">取消</a-button>
        <a-button type="primary" @click.stop="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    data() {
      return {
        visible: false,
        title: '',
        entityList: [],
        defaultChecked:false,
        checkShow:0,
        fialData:[],
        excelName:'',
        noNew:true,
        idFlag:false //是否是身份证校验
      }
    },
    methods: {
      moment,
      showModal(res,data,name,idFlag) {    //res 反馈信息  data 原表格数据 name 下载名称  idFlag是否是身份证校验
        if(data&&data.length>0){
          this.failData = data
        }
        this.idFlag = idFlag?true:false
        this.excelName = name?name:''
        if(res.repeatInfo!=null&&res.repeatInfo.length>0&&(res.errorInfo==null||res.errorInfo.length==0)){
          this.entityList = res.repeatInfo
          this.checkShow = true
        }else{
           this.checkShow = false
           this.entityList = res.errorInfo||res.data
        }
        this.visible = true
        this.defaultChecked = false
      },
      onChange(){
        this.defaultChecked = !this.defaultChecked
      },
      handleOk() {
        if(this.defaultChecked){
          this.$emit('checked', true);
        }
        this.visible = false
      },
      // 下载异常反馈
      handleExcel(){
        let hArr = []
        let header = []
        let haderKey = []
        let cArr = []
        const time  = moment().format("YYYYMMDD")
        // 如果不是身份证校验，则添加表头  是身份证校验则返回后台数据
        if(!this.idFlag){
          //头部数据
          for(const fail in this.failData[0]){
            hArr.push(fail)
          }
          // 添加内容
          cArr = [].concat(this.failData)
          cArr.map((items,index)=>{
            items['异常信息'] = ''
            for(let en of this.entityList){
              if(Number(en.line)-2==index){
                items['异常信息'] = en.message
              }
            }
          })
          hArr = hArr.filter(item=>item!='异常信息')
          header =   [...hArr,'异常信息']
          haderKey = [...hArr,'异常信息']
        }else{
          cArr = this.entityList.map(item=>{
            item.reason = item.isTrue?'':item.reason||''
            item.isTrue = item.isTrue?'是':'否'
            
            return item
          })
          header =  ['姓名','身份证号','是否一致','原因']
          haderKey = ['name','idCard','isTrue','reason']
        }
        
        const excelDatas = [{
          tHeader: header, // 表一的数据字段
          filterVal: haderKey, // sheet表一头部
          tableDatas: cArr, // 表一的整体json数据
          sheetName: "导入反馈"// 表一的sheet名字
        }]
          this.json2excel(excelDatas, `${this.excelName}异常反馈${time}`, true, "xlsx")
      },
      json2excel(tableJson, filenames, autowidth, bookTypes){
        const that = this
        //这个是引用插件
        import("@/vendor/ExportCommonExcel").then(excel => {
          var tHeader = []
          var dataArr = []
          var sheetnames = []
          for (const i in tableJson) {
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
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
      }
    }
  }
</script>
