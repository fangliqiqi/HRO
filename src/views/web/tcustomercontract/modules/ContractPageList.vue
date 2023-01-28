<template>
  
  <!-- table区域-begin -->
  <div>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="confirmLoading"
      @change="handleTableChange"
      :scroll="{x: 1}"
    >
      <span
        slot="action"
        slot-scope="text, record"
      >
        <a @click="handleShow(record)">详情</a>
      </span>

      <span
        slot="customerStatus"
        slot-scope="text, record"
      >
        <a-tag
          v-if="record.customerStatus == 0"
          color="pink"
        >合同未上传</a-tag>
        <a-tag
          v-if="record.customerStatus == 1"
          color="green"
        >合同正常</a-tag>
        <a-tag
          v-if="record.customerStatus == 2"
          color="orange"
        >合同即将到期</a-tag>
        <a-tag
          v-if="record.customerStatus == 3"
          color="red"
        >合同到期</a-tag>
      </span>

      <span
        slot="prAuditFlag"
        slot-scope="text, record"
      >
        <a-tag
          :color="statusOption[record.prAuditFlag]['color']"
        >{{ statusOption[record.prAuditFlag]['text'] }}</a-tag>
      </span>

      <span
        slot="labelScoped"
        slot-scope="text, record"
      >
        <span v-if="record.label != null">
          <a-tag
            v-for="(tag, index) in record.label.split(',')"
            :key="index"
          >{{ tag }}</a-tag>
        </span>
        <span v-else> - </span>
      </span>

    </a-table>
    <a-modal
      title="合同详情"
      :width="800"
      :visible="visible"
      @ok="handleCancel"
      @cancel="handleCancel"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <a-form layout="inline" class="contractItem">
        <a-row>
          <a-divider>合同基本信息</a-divider>
          <a-col :span="12">
            <a-form-item label="合同名称" class="stepFormText">{{ model.contractName }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="起止日期" class="stepFormText">{{ model.startDate }}~{{ model.endDate }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户单位" class="stepFormText">{{ model.customerName }}({{ serviceSideString[Number(model.serviceSide)] }})</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户类型" class="stepFormText">{{ getCustomerType(model.customerType) || '-' }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="CRM合同编号" class="stepFormText">{{ model.crmNo }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="商务主体" class="stepFormText">{{ model.businessSubjectName }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="用章类型" class="stepFormText">{{ getChapterType(model.chapterType) }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="用章单位" class="stepFormText">{{ model.chapterUnitText }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户先行盖章" class="stepFormText">{{ generalJudge[Number(model.chapterCustomerPre)] }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否外带" class="stepFormText">{{ generalJudge[Number(model.outWithFlag)] }}</a-form-item>
          </a-col>
        </a-row>
        <a-divider>业务信息</a-divider>
        <a-row>
          <a-col :span="12">
            <a-form-item label="合同模板" class="stepFormText">{{ contractTemplateString[model.contractTemplate] }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="业务类别" class="stepFormText">{{ model.businessTypeText }} / {{ model.businessSubText }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="业务开发人" class="stepFormText">{{ model.businessDeveloperId }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开发部门/分公司" class="stepFormText">{{ model.businessDeveloperOrganText }}</a-form-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-item label="结算周期" class="stepFormText">{{ settleCycleString[Number(model.settleCycle)] }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="费用方式" class="stepFormText">{{ settleTypeString[Number(model.settleType)] }}</a-form-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-item label="收入预估" class="stepFormText">{{ model.estimatedIncome }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同金额" class="stepFormText">{{ model.money||'-' }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="服务人数" class="stepFormText">{{ model.servicePeopleNum||'-' }}</a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同要点" class="stepFormText lineOver">{{ model.remark||'-' }}</a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item class="stepFormText" label="合同附件">
              <div class="clearfix">
                <a-upload
                  listType="picture-card"
                  :fileList="model.fileList"
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
          <a-col :span="24">
            <a-form-item class="stepFormText" label="归档附件">
              <div class="clearfix">
                <a-upload
                  listType="picture-card"
                  :fileList="model.fileArchiveList"
                  @preview="handlePreview"
                  :showUploadList="{ showRemoveIcon: false }"
                  accept=".jpg, .jpeg, .png, .bmp, .JPG, .JPEG, .gif, .pdf, .doc, .docx"
                ></a-upload>
              </div>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </a-modal>
  </div>
  <!-- table区域-end -->
  
</template>

<script>
  import { httpAction } from '@/api/manage'
  import {initDictOptions, filterDict} from '@/components/dict/JDictSelectUtil'
  import { filterOrganDict1,filterSysUserDict } from '@/utils/customDict'
  import { getNameFromArr } from '@/utils/common'

  export default {
    name: 'ContractPageList',
    props: {
      listUrl:{
        type: String,
        default:'',
        required: true
      },
      chapterUnitDicts:{
        type: Array,
        default:()=>[],
        required: true
      },
      data:{
        type: Object,
        required: true
      },
    },
    data() {
      return {
        confirmLoading:false,
        queryParam:{},
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30', '50', '100'],
          showTotal: (total, range) => {
            return `${range[0]}-${range[1]} 共${total}条`
          },
          showQuickJumper: false,
          showSizeChanger: true,
          total: 0
        },
        dataSource:[],
        visible:false,
        model:{},
        previewVisible:false,
        previewImage: '',
        companyName: ['', '皖信', '柯恩', '易服','昊伦','赤道线'],
        generalJudge: ['否', '是'],
        serviceSideString: ['', '甲方', '乙方'],
        contractTemplateString: ['', '公司模板无修改', '公司模板有修改', '客户指定', '其他模板'],
        settleCycleString: ['', '月结', '季度结', '半年结', '年结'],
        settleTypeString: ['', '当月结当月费用', '当月结上月费用', '当月结下月费用', '其他'],

        //字典数组缓存
        contractTypeDicts: [],
        chapterUnit:[],
        // businessTypeDicts: [],
        // businessSubDicts: [],
        organs:[],
        customerTreeData: [],
        businessDeveloper: [],
        sysUsers: {},
        prAuditFlagStatus:[
          {color:'green',text:'审核通过'},
          {color:'red',text:'审核不通过'},
          {color:'cyan',text:'待审核'},
          {color:'orange',text:'待提交'},
          {color:'purple',text:'全国业务中心审核'},
          {color:'#87d068',text:'已办理'},
          {color:'blue',text:'已归档'},
        ],
        // 表头
        columns: [
          {
            title: '合同状态',
            align: 'center',
            dataIndex: 'prAuditFlag',
            width: 120,
            customRender:(text)=>{
              return <a-tag color={this.prAuditFlagStatus[text].color}>{this.prAuditFlagStatus[text].text}</a-tag>
            }
          },
          {
            title: '业务类型',
            align: 'center',
            dataIndex: 'businessType',
            width: 100,
            ellipsis: true,
            customRender: (text) => {
              const businessType = filterDict(this.data.customerBusinessTypeDict, text)
              return (
                <a-tooltip placement="topLeft" title={businessType}>
                  {businessType}
                </a-tooltip>
              )
            },
          },
          {
            title: '合同名称',
            align: 'center',
            dataIndex: 'contractName',
            width: 200,
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
            title: '客户名称',
            align: 'center',
            dataIndex: 'customerName',
            width: 180,
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
            title: '业务开发人',
            align: 'center',
            dataIndex: 'businessDeveloperId',
            width: 100,
            ellipsis: true,
            customRender: (text) => {
              const result = this.getNameFormobj(this.sysUsers,text)
              return (
                <a-tooltip placement="topLeft"  title={result}>
                  {result}
                </a-tooltip>
              )
            },
          },
          {
            title: '开发部门/分公司',
            align: 'center',
            dataIndex: 'businessDeveloperOrgan',
            width: 200,
            ellipsis: true,
            customRender: (text) => {
              const business = filterOrganDict1(this.organs, text)
              return (
                <a-tooltip placement="topLeft" title={business}>
                  {business}
                </a-tooltip>
              )
            },
          },
          {
            title: '合同开始时间',
            align: 'center',
            dataIndex: 'startDate',
            width: 110,
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
            title: '合同终止时间',
            align: 'center',
            dataIndex: 'endDate',
            width: 110,
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
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser',
            width: 80,
            ellipsis: true,
            customRender: (text) => {
              const user = filterSysUserDict(this.sysUsers, text)
              return (
                <a-tooltip placement="topLeft" title={user}>
                  {user}
                </a-tooltip>
              )
            },
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            width: 150,
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
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 170,
            fixed: 'right',
            scopedSlots: { customRender: 'action' },
          },
        ],
        url: {
          getOrgan: '/admin/organizationinfo/getOrgForCus?displayFlag=0&type=0',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
          getOne: '/hrBase/tcustomercontract/',
          getSysUsers: '/admin/user/userDic',
          getBusinessDeveloperId: 'admin/user/findWxUsers',
          getBusinessDeveloperArray:'/admin/user/getUserByRoleNameAndClient',// 获得业务开发人
        },
        BusinessDeveloperArray:''
      }
    },
    created() {
      this.initDictConfig()
      this.loadData(1)
    },
    methods: {
      // 方法根据对象属性查找值
      getNameFormobj(obj,value){
        for(let i in obj){
          if(i == value){
            return obj[i]
          }
        }
      },
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
      loadData(arg) {
        this.confirmLoading = true
        const qs = require('qs')
        this.queryParam.current = this.ipagination.current = arg
        this.queryParam.size = this.ipagination.pageSize
        // eslint-disable-next-line
        const query = _.cloneDeep(this.queryParam)
        const params = qs.stringify(query)
        httpAction(`${this.listUrl}&${params}`,null,'get').then(res=>{
          if(res.code === 200){
            this.dataSource = res.data.records
            this.ipagination.total = res.data.total
          }else{
            this.$message.warn(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },
      handleCancel(){
        this.visible = false
      },
      handleTableChange(pagination) {
        this.ipagination = pagination
        this.loadData(pagination.current)
      },
      handlePreview(file) {
        const fileExt = file.name.replace(/.+\./, '')
        const reg = new RegExp(fileExt, 'gi')
        if (reg.test('xls,xlsx,doc,docx,ppt,pptx')) {
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
      handlePreviwCancel() {
        this.previewVisible = false
      },

      /**
       * 客户合同详情
       */
      handleShow(record) {
        httpAction(this.url.getOne + record.id, null, "GET").then((res) => {
          if(res.code == 200){
            if(!res.data){
              this.$message.warning('该合同不存在或已删除!')
              return
            }
            this.visible = true
            if(!res.data){
              this.$message.warning('该合同不存在或已删除!')
              return false
            }
            res.data.businessDeveloperId = filterSysUserDict(this.sysUsers, res.data.businessDeveloperId)
            res.data.businessTypeText = getNameFromArr(this.data.customerBusinessTypeDict,res.data.businessType,'id','label')
            const arr = this.data.customerBusinessTypeDict.filter(item=>String(item.id) === res.data.businessType)
            const temp = arr[0] ? arr[0]['children'] : []
            res.data.businessSubText = getNameFromArr(temp,res.data.businessSub,'id','label')
            res.data.businessDeveloperOrganText = getNameFromArr(this.organs,res.data.businessDeveloperOrgan,'id','organName')
            res.data.chapterUnitText = this.filterDicts(this.chapterUnit,res.data.chapterUnit)
            this.model = res.data
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      /**
       * 加载数据字典
       */
      initDictConfig() {
        initDictOptions('customer_contract_type').then((res) => {
          if (res.code === 200) {
            this.contractTypeDicts = res.data
          }
        });
         // 字典获取用章单位
        initDictOptions('chapter_unit').then((res) => {
          if (res.code === 200) {
            this.chapterUnit = res.data
          }
        })
        // initDictOptions('customer_business_type').then((res) => {
        //   if (res.code === 200) {
        //     this.businessTypeDicts = res.data
        //   }
        // });
        
        httpAction(this.url.getBusinessDeveloperArray, '', 'GET').then((res) => {
          if (res.code === 200 && res.data.length > 0) {
            this.BusinessDeveloperArray = res.data
          }
        });
        httpAction(this.url.getOrgan,'','GET').then((res) => {
          if(res.code === 200 && res.data.length > 0) {
            this.organs = res.data
          }
        });
        httpAction(this.url.getSysUsers, null ,'GET').then((res) => {
          if(res.code === 200){
            this.sysUsers = res.data
          }
        });
        // initDictOptions('customer_business_sub_type').then((res) => {
        //   if (res.code === 200) {
        //     this.businessSubDicts = res.data;
        //   }
        // });
      },
      /**
       * 加载客户单位树形结构
       */
      loadCustomerTreeData() {
        httpAction(this.url.getTreeData,null,'get').then((res) => {
          this.customerTreeData = res.data;
        });
      }
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}
.stepFormText {
  display: flex;
  :global(.ant-form-item-label) {
    width: 115px;
  }
   :global(.ant-form-item-control-wrapper) {
    max-width: 250px;
  }  
}

</style>