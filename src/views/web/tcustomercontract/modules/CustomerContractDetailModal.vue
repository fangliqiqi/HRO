<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="handleCancel"
    wrapClassName="contractModal"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-tabs default-active-key="1" @change="tabChange">
        <a-tab-pane key="1" tab="详情" class="mine">
          <div style="height:500px;">
            <happy-scroll
              color="rgba(23, 22, 22, 0.68)"
              size="5"
              resize
              hide-horizontal
            >
              <a-form :form="form" layout="inline" class="ant-advanced-search-form" style="width:932px;margin-right:15px;">
                <div v-if="model.stopFlag==='1'" class="showReason">
                  <div class="sectionTitle">终止原因</div>
                  <p class="reasonText">{{ model.stopReason.trim() }}</p>
                </div>

                <div class="sectionTitle"><span style="font-weight: bold;margin-right:10px;">合同基本信息</span>
                  <a-tag color="blue" class="tagDiv">{{ typeTitle[model.signingStatus] }}</a-tag>
                  <a-tag color="orange" class="tagDiv">{{ (model.oldCustomerFlag == 0) ? '新客户' : '老客户' }}</a-tag>
                </div>
                <detail-list :col="24" v-if="model.signingStatus == 0 || model.signingStatus == 2 || model.signingStatus == 3">
                  <detail-list-item class="listItem" term="关联合同" >{{ model.parentContractName || '' }} <a-button v-if="model.goOnOaOldData == '1'" @click="handleDetail" type="link">查看</a-button></detail-list-item>
                </detail-list>
                <detail-list :col="24">
                  <detail-list-item class="listItem" term="合同名称" >{{ model.contractName }}</detail-list-item>
                </detail-list>
                <detail-list :col="2">
                  <detail-list-item term="客户单位">
                    {{ model.customerIdText }}
                    <span v-if="model.signingStatus != 5">({{ serviceSideString[Number(model.serviceSide)] }})</span>
                  </detail-list-item>
                  <detail-list-item term="客户类型" v-if="model.signingStatus != 5">{{ getCustomerType(model.customerType) }}</detail-list-item>
                </detail-list>
                <detail-list :col="2" v-if="model.signingStatus != 5">
                  <detail-list-item class="listItem" term="CRM合同编号">{{ model.crmNo }}</detail-list-item>
                  <detail-list-item term="商务主体">{{ model.businessSubjectText }}</detail-list-item>
                </detail-list>
                <detail-list :col="2" v-if="model.signingStatus != 5">
                  <detail-list-item term="起止日期">{{ model.startDate }}~{{ model.endDate }}</detail-list-item>
                  <detail-list-item term="是否续签" v-if="model.signingStatus == 0||model.signingStatus == 2">{{ signingStatusString[Number(model.signingStatus)] }}</detail-list-item>
                </detail-list>
                <detail-list :col="2" v-if="model.signingStatus != 5">
                  <detail-list-item term="用章类型">{{ getChapterType(model.chapterType) }}</detail-list-item>
                  <detail-list-item term="用章单位">{{ model.chapterUnitText }}</detail-list-item>
                </detail-list>
                <detail-list :col="2" v-if="model.signingStatus != 5">
                  <detail-list-item term="客户先行盖章">{{ generalJudge[Number(model.chapterCustomerPre)] }}</detail-list-item>
                  <detail-list-item term="是否外带">{{ generalJudge[Number(model.outWithFlag)] }}</detail-list-item>
                </detail-list>
                <!-- <detail-list :col="1">
                  <detail-list-item term="是否老客户">{{ generalJudge[Number(model.oldCustomerFlag)] }}</detail-list-item>
                </detail-list> -->

                <div class="sectionTitle" v-if="model.signingStatus != 5" style="font-weight:bold;">业务信息</div>
                <detail-list :col="2">
                  <detail-list-item term="合同模板" v-if="model.signingStatus != 5">{{ contractTemplateString[model.contractTemplate] }}</detail-list-item>
                  <detail-list-item
                    term="业务类别"
                  >{{ model.businessTypeText }} / {{ model.businessSubText }}</detail-list-item>
                </detail-list>

                <detail-list :col="2">
                  <detail-list-item term="业务开发人">{{ model.businessDeveloperIdText }}</detail-list-item>
                  <detail-list-item term="开发部门/分公司">{{ model.businessDeveloperOrganName }}</detail-list-item>
                </detail-list>
                <!-- <detail-list :col="2" v-if="model.signingStatus != 5">
                  <detail-list-item term="结算周期">{{ settleCycleString[Number(model.settleCycle)] }}</detail-list-item>
                  <detail-list-item term="费用方式">{{ settleTypeString[Number(model.settleType)] }}</detail-list-item>
                </detail-list> -->
                <detail-list :col="2">
                  <detail-list-item term="收入预估">{{ model.estimatedIncome }}</detail-list-item>
                  <detail-list-item term="合同金额">{{ model.money || ' ' }}</detail-list-item>
                </detail-list>
                <detail-list :col="2">
                  <detail-list-item term="预期归档时间" v-if="model.signingStatus == 4">{{ model.archiveDate || ' ' }}</detail-list-item>
                  <detail-list-item term="服务人数">{{ model.servicePeopleNum || ' ' }}</detail-list-item>
                </detail-list>
                <detail-list :col="1">
                  <detail-list-item term="合同要点">{{ model.remark || ' ' }}</detail-list-item>
                </detail-list>

                <a-row v-if="model.signingStatus != 5">
                  <a-col :span="24">
                    <a-form-item class="stepFormText" label="合同附件">
                      <div class="clearfix">
                        <a-upload
                          listType="picture-card"
                          :fileList="fileList"
                          @preview="handlePreview"
                          :multiple="true"
                          :showUploadList="{ showRemoveIcon: false }"
                          accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.rar,.zip"
                        ></a-upload>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviwCancel">
                          <img alt="example" style="width: 100%" :src="previewImage" />
                        </a-modal>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row v-if="model.signingStatus != 5">
                  <a-col :span="24">
                    <a-form-item class="stepFormText" label="归档附件">
                      <div class="clearfix">
                        <a-upload
                          listType="picture-card"
                          :fileList="fileArchiveList"
                          @preview="handlePreview"
                          :showUploadList="{ showRemoveIcon: false }"
                          accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx"
                        ></a-upload>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </happy-scroll>
          </div>
        </a-tab-pane>
        <a-tab-pane key="5" tab="主合同详情" v-if="Number(model.signingStatus) === 3 && String(model.goOnOaOldData) !== '0'">
          <div style="height:500px;">
            <happy-scroll
              color="rgba(23, 22, 22, 0.68)"
              size="5"
              resize
              hide-horizontal
            >
              <a-form layout="inline" class="ant-advanced-search-form" style="width:1000px">
                <div v-if="mainModel.stopFlag==='1'" class="showReason">
                  <div class="sectionTitle">终止原因</div>
                  <p class="reasonText">{{ mainModel.stopReason.trim() }}</p>
                </div>

                <div class="sectionTitle"><span style="font-weight: bold;margin-right:10px;">合同基本信息</span>
                  <a-tag color="blue">{{ typeTitle[mainModel.signingStatus] }}</a-tag>
                  <a-tag color="orange">{{ (mainModel.oldCustomerFlag == 0) ? '新客户' : '老客户' }}</a-tag>
                </div>
                <detail-list :col="24">
                  <detail-list-item class="listItem" term="合同名称" >{{ mainModel.contractName }}</detail-list-item>
                </detail-list>
                <detail-list :col="2">
                  <detail-list-item term="客户单位">{{ mainModel.customerIdText }}({{ serviceSideString[Number(mainModel.serviceSide)] }})</detail-list-item>
                  <detail-list-item term="客户类型">{{ getCustomerType(mainModel.customerType) }}</detail-list-item>
                </detail-list>
                <detail-list :col="2">
                  <detail-list-item class="listItem" term="CRM合同编号" >{{ mainModel.crmNo }}</detail-list-item>
                  <detail-list-item term="商务主体">{{ mainModel.businessSubjectText }}</detail-list-item>
                </detail-list>
                <detail-list :col="2">
                  <detail-list-item term="起止日期">{{ mainModel.startDate }}~{{ mainModel.endDate }}</detail-list-item>
                </detail-list>
                <detail-list :col="2">
                  <detail-list-item term="用章类型">{{ getChapterType(mainModel.chapterType) }}</detail-list-item>
                  <detail-list-item term="用章单位">{{ mainModel.chapterUnitText }}</detail-list-item>
                </detail-list>
                <detail-list :col="2">
                  <detail-list-item term="客户先行盖章">{{ generalJudge[Number(mainModel.chapterCustomerPre)] }}</detail-list-item>
                  <detail-list-item term="是否外带">{{ generalJudge[Number(mainModel.outWithFlag)] }}</detail-list-item>
                </detail-list>
                <!-- <detail-list :col="1">
                  <detail-list-item term="是否老客户">{{ generalJudge[Number(mainModel.oldCustomerFlag)] }}</detail-list-item>
                </detail-list> -->

                <div class="sectionTitle">业务信息</div>
                <detail-list :col="2">
                  <detail-list-item term="合同模板">{{ contractTemplateString[mainModel.contractTemplate] }}</detail-list-item>
                  <detail-list-item
                    term="业务类别"
                  >{{ mainModel.businessTypeText }} / {{ mainModel.businessSubText }}</detail-list-item>
                </detail-list>

                <detail-list :col="2">
                  <detail-list-item term="业务开发人">{{ mainModel.businessDeveloperIdText }}</detail-list-item>
                  <detail-list-item term="开发部门/分公司">{{ mainModel.businessDeveloperOrganName }}</detail-list-item>
                </detail-list>
                <!-- <detail-list :col="2">
                  <detail-list-item term="结算周期">{{ settleCycleString[Number(mainModel.settleCycle)] }}</detail-list-item>
                  <detail-list-item term="费用方式">{{ settleTypeString[Number(mainModel.settleType)] }}</detail-list-item>
                </detail-list> -->
                <detail-list :col="2">
                  <detail-list-item term="收入预估">{{ mainModel.estimatedIncome }}</detail-list-item>
                  <detail-list-item term="合同金额">{{ mainModel.money || ' ' }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="服务人数">{{ mainModel.servicePeopleNum || ' ' }}</detail-list-item>
                </detail-list>
                <detail-list :col="1">
                  <detail-list-item term="合同要点">{{ mainModel.remark || ' ' }}</detail-list-item>
                </detail-list>

                <a-row>
                  <a-col :span="24">
                    <a-form-item class="stepFormText" label="合同附件">
                      <div class="clearfix">
                        <a-upload
                          listType="picture-card"
                          :fileList="mainModel.fileList"
                          @preview="handlePreview"
                          :multiple="true"
                          :showUploadList="{ showRemoveIcon: false }"
                          accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.rar,.zip"
                        ></a-upload>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">
                    <a-form-item class="stepFormText" label="归档附件">
                      <div class="clearfix">
                        <a-upload
                          listType="picture-card"
                          :fileList="mainModel.fileArchiveList"
                          @preview="handlePreview"
                          :showUploadList="{ showRemoveIcon: false }"
                          accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx"
                        ></a-upload>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </happy-scroll>
          </div>
        </a-tab-pane>
        <a-tab-pane key="6" tab="关联合同" v-if="model.signingStatus != 3 && model.signingStatus != 5">
          <contract-page-list
            :listUrl="listUrl"
            :chapterUnitDicts="chapterUnitDicts"
            :data="{customerBusinessTypeDict:customerBusinessTypeDict,customerBusinessSubTypeDict:customerBusinessSubTypeDict}">
          </contract-page-list>
        </a-tab-pane>
        <a-tab-pane key="2" tab="审批流程抄送记录">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="审核记录">
              <a-timeline class="statusStep">
                <a-timeline-item v-for="(item, index) in recordList.auditInfo" :key="index">
                  <p>
                    <strong>{{ item.nodeName }}</strong>
                  </p>
                  <p>状态：{{ auditFlagArr[item.approvalResult] || '' }}</p>
                  <p>操作人：{{ item.approvalManName }}&nbsp;&nbsp;&nbsp;审核意见：{{ item.approvalOpinion }}</p>
                  <p>操作时间：{{ item.approvalTime }}</p>
                </a-timeline-item>
              </a-timeline>
            </a-tab-pane>
            <a-tab-pane key="2" tab="抄送记录">
              <a-timeline-item v-for="(item, index) in recordList.copyInfo" :key="index">
                <p>
                  <strong>{{ item.nodeName }}</strong>
                </p>
                <p>操作人：{{ item.auditUser }}</p>
                <p>操作时间：{{ item.createTime }}</p>
              </a-timeline-item>
            </a-tab-pane>
            <a-tab-pane key="3" tab="办理归档记录">
              <a-timeline-item v-for="(item, index) in recordList.handInfo" :key="index">
                <p>
                  <strong>{{ item.nodeName }}</strong>
                </p>
                <p>操作人：{{ item.approvalManName }}&nbsp;&nbsp;&nbsp;审核意见：{{ item.approvalOpinion }}</p>
                <p>操作时间：{{ item.approvalTime }}</p>
                <p>
                  {{ new RegExp('办理').test(item.nodeName) ? '快递编号' : '归档编号' }}：{{
                    new RegExp('办理').test(item.nodeName) ? item.expressNo : item.achiveNo
                  }}
                </p>
              </a-timeline-item>
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
        <a-tab-pane key="3" tab="流程进展明细">
          <div v-if="showProcess">
            <VueG6Editor :id="processId" :dataSource="nodeDataSource" :oprator="oprator" ref="G6EditorForm" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="操作记录">
          <a-card style="margin-top: 20px" :bordered="false" title="操作记录">
            <a-table
              :columns="oprateList"
              :dataSource="recordSource"
              :defaultExpandAllRows="true"
              :pagination="ipagination"
              @change="tableChange"
              rowKey="id"
            >
              <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
                {{ record.createTime }} 由 <a-tag color="blue">{{ record.createUserName }}</a-tag
                >编辑<br />
                <span v-for="(item, index) in changeLog(record)" :key="index">
                  修改了<strong>{{ item.name }}</strong
                  >：旧值为：{{ item.oldField }}，新值为：{{ item.newField }}<br />
                </span>
              </p>
            </a-table>
          </a-card>
        </a-tab-pane>
      </a-tabs>
      <contract-detail-modal ref="ContractDetailForm" :chapterUnitDicts="chapterUnitDicts" :data="{customerBusinessTypeDict:customerBusinessTypeDict,organs:organs,sysUsers:businessDeveloper}"/>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getNameFromArr, formateSourceNode, getNameFromTree } from '@/utils/common'
