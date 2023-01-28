<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :closable="false"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <a-button key="audit" type="primary" @click="handleAudit">审核</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-tabs default-active-key="1" @change="tabChange">
        <a-tab-pane key="1" tab="详情">
          <div style="height:500px;">
            <happy-scroll
              color="rgba(23, 22, 22, 0.68)"
              size="5"
              resize
              hide-horizontal
            >
              <a-form :form="form" layout="inline" class="ant-advanced-search-form" style="width:1000px">
                <div class="sectionTitle"><span style="font-weight: bold;margin-right:10px;">合同基本信息</span>
                  <a-tag color="blue">{{ typeTitle[model.signingStatus] }}</a-tag>
                  <a-tag color="orange">{{ (model.oldCustomerFlag == 0) ? '新客户' : '老客户' }}</a-tag>
                </div>
                <detail-list :col="24" v-if="model.signingStatus == 0 || model.signingStatus == 2 || model.signingStatus == 3">
                  <detail-list-item class="listItem" term="关联合同" >{{ model.parentContractName || '' }} <a-button v-if="model.goOnOaOldData == '1'" @click="handleDetail" type="link">查看</a-button></detail-list-item>
                </detail-list>
                <detail-list :col="24">
                  <detail-list-item term="合同名称">{{ model.contractName }}</detail-list-item>
                </detail-list>
                <detail-list :col="2">
                  <detail-list-item term="客户单位">{{ model.customerName }}({{ serviceSideString[Number(model.serviceSide)] }})</detail-list-item>
                  <detail-list-item term="客户类型" v-if="model.signingStatus != 5">{{ getCustomerType(model.customerType) }}</detail-list-item>
                </detail-list>
                <detail-list :col="2" v-if="model.signingStatus != 5">
                  <detail-list-item class="listItem" term="CRM合同编号" >{{ model.crmNo }}</detail-list-item>
                  <detail-list-item term="商务主体">{{ model.businessSubjectText }}</detail-list-item>
                </detail-list>
                <detail-list :col="2" v-if="model.signingStatus != 5">
                  <detail-list-item term="起止日期">{{ model.startDate }}--{{ model.endDate }}</detail-list-item>
                  <detail-list-item term="是否续签" v-if="model.signingStatus == 0||model.signingStatus == 2">{{ signingStatusString[Number(model.signingStatus)] }}</detail-list-item>
                </detail-list>
                <detail-list :col="2" v-if="model.signingStatus != 5">
                  <detail-list-item term="用章类型">{{ getChapterType(model.chapterType) }}</detail-list-item>
                  <detail-list-item term="用章单位">{{ model.chapterUnitTxt }}</detail-list-item>
                </detail-list>
                <detail-list :col="2" v-if="model.signingStatus != 5">
                  <detail-list-item term="客户先行盖章">{{ generalJudge[Number(model.chapterCustomerPre)] }}</detail-list-item>
                  <detail-list-item term="是否外带">{{ generalJudge[Number(model.outWithFlag)] }}</detail-list-item>
                </detail-list>

                <div class="sectionTitle" v-if="model.signingStatus != 5">业务信息</div>
                <detail-list :col="2">
                  <detail-list-item term="合同模板" v-if="model.signingStatus != 5">{{ contractTemplateString[model.contractTemplate] }}</detail-list-item>
                  <detail-list-item term="业务类别">{{ model.businessTypeText }} / {{ model.businessSubText }}</detail-list-item>
                </detail-list>

                <detail-list :col="2">
                  <detail-list-item term="业务开发人">{{ model.businessDeveloperIdText }}</detail-list-item>
                  <detail-list-item term="开发部门/分公司">{{ model.businessDeveloperOrganText }}</detail-list-item>
                </detail-list>
                <!-- <detail-list :col="2">
                  <detail-list-item term="结算周期">{{ settleCycleString[Number(model.settleCycle)] }}</detail-list-item>
                  <detail-list-item term="费用方式">{{ settleTypeString[Number(model.settleType)] }}</detail-list-item>
                </detail-list> -->
                <detail-list :col="2">
                  <detail-list-item term="收入预估">{{ model.estimatedIncome }}</detail-list-item>
                  <detail-list-item term="合同金额">{{ model.money || ' ' }}</detail-list-item>
                </detail-list>
                <detail-list>
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
                          accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx,.rar,.zip"
                        ></a-upload>
                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </happy-scroll>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="审批流程抄送记录">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="审核记录">
              <a-timeline class="statusStep">
                <a-timeline-item v-for="(item, index) in recordList.auditInfo" :key="index">
                  <p>
                    <strong>{{ item.nodeName }}</strong>
                  </p>
                  <p>状态：{{ statusOption[item.approvalResult] || '' }}</p>
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
            <a-tab-pane key="3" tab="办理记录">
              <a-timeline-item v-for="(item, index) in recordList.handInfo" :key="index">
                <p>
                  <strong>{{ item.nodeName }}</strong>
                </p>
                <p>状态：{{ statusOption[item.approvalResult] || '' }}</p>
                <p>操作人：{{ item.approvalManName }}&nbsp;&nbsp;&nbsp;审核意见：{{ item.approvalOpinion }}</p>
                <p>操作时间：{{ item.approvalTime }}</p>
              </a-timeline-item>
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
        <a-tab-pane key="3" tab="流程进展明细">
          <div v-if="showProcess">
            <VueG6Editor :id="processId" :dataSource="nodeDataSource" :oprator="oprator" ref="G6EditorForm" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-spin>

    <contract-audit-modal ref="auditModal" @ok="auditModalOk"></contract-audit-modal>
    <contract-detail-modal ref="ContractDetailForm" :chapterUnitDicts="chapterUnitDicts" :data="{customerBusinessTypeDict:customerBusinessTypeDict,organs:organs,sysUsers:businessDeveloper}"/>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getNameFromArr, formateSourceNode } from '@/utils/common'
