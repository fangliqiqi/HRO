<template>
  <a-modal
    title="合同列表"
    :width="1250"
    placement="right"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    :bodyStyle="{padding:'0 24px'}"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >确定</a-button>
    </template>
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="客户名称">
                <a-input
                  placeholder="客户名称"
                  v-model="queryParam.customerName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col
              :md="6"
              :sm="8"
            >
              <a-form-item label="客户编码">
                <a-input
                  placeholder="客户编码"
                  v-model="queryParam.customerCode"
                ></a-input>
              </a-form-item>
            </a-col>
            <template>
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item label="合同名称">
                  <a-input
                    placeholder="合同名称"
                    v-model="queryParam.contractName"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="toggleSearchStatus">
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item
                  label="商务主体"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    placeholder="商务主体"
                    optionFilterProp="children"
                    :dropdownMatchSelectWidth="false"
                    :getPopupContainer="getPopupContainerFun"
                    v-model="queryParam.businessSubject"
                  >
                    <a-select-option
                      v-for="(item, index) in organs"
                      :key="index"
                      :value="item.id"
                    >{{ item.description }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :md="6"
                :sm="8"
              >
                <a-form-item
                  label="业务类型"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    placeholder="业务类型"
                    optionFilterProp="children"
                    :dropdownMatchSelectWidth="false"
                    v-model="queryParam.businessType"
                  >
                    <a-select-option
                      v-for="(item, index) in businessTypeDicts"
                      :key="index"
                      :value="item.id"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :md="12"
                :sm="14"
              >
                <a-form-item label="合同开始时间">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    placeholder="开始时间"
                    style="width:46%"
                    v-model="queryParam.startTimeStart_extra"
                    @change="changeRange(arguments,'startTimeStart')"
                  />
                  ~
                  <a-date-picker
                    format="YYYY-MM-DD"
                    placeholder="结束时间"
                    style="width:46%"
                    v-model="queryParam.startTimeEnd_extra"
                    @change="changeRange(arguments,'startTimeEnd')"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :md="12"
                :sm="14"
              >
                <a-form-item label="合同终止时间" class="stepFormText">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    placeholder="开始时间"
                    style="width:46%"
                    v-model="queryParam.endTimeStart_extra"
                    @change="changeRange(arguments,'endTimeStart')"
                  />
                  ~
                  <a-date-picker
                    format="YYYY-MM-DD"
                    placeholder="结束时间"
                    style="width:46%"
                    v-model="queryParam.endTimeEnd_extra"
                    @change="changeRange(arguments,'endTimeEnd')"
                  />
                </a-form-item>
              </a-col>
            </template>
            <a-col
              :md="6"
              :sm="8"
            >
              <span
                style="float: left;overflow: hidden;"
                class="table-page-search-submitButtons"
              >
                <a-button
                  type="primary"
                  @click="searchQuery"
                  icon="search"
                >查询</a-button>
                <a-button
                  type="primary"
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 8px"
                >重置</a-button>
                <a
                  @click="handleToggleSearch"
                  style="margin-left: 8px"
                >
                  {{ toggleSearchStatus ? '收起' : '展开' }}
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>
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
          :rowSelection="{selectedRowKeys: selectedRowKeys,type:'radio',onChange:onSelectChange}"
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
      </div>
      <!-- table区域-end -->
      <div class="customNumberWrap" v-if="[0,3].indexOf(type)>-1">
        <span>未找到合同？填写原合同编号</span>
        <a-input
          allowClear
          style="width:300px;"
          placeholder="请输入原合同编号"
          @change="customNumOnChange"
        />
      </div>
      <customer-contract-detail-modal ref="detailModal"></customer-contract-detail-modal>
    </a-card>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import {initDictOptions, filterDict} from '@/components/dict/JDictSelectUtil'
import { filterOrganDict1,filterSysUserDict } from '@/utils/customDict'
import { getNameFromArr } from '@/utils/common'
import CustomerContractDetailModal from './CustomerContractDetailModal'

  export default {
    name: 'SelectContractListModal',
    components: {
      CustomerContractDetailModal
    },
    data() {
      return {
        visible:false,
        confirmLoading:false,
        queryParam:{},
        toggleSearchStatus:false,
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
        selectedRowKeys:[],
        type:0,
        fileList: [],
        loadingDown:false,
        //字典数组缓存
        contractTypeDicts: [],
        businessTypeDicts: [],
        businessSubDicts: [],
        chapterUnitDicts: [],
        loading: false,
        organs:[],
        customerTreeData: [],
        businessDeveloper: [],
        sysUsers: {},
        contractNumber:'', // OA中的客户合同编码
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
            width: 180,
            ellipsis: true,
            title: '结算主体',
            align: 'center',
            dataIndex: 'settleDomainName',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            title: '业务类型',
            align: 'center',
            dataIndex: 'businessType',
            width: 140,
            ellipsis: true,
            customRender: (text) => {
              const businessType = filterDict(this.businessTypeDicts, text)
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
            width: 130,
            ellipsis: true,
            customRender: (text) => {
              const result = filterSysUserDict(this.sysUsers, text)
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
            width: 140,
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
            width: 140,
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
            width: 150,
            ellipsis: true,
            title: '合同要点',
            align: 'center',
            dataIndex: 'remark',
            customRender: text => {
              const resultText = text || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            title: '创建人',
            align: 'center',
            dataIndex: 'createUser',
            width: 120,
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
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
        ],
        url: {
          list: '/hrBase/tcustomercontract/page?selectType=6',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
          getOne: '/hrBase/tcustomercontract/',
          getSysUsers: '/admin/user/userDic',
          getBusinessDeveloperId: 'admin/user/findWxUsers',
          getBusinessDeveloperArray:'/admin/user/getUserByRoleNameAndClient',// 获得业务开发人
        },
        BusinessDeveloperArray:'',
      }
    },
    methods: {
      changeRange(agrs,str){
        this.queryParam[str] = agrs[1]
      },
      getPopupContainerFun(triggerNode){
        const wid = getComputedStyle(triggerNode).width
        triggerNode.setAttribute('style','width:'+wid)
        return triggerNode.parentNode
      },
      show(type){
        this.visible = true
        this.type = type // 合同类型
        this.selectedRowKeys = []
        this.loadData(1)
      },
      searchQuery(){
        this.loadData(1)
      },
      onSelectChange(selectedRowKeys, selectedRows){
        this.selectedRowKeys = selectedRowKeys
        this.$emit('ok',selectedRows[0])
        this.handleCancel()
      },
      searchReset(){
        this.queryParam = {}
        this.selectedRowKeys = []
        this.loadData(1)
      },
      handleToggleSearch(){
        this.toggleSearchStatus = !this.toggleSearchStatus
      },
      loadData(arg) {
        this.confirmLoading = true
        const qs = require('qs')
        this.queryParam.current = this.ipagination.current = arg
        this.queryParam.size = this.ipagination.pageSize
        // eslint-disable-next-line
        const query = _.cloneDeep(this.queryParam)
        if(query.startTimeStart_extra){
          query.startTimeStart = query.startTimeStart_extra.format('YYYY-MM-DD')
        delete query.startTimeStart_extra
        }
        if(query.startTimeEnd_extra){
          query.startTimeEnd = query.startTimeEnd_extra.format('YYYY-MM-DD')
          delete query.startTimeEnd_extra
        }
        if(query.endTimeStart_extra){
          query.endTimeStart = query.endTimeStart_extra.format('YYYY-MM-DD')
          delete query.endTimeStart_extra
        }
        if(query.endTimeEnd_extra){
          query.endTimeEnd = query.endTimeEnd_extra.format('YYYY-MM-DD')
          delete query.endTimeEnd_extra
        }
        const params = qs.stringify(query)
        httpAction(`/hrBase/tcustomercontract/page?selectType=6&${params}`,null,'get').then(res=>{
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
        this.confirmLoading = false
        this.contractNumber = ''
        this.visible = false
        this.queryParam = {}
      },
      handleTableChange(pagination) {
        this.ipagination = pagination
        this.loadData(pagination.current)
      },

      /**
       * 客户合同详情
       */
      handleShow(record) {
        this.$refs.detailModal.treeData = this.customerTreeData;
        this.$refs.detailModal.organs = this.organs;
        this.$refs.detailModal.industryBelongs = this.industryBelongDictOptions;
        this.$refs.detailModal.industrySub = this.industrySub;
        this.$refs.detailModal.customerContractDict = this.contractTypeDicts;
        this.$refs.detailModal.customerBusinessTypeDict = this.businessTypeDicts;
        this.$refs.detailModal.chapterUnitDicts = this.chapterUnitDicts
        // this.$refs.detailModal.customerBusinessSubTypeDict = this.businessSubDicts;
        this.$refs.detailModal.areaTrees = this.$ls.get('glob_area')
        this.$refs.detailModal.title = '客户合同查看'
        httpAction(this.url.getOne + record.id, null, "GET").then((res) => {
          if(Number(res.code) === 200){
            res.data.businessDeveloperId = filterSysUserDict(this.sysUsers, res.data.businessDeveloperId)
            this.$refs.detailModal.show(res.data)
          }else{
            this.$message.error(res.msg)
          }
        });
        
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
        httpAction(this.url.getSysUsers, null ,'GET').then((res) => {
          if(res.code === 200){
            this.sysUsers = res.data
          }
        })
      },
      /**
       * 加载客户单位树形结构
       */
      loadCustomerTreeData() {
        httpAction(this.url.getTreeData,null,'get').then((res) => {
          this.customerTreeData = res.data;
        });
      },
      // OA中合同编号输入
      customNumOnChange(e){
        const value = e.target.value
        this.contractNumber = value
      },
      // 点击确定按钮
      handleOk(){
        if(!this.contractNumber){
          this.$message.warn('请填写原合同编号')
          return
        }
        this.confirmLoading = true
        this.$emit('oAOk',this.contractNumber)
        this.handleCancel()
      }
    }
  }
</script>
<style lang="less"  scoped>
.customNumberWrap {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  span{
    color: #666;
    margin-right: 10px;
  }
}
@media screen and (max-width: 1300px) {
  .stepFormText {
    :global(.ant-calendar-picker) {
      width: 150px;
    }
  }
}
@media screen and (max-width: 1000px) {
  .stepFormText {
    :global(.ant-calendar-picker) {
      width: 100px;
    }
  }
}
</style>

