<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    style="top: 20px;"
    cancelText="关闭"
    class="ant-modal_detail"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <page-layout
      :title="model.customerName"
      logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"
    >

      <a-card
        style="margin-top: 24px"
        :bordered="false"
        title="基本信息"
      >
        <detail-list>
          <detail-list-item term="上级机构">{{ model.parentContractName }}</detail-list-item>
          <detail-list-item term="行业类型">{{ model.industryBelong }}</detail-list-item>
          <detail-list-item term="行业细分">{{ model.industrySub || '-' }}</detail-list-item>
          <detail-list-item term="客户地址">{{ model.customerAddress }}{{ model.address }}</detail-list-item>
          <detail-list-item term="服务归属地">{{ model.belongArea || '暂无' }}</detail-list-item>

          <detail-list-item term="客户性质">{{ model.nature }}</detail-list-item>
          <detail-list-item term="客户类型">{{ getCustomerType(model.customerType) }}</detail-list-item>
          <!-- <detail-list-item term="民族">{{ model.nationality }}</detail-list-item>
          <detail-list-item term="政治面貌">{{ model.politicalStatus }}</detail-list-item>
          <detail-list-item term="婚姻状况">{{ model.maritalStatus }}</detail-list-item>
          <detail-list-item term="国籍">{{ model.country }}</detail-list-item> -->
        </detail-list>
      </a-card>
      <!-- actions -->
      <!-- <template slot="action">
        <a-button-group style="margin-right: 4px;">
          <a-button>操作</a-button>
          <a-button>操作</a-button>
          <a-button>
            <a-icon type="ellipsis" />
          </a-button>
        </a-button-group>
        <a-button type="primary">主操作</a-button>
      </template> -->

      <a-card
        :bordered="false"
        title="流程进度"
      >
        <a-steps
          :direction="isMobile() && 'vertical' || 'horizontal'"
          :current="2"
          progressDot
        >
          <a-step>
            <template slot="title">
              客户创建
            </template>
            <span slot="description">({{ model.createUserName }})</span>
          </a-step>
          <a-step>
            <template slot="title">
              客户审核
            </template>
            <span slot="description">({{ model.prAuditManName == null ? '无' : model.prAuditManName }})</span>
          </a-step>
          <a-step title="完成">
          </a-step>
        </a-steps>
      </a-card>

      <!-- 操作 -->
      <a-card
        style="margin-top: 24px"
        :bordered="false"
        :tabList="tabList"
        :activeTabKey="activeTabKey"
        rowKey="key"
        @tabChange="(key) => {this.activeTabKey = key}"
      >
        <a-table
          v-if="activeTabKey === '1'"
          :columns="employeeContractColumns"
          :dataSource="customerContractList"
          :pagination="false"
          :scroll="{ x: 1}"
          rowKey="id"
        >
          <template
            slot="status"
            slot-scope="status"
          >
            <a-badge
              :status="status | statusTypeFilter"
              :text="status | statusFilter"
            />
          </template>

          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="imagesPreviewShow(record)" v-if="record.fileList && record.fileList.length > 0">
              <a-tag color="green" style="cursor: pointer">附件预览</a-tag>
            </a>
            <!--<a @click="imagesPreviewShow(record)" v-if="record.fileList.docAtta && record.fileList.docAtta.length > 0">
              <a-tag color="green">文档预览</a-tag>
            </a>-->
          </span>
        </a-table>
      </a-card>
      <a-card
        style="margin-top: 20px"
        :bordered="false"
        title="操作记录"
      >
        <a-table
          :columns="recordList"
          :dataSource="recordSource"
          :defaultExpandAllRows="true"
          :pagination="ipagination"
          @change="tableChange"
          rowKey="id"
        >
          <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
            {{ record.createTime }} 由  <a-tag color="blue">{{ record.createUserName }}</a-tag>编辑<br/>
            <span v-for="(item,index) in changeLog(record)" :key="index">
              修改了<strong>{{ item.name }}</strong>：旧值为:{{ item.oldField }}，新值为：{{ item.newField }}<br/>
            </span>
          </p>
        </a-table>
      </a-card>
    </page-layout>

    <images-view-modal ref="imagesViewModal"></images-view-modal>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { mixinDevice } from '@/utils/mixin.js'
  import PageLayout from '@/components/page/PageLayout'
  import DetailList from '@/components/tools/DetailList'
  import DepartList from '../../../system/DepartList'
  import { filterDict,organDict } from '@/components/dict/JDictSelectUtil'
  import ImagesViewModal from './ImagesViewModal'
  import { getAreaName,getAreaFieldName,getNameFromArr } from '@/utils/common'
  const DetailListItem = DetailList.Item

  export default {
    name: "CustomerAllDetailModal",
    components: {
      DepartList,
      PageLayout,
      DetailList,
      DetailListItem,
      ImagesViewModal
    },
    mixins: [mixinDevice],
    data () {
      return {
        title: '详细',
        visible: false,
        treeData:[],
        industryBelongs:[],
        industrySub:[],
        model: {},
        areaTrees: [],
        areaCitys: [],
        areaTowns: [],
        customerNatures: [],
        customerContractList: [],
        contractTypeDicts: [],
        businessTypeDicts: [],
        businessSubDicts: [],
        fileTypeOfOffice: ['xls','xlsx','doc','docx','ppt','pptx','pdf'],
        fileTypeOfImage: ['jpg','jpeg','png','bmp','JPG','JPEG','gif'],
        organs: [],
        prAuditFlagStatus:[
          {color:'green',text:'审核通过'},
          {color:'red',text:'审核不通过'},
          {color:'cyan',text:'待审核'},
          {color:'orange',text:'待提交'},
          {color:'purple',text:'全国业务中心审核'},
          {color:'#87d068',text:'已办理'},
          {color:'blue',text:'已归档'},
        ], // 合同状态
        signStatus:{'0':'续签','1':'新签','2':'重签','3':'补充协议','4':'先于合同执行','5':'虚拟合同'}, // 合同签订状态
        tabList: [
          {
            key: '1',
            tab: '合同信息'
          }
        ],
        activeTabKey: '1',
        //员工合同列表标题
        employeeContractColumns: [
          {
            width: 140,
            ellipsis: true,
            title: '审核状态',
            align: 'center',
            dataIndex: 'prAuditFlag',
            customRender: text => {
              return <a-tag color={this.prAuditFlagStatus[text].color}>{this.prAuditFlagStatus[text].text}</a-tag>
            }
          },
          {
            width: 140,
            ellipsis: true,
            title: '签订状态',
            align: 'center',
            dataIndex: 'signingStatus',
            customRender: text => {
              const resultText = this.signStatus[String(text)] || '-'
              return <a-tooltip title={resultText}>{resultText}</a-tooltip>
            }
          },
          {
            width:150,
            ellipsis: true,
            title: "合同名称",
            align: 'center',
            dataIndex: 'contractName',
            key: 'contractName',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            width:150,
            ellipsis: true,
            title: "合同编号",
            align: 'center',
            dataIndex: 'contractCode',
            key: 'contractCode',
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            width:150,
            ellipsis: true,
            title: "商务主体",
            align: 'center',
            dataIndex: 'businessSubject',
            key: 'businessSubject',
            customRender:(text)=>{
              const organs = organDict(this.organs, text)
              return <a-tooltip
                placement="topLeft"
                title={organs}
              >{organs}</a-tooltip>
            }
          },
          {
            width:120,
            ellipsis: true,
            title: "合同类型",
            align: 'center',
            dataIndex: 'contractType',
            key: 'contractType',
            customRender:(text)=>{
              const type = filterDict(this.contractTypeDicts, text)
              return <a-tooltip
                placement="topLeft"
                title={type}
              >{type}</a-tooltip>
            }
          },
          {
            width:250,
            ellipsis: true,
            title: "合同起止日期",
            align: 'center',
            dataIndex: 'startDate',
            key: 'startDate',
            customRender:(text,record)=>{
              const range = `${text}~${record.endDate}`
              return <a-tooltip
                placement="topLeft"
                title={range}
              >{range}</a-tooltip>
            }
          },
          {
            width:120,
            ellipsis: true,
            title: "业务类型",
            dataIndex: 'businessType',
            key: 'businessType',
            customRender:(text)=>{
              const business = filterDict(this.businessTypeDicts, text)
              return <a-tooltip
                placement="topLeft"
                title={business}
              >{business}</a-tooltip>
            }
          },
          {
            width:110,
            ellipsis: true,
            title: '操作',
            key: 'operation',
            align: 'center',
            fixed:'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        recordList:[
          {
            title: "操作人",
            dataIndex: 'createUserName',
            width:60,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: "操作时间",
            dataIndex: 'createTime',
            width:100,
            ellipsis: true,
            customRender:(text)=>{
              return <a-tooltip
                placement="topLeft"
                title={text}
              >{text}</a-tooltip>
            }
          },
          {
            title: "操作内容",
            dataIndex: 'differenceInfo',
            width:250,
            ellipsis: true,
            customRender:(text)=>{
              const field = []
              text.split(',').map((item)=>{
                field.push(this.fields[item])
              })
              const res = field.join(',')
              return <a-tooltip
                placement="topLeft"
                title={res}
              >{res}</a-tooltip>
            }
          },

        ],
        recordSource:[],
        fields:{
          customerName:'客户名称',
          nature:'客户性质',
          customerType: '客户类型',
          industryBelong:'行业类型',
          industrySub:'行业细分',
          province:'客户地址所在省',
          city:'客户地址所在市',
          town:'客户地址所在区',
          address:'客户详细地址',
          belongProvince:'服务归属地所在省',
          belongCity:'服务归属地所在市',
          belongTown:'服务归属地所在区',
        },
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
          total: 0
        },
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          'agree': '成功',
          'reject': '驳回'
        }
        return statusMap[status]
      },
      statusTypeFilter(type) {
        const statusTypeMap = {
          'agree': 'success',
          'reject': 'error'
        }
        return statusTypeMap[type]
      }
    },
    methods: {
      getCustomerType(val){
        const arr = ['集团客户','重点客户','一般客户','电信客户']
        return arr[val]
      },
      changeLog(record){
        const arr = []
        if(record.differenceInfo){
          const oldInfo = JSON.parse(record.oldInfo)
          const newInfo = JSON.parse(record.newInfo)
          record.differenceInfo.split(',').map((item)=>{
            switch (true){
              case /(belongProvince|belongCity|belongTown)/.test(item) : {
                  let index;
                  switch (item){
                    case 'belongProvince' :
                      index = 0;
                    break;
                    case 'belongCity' :
                      index = 1;
                    break;
                    case 'belongTown' :
                      index = 2;
                    break;
                  }
                  arr.push({
                    name:this.fields[item],
                    oldField:getAreaFieldName(oldInfo.belongProvince,oldInfo.belongCity,oldInfo.belongTown,index),
                    newField:getAreaFieldName(newInfo.belongProvince,newInfo.belongCity,newInfo.belongTown,index)
                  })
                }
              break;
              case /(province|city|town)/.test(item) : {
                let index
                switch (item){
                  case 'province' :
                    index = 0;
                  break;
                  case 'city' :
                    index = 1;
                  break;
                  case 'town' :
                    index = 2;
                  break;
                }
                arr.push({
                  name:this.fields[item],
                  oldField:getAreaFieldName(oldInfo.province,oldInfo.city,oldInfo.town,index),
                  newField:getAreaFieldName(newInfo.province,newInfo.city,newInfo.town,index),
                })
              }
              break;
              case /industryBelong/.test(item) : {
                arr.push({
                  name:this.fields[item],
                  oldField:getNameFromArr(this.industryBelongs,oldInfo[item],'id','label'),
                  newField:getNameFromArr(this.industryBelongs,newInfo[item],'id','label')
                })
              }
              break;
              case /nature/.test(item) : {
                arr.push({
                  name:this.fields[item],
                  oldField:getNameFromArr(this.customerNatures,oldInfo[item],'value','label'),
                  newField:getNameFromArr(this.customerNatures,newInfo[item],'value','label')
                })
              }
              break;
              case /industrySub/.test(item) : {
                arr.push({
                  name:this.fields[item],
                  oldField:getNameFromArr(this.industrySub,oldInfo[item],'id','label'),
                  newField:getNameFromArr(this.industrySub,newInfo[item],'id','label')
                })
              }
              break;
              case /customerType/.test(item) : {
                arr.push({
                  name:this.fields[item],
                  oldField:this.getCustomerType(oldInfo[item]),
                  newField:this.getCustomerType(newInfo[item])
                })
              }
              break;
              default :
                arr.push({
                  name:this.fields[item],
                  oldField:oldInfo[item] || '空',
                  newField:newInfo[item] || '空'
                })
              break
            }
          })
        }
        return arr
      },
      getPageDate(current,size){
        httpAction(`/hrBase/lupdaterecord/page?modul=0&domainId=${this.model.id}&current=${current}&size=${size}`,null,'get').then((res) => {
          if(res.code === 200 && res.data){
            this.recordSource = res.data.records
            this.ipagination.total = res.data.total
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      tableChange(pagination){
        //分页、排序、筛选变化时触发
        this.ipagination = pagination
        this.getPageDate(pagination.current,pagination.pageSize)
      },
      imagesPreviewShow(record) {
        this.$refs.imagesViewModal.showModal(record)
      },
      edit(record) {
        this.model = Object.assign({parentContractName:''}, record)
        this.customerContractList = this.model.contractVoList;
        this.model.belongArea = getAreaName(this.model.belongProvince,this.model.belongCity,this.model.belongTown,' ')
        this.model.customerAddress = getAreaName(this.model.province,this.model.city,this.model.town,'')
        this.model.nature = getNameFromArr(this.customerNatures,this.model.nature,'value','label')
        this.model.industryBelong = getNameFromArr(this.industryBelongs,this.model.industryBelong,'id','label')
        this.model.industrySub = getNameFromArr(this.industrySub,this.model.industrySub,'id','label')
        if(Number(this.model.parentId)){
          httpAction(`hrBase/tcustomerinfo/${this.model.parentId}`,null,'get').then(res=>{
            if(res.code === 200 && res.data){
              this.model.parentContractName = res.data.customerName      
            }
          })
        }
        // 查询操作记录
        httpAction(`/hrBase/lupdaterecord/page?modul=0&domainId=${this.model.id}`,null,'get').then((res)=>{
          if(res.code === 200){
            this.recordSource = res.data.records
          }
        }).finally(()=>{
          this.visible = true
        })
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
        this.model = {}
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
</style>
