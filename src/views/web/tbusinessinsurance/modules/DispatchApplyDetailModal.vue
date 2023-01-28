<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    class="ant-modal_detail"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <page-layout
      :title="model.empName"
      logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"
    >

      <!-- 操作 -->
      <a-card
        style="margin-top: 24px"
        :bordered="false"
        :tabList="tabList"
        :activeTabKey="activeTabKey"
        @tabChange="(key) => {this.activeTabKey = key}"
      >

        <detail-list v-if="activeTabKey === '1'">
          <detail-list-item term="身份证号">{{ employeeInfo.empIdcard || '--' }}</detail-list-item>
          <detail-list-item term="身份证有效期">{{ employeeInfo.empIdcardValidity || '--' }}</detail-list-item>
          <detail-list-item term="性别">{{ employeeInfo.empSex || '--' }}</detail-list-item>
          <detail-list-item term="年龄">{{ employeeInfo.empAge || '--' }}</detail-list-item>
          <detail-list-item term="出生日期">{{ (employeeInfo.empBirthday) ? moment(employeeInfo.empBirthday).format('YYYY-MM-DD') : '--' }}</detail-list-item>
          <detail-list-item term="婚姻状况">{{ employeeInfo.empMarriStatu || '--' }}</detail-list-item>
          <detail-list-item term="民族">{{ employeeInfo.empNational || '--' }}</detail-list-item>
          <detail-list-item term="政治面貌">{{ employeeInfo.politicalStatus || '--' }}</detail-list-item>
          <detail-list-item term="E-Mail">{{ employeeInfo.empEmail || '--' }}</detail-list-item>
          <detail-list-item term="QQ">{{ employeeInfo.empQq || '--' }}</detail-list-item>
          <detail-list-item term="联系方式">{{ employeeInfo.empPhone || '--' }}</detail-list-item>
          <detail-list-item term="员工类型">{{ employeeInfo.empType || '--' }}</detail-list-item>
          <detail-list-item
            term="结算主体"
            class="termContent"
          >
            <a-tooltip placement="topLeft">
              <template slot="title">
                {{ model.settlementOrganName || '--' }}
              </template>
              <span class="overflow">
                {{ model.settlementOrganName || '--' }}
              </span>
            </a-tooltip>
          </detail-list-item>
          <detail-list-item
            term="所属单位"
            class="termContent"
          >
            <a-tooltip placement="topLeft">
              <template slot="title">
                {{ model.customerName || '--' }}
              </template>
              <span class="overflow">
                {{ model.customerName || '--' }}
              </span>
            </a-tooltip>
          </detail-list-item>
          <detail-list-item term="就职班组">{{ employeeInfo.inauguralTeam || '--' }}</detail-list-item>

          <detail-list-item term="就职岗位">{{ employeeInfo.post || '--' }}</detail-list-item>
          <detail-list-item term="电信编号">{{ employeeInfo.telecomNumber || '--' }}</detail-list-item>
          <detail-list-item term="户口性质">{{ employeeInfo.empRegisType || '--' }}</detail-list-item>
          <detail-list-item
            term="开户行"
            class="termContent"
          >
            <a-tooltip placement="topLeft">
              <template slot="title">
                {{ employeeInfo.empBankName || '--' }}
              </template>
              <span class="overflow">
                {{ employeeInfo.empBankName || '--' }}
              </span>
            </a-tooltip>
          </detail-list-item>
          <detail-list-item term="银行卡号">{{ employeeInfo.empBankNo || '--' }}</detail-list-item>
          <detail-list-item term="员工标签">{{ employeeInfo.empLabel || '--' }}</detail-list-item>
          <detail-list-item
            term="身份证地址"
            class="termContent"
          >
            <a-tooltip placement="topLeft">
              <template slot="title">
                {{ employeeInfo.idAreaName }}
              </template>
              <span class="overflow">
                {{ employeeInfo.idAreaName }}
              </span>
            </a-tooltip>
          </detail-list-item>
          <detail-list-item
            term="档案所在地"
            class="termContent"
          >
            <a-tooltip placement="topLeft">
              <template slot="title">
                {{ employeeInfo.fileAreaName || '' }}
              </template>
              <span class="overflow">
                {{ employeeInfo.fileAreaName || '' }}
              </span>
            </a-tooltip>
          </detail-list-item>
          <detail-list-item term="备注">{{ employeeInfo.remark }}</detail-list-item>
        </detail-list>

        <detail-list
          v-if="activeTabKey === '2'"
          class="termContent"
        >
          <detail-list-item term="保险公司">
            <a-tooltip placement="topLeft">
              <template slot="title">
                {{ model.insuranceCompanyName }}
              </template>
              <span class="overflow">
                {{ model.insuranceCompanyName }}
              </span>
            </a-tooltip>
          </detail-list-item>
          <detail-list-item
            term="险种"
            class="termContent"
          >
            <a-tooltip placement="topLeft">
              <template slot="title">
                {{ model.insuranceTypeName }}
              </template>
              <span class="overflow">
                {{ model.insuranceTypeName }}
              </span>
            </a-tooltip>
          </detail-list-item>
          <detail-list-item term="购买类型">{{ buyTypeName }}</detail-list-item>
          <detail-list-item term="购买标准">{{ model.buyStandard }}</detail-list-item>
          <detail-list-item term="实际保费">{{ model.buyPay }}</detail-list-item>
          <detail-list-item term="身故或残疾">{{ model.deathDisabilityMoney }}</detail-list-item>
          <detail-list-item term="医疗额度">{{ model.medicalMoney }}</detail-list-item>
          <detail-list-item term="发票号">{{ model.invoiceNo || '--' }}</detail-list-item>
          <detail-list-item term="保单号">{{ model.policyNo || '--' }}</detail-list-item>
          <detail-list-item term="保单开始时间">{{ model.policyStart || '--' }}</detail-list-item>
          <detail-list-item term="保单结束时间">{{ model.policyEnd || '--' }}</detail-list-item>
          <detail-list-item term="保单生效时间">{{ model.policyEffect || '--' }}</detail-list-item>
          <detail-list-item
            term="结算主体"
            class="termContent"
          >
            <a-tooltip placement="topLeft">
              <template slot="title">
                {{ model.settlementOrganName }}
              </template>
              <span class="overflow">
                {{ model.settlementOrganName }}
              </span>
            </a-tooltip>
          </detail-list-item>
          <detail-list-item term="结算类型">{{ settleType }}</detail-list-item>
          <detail-list-item term="结算月份">{{ model.settleMonth || '--' }}</detail-list-item>
          <detail-list-item term="派单类型">{{ (model.fromEmpName) ? '替换' : '新增' }}</detail-list-item>
          <detail-list-item term="被替换人">{{ model.fromEmpName }}</detail-list-item>
          <detail-list-item term="状态">{{ statusName }}</detail-list-item>
          <detail-list-item term="商险购买地">{{ model.businessInsuranceProv }} - {{ model.businessInsuranceAddr }}</detail-list-item>
          <!-- <detail-list-item term="替换状态">{{ (model.replaceStatus == 2) ? '已替换' : '未替换' }}</detail-list-item>
          <detail-list-item term="替换时间">{{ model.replaceDate || '--' }}</detail-list-item> -->
          <detail-list-item term="创建人">{{ model.createUser }}</detail-list-item>
          <detail-list-item term="创建时间">{{ model.createTime }}</detail-list-item>
          <detail-list-item term="是否失效"><span v-if="model.validFlag==0">有效</span><span v-else>无效</span></detail-list-item>
          <detail-list-item term="替换人姓名">{{ model.toEmpName || '--' }}</detail-list-item>
          <detail-list-item term="替换时间">{{ model.toReplaceTime || '--' }}</detail-list-item>
          <detail-list-item term="购买月数">{{ (model.buyMonth) ? (model.buyMonth+'个月') : '--' }}</detail-list-item>
          <detail-list-item term="保费结算类型">
            <span v-if="model.settleBuyPayType == 1">实际保费</span>
            <span v-else-if="model.settleBuyPayType == 2">预估保费</span>
            <span v-else>--</span>
          </detail-list-item>
          <detail-list-item term="退保金额">{{ model.refundMoney || '--' }}</detail-list-item>
          <detail-list-item term="备注">{{ model.remark || '--' }}</detail-list-item>
        </detail-list>

      </a-card>
      <a-card
        title="附件"
        v-if="activeTabKey === '2'"
        :bordered="false"
      >
        <div v-if="defaultFileList.length" style="margin-bottom: 10px;">
          普通附件
          <a-upload
            v-if="defaultFileList.length"
            listType="picture"
            :defaultFileList="defaultFileList"
            :showUploadList="{showRemoveIcon:false}"
            :remove="removeFile"
            @preview="preview"
          >
          </a-upload>
        </div>
        <div v-if="defaultFileListBd.length">
          电子保单
          <a-upload
            listType="picture"
            :defaultFileList="defaultFileListBd"
            :showUploadList="{showRemoveIcon:false}"
            :remove="removeFile"
            @preview="preview"
          >
          </a-upload>
        </div>
        <div v-if="defaultFileList.length == 0 && defaultFileListBd.length == 0">
          <a-empty description="暂无附件"/>
        </div>
      </a-card>
      <a-card
        v-if="activeTabKey === '3'"
        :bordered="false"
      >
        <a-timeline v-if="processList.length">
          <a-timeline-item
            v-for="(item,index) in processList"
            :key="index"
            :color="colorArr[item.auditStatus]"
          >
            <p><span>流程状态：</span>{{ statusTxt[item.auditStatus] }}</p>
            <p><span>备注：</span>{{ item.auditRemark }}</p>
            <p><span>操作人及时间：</span>{{ item.auditUser }} {{ item.createTime }}</p>
          </a-timeline-item>
        </a-timeline>
        <a-empty v-else description="暂无流程"/>
      </a-card>

    </page-layout>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      :width="'80%'"
      @cancel="handlePreviwCancel"
    >
      <img
        alt="example"
        style="max-width:100%"
        :src="previewImage"
      />
    </a-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import { mixinDevice } from '@/utils/mixin.js'
  import PageLayout from '@/components/page/PageLayout'
  import DetailList from '@/components/tools/DetailList'
  import { getAreaName } from '@/utils/common'
  const DetailListItem = DetailList.Item
  import { httpAction } from '@/api/manage'
  // import { hasPermissionToPage } from '../../../../store/modules/permission'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: "DispatchApplyDetailModal",
    components: {
      PageLayout,
      DetailList,
      DetailListItem,
    },
    mixins: [mixinDevice],
    data () {
      return {
        title: '详情',
        visible: false,
        model: {},
        employeeInfo:{}, //员工信息
        buyTypeName:'', //购买类型
        sexOptions: [], // 性别
        empTypeOptions: [], // 员工类型
        employeeLableOptions: [],  // 员工标签
        empMarriOptions: [],  // 婚姻状况
        educationOptions: [], // 学历级别
        politicalOptions: [], // 政治面貌
        empRegisTypeOptions: [],  // 户口性质
        empNationalOptions: [], // 民族
        settleDomainBelongs:[],
        settleDomainName:'', //结算主体
        attachmentList:[], //附件
        isDelAttach:true, //是否可以删除附件
        defaultFileList:[], //普通附件
        defaultFileListBd:[], //电子保单
        processList:[], //流程明细
        colorArr:['blue','green','red','green','blue'],
        statusTxt:['待审核','已通过','未通过','已委托','提交审核'],
        url:{
          employee:'/hrBase/temployeeinfo/',
          settlementOrganUrl:'/hrBase/tsettledomain/',
          attachmentUrl:'/busiInsurance/tinsuranceatta/geteAttaById/',
          delAttachUrl:'/busiInsurance/tinsuranceatta/',
          process:'/busiInsurance/tbusinessinsurance/queryFlowById/'
        },
        tabList: [
          {
            key: '1',
            tab: '基本信息'
          },
          {
            key: '2',
            tab: '商险派单'
          },
          {
            key: '3',
            tab: '流程详情'
          },
        ],
        activeTabKey: '1',
        fileTypeOfOffice:'xls,xlsx,doc,docx,ppt,pptx,pdf',
        previewVisible:false,
        previewImage:'',
      }
    },
    methods: {
      getAreaName,
      moment,
      edit(record) {
        this.initDictConfig()
        this.model = Object.assign({}, record)
        //获取员工信息
        httpAction(this.url.employee+this.model.empId, '', 'GET').then((res) => {
          if (res.code === 200) {
            this.employeeInfo = res.data
            this.employeeInfo.empSex = filterDictText(this.sexOptions, this.employeeInfo.empSex)
            this.employeeInfo.empMarriStatu = filterDictText(this.empMarriOptions, this.employeeInfo.empMarriStatu)
            this.employeeInfo.empNational = filterDictText(this.empNationalOptions, this.employeeInfo.empNational)
            this.employeeInfo.politicalStatus = filterDictText(this.politicalOptions, this.employeeInfo.politicalStatus)
            this.employeeInfo.empType = filterDictText(this.empTypeOptions, this.employeeInfo.empType)
            this.employeeInfo.empRegisType = filterDictText(this.empRegisTypeOptions, this.employeeInfo.empRegisType)
            this.employeeInfo.empLabel = filterDictText(this.employeeLableOptions, this.employeeInfo.empLabel)

            this.employeeInfo.fileAreaName = getAreaName(this.employeeInfo.fileProvince,this.employeeInfo.fileCity,this.employeeInfo.fileTown,'-') + (this.employeeInfo.fileAddr || ' ')
            this.employeeInfo.idAreaName = getAreaName(this.employeeInfo.idProvince,this.employeeInfo.idCity,this.employeeInfo.idTown,'-') + (this.employeeInfo.idcardAddr || '')

            // let settleDomainTemp = this.employeeInfo.settleDomain // 用于取所属单位
            // this.employeeInfo.belongUnit = this.settleDomainBelongs[settleDomainTemp].customerName
          }else{
            this.$message.warning('获取员工信息错误')
          }
        })
        //获取附件
        httpAction(this.url.attachmentUrl+this.model.id+'?policyType=0', '', 'GET').then((res) => {
          if (res.code === 200) {
            for (const item of res.data) {
              this.defaultFileList.push({
                uid:item.id,
                name:item.attaName,
                status:'done',
                url:item.attaUrl,
                response:item.attaSize,
                thumbUrl:item.attaUrl,
              })
            }
          }
        })
        httpAction(this.url.attachmentUrl+this.model.id+'?policyType=1', '', 'GET').then((res) => {
          if (res.code === 200) {
            for (let item of res.data) {
              this.defaultFileListBd.push({
                uid:item.id,
                name:item.attaName,
                status:'done',
                url:item.attaUrl,
                response:item.attaSize,
                thumbUrl:item.attaUrl,
              })
            }
          }
        })
        

        this.visible = true
        httpAction(this.url.process+this.model.id, '', 'GET').then((res) => {
          if(res.code == 200 && res.data){
            this.processList = res.data
          }
        })
      },
      // 数据字典
      initDictConfig() {
        // 性别
        initDictOptions('sex').then((res) => {
          if (res.code === 200) {
            this.sexOptions = res.data
          }
        })
        // 婚姻状况
        initDictOptions('marital_status').then((res) => {
          if (res.code === 200) {
            this.empMarriOptions = res.data
          }
        })
        // 民族
        initDictOptions('nation').then((res) => {
          if (res.code === 200) {
            this.empNationalOptions = res.data
          }
        })
        // 政治面貌
        initDictOptions('political_status').then((res) => {
          if (res.code === 200) {
            this.politicalOptions = res.data
          }
        })
        // 员工类型
        initDictOptions('personnel_type').then((res) => {
          if (res.code === 200) {
            this.empTypeOptions = res.data
          }
        })
        // 户口性质
        initDictOptions('household_nature').then((res) => {
          if (res.code === 200) {
            this.empRegisTypeOptions = res.data
          }
        })
        // 员工标签
        initDictOptions('employee_lable').then((res) => {
          if (res.code === 200) {
            this.employeeLableOptions = res.data
          }
        })
      },
      removeFile(){
        // const _this = this
        // this.$confirm({
        //   title: '删除',
        //   content: '确定删除该附件？',
        //   okText: '确认',
        //   cancelText: '取消',
        //   onOk:function(){
        //     if(hasPermissionToPage('wxhr:tinsuranceatta_del',_this.$route)) {
        //       httpAction(_this.url.delAttachUrl+fileInfo.uid, {id:fileInfo.uid}, 'DELETE').then((res) => {
        //         if (res.code === 200) {
        //           _this.defaultFileList.map((file,index)=>{
        //             if(file.uid == fileInfo.uid){
        //               //删除该附件
        //               _this.defaultFileList.splice(index,1);
        //               return
        //             }
        //           })
        //           _this.$message.success('删除成功！')
        //         } else {
        //           _this.$message.warning(res.msg)
        //         }
        //       })
        //     }else{
        //       _this.$message.warning('暂无删除附件权限')
        //     }
        //   },
        // });
        return false
      },
      
      // 预览
      preview(file){
        let fileExt = file.name.replace(/.+\./,"")
        let reg = new RegExp(fileExt,"gi")
        if(reg.test(this.fileTypeOfOffice)) {
          window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`, '_blank')
        }else{
          this.previewImage = file.url || file.thumbUrl
          this.previewVisible = true
        }
      },
      handlePreviwCancel(){
        this.previewVisible = false
      },
      handleOk() {
        this.close()
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.defaultFileList=[]
        this.buyTypeName=''
      }
    }
  }
</script>

<style lang="scss" scoped>
.detail-layout {
  margin-left: 44px;
}
.text {
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
}

.no-data {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}
.mobile {
  .detail-layout {
    margin-left: unset;
  }
  .status-list {
    text-align: left;
  }
}
.ant-modal_detail {
  margin-top: 65px;
}
.overflow {
  display: inline-block;
  width: 220px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  height: 21px;
  line-height: 20px;
  color: #000000a6 !important;
}
.termContent {
  :global(.content) {
    padding-bottom: 0px;
  }
}
</style>