import pick from 'lodash.pick'
import moment from 'moment'
import ContractAuditModal from '../../tcustomercontract/modules/ContractAuditModal'
import ContractDetailModal from './ContractDetailModal'
import VueG6Editor from '@/components/g6edit/index'
import DetailList from '@/components/tools/DetailList'
import { HappyScroll } from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'

const DetailListItem = DetailList.Item
export default {
  name: 'CustomerContractAuditModal',
  components: { ContractAuditModal, VueG6Editor, DetailList, DetailListItem,HappyScroll,ContractDetailModal },
  data() {
    return {
      title: '操作',
      visible: false,
      treeData: [],
      industryBelongs: [],
      industrySub: [],
      organs: [],
      model: {},
      fileList: [],
      fileArchiveList: [],
      businessDeveloper: [],
      areaTrees: [],
      areaCitys: [],
      areaTowns: [],
      ids: '',
      disabled: true,
      showDisabled: true,
      request: true,
      previewVisible: false,
      previewImage: '',
      fileTypeOfOffice: 'xls,xlsx,doc,docx,ppt,pptx',
      confirmLoading: false,
      showProcess: false,
      form: this.$form.createForm(this),
      //数据字典
      customerContractDict: [],
      customerBusinessTypeDict: [],
      customerBusinessSubTypeDict: [],
      chapterUnitDicts: [],
      url: {
        getBusinessSub: '/admin/dict/getByParentId',
      },
      recordList: {
        auditInfo: [],
        copyInfo: [],
        handInfo: [],
      },
      statusOption: {
        0: '审核通过',
        1: '审核不通过',
        3: '提交',
        5: '已办理',
        6: '已归档',
      },
      validatorRules: {
        customerId: { rules: [{ required: true, message: '请选择所属客户!' }] },
        customerCode: { rules: [{ required: true, message: '请选填写客户编码!' }] },
        contractName: { rules: [{ required: true, message: '请填写合同名称!' }] },
        contractCode: { rules: [{ required: true, message: '请填写合同编号!' }] },
        businessSubject: { rules: [{ required: true, message: '请选择商务主体!' }] },
        contractType: { rules: [{ required: true, message: '请选择合同类型!' }] },
        startDate: { rules: [{ required: true, message: '请选择合同生效时间!' }] },
        endDate: { rules: [{ required: true, message: '请选择合同失效时间!' }] },
        businessType: { rules: [{ required: true, message: '请选择业务类型!' }] },
        businessSub: { rules: [{ required: true, message: '请选择业务细分!' }] },
        signingStatus: { rules: [{ required: true, message: '请选择合同签订类型!' }] },
      },
      auditFlagArr: ['审核通过', '审核不通过', '待审核', '待提交', '全国业务中心审核', '已办理', '已归档'],
      companyName: ['', '皖信', '柯恩', '易服','昊伦','赤道线'],
      generalJudge: ['否', '是'],
      signingStatusString: ['续签', '新签','重签'],
      serviceSideString: ['', '甲方', '乙方'],
      contractTemplateString: ['', '公司模板无修改', '公司模板有修改', '客户指定', '其他模板'],
      settleCycleString: ['', '月结', '季度结', '半年结', '年结'],
      settleTypeString: ['', '当月结当月费用', '当月结上月费用', '当月结下月费用', '其他'],
      typeTitle:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'},
      nodeDataSource: {}, // 流程详情
      processId: '', // 流程id
      oprator: -1,
    }
  },
  computed: {
    importExcelUrl: function () {
      return this.url.importUrl
    },
  },
  methods: {
    moment,
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
    handleAudit() {
      this.$refs.auditModal.showModal(this.model.id)
    },
    handleDetail(){
      this.$refs.ContractDetailForm.show(this.model.parentContractId)
    },
    /**
     * 客户合同详情
     */
    async show(record) {
      this.model = Object.assign({chapterUnitTxt:'',parentContractName:'',businessSubjectText:'',businessSubText:'',businessDeveloperOrganText:'',customerName:''}, record)
      // await this.changeBusinessType(this.model.businessType)
      const arr = this.customerBusinessTypeDict.filter(item=>String(item.id) === this.model.businessType)
      this.customerBusinessSubTypeDict = arr[0] ? arr[0]['children'] : []
      // 判断是否是续签OA老合同：0是 1不是
      if(String(record.goOnOaOldData) === '0'){
        this.model.parentContractName = record.parentContractId || ''
      }else {
        await this.getContractName(record)
      }
      await this.getCustomerName(record.customerId)
      this.visible = true
      this.showDisabled = true
      this.model.businessTypeText = getNameFromArr(
        this.customerBusinessTypeDict,
        this.model.businessType,
        'id',
        'label'
      )
      this.model.businessDeveloperIdText = this.model.businessDeveloperId
      this.model.chapterUnitTxt = this.GLOBAL_CONST['companyChapterType'][this.model.chapterUnit]
      this.model.businessSubjectText = getNameFromArr(this.organs, this.model.businessSubject, 'id', 'organName')
      // 业务类别
      this.model.businessSubText = getNameFromArr(
        this.customerBusinessSubTypeDict,
        this.model.businessSub,
        'id',
        'label'
      )
      this.model.businessDeveloperOrganText = getNameFromArr(
        this.organs,
        this.model.businessDeveloperOrgan,
        'id',
        'organName'
      )
      this.fileList = this.model.fileList || []
      this.fileArchiveList = this.model.fileArchiveList || []
    },
    async getCustomerName(id){
      httpAction(`/hrBase/tcustomerinfo/${id}`, null, 'get').then((res) => {
        if (res.code === 200 && res.data) {
          this.model.customerName = res.data.customerName
        }
      })
    },
    async getContractName(record){
      const _this = this
      if(record.signingStatus === '0' || record.signingStatus === '2' || record.signingStatus === '3'){
        httpAction(`/hrBase/tcustomercontract/${record.parentContractId}`, null, 'get').then((res) => {
          if (res.code === 200 && res.data) {
            _this.model.parentContractName = res.data.contractName
          }
        })
      }
    },
    processDetail() {
      this.confirmLoading = true
      httpAction(`/hrBase/tcustomercontract/getNewAllAuditInfo/${this.model.id}`, null, 'get')
        .then((res) => {
          if (res.code === 200) {
            this.recordList = res.data
          } else {
            this.$message.warning(res.msg)
          }
        })
        .finally(() => {
          this.request = false
          this.confirmLoading = false
        })
    },
    tabChange(key) {
      if (key === '2' && this.request) {
        this.processDetail()
      }
      if (key === '3' && !this.showProcess) {
        this.getProcess()
      }
    },
    getProcess() {
      this.confirmLoading = true
      httpAction(
        `/hrBase/tauditnodeproocess/getNodeProocess/byadvancePaymentId?contractId=${this.model.id}`,
        null,
        'get'
      )
        .then((res) => {
          if (res.code === 200) {
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
    auditModalOk() {
      this.$emit('ok')
      this.close()
    },
    // 业务类型改变
    async changeBusinessType(value, option) {
      const res = await httpAction(`${this.url.getBusinessSub}?parentId=${value}`, null, 'get')
      if (res.code === 200) {
        this.customerBusinessSubTypeDict = res.data
        if (option) {
          this.$nextTick(() => {
            this.form.setFieldsValue(
              pick({ businessSub: String(this.customerBusinessSubTypeDict[0].id) }, 'businessSub')
            )
          })
        }
      }
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = this.showProcess = false
      this.treeData = null
      this.industryBelongs = null
      this.fileList = []
      this.request = true
      this.recordList = {
        auditInfo: [],
        copyInfo: [],
        handInfo: [],
      }
    },
  },
}
</script>
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
<style lang="less" >
.detail-list {
  .term {
    margin-right: 18px;
    min-width: 120px;
  }
}
</style>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 150px;
    text-align: left;
  }
}
.sectionTitle {
  font-size: 18px;
  margin: 0 0 30px;
}

</style>
