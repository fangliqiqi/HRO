<template>
  <a-modal
    title="确认出账"
    :width="1200"
    placement="right"
    :closable="false"
    :visible="visible"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
      <!-- <router-link
        target="_blank"
        :to="{path:'/pdf/salaryFail',query:{id:model.id}}"
        style="margin-left:5px;margin-right:5px"
      >
        <a-button type="primary">打印封面</a-button>
      </router-link> -->
      <a-button
        type="primary"
        @click="handlePrint"
      >表单打印</a-button>
      <a-button
        type="primary"
        @click="handleDownload"
      >导出</a-button>
      <a-button
        type="primary"
        @click="handleOutSuccess"
      >发放成功</a-button>
      <a-button
        type="primary"
        @click="handleOutFail"
        style="background:red;border:red"
      >退回</a-button>
    </template>
    <a-card
      :bordered="false"
      style="background:#f5f5f5"
    >
      <a-tabs
        :activeKey="activeKey"
        @change="changeTab"
      >
        <a-tab-pane
          tab="报账表"
          key="1"
        >
          <a-button
            type="primary"
            class="tag-read"
            :data-clipboard-text="copyText"
            @click="hancleCopy"
          >复制</a-button>
          <a-form>
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="收款单位:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <span>{{ lostInfo.orgName || '-' }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="开户行:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <span>{{ lostInfo.bankName || '-' }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="银行账号:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <span>{{ lostInfo.bankNo || '-' }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="发放金额:"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <span>{{ lostInfo.money }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <template v-if="lostInfo.adjustmentType == 0">
              <a-divider />
              <a-row>
                <a-col :span="24">
                  <a-form-item
                    label="换人换卡证明"
                    class="stepFormText"
                  >
                    <div class="file-list" style="width: 900px;">
                      <a-upload
                        :fileList="fileArr"
                        list-type="picture-card"
                        :showUploadList="{showRemoveIcon:false}"
                      >
                      </a-upload>
                    </div>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item
                    label="调整明细"
                    class="stepFormText"
                  >
                    <a-table :columns="columns" rowKey="id" :pagination="false" :data-source="dataSource" style="width:900px">
                    </a-table>
                  </a-form-item>
                </a-col>
              </a-row>
            </template>
            
          </a-form>
        </a-tab-pane>
        <a-tab-pane
          tab="封面"
          key="2"
          :forceRender="true"
        >
          <salary-fail-page-modal
            ref="salaryFailPageModal"
            :coverList="coverList"
            :lostInfo="lostInfo"
          ></salary-fail-page-modal>
        </a-tab-pane>
        <a-tab-pane
          tab="发放失败记录"
          key="3"
          :forceRender="true"
        >
          <salary-fail-record-model
            ref="salaryFailRecordModal"
            :fileList="fileList"
            :modelInfo="model"
          >
          </salary-fail-record-model>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-modal>
</template>
<script>
import Clipboard from 'clipboard'
import SalaryFailPageModal from "./SalaryFailPageModal"
import SalaryFailRecordModel from "./SalaryFailRecordModel"
import { httpAction } from '@/api/manage'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: "DiySalaryFailModel",
  components: {
    SalaryFailPageModal,
    SalaryFailRecordModel
  },
  data(){
    return{
      visible: false,
      activeKey:'1',
      lostInfo:{},
      coverList:[],
      fileList:[],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      url:{
        openBilling: "salary/lostandfoundinfo/openBilling",
        doIssueSuccess:"salary/lostandfoundinfo/doIssueSuccess",
        doIssueFail:"salary/lostandfoundinfo/doIssueFail",
        getPrintCount:"/salary/tprintrecord/getPrintCount",
      },
      model:{},
      copyText:"",
      fileArr: [],
      dataSource: [],
      columns: [
        {
          ellipsis: true,
          title: '信息项',
          align: 'center',
          dataIndex: 'fileName',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          ellipsis: true,
          title: '变更前',
          align: 'center',
          dataIndex: 'beforeMod',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        },
        {
          // width: 100,
          ellipsis: true,
          title: '变更后',
          align: 'center',
          dataIndex: 'afterMod',
          customRender: text => {
            const resultText = text || '-'
            return <a-tooltip title={resultText}>{resultText}</a-tooltip>
          }
        }
      ],
    }
  },
  props: {
    bankOptions:{
      type:Array,
      required:true
    }
  },
  methods:{
    ...mapGetters(["nickname", "avatar","userInfo"]),
    async show(record){
      this.coverList = []
      this.model = Object.assign({}, record)
      httpAction(this.url.openBilling + '?lostAndFoundInfoId=' + record.id, {}, 'POST').then((res) => {
        if(res.code == 200){
          this.activeKey = '1'
          this.visible = true
          this.lostInfo = res.data.lost
          this.copyText = this.lostInfo.orgName + " " + this.lostInfo.money + " " +  this.lostInfo.bankNo
          if(filterDictText(this.bankOptions, this.lostInfo.bankName) != '-'){
            this.lostInfo.bankName = filterDictText(this.bankOptions, this.lostInfo.bankName)
          }
          if(res.data.cover){
            this.coverList.push(res.data.cover)
          }
        }else{
          this.$message.error(res.msg)
        }
      })
      // 获取失败记录图
      this.fileList = []
      const fileRes = await httpAction(`/salary/tsalaryatta/getTSalaryAttaListByIdType?linkId=${this.model.id}&linkType=7`,null,'get')
      if(fileRes.code==200){
        fileRes.data.map(item=>{
          this.fileList.push({
            uid: item.id,
            name: item.attaName,
            status: 'done',
            url: item.attaUrl,
            id:item.linkId
          })
        })
      }
      // 换人换卡证明
      const result = await httpAction(`/salary/tsalaryatta/getTSalaryAttaListByIdType?linkId=${this.model.id}&linkType=10`,null,'get');
      if(result.code === 200){
        this.fileArr = result.data.map(item=>{
          return {
            uid: item.id,
            name: item.attaName,
            status: 'done',
            url: item.attaUrl,
          }
        })
      }else{
        this.$message.warning(result.msg);
      }
      // 调整明细
      const listRes = await httpAction(`/salary/tpacchangelog/${this.model.id}`,null,'get');
      if(listRes.code === 200){
        this.dataSource = listRes.data;
      }else{
        this.$message.warning(listRes.msg);
      }
    },
    close(){
      this.visible = false
      this.coverList = []
      this.fileArr = []
      this.dataSource = []
    },
    handleCancel(){
      this.close()
    },
    handlePrint(){
      let that = this
      // 数据
      if(this.coverList.length==0){
        that.$message.error("暂无数据打印")
      }else{
        httpAction(this.url.getPrintCount,{'fromId':this.model.id,'fromType':4},"POST").then((res) => {
          if(res.code == 200){
            if(res.data >= 1){
              this.$confirm({
                title: '是否再次打印',
                content: '该表单已打印,需要继续吗',
                onOk() {
                  let routeData = that.$router.resolve({
                    path: "/pdf/salaryFail",
                    query: {id:that.model.id,count:res.data},
                  });
                  window.open(routeData.href, '_blank')
                },
                onCancel() {},
              });
            }else{
              let routeData = that.$router.resolve({
                path: "/pdf/salaryFail",
                query: {id:that.model.id,count:res.data},
              });
              window.open(routeData.href, '_blank')
            }
          }
        })
      }
    },
    handleDownload(){
      let auditName = ''
      let createName = ''
      let revenueName = ''
      var excelDatas = [
        {
          tHeader: ["收款单位", "身份证号", "开户行","银行账号", "发放金额"],
          filterVal: ['orgName','empIdcard', "bankName", "bankNo","money"],
          tableDatas: [{
            'orgName':this.lostInfo.orgName,'empIdcard':this.lostInfo.empIdcard,'bankName':this.lostInfo.bankName,
            'bankNo':this.lostInfo.bankNo,'money':this.lostInfo.money
          }],
          sheetName: "报账表"
        },
      ]
      for(var d of this.coverList){
        d.createDate = d.createDate ?  moment(d.createDate).format("YYYY/MM/DD") : ""
        console.log(this.coverList);
        let coverData = [
          {'company':d.title,'project':'','payType':'','money':'','no':`附件${this.coverList.length}张`},
          {'company':"银行转账审批单",'project':'','payType':'','money':'','no':''},
          {'company':"S",'project':d.createDate,'payType':'部门编码','money':d.settleDepartNo,'no':''},
          {'company':"单位",'project':'项目','payType':'付款方式','money':'金额','no':'附件张'},
          {'company':d.unitName,'project':d.settlementMonth + '工资','payType':'银行转账','money':'¥' + d.money,'no':''},
          {'company':d.settleDepartName,'project':'','payType':'','money':'','no':''},
          {'company':"合计人民币:",'project':d.chmoney,'payType':'','money':'¥' + d.money,'no':''},
          {'company':"备注:",'project':'','payType':'','money':'','no':''},
          {'company':"收款单位名称:" + d.organName + "        账号:" + d.bankNo + "        开户行:" + d.bankName,'project':'','payType':'','money':'','no':''},
          {'company':"公司领导:        财务负责人:" + revenueName + '        网银审核授权人：        网银转账提交人：' + this.nickname() + '：        数据审核人：' + auditName + '        制表人:' + createName,'project':'' ,'payType': '','money':'','no':''},
        ]
        excelDatas.push({
          tHeader: ["序号", "名字", "描述", "金钱", "地位"],
          filterVal: ["company", "project", "payType", "money",'no'],
          tableDatas:coverData,
          sheetName:'转账封面'
        })
      }
      this.json2excel(excelDatas, "发放失败出账", true, "xlsx")
    },
    json2excel(tableJson, filenames, autowidth, bookTypes){
      var that = this
      //这个是引用插件
      import("@/vendor/ExportSalaryFail").then(excel => {
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
    // 出账成功
    handleOutSuccess(){
      let that = this
      this.$confirm({
          title: '确认出账成功',
          content: '确认出账成功?',
          onOk() {
            httpAction(that.url.doIssueSuccess,that.lostInfo,'POST').then((res) => {
              if(res.code == 200){
                that.close()
                that.$emit('ok')
                that.$message.success("出账成功")
              }else{
                that.$message.error(res.msg)
              }
            })
          },
          onCancel() {},
        });
    },
    // 出账失败
    handleOutFail(){
      let that = this
      const formData = new FormData();
      formData.append(`id`,this.lostInfo.id);
      formData.append(`reason`,'');
      formData.append(`flag`,'0');
      this.fileList.forEach(item=>{
        formData.append(`files`,item);
      })
      this.$confirm({
          title: '确认出账失败',
          content: '确认出账失败?',
          onOk() {
            httpAction(that.url.doIssueFail,formData,'POST').then((res) => {
              if(res.code == 200){
                that.close()
                that.$emit('ok')
                that.$message.success("出账失败成功")
              }else{
                that.$message.error(res.msg)
              }
            })
          },
          onCancel() {},
        });
    },
    changeTab(key){
      this.activeKey = key
      if(key == 2){
        this.$refs.salaryFailPageModal.show()
      }
    },
    hancleCopy(){
      var clipboard = new Clipboard('.tag-read')
      // eslint-disable-next-line
      clipboard.on('success', e => {
        clipboard.destroy()
        this.$message.success("复制成功")
      })
      // eslint-disable-next-line
      clipboard.on('error', e => {
        // 释放内存
        clipboard.destroy()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-form-item{
    margin-bottom: 0px;
  }
  .stepFormText{
    text-align: right;
    display: flex;
    width: 100%;
    margin-left: 85px;
    :global(.ant-form-item-label){
      width: 100px;
    }
  }
  
</style>
