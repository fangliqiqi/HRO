<template>
  <a-spin :spinning="confirmLoading">
    <a-modal
      title="历史事件"
      :visible="historyVisible"
      :width="'90%'"
      @cancel="handleCancel"
      :footer="null"
      :maskClosable="false"
      :destroyOnClose="true"
      wrapClassName="wrapClass"
    >
      <a-tabs defaultActiveKey="0">
        <a-tab-pane
          v-for="(item,index) in historyList"
          :key="index"
          style="height:500px;overflow-y: scroll;"
          :tab="'历史事件'+(index+1)"
        >
          <a-divider orientation="left">基本信息</a-divider>
          <a-card :bordered="false">
            <a-row class="mbot">
              <a-col :span="12">
                <span class="name">{{ item.emName }}</span>
                {{ item.empAge }}岁
              </a-col>
            </a-row>
            <detail-list>
              <detail-list-item term="姓名">{{ item.emName }}</detail-list-item>
              <detail-list-item term="社会保险">{{ socialStatus[item.socialStatus] }}</detail-list-item>
            </detail-list>
            <detail-list>
              <detail-list-item term="性别">{{ item.empSex }}</detail-list-item>
              <detail-list-item term="商业保险">
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    {{ insuranceInfoArr[index] || '未购买' }}
                  </template>
                  <span class="overflow">
                    {{ insuranceInfoArr[index] || '未购买' }}
                  </span>
                </a-tooltip>
              </detail-list-item>
            </detail-list>
            <detail-list>
              <detail-list-item term="身份证">{{ item.emIdCard }}</detail-list-item>
              <detail-list-item term="联系方式">{{ item.empPhone }}</detail-list-item>
            </detail-list>
            <detail-list>
              <detail-list-item term="客户单位">
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    {{ item.customerName }}
                  </template>
                  <span class="overflow">
                    {{ item.customerName }}
                  </span>
                </a-tooltip>
              </detail-list-item>
              <detail-list-item term="岗位">{{ item.post }}</detail-list-item>
            </detail-list>
            <detail-list>
              <detail-list-item term="结算主体">
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    {{ item.departName }}
                  </template>
                  <span class="overflow">
                    {{ item.departName }}
                  </span>
                </a-tooltip>
              </detail-list-item>
              <detail-list-item term="业务类型">{{ item.businessTypeName }}</detail-list-item>
            </detail-list>
            <detail-list>
              <detail-list-item term="劳动合同期限">
                <template v-if="item.contractStart">
                  {{ item.contractStart }} ~ {{ item.contractEnd }}
                </template>
                <template v-else>
                  暂无合同
                </template>
              </detail-list-item>
              <detail-list-item term="社保参保地">
                <template v-if="item.provinceName">
                  {{ item.provinceName }} {{ item.cityName }} {{ item.townName }}
                </template>
                <span v-else>暂无</span>
              </detail-list-item>
            </detail-list>
            
            <detail-list v-if="flag>1">
              <detail-list-item term="皖信工龄">{{ item.workLengthWxYear }}年{{ item.workLengthWxMonth }}月</detail-list-item>
              <detail-list-item term="前12个月平均工资">{{ item.averageSalary }}</detail-list-item>
            </detail-list>
            <detail-list v-if="flag>1">
              <detail-list-item term="客户单位工龄">{{ item.workLengthCustomerYear }}年{{ item.workLengthCustomerMonth }}月</detail-list-item>
            </detail-list>
          </a-card>
          <a-divider orientation="left">事件信息</a-divider>
          <div v-if="flag == 0 || flag == 1">
            <a-card :bordered="false">

              <detail-list>
                <detail-list-item term="事件发生时间">{{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD') }}</detail-list-item>
                <detail-list-item term="事件发生地点">{{ item.eventOccurrenceAddr }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="事件发生经过">{{ item.eventThrough }}</detail-list-item>
              </detail-list>
              <div v-if="item.eventType == 5">
                <detail-list>
                  <detail-list-item term="车辆归属单位">{{ item.carOfUnit }}</detail-list-item>
                  <detail-list-item term="车辆保险购买单位">{{ item.carInsuranceUnit }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="交强险赔付额">{{ item.payStrongInsurance }}</detail-list-item>
                  <detail-list-item term="第三责任险保额">{{ item.thirdPartyLiabilityInsurance }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="伤者户口归属">{{ (item.woundedHukouAttribution == 0) ? '城镇居民' : '农村户口' }}</detail-list-item>
                  <detail-list-item term="受伤部位">{{ item.injuredArea }}</detail-list-item>
                  <detail-list-item term="受伤程度">{{ item.injuredDegree }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="第三人身份号">{{ item.thirdPersonIdCard }}</detail-list-item>
                  <detail-list-item term="年龄">{{ item.age }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="伤者家庭情况">{{ item.injuredFamilyStatus }}</detail-list-item>
                  <detail-list-item term="治疗费（预判）">{{ item.treatmentCosts }}</detail-list-item>
                </detail-list>
              </div>
              <div v-else>
                <detail-list>
                  <detail-list-item term="伤害部位">{{ item.injuryPosition }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="是否治疗">{{ isCuringOtion[item.isCuring] }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="治疗类型">{{ item.curingTypeName }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="就诊医院">{{ item.curingHospital }}</detail-list-item>
                </detail-list>
              </div>
            </a-card>
            <a-divider orientation="left">方案意见</a-divider>
            <a-card :bordered="false">
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="赔付方案">{{ item.payPlan }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="客户意见">{{ item.customerOpinion }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="部门/子分公司处理方案、意见">{{ item.organOpinion }}</detail-list-item>
              </detail-list>
            </a-card>
          </div>
          <div v-if="flag == 2">
            <a-card :bordered="false">
              <detail-list>
                <detail-list-item term="事件发生时间">{{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD HH:mm:ss') }}</detail-list-item>
              </detail-list>
              <detail-list>
                <detail-list-item term="事件类别">{{ retiredTypeOption[item.eventType].label }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="事件说明">{{ item.eventThrough }}</detail-list-item>
              </detail-list>
            </a-card>
            <a-divider orientation="left">方案意见</a-divider>
            <a-card :bordered="false">
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="赔付方案">{{ item.payPlan }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="法务意见">{{ item.customerOpinion }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="部门/子分公司处理方案、意见">{{ item.organOpinion }}</detail-list-item>
              </detail-list>
            </a-card>
          </div>
          <div v-if="flag == 3">
            <a-card :bordered="false">
              <detail-list>
                <detail-list-item term="仲裁时间">{{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD') }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="仲裁个人诉求">{{ item.eventThrough }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="事件说明">{{ item.eventOccurrenceAddr }}</detail-list-item>
              </detail-list>
            </a-card>
            <a-divider orientation="left">方案意见</a-divider>
            <a-card :bordered="false">
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="赔付方案">{{ item.payPlan }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="法务意见">{{ item.customerOpinion }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="部门/子分公司处理方案、意见">{{ item.organOpinion }}</detail-list-item>
              </detail-list>
            </a-card>
          </div>

          <div v-if="flag == 4">
            <a-card :bordered="false">
              <detail-list>
                <detail-list-item term="原告/被告">{{ (item.plaintiffOrDefendant == 0) ? '原告' : '被告' }}</detail-list-item>
              </detail-list>
              <detail-list>
                <detail-list-item term="客户单位">{{ customerDict(customerTreeData,item.unitId) }}</detail-list-item>
              </detail-list>
              <detail-list>
                <detail-list-item term="诉讼时间">{{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD') }}</detail-list-item>
                <detail-list-item term="法院">{{ item.eventOccurrenceAddr }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="原告诉求">{{ item.eventThrough }}</detail-list-item>
              </detail-list>
            </a-card>
            <a-divider orientation="left">方案意见</a-divider>
            <a-card :bordered="false">
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="法务意见"> {{ item.customerOpinion }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="部门/子分公司处理方案、意见"> {{ item.organOpinion }}</detail-list-item>
              </detail-list>
            </a-card>
          </div>
          <div v-if="flag == 5">
            <a-card :bordered="false">
              <detail-list>
                <detail-list-item term="发生时间">
                  {{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD') }}
                </detail-list-item>
              </detail-list>
              <detail-list>
                <detail-list-item term="劳动保障部门">
                  {{ item.eventOccurrenceAddr }}
                </detail-list-item>
              </detail-list>
              <detail-list>
                <detail-list-item term="投诉渠道">{{ (item.eventResource == 0) ? '电话' : '纸质' }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="投诉内容"> {{ item.eventThrough }}</detail-list-item>
              </detail-list>
            </a-card>
            <a-divider orientation="left">方案意见</a-divider>
            <a-card :bordered="false">
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="赔付方案（需要写明算法）"> {{ item.payPlan }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="法务意见"> {{ item.customerOpinion }}</detail-list-item>
              </detail-list>
              <detail-list
                layout="vertical"
                :col="24"
              >
                <detail-list-item term="部门/子分公司处理方案、意见"> {{ item.organOpinion }}</detail-list-item>
              </detail-list>
            </a-card>
          </div>

          <a-divider orientation="left">材料附件</a-divider>
          <a-card :bordered="false">
            <a-empty v-if="attachList[index] == null" />
            <ul
              class="filelist"
              v-if="attachList[index] != null"
            >
              <li
                v-for="(items, indexs) in attachList[index]"
                :key="indexs"
                :value="item.id"
              >
                <span class="filename">{{ items.attaName }}</span>
                <span
                  class="down"
                  @click="down(items)"
                >下载</span>
              </li>
            </ul>
            <a-row
              class="mbot"
              v-if="attachList[index] != null"
            >
              <a-col
                :span="2"
                :offset="1"
                style="margin-top:10px;"
              >
                <a-button
                  type="primary"
                  @click="downAll(item.id,item.emName)"
                >一键打包下载</a-button>
              </a-col>
            </a-row>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </a-spin>
</template>

<script>
import moment from 'moment'
import { filterDict,filterDictText,customerDict,initDictOptions } from '@/components/dict/JDictSelectUtil'
import { httpAction,downFile } from '@/api/manage'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: 'HistoryEventModal',
  components: {
    DetailList,
    DetailListItem,
  },
  data() {
    return {
      model: {},
      title: '历史事件',
      historyVisible: false,
      confirmLoading: false,
      businessTypeDicts: [], //业务类型
      isCuringOtion: ['是', '否'], //是否治疗
      socialStatus:['已购买，与劳动合同起始时间一致','已购买，与劳动合同起始时间不一致','未购买'],
      insuranceInfo:{}, //商业保险信息
      insuranceInfoArr:[], //商业保险信息
      treatmentTypeOption: [], //治疗类型
      settleDomainOptions: [], //结算主体
      departName: '', //结算主体名称
      fileList: [], //附件列表
      historyList:[], //历史事件详情
      attachList:[], //历史事件附件
      flag:0, // 0工伤1非因工
      customerName:'', //客户单位名称
      businessTypeName:'',//业务类型
      curingTypeName:'', //治疗类型
      organizationOption:[],
      customerTreeData:[],
      retiredTypeOption:[], //退工类型
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
     
      url: {
        down:'/hrEmergency/fileUpload/ossFileZip/domain/', //一键下载
        historyUrl:[
          '/hrEmergency/tworkinjuryevent/old/',
          '/hrEmergency/tnonworkevent/old/',
          '/hrEmergency/tretiredworkevent/old/',
          '/hrEmergency/tabitrationevent/old/',
          '/hrEmergency/tlitigationevent/old/',
          '/hrEmergency/tcomplaintevent/old/',
        ],
        fieldArr:['workInjuryEvent','nonWorkEvent','retiredWorkEvent','abitrationEvent','litigationEvent','complaintEvent'],
        getAttachUrl: '/hrEmergency/fileUpload/ossFileUrl/domain/', //获取附件列表
        getCustomerById: '/hrBase/tcustomerinfo/getCusNameAndBusinessType', //查询客户单位
      }
    }
  },

  methods: {
    moment,
    customerDict,
    show(record,insuranceInfo){
      if(this.flag == 2) this.initDictConfig()
      this.historyVisible = true
      this.insuranceInfo = insuranceInfo
      const _this = this
      httpAction(this.url.historyUrl[this.flag]+record.id,null,'get').then((res) => {
        if(res.code == 200 && res.data){
            for(let [index,item] of res.data.entries()){
              _this.$set(_this.historyList,index,item[_this.url.fieldArr[this.flag]])
              
              let str = ''
              if(item.insurance){
                for(let obj of item.insurance){
                  str += obj.insuranceTypeName
                }
              }
              _this.$set(_this.insuranceInfoArr,index,str)
              //获取附件
              httpAction(_this.url.getAttachUrl+item[_this.url.fieldArr[this.flag]].id+'?type='+_this.flag,null , 'get').then((result)=>{
                _this.attachList[index] = result.data
              })
              _this.historyList[index].empSex = record.empSex
              _this.historyList[index].curingTypeName = filterDictText(this.treatmentTypeOption, item[_this.url.fieldArr[this.flag]].curingType) //治疗类型
              // 结算主体
              _this.historyList[index].departName = (this.settleDomainOptions[item[_this.url.fieldArr[this.flag]].emSettleId]) ? this.settleDomainOptions[item[_this.url.fieldArr[this.flag]].emSettleId].departName : ''
              //查询客户单位合同相关信息
              httpAction(
                this.url.getCustomerById + '?cusId=' + item[_this.url.fieldArr[this.flag]].emCusId + '&settleDomainId=' + item[_this.url.fieldArr[this.flag]].emSettleId,
                null,'get').then(resu => {
                  _this.$set(_this.historyList[index], `customerName`, resu.data.cusName)
                  _this.$set(_this.historyList[index], `businessTypeName`, filterDict(this.businessTypeDicts, resu.data.businessType))
              })
            }
        }
      })

    },
    //下载附件
    down(record) {
      window.open(record.attaSrc,"_blank")
      // window.open('https://view.officeapps.live.com/op/view.aspx?src='+record.attaSrc,"_blank");
    },
    downAll(id,name){
      let httpurl = this.url.down+id+'?type='+this.flag
      const _this = this
       downFile(httpurl, null).then((res) => {
        let data = res;
        let fileReader = new FileReader();
        fileReader.onload = function() {
          try {
            let jsonData = JSON.parse(this.result)
            let msg = '下载失败'
            if (jsonData.msg) {
            // 说明是普通对象数据，后台转换失败
              msg += ','+jsonData.msg
            }
            _this.$message.warning(msg)
            return false
          } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            var blob = new Blob([res], {type: 'application/zip'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = name+'的材料附件' + '.zip' // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
          }
        };
        fileReader.readAsText(data)
      })
      
    },

    handleCancel() {
      this.close()
    },
    close() {
      this.historyVisible = false
      this.historyList = []
      this.flag = 0
      this.insuranceInfo = {}
    },

    initDictConfig() {
      //退工事件类型
      initDictOptions('retired_type').then(res => {
        if (res.code === 200) {
          this.retiredTypeOption = res.data
        }
      })
    }
    
  }
}
</script>
  
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
.ant-advanced-search-form {
  padding: 0px 0px 24px 0px;
}

.left {
  float: left;
}
.filelist {
  list-style: none;
  padding: 0px;
}
.filelist li {
  line-height: 25px;
  margin-bottom: 10px;
}
.filelist li:hover {
  color: #f30505;
}
.filelist li:hover .filename {
  background: rgba(24, 144, 255, 0.2);
}
.filelist .filename:hover {
  cursor: pointer;
}
.filelist .filename {
  width: 50%;
  display: inline-block;
  background: #f2f2f2;
}
.filelist .down {
  color: #1abc9c;
  margin: 0px 10px;
  cursor: pointer;
}
.name {
  margin: 0px 10px 0px 0px;
  font-weight: bold;
  font-size: 18px;
}
.num {
  color: #f30505;
  text-decoration: underline;
  cursor: pointer;
}
.mbot {
  margin-bottom: 20px;
}
.dialogBody {
  height: 650px;
  overflow-y: scroll;
}
.dialogBottom {
  bottom: 0px;
}
.dialogBottom .changeEventBtn {
  background-color: rgba(255, 153, 0, 1);
  color: #fff;
}
.dialogBottom .accessBtn {
  background-color: rgba(26, 188, 156, 1);
  color: #fff;
}
.dialogBottom .extraBtn {
  background-color: rgba(26, 188, 156, 1);
  color: #fff;
}
.dialogBottom .backBtn {
  background-color: rgba(255, 0, 0, 1);
  color: #fff;
}
.dialogBottom .ant-btn {
  margin-left: 10px !important;
  margin-top: 10px !important;
  margin-bottom: 0px !important;
}
.wrapClass .ant-modal-footer {
  overflow: hidden;
}
.wrapClass .ant-form-item {
  margin-bottom: 0px !important;
}
.overflow {
  display: inline-block;
  width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>