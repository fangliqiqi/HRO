<template>
  <a-modal
    :title="title"
    :width="1000"
    placement="right"
    :closable="true"
    @cancel="handleCancel"
    cancelText="取消"
    okText="审核"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <a-button
        type="primary"
        @click="handlePrint"
      >封面打印</a-button>
      <a-button
        type="primary"
        @click="handleDownload"
      >导出</a-button>
    </template>
    <a-card :bordered="false">
      <a-tabs @change="changeTab">
        <a-tab-pane
          v-for="pane in panes"
          :tab="'封面-'+pane.payTypeText"
          :key="pane.id"
        >
          <a-row type="flex">
            <a-col
              style="text-align:center;font-size:15px;font-weight:bolder;color:#333"
              :span="12"
              :offset="6"
              id="tabledesc1"
            >{{ pane.title }}</a-col>
            <a-col
              style="text-align:center;font-size:20px;font-weight:bolder;color:#333;margin-top:10px"
              :span="12"
              :offset="6"
            >{{ pane.payTypeText }}审批单</a-col>
          </a-row>
          <table
            class="table1"
            aria-describedby="tabledesc1"
          >
            <tr class="tr1">
              <th
                class="td1"
                colspan="2"
                scope="col"
              ></th>
              <th
                class="td1"
                colspan="2"
                scope="col"
              >{{ pane.createDate }}</th>
              <th
                class="td1"
                scope="col"
              >结算主体编码</th>
              <th
                class="td1"
                scope="col"
              >{{ pane.settleNo }}</th>
            </tr>
            <tr class="tr1">
              <td
                class="td1"
                colspan="2"
              >
                <p class="font18">单位</p>
                <p>{{ pane.unitName }}</p>
                <p>{{ pane.settleName }}</p>
              </td>
              <td
                class="td1"
                colspan="2"
              >
                <p class="font18">项目</p>
                <p>{{ pane.itemName }}</p>
              </td>
              <td class="td1">
                <p class="font18">付款方式</p>
                <p>{{ pane.payTypeText }}</p>
              </td>
              <td class="td1">
                <p class="font18">金额</p>
                <p>¥{{ pane.money }}</p>
              </td>
            </tr>
            <tr class="tr1">
              <td
                class="td1"
                colspan="2"
              >合计人民币:</td>
              <td
                style="font-weight:bolder;text-align:left"
                class="td1"
                colspan="3"
              >{{ pane.chmoney }}</td>
              <td class="td1">¥{{ pane.money }}</td>
            </tr>
            <tr v-if="pane.payType == 1">
              <td class="td1">收款单位名称:</td>
              <td class="td1">
                {{ pane.organName }}
              </td>
              <td class="td1">账户:</td>
              <td class="td1">
                {{ pane.bankNo }}
              </td>
              <td class="td1">开户行:</td>
              <td class="td1">
                {{ pane.bankName }}
              </td>
            </tr>
            <tr>
              <td class="td1">备注:</td>
              <td
                class="td1"
                colspan="5"
              >
                <input
                  style="border:0;width:100%"
                  :value="pane.remark"
                >
              </td>
            </tr>
          </table>
          <a-row
            type="flex"
            v-if="pane.payType == 1"
          >
            <a-col :span="4">公司领导:</a-col>
            <a-col :span="4">财务负责人:{{ revenueName }}</a-col>
            <a-col :span="4">网银审核授权人:</a-col>
            <a-col :span="4">网银转账提交人: {{ bankUpName }}</a-col>
            <a-col :span="4">数据审核:{{ auditName }}</a-col>
            <a-col :span="4">制表人:{{ createName }}</a-col>
          </a-row>
          <a-row
            type="flex"
            v-if="pane.payType == 0"
          >
            <a-col :span="4">公司领导:</a-col>
            <a-col :span="4">财务负责人:{{ revenueName }}</a-col>
            <a-col :span="4">出纳会计:</a-col>
            <a-col :span="4">数据审核:{{ auditName }}</a-col>
            <a-col :span="4">制表人:{{ createName }}</a-col>
          </a-row>

        </a-tab-pane>
        <a-tab-pane tab="流程进展明细" key="process" forceRender>
          <process-modal
            ref="ProcessForm"
            :attaList="attaList"
            :salaryStandardInfo="model"
            :userList="employData"
          >
          </process-modal>
        </a-tab-pane>
      </a-tabs>

    </a-card>

  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