import VueG6Editor from '@/components/g6edit/index'
import DetailList from '@/components/tools/DetailList'
import ContractPageList from './ContractPageList'
import ContractDetailModal from './ContractDetailModal'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

const DetailListItem = DetailList.Item
export default {
  name: 'CustomerContractDetailModal',
  components: { VueG6Editor, DetailList, DetailListItem,ContractPageList,HappyScroll,ContractDetailModal },
  data() {
    return {
      //下面三个是地址信息
      areaTrees: [],
      areaCitys: [],
      areaTowns: [],
      //开发人员信息
      businessDeveloper: [],
      //新增数组，业务细分
      businessType: [],
      title: '操作',
      visible: false,
      treeData: [],
      industryBelongs: [],
      industrySub: [],
      organs: [],
      model: {},
      mainModel: {},
      fileList: [],
      fileArchiveList: [],
      ids: '',
      disabled: true,
      showDisabled: true,
      previewVisible: false,
      previewImage: '',
      fileTypeOfOffice: 'xls,xlsx,doc,docx,ppt,pptx',
      confirmLoading: false,
      form: this.$form.createForm(this),
      recordList: {
        auditInfo: [],
        copyInfo: [],
        handInfo: [],
      },
      showProcess: false,
      //数据字典
      customerContractDict: [],
      customerBusinessTypeDict: [],
      customerBusinessSubTypeDict: [],
      customerOldBusinessSubTypeDict: [],
      customerBusinessSubDicts:[],
      chapterUnitDicts:[],
      chapterUnit:[],
      //网络请求参数
      url: {
        add: '/hrBase/tcustomercontract',
        edit: '/hrBase/tcustomerinfo',
        getCustomerInfo: '/hrBase/tcustomerinfo/',
        getOrgan: '/admin/organizationinfo/getOrgForCus',
        deleteAtta: '/hrBase/mcontractatta/',
        getBusinessSub: '/admin/dict/getByParentId',
      },
      oprateList: [
        {
          title: '操作人',
          dataIndex: 'createUserName',
          width: 60,
          ellipsis: true,
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          width: 170,
          ellipsis: true,
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '操作内容',
          dataIndex: 'differenceInfo',
          width: 250,
          ellipsis: true,
          customRender: (text) => {
            const field = []
            text.split(',').map((item) => {
              if(item==='contractCode'||item==='businessDeveloperOrgan'||item==='contractTerm'){
                return
              }
              field.push(this.fields[item])
            })
            const res = field.join(',')
            return (
              <a-tooltip placement="topLeft" title={res}>
                {res}
              </a-tooltip>
            )
          },
        },
      ],
      recordSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0,
      },
      fields: {
        contractName: '合同名称',
        businessSubject: '商务主体',
        startDate: '合同开始时间',
        endDate: '合同结束时间',
        // contractTerm: '合同有效期',
        businessType: '业务类型',
        businessSub: '业务细分',
        // contractCode: '合同编号',
        customerType: '客户类型',
        prAuditFlag: '状态',
        estimatedIncome: '收入预估',
        remark: '合同要点',
        // 新增字段的更改
        outWithFlag: '是否外带',
        chapterCustomerPre: '客户先行盖章',
        chapterType: '用章类型',
        chapterUnit: '用章单位',
        oldCustomerFlag: '是否老客户',
        customerId: '客户单位',
        money: '合同金额',
        servicePeopleNum: '服务人数',
        signingStatus: '是否续签',
        customerCode: '客户编码',
        crmNo: 'CRM合同编号',
        serviceSide: '服务方',
        businessDeveloperId: '业务开发人',
        businessSubjectName: '开发部门',
        province: '省',
        city: '市',
        town: '县',
        contractTemplate: '合同模板',
        settleCycle: '结算周期',
        settleType: '费用方式',
        archiveDate:'预期归档时间'
      },
      auditFlagArr: ['审核通过', '审核不通过', '待审核', '待提交', '全国业务中心审核', '已办理', '已归档'],
      companyName: ['', '皖信', '柯恩', '易服','昊伦','赤道线'],
      generalJudge: ['否', '是'],
      signingStatusString: ['续签','新签', '重签'],
      serviceSideString: ['', '甲方', '乙方'],
      contractTemplateString: ['', '公司模板无修改', '公司模板有修改', '客户指定', '其他模板'],
      settleCycleString: ['', '月结', '季度结', '半年结', '年结'],
      settleTypeString: ['', '当月结当月费用', '当月结上月费用', '当月结下月费用', '其他'],
      nodeDataSource: {}, // 流程详情
      processId: '', // 流程id
      oprator: -1,
      request: true,
      isUpload: true,
      typeTitle:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'},
      listUrl:'',
    }
  },
  methods: {
    getChapterType(str){
      const chapterTypeString = ['', '合同章', '法人章']
      const arr = str ? str.split(',') : []
      const res = arr.map(item=>{
        return chapterTypeString[item]
      })
      return res.join(',')
    },
    getCustomerType(val){
      const arr = ['集团客户','重点客户','一般客户','电信客户']
      return arr[val]
    },
    // 根据字典数据 翻译字典
    filterDicts(dictOptions, nums) {
      const arr = nums?nums.split(","):[] 
      const resArr = []
      arr.map(item=>{
        const res = dictOptions.find(items => items.value == item)
        if(res){
          resArr.push(res.label)
        }
      })
      return resArr.join(',')
    },
    // 业务细分的记录字符串转化为具体的业务，具体在详情页的操作记录中
    getAreaInfo(jobArray, arrayString, id, target) {
      return arrayString
        .split(',')
        .map((val) => {
          return getNameFromArr(jobArray, val, id, target)
        })
        .toString()
    },
    changeLog(record) {
      const arr = []
      function indexToString(index, stringArray) {
        switch (index) {
          case undefined:
            return '空'
          case null:
            return '空'
          case '':
            return '空'
          default:
            return stringArray[Number(index)]
        }
      }
      const that=this
      if (record.differenceInfo) {
        const oldInfo = JSON.parse(record.oldInfo)
        const newInfo = JSON.parse(record.newInfo)
        record.differenceInfo.split(',').map((item) => {
          // 正则匹配v-decorator取值
          switch (item) {
            case 'estimatedIncome':
              arr.push({
                name: this.fields[item],
                oldField: oldInfo.estimatedIncome,
                newField: newInfo.estimatedIncome,
              })
              break
            case 'remark':
              arr.push({
                name: this.fields[item],
                oldField: oldInfo.remark,
                newField: newInfo.remark,
              })
              break
            case 'endDate':
              arr.push({
                name: this.fields[item],
                oldField: oldInfo.endDate,
                newField: newInfo.endDate,
              })
              break
            case 'startDate':
              arr.push({
                name: this.fields[item],
                oldField: oldInfo.startDate,
                newField: newInfo.startDate,
              })
              break
            case 'businessSubjectName':
              arr.push({
                name: this.fields[item],
                oldField: oldInfo.businessSubjectName,
                newField: newInfo.businessSubjectName,
              })
              break
            case 'crmNo':
              arr.push({
                name: this.fields[item],
                oldField: oldInfo.crmNo,
                newField: newInfo.crmNo,
              })
              break
            case 'businessSubject':
              arr.push({
                name: this.fields[item],
                oldField: getNameFromArr(this.organs, oldInfo.businessSubject, 'id', 'organName'),
                newField: getNameFromArr(this.organs, newInfo.businessSubject, 'id', 'organName'),
              })
              break
            case 'signingStatus':
              arr.push({
                name: this.fields[item],
                oldField: indexToString(oldInfo.signingStatus, that.signingStatusString),
                newField: indexToString(newInfo.signingStatus, that.signingStatusString),
              })
              break
            case 'serviceSide':
              arr.push({
                name: this.fields[item],
                oldField: indexToString(oldInfo.serviceSide, that.serviceSideString),
                newField: indexToString(newInfo.serviceSide, that.serviceSideString),
              })
              break
            case 'oldCustomerFlag':
              arr.push({
                name: this.fields[item],
                oldField: indexToString(oldInfo.oldCustomerFlag, that.generalJudge),
                newField: indexToString(newInfo.oldCustomerFlag, that.generalJudge),
              })
              break
            case 'chapterType':
              arr.push({
                name: this.fields[item],
                oldField: this.getChapterType(oldInfo.chapterType),
                newField: this.getChapterType(newInfo.chapterType),
              })
              break
            case 'chapterUnit':
              arr.push({
                name: this.fields[item],
                oldField: this.GLOBAL_CONST['companyChapterType'][oldInfo.chapterUnit],
                newField: this.GLOBAL_CONST['companyChapterType'][newInfo.chapterUnit],
              })
              break
            case 'chapterCustomerPre':
              arr.push({
                name: this.fields[item],
                oldField: indexToString(oldInfo.chapterCustomerPre, that.generalJudge),
                newField: indexToString(newInfo.chapterCustomerPre, that.generalJudge),
              })
              break
            case 'outWithFlag':
              arr.push({
                name: this.fields[item],
                oldField: indexToString(oldInfo.outWithFlag, that.generalJudge),
                newField: indexToString(newInfo.outWithFlag, that.generalJudge),
              })
              break
            case 'businessDeveloperId':
              arr.push({
                name: this.fields[item],
                oldField: getNameFromArr(this.businessDeveloper, oldInfo.businessDeveloperId, 'user_id', 'nickname'),
                newField: getNameFromArr(this.businessDeveloper, newInfo.businessDeveloperId, 'user_id', 'nickname'),
              })
              break
            case 'businessType':
              arr.push({
                name: this.fields[item],
                oldField: getNameFromArr(this.customerBusinessTypeDict, oldInfo.businessType, 'id', 'label'),
                newField: getNameFromArr(this.customerBusinessTypeDict, newInfo.businessType, 'id', 'label'),
              })
              break
            case 'businessSub':
              arr.push({
                name: this.fields[item],
                oldField: getNameFromArr(this.customerBusinessSubDicts, oldInfo.businessSub, 'id', 'label'),
                newField: getNameFromArr(this.customerBusinessSubDicts, newInfo.businessSub, 'id', 'label'),
              })
              break
            case 'prAuditFlag':
              arr.push({
                name: this.fields[item],
                oldField: this.auditFlagArr[oldInfo.prAuditFlag],
                newField: this.auditFlagArr[newInfo.prAuditFlag],
              })
              break
            case 'customerType':
              arr.push({
                name: this.fields[item],
                oldField: this.customerTypeArr[oldInfo.customerType],
                newField: this.customerTypeArr[newInfo.customerType],
              })
              break
            case 'contractTemplate':
              arr.push({
                name: this.fields[item],
                oldField: indexToString(oldInfo.contractTemplate, that.contractTemplateString),
                newField: indexToString(newInfo.contractTemplate, that.contractTemplateString),
              })
              break
            case 'settleCycle': {
              arr.push({
                name: this.fields[item],
                oldField: indexToString(oldInfo.settleCycle, that.settleCycleString),
                newField: indexToString(newInfo.settleCycle, that.settleCycleString),
              })
              break
            }
            case 'settleType':
              arr.push({
                name: this.fields[item],
                oldField: indexToString(oldInfo.settleType, that.settleTypeString),
                newField: indexToString(newInfo.settleType, that.settleTypeString),
              })
              break
            default:
              // arr.push({
              //   name: this.fields[item],
              //   oldField: oldInfo[item] || '空',
              //   newField: newInfo[item] || '空',
              // })
              break
          }
        })
      }
      return arr
    },
    getPageDate(current, size) {
      httpAction(
        `/hrBase/lupdaterecord/page?modul=1&domainId=${this.model.id}&current=${current}&size=${size}`,
        null,
        'get'
      ).then((res) => {
        if (res.code === 200 && res.data) {
          this.recordSource = res.data.records
          this.ipagination.total = res.data.total
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    tableChange(pagination) {
      //分页、排序、筛选变化时触发
      this.ipagination = pagination
      this.getPageDate(pagination.current, pagination.pageSize)
    },
    // eslint-disable-next-line no-unused-vars
    handlePreviwCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      const fileExt = file.name.replace(/.+\./, '')
      const reg = new RegExp(fileExt, 'gi')
      if (reg.test(this.fileTypeOfOffice)) {
        this.previewVisible = false
        window.open(
          `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`,
          '_blank'
        )
      } else if (/(pdf|zip|rar)/gi.test(fileExt)) {
        window.open(file.url || file.thumbUrl, '_blank')
      } else {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      }
    },
    handleDetail(){
      this.$refs.ContractDetailForm.show(this.model.parentContractId)
    },
    
    /**
     * 客户合同详情
     */
    async show(record) {
      this.model = Object.assign({parentContractName:'',chapterUnitText:'',businessSubText:'',businessTypeText:'',businessDeveloperIdText:''}, record)
      const arr = this.customerBusinessTypeDict.filter(item=>String(item.id) === this.model.businessType)
      this.customerBusinessSubTypeDict = arr[0] ? arr[0]['children'] : []
      await this.getCustomerName(this.model.customerId)
      // 判断是否是续签OA老合同：0是 1不是
      if(String(record.goOnOaOldData) === '0'){
        this.model.parentContractName = record.parentContractId
      }else {
        await this.getContractName(record)
      }
      this.listUrl = `/hrBase/tcustomercontract/page?selectType=0&firstContractId=${this.model.firstContractId}&id=${this.model.id}`

      this.visible = true
      this.showDisabled = true
      // this.model.customerIdText = getNameFromTree(this.treeData, this.model.customerId, 'value', 'title')
      this.model.businessTypeText = getNameFromArr(this.customerBusinessTypeDict,this.model.businessType,'id','label')
      this.model.businessDeveloperIdText = this.model.businessDeveloperId
      this.model.businessSubjectText = getNameFromArr(this.organs, this.model.businessSubject, 'id', 'organName')
      // 业务类别
      this.model.businessSubText = getNameFromArr(this.customerBusinessSubTypeDict,this.model.businessSub,'id','label')
      // this.model.businessDeveloperOrgan = getNameFromArr(this.organs,this.model.businessDeveloperOrgan,'id','organName')
      // this.model.chapterUnitText = this.GLOBAL_CONST['companyChapterType'][this.model.chapterUnit]
      this.model.chapterUnitText = this.filterDicts(this.chapterUnit,this.model.chapterUnit)
      if (this.model.province) {
        this.areaCitys = this.areaTrees[parseInt(this.model.province) - 1].children
        for (let index = 0; index < this.areaCitys.length; index++) {
          if (Number(this.areaCitys[index].id) === Number(this.model.city)) {
            this.areaTowns = this.areaCitys[index].children
            break
          }
        }
      }
      this.fileList = this.model.fileList || []
      this.fileArchiveList = this.model.fileArchiveList || []
      httpAction(`/hrBase/lupdaterecord/page?modul=1&domainId=${this.model.id}`, null, 'get').then((res) => {
        if (Number(res.code) === 200) {
          this.recordSource = res.data.records
        }
      })
    },
    async getCustomerName(id){
      httpAction(`/hrBase/tcustomerinfo/${id}`, null, 'get').then((res) => {
        if (res.code === 200 && res.data) {
          this.model.customerIdText = res.data.customerName
        }
      })
    },
    async getContractName(record){
      const _this = this
      if(record.signingStatus === '0' || record.signingStatus === '3' || record.signingStatus === '2'){
        httpAction(`/hrBase/tcustomercontract/${record.parentContractId}`, null, 'get').then((res) => {
          if (res.code === 200 && res.data) {
            _this.model.parentContractName = res.data.contractName
          }
        })
      }
    },
    getBusinessSubData(value) {
      httpAction(`${this.url.getBusinessSub}?parentId=${value}`, null, 'get').then((res) => {
        if (res.code === 200) {
          this.customerOldBusinessSubTypeDict = res.data
        }
      })
    },
    tabChange(key) {
      if (key === '2' && this.request) {
        httpAction(`/hrBase/tcustomercontract/getNewAllAuditInfo/${this.model.id}`, null, 'get')
          .then((res) => {
            if (Number(res.code) === 200) {
              this.recordList = res.data
            } else {
              this.$message.warning(res.msg)
            }
          }).finally(() => {
            this.request = false
          })
      }
      if (key === '3' && !this.showProcess) {
        this.processDetail()
      }
      if(key === '5' && Object.keys(this.mainModel).length === 0){
        httpAction(`/hrBase/tcustomercontract/${this.model.parentContractId}`,null,'get').then(res=>{
          if(res.code === 200 && res.data){
            this.mainModel = res.data
            this.mainModel.businessSubjectText = getNameFromArr(this.organs, this.mainModel.businessSubject, 'id', 'organName')
            this.mainModel.customerIdText = getNameFromTree(this.treeData, this.mainModel.customerId, 'value', 'title')
            this.mainModel.businessTypeText = getNameFromArr(this.customerBusinessTypeDict,this.mainModel.businessType,'id','label')
            this.mainModel.businessDeveloperIdText = getNameFromArr(this.businessDeveloper, this.mainModel.businessDeveloperId, 'user_id', 'nickname')
            // this.mainModel.chapterUnitText = this.GLOBAL_CONST['companyChapterType'][this.mainModel.chapterUnit]
            this.model.chapterUnitText = this.filterDicts(this.chapterUnit,this.mainModel.chapterUnit)
            // 业务类别
            const arr = this.customerBusinessTypeDict.filter(item=>String(item.id) === this.mainModel.businessType)
            this.customerBusinessSubTypeDict = arr[0] ? arr[0]['children'] : []
            this.mainModel.businessSubText = getNameFromArr(this.customerBusinessSubTypeDict,this.mainModel.businessSub,'id','label')
            // this.mainModel.businessDeveloperOrgan = getNameFromArr(this.organs,this.mainModel.businessDeveloperOrgan,'id','organName')
          }
        })
      }
    },
    processDetail() {
      this.confirmLoading = true
      httpAction(
        `hrBase/tauditnodeproocess/getNodeProocess/byadvancePaymentId?contractId=${this.model.id}`,
        null,
        'get'
      )
        .then((res) => {
          if (Number(res.code) === 200) {
            // 获取主流程id
            if (res.data.length) {
              httpAction(`/process/tprocess/getProcessVoById?id=${res.data[0]['processId']}`, null, 'get')
                .then((result) => {
                  if (result.code === 200) {
                    this.nodeDataSource = formateSourceNode(result.data, res.data[0]['processId'])
                  }
                })
                .finally(() => {
                  this.showProcess = true
                })
            }
          } else {
            this.$message.warning(res.msg)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    /**
     * 获取系统单位组织架构信息
     */
    loadOrgans() {
      httpAction(this.url.getOrgan, '', 'GET').then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.organs = res.data
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.form.resetFields()
      this.$emit('close')
      this.visible = false
      this.disableSubmit = this.showProcess = false
      this.treeData = []
      this.mainModel = this.model = {}
      this.industryBelongs = []
      this.customerBusinessSubTypeDict = this.customerOldBusinessSubTypeDict = this.fileArchiveList = []
      this.request = true
    },

  },
  created() {
    initDictOptions('customer_business_sub_type').then((res) => {
        if (res.code === 200) {
          this.customerBusinessSubDicts = res.data
        }
      }),
      // 字典获取用章单位
      initDictOptions('chapter_unit').then((res) => {
        if (res.code === 200) {
          this.chapterUnit = res.data
        }
      })

  },
}
</script>

<style lang="less" scoped>
.mine {
    /deep/ .detail-list{
    .term{
      min-width: 120px;
    }
  }
}
.tagDiv{
  vertical-align: text-bottom;
}
.showText {
  font-weight: 400;
}

.showReason {
  display: flex;
  flex-direction: row;
}
.reasonText {
  margin-left: 30px;
  font-size: 18px;
  font-weight: 450;
}
.stepFormText {
  display: flex;
  :global(.ant-form-item-label) {
    width: 150px;
    text-align: left;
  }
}
.sectionTitle {
  font-size: 18px;
  margin: 8px 0 20px;
  white-space: nowrap;
}
</style>