import { mapGetters } from 'vuex'
import moment from 'moment'
import ProcessModal from './ProcessModal'

export default {
  name: 'PausePageModal',
  components: {
    ProcessModal
  },
  data() {
    return {
      panes:[],
      activeKey:'1',
      payType:1,
      employData:{},
      createName:'',
      auditName:'',
      revenueName:'',
      bankUpName:'',
      visible:false,
      attaList: [],
      model: {},
      url:{
        getPrintCount:"/salary/tprintrecord/getPrintCount",
      }
    }
  },
  props: {
    coverList:{
      type:Array,
      required:true
    },
    title:{
      type:String,
      required:true
    },
    
  },
  methods:{
    ...mapGetters(["nickname", "avatar","userInfo"]),
    changeTab(key){
      if(key === 'process'){
        this.$refs.ProcessForm.show();
      }
    },
    show(record){
      this.visible = true
      this.model = Object.assign({}, record)
      this.bankUpName = this.nickname()
      // httpAction('admin/user/findUserBypPrmission?permissionStr=wxhr:lostandfoundinfo_doBilling', '', 'GET').then((res) => {
      //   if (res.code === 200) {
      //     for(var d of res.data){
      //       // if(this.lostInfo.createUser == d.userId){
      //       //   this.createName = d.nickname
      //       // }
      //       // if(this.salaryStandardInfo.auditUser == d.userId){
      //       //   this.auditName = d.nickname
      //       // }
      //       // if(this.salaryStandardInfo.revenueUser == d.userId){
      //       //   this.revenueName = d.nickname
      //       // }
      //       if(this.coverList[0].createUser == d.userId){
      //         this.createName = d.nickname
      //       }
      //     }
      //   } 
      // })
      this.createName = this.employData[this.coverList[0].createUser];

      this.panes = this.coverList
      for(var c in this.panes){
        if(c == 0){
          this.activeKey = this.panes[0].id
        }
        this.panes[c].auditName = ''
        this.panes[c].createName = ''
        this.panes[c].key = this.panes[c].id
        this.panes[c].payTypeText = this.panes[c].payType == 1 ? '银行转账' : '现金付款'
      }
    },
    onChange(activeKey ){
      console.log(activeKey)
    },
    handleCancel(){
      this.visible = false
    },
    handlePrint(){
      let that = this
      httpAction(this.url.getPrintCount,{'fromId':this.model.id,'fromType':3},"POST").then((res) => {
        if(res.code == 200){
          if(res.data >= 1){
            this.$confirm({
              title: '是否再次打印',
              content: '该表单已打印,需要继续吗',
              onOk() {
                let routeData = that.$router.resolve({
                  path: "/pdf/diyonepause",
                  query: {id:that.model.id,count:res.data},
                });
                window.open(routeData.href, '_blank')
              },
              onCancel() {},
            });
          }else{
            let routeData = that.$router.resolve({
              path: "/pdf/diyonepause",
              query: {id:that.model.id,count:res.data},
            });
            window.open(routeData.href, '_blank')
          }
        }
      })
      
    },
    // 导出
    handleDownload(){
      let auditName = ''
      let createName = ''
      let revenueName = ''
      if(this.model.chargeUser){
        createName = this.employData[this.model.chargeUser];
      }
      
      var excelDatas = [
      ]
      for(let c in this.coverList){
        this.coverList[c] = this.coverList[c] ? this.coverList[c] : ' '
      }
      for(var d of this.coverList){
        let organName = d.organName ? d.organName : ''
        let bankNo = d.bankNo ? d.bankNo : ''
        let bankName = d.bankName ? d.bankName : ''
        d.reportDate = d.reportDate ?  moment(d.reportDate).format("YYYY/MM/DD") : ""
        let lastTwo = d.itemName.substr(d.itemName.length - 2,2)
        if(lastTwo == "其他"){
          d.itemName = d.itemName.substr(0,d.itemName.length - 2) + "工资"
        }
        let coverData = []
        let remark = d.remark ? d.remark : ''
        if(d.payType == 1){
          coverData = [
              {'company':d.title + '','project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
              {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
              {'company':"Z",'project':d.reportDate,'payType':'部门编码','money':d.settleNo,'no':''},
              {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':''},
              {'company':d.unitName,'project':d.itemName,'payType':'银行转账','money':'¥' + d.money,'no':''},
              {'company':d.settleName,'project':'','payType':'','money':'','no':''},
              {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
              {'company':"收款单位名称:",'project':organName,'payType':'账号:'+bankNo,'money':'开户行:'+bankName,'no':''},
              {'company':"备注:",'project':remark,'payType':'','money':'','no':''},
              {'company':"",'project':'','payType':'','money':'','no':''},
              {'company':"公司领导：          财务负责人:" + revenueName + '            网银审核授权人：          网银转账提交人：' + this.nickname() + '          数据审核人：' + auditName + '       制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
            ]
          }else{
            coverData = [
              {'company':d.title,'project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
              {'company':"现金付款审批单",'project':'','payType':'','money':'','no':''},
              {'company':"Z",'project':d.createDate,'payType':'部门编码','money':d.settleNo,'no':''},
              {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':''},
              {'company':d.unitName ,'project':d.itemName,'payType':'现金转账','money':'¥' + d.money,'no':''},
              {'company':d.settleName,'project':'','payType':'','money':'','no':''},
              {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
              {'company':"",'project':'','payType':'','money':'','no':''},
              {'company':"备注: ",'project':remark,'payType':'','money':'','no':''},
              {'company':"",'project':'','payType':'','money':'','no':''},
              {'company':"公司领导：          财务负责人：" + revenueName + '          出纳会计: ' + '          数据审核人：' + auditName + '          制表人: ' + createName,'project':'','payType':'','money':'','no':''},
            ]
          }
          excelDatas.push({
            tHeader: ["序号", "名字", "描述", "金钱", "地位"],
            filterVal: ["company", "project", "payType", "money",'no'],
            tableDatas:coverData,
            sheetName:'转账封面'
          })
      }
      let excelName = this.model.settleDepartName + "自定义暂停发" + this.model.settleDepartNo
      this.json2excel(excelDatas, excelName, true, "xlsx")
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportOnePage").then(excel => {
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
    }
  }
}
</script>
<style scoped>
.tablePage {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100%;
}
.table1 {
  border: 1px solid #ccc;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 20px;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 th {
  font-weight: normal;
}
.table1 .td1 {
  border: 1px solid #333;
  text-align: center;
  height: 40px;
  padding: 10px;
  width: 17%;
  max-width: 400px;
}
.table1 .td2 {
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  width: 17%;
  text-align: center;
}
.table1 .tit {
  background: #e6f7ff;
  font-weight: bolder;
}
.table1 .input1 {
  height: 35px;
  width: 100%;
  padding: 0 5px;
}
.table1 .btn {
  width: 20%;
  font-size: 16px;
  border: none;
  background: red;
  color: #fff;
  float: right;
}
.table2 {
  text-align: center;
  display: block;
  width: 83%;
  margin: 20px auto 10px;
}
.num {
  margin-top: 20px;
}
.font18 {
  font-size: 18px;
  font-weight: bolder;
}
</style>