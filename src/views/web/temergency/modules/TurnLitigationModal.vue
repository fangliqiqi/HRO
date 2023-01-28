<template>
  <a-modal
    :title="title"
    :width="'90%'"
    placement="right"
    :closable="true"
    :footer="null"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirm-loading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-tabs defaultActiveKey="1">
              <a-tab-pane
                :tab="tabTitle"
                key="1"
              >
                <a-row>
                  <a-col :span="24">
                    <a-steps :current="current">
                      <a-step title="基本信息" />
                      <a-step title="事件信息" />
                      <a-step title="方案意见" />
                      <a-step title="材料附件" />
                    </a-steps>
                  </a-col>
                </a-row>
                <div
                  class="content"
                  v-show="current == 0"
                >
                  <a-row class="mbot">
                    <a-col :span="12">
                      <span class="name">{{ rowEmpoyee.empName }}</span> {{ insuranceInfo.empAge }}岁
                    </a-col>
                    <a-col
                      :span="3"
                      :offset="9"
                    >
                      历史发生事件 <span
                        class="num"
                        @click="history"
                      >{{ insuranceInfo.record || 0 }}</span> 起
                    </a-col>
                  </a-row>
                  <detail-list>
                    <detail-list-item term="性别">{{ rowEmpoyee.empSex }}</detail-list-item>
                    <detail-list-item term="社会保险">{{ insuranceInfo.socialStatusStr || '未购买' }}</detail-list-item>
                  </detail-list>
                  <detail-list>
                    <detail-list-item term="身份证">{{ rowEmpoyee.empIdcard }}</detail-list-item>
                    <detail-list-item term="商业保险">
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          {{ insuranceInfo.insuranceStr || '未购买' }}
                        </template>
                        <span class="overflow">
                          {{ insuranceInfo.insuranceStr || '未购买' }}
                        </span>
                      </a-tooltip>
                    </detail-list-item>
                  </detail-list>
                  <detail-list>
                    <detail-list-item term="联系方式">{{ insuranceInfo.empPhone }}</detail-list-item>
                    <detail-list-item term="职位">{{ insuranceInfo.post }}</detail-list-item>
                  </detail-list>

                  <detail-list>
                    <detail-list-item term="客户单位">
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          {{ rowEmpoyee.customerName || '' }}
                        </template>
                        <span class="overflow">
                          {{ rowEmpoyee.customerName || '' }}
                        </span>
                      </a-tooltip>
                    </detail-list-item>
                    <detail-list-item term="结算主体">
                      <a-tooltip placement="topLeft">
                        <template slot="title">
                          {{ (settleDomainOptions[rowEmpoyee.settleDomain]) ? settleDomainOptions[rowEmpoyee.settleDomain].departName : '暂无' }}
                        </template>
                        <span class="overflow">
                          {{ (settleDomainOptions[rowEmpoyee.settleDomain]) ? settleDomainOptions[rowEmpoyee.settleDomain].departName : '暂无' }}
                        </span>
                      </a-tooltip>
                    </detail-list-item>
                  </detail-list>
                  <detail-list>
                    <detail-list-item term="业务类型">{{ rowEmpoyee.businessTypeName }}</detail-list-item>
                    <detail-list-item term="劳动合同期限">
                      <template v-if="insuranceInfo.contractStart">
                        {{ insuranceInfo.contractStart }} ~ {{ insuranceInfo.contractEnd }}
                      </template>
                      <template v-else>
                        暂无合同
                      </template>
                    </detail-list-item>
                  </detail-list>
                  <detail-list>
                    <detail-list-item term="社保参保地">{{ insuranceInfo.area || '暂无' }}</detail-list-item>
                    <detail-list-item term="前12个月平均工资">{{ insuranceInfo.averageSalary || '--' }}</detail-list-item>
                  </detail-list>
                  <a-divider />
                  <a-form
                    :form="riskForm"
                    layout="inline"
                    class="ant-advanced-search-form"
                  >
                    <a-row>
                      <a-col :span="9">
                        <a-form-item
                          label="皖信工龄"
                          class="stepFormlabel"
                        >
                          <a-input
                            placeholder="年"
                            addonAfter="年"
                            style="width: 100px;"
                            v-decorator="['workLengthWxYear',validatorRules.workLengthWxYear]"
                          />
                        </a-form-item>
                        <a-form-item
                          label=""
                          :colon="false"
                          class="stepFormlabel1"
                        >
                          <a-input
                            placeholder="月"
                            addonAfter="月"
                            style="width: 100px"
                            v-decorator="['workLengthWxMonth',validatorRules.workLengthWxMonth]"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="10">
                        <a-form-item
                          label="客户单位工龄"
                          class="stepFormlabel"
                        >
                          <a-input
                            placeholder="年"
                            addonAfter="年"
                            style="width: 100px;"
                            v-decorator="['workLengthCustomerYear',validatorRules.workLengthCustomerYear]"
                          />
                        </a-form-item>
                        <a-form-item
                          label=""
                          :colon="false"
                          class="stepFormlabel1"
                        >
                          <a-input
                            placeholder="月"
                            addonAfter="月"
                            style="width: 100px"
                            v-decorator="['workLengthCustomerMonth',validatorRules.workLengthCustomerMonth]"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form>
                </div>
                <div
                  class="content"
                  v-show="current == 1"
                >
                  <a-form
                    :form="thingForm"
                    layout="inline"
                    class="ant-advanced-search-form"
                  >
                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          label="原告/被告"
                          class="stepFormText"
                        >
                          <a-radio-group v-decorator="['plaintiffOrDefendant',{rules: [{ required: true, message: '请选择原告被告!' }] }]">
                            <a-radio value="0">原告</a-radio>
                            <a-radio value="1">被告</a-radio>
                          </a-radio-group>
                        </a-form-item>
                      </a-col>
                      <a-col :span="9">
                        <a-form-item
                          label="客户单位"
                          class="stepFormText"
                        >
                          <!-- <a-tree-select
                            showSearch
                            style="width: 200px"
                            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                            :treeData="customerTreeData"
                            placeholder="请选择客户单位"
                            treeNodeFilterProp="title"
                            treeDefaultExpandAll
                            @change="treeSelectChange"
                            v-decorator="['unitId',{rules: [{ required: true, message: '请选择客户单位!' }] }]"
                          ></a-tree-select> -->
                          <select-page
                            placeholder="请选择客户单位"
                            style="width: 200px"
                            v-decorator="['unitId', {rules: [{ required: true, message: '请选择客户单位!' }]}]"
                            :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                            :title="'customerName'"
                            @select="handleSelect"
                            :id="'id'"
                          ></select-page>
                        </a-form-item>
                      </a-col>
                      <a-col :span="14">
                        <a-form-item
                          label="个人"
                          class="stepFormText"
                        >
                          {{ rowEmpoyee.empName }}
                        </a-form-item>
                      </a-col>
                      <a-col :span="9">
                        <a-form-item
                          label="诉讼时间"
                          class="stepFormText"
                        >
                          <a-date-picker
                            placeholder="请选择诉讼时间"
                            style="width: 200px"
                            format="YYYY-MM-DD"
                            v-decorator="['eventOccurrenceTime',{rules: [{ required: true, message: '请选择诉讼时间!' }] }]"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="15">
                        <a-form-item
                          label="法院"
                          class="stepFormText"
                        >
                          <a-input
                            placeholder="请输入法院名称"
                            v-decorator="['eventOccurrenceAddr',{rules: [{ required: true, message: '请输入法院名称!' },{max:50,message:'法院名称最多50个字符!'}] }]"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="24">
                        <a-form-item
                          label="原告诉求"
                          class="stepFormText"
                        >
                          <a-textarea
                            rows="4"
                            cols="130"
                            style="resize:none"
                            placeholder="请输入原告诉求"
                            v-decorator="['eventThrough',{rules: [{ required: true, message: '请输入原告诉求!' },{max:500,message:'原告诉求最多500个字符!'}] }]"
                          ></a-textarea>
                        </a-form-item>
                      </a-col>

                    </a-row>
                  </a-form>
                </div>
                <div
                  class="content"
                  v-show="current == 2"
                >
                  <a-form
                    :form="planForm"
                    layout="vertical"
                  >
                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          label="法务意见"
                          :label-col="{ span: 24 }"
                          :wrapper-col="{ span: 24 }"
                        >
                          <a-textarea
                            rows="4"
                            cols="150"
                            placeholder="请输入法务意见"
                            v-decorator="['customerOpinion',validatorRules.customerOpinion]"
                          ></a-textarea>
                        </a-form-item>
                      </a-col>
                      <a-col :span="24">
                        <a-form-item
                          label="部门/子分公司处理方案、意见"
                          :label-col="{ span: 24 }"
                          :wrapper-col="{ span: 24 }"
                        >
                          <a-textarea
                            rows="4"
                            cols="128"
                            placeholder="请输入部门/子分公司处理方案、意见"
                            v-decorator="['organOpinion',validatorRules.organOpinion]"
                          ></a-textarea>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form>
                </div>
                <div
                  class="content"
                  v-show="current == 3"
                >
                  <a-row>
                    <a-col :span="24">
                      <a-upload-dragger
                        :multiple="true"
                        name="file"
                        :fileList="fileList"
                        :beforeUpload="beforeUpload"
                        :remove="removeFile"
                        @change="handleChange"
                        accept="image/*,.xls,.xlsx,.csv,.pdf,.doc,.docx,.m4a,.mp3,.zip,.rar"
                      >
                        <p class="ant-upload-drag-icon">
                          <a-icon type="inbox" />
                        </p>
                        <p class="ant-upload-text">点击或者拖拽上传</p>
                      </a-upload-dragger>
                    </a-col>
                  </a-row>
                </div>
                <div class="steps-action">
                  <a-button
                    type="primary"
                    style="margin-bottom:0px;"
                    @click="next"
                    v-if="current < 3"
                    :disabled="disabledBtn"
                  >下一步</a-button>
                  <a-button
                    type="primary"
                    v-if="current == 3"
                    style="margin-bottom:0px;"
                    @click="handleOk"
                  >保存</a-button>
                  <a-button
                    style="margin-left: 8px;margin-bottom:0px;"
                    v-if="current != 0"
                    @click="prev"
                  >返回上一步</a-button>
                </div>
              </a-tab-pane>
              <a-tab-pane
                tab="详情"
                key="2"
              >
                <a-divider orientation="left">事件信息</a-divider>
                <div v-if="flag == 0">
                  <a-card :bordered="false">
                    <detail-list>
                      <detail-list-item term="事件发生时间">{{ moment(model.eventOccurrenceTime).format('YYYY-MM-DD HH:mm:ss') }}</detail-list-item>
                      <detail-list-item term="事件发生地点">{{ model.eventOccurrenceAddr }}</detail-list-item>
                      <detail-list-item term="伤害部位">{{ model.injuryPosition }}</detail-list-item>
                    </detail-list>
                    <detail-list>
                      <detail-list-item term="是否治疗">{{ isCuringOption[model.isCuring] }}</detail-list-item>
                      <detail-list-item term="治疗类型">{{ model.curingType }}</detail-list-item>
                      <detail-list-item term="就诊医院">{{ model.curingHospital }}</detail-list-item>
                    </detail-list>
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="事件发生经过">{{ model.eventThrough }}</detail-list-item>
                    </detail-list>
                  </a-card>
                  <a-divider orientation="left">方案意见</a-divider>
                  <a-card :bordered="false">
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="赔付方案">{{ model.payPlan }}</detail-list-item>
                    </detail-list>
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="客户意见">{{ model.customerOpinion }}</detail-list-item>
                    </detail-list>
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="部门/子分公司处理方案、意见">{{ model.organOpinion }}</detail-list-item>
                    </detail-list>
                  </a-card>
                </div>
                <div v-if="flag == 3">
                  <a-card :bordered="false">
                    <detail-list>
                      <detail-list-item term="仲裁时间">{{ moment(model.eventOccurrenceTime).format('YYYY-MM-DD HH:mm:ss') }}</detail-list-item>
                    </detail-list>
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="仲裁个人诉求">{{ model.eventThrough }}</detail-list-item>
                    </detail-list>
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="事件说明">{{ model.eventOccurrenceAddr }}</detail-list-item>
                    </detail-list>
                  </a-card>
                  <a-divider orientation="left">方案意见</a-divider>
                  <a-card :bordered="false">
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="赔付方案">{{ model.payPlan }}</detail-list-item>
                    </detail-list>
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="法务意见">{{ model.customerOpinion }}</detail-list-item>
                    </detail-list>
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="部门/子分公司处理方案、意见">{{ model.organOpinion }}</detail-list-item>
                    </detail-list>
                  </a-card>
                </div>
                <div v-if="flag == 5">
                  <a-card :bordered="false">
                    <detail-list>
                      <detail-list-item term="发生时间">{{ moment(model.eventOccurrenceTime).format('YYYY-MM-DD HH:mm:ss') }}</detail-list-item>
                    </detail-list>
                    <detail-list>
                      <detail-list-item term="劳动保障部门">{{ model.eventOccurrenceAddr }}</detail-list-item>
                      <detail-list-item term="投诉渠道">{{ (model.eventResource == 0) ? '电话' : '纸质' }}</detail-list-item>
                    </detail-list>
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="投诉内容">{{ model.eventThrough }}</detail-list-item>
                    </detail-list>
                  </a-card>
                  <a-divider orientation="left">方案意见</a-divider>
                  <a-card :bordered="false">
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="法务意见">{{ model.customerOpinion }}</detail-list-item>
                    </detail-list>
                    <detail-list
                      layout="vertical"
                      :col="24"
                    >
                      <detail-list-item term="部门/子分公司处理方案、意见">{{ model.organOpinion }}</detail-list-item>
                    </detail-list>
                  </a-card>
                </div>
                <a-divider orientation="left">材料附件</a-divider>
                <a-card :bordered="false">
                  <span v-if="fileLists.length == 0">暂无附件</span>
                  <ul
                    class="filelist"
                    v-if="fileLists.length"
                  >
                    <li
                      v-for="(item, index) in fileLists"
                      :key="index"
                      :value="item.uid"
                    >
                      <span class="filename">{{ item.name }}</span>
                      <span
                        class="down"
                        @click="down(item)"
                      >下载</span>
                    </li>
                  </ul>
                </a-card>
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>

      </a-form>
      <!--历史事件-->
      <History-Event-Modal ref="HistoryEventModalForm"></History-Event-Modal>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,postActionHeader } from '@/api/manage'
  import { initDictOptions,filterDictText,filterDict } from '@/components/dict/JDictSelectUtil'
  import { getAllSettleDomainSelectVos } from '@/api/api'
  import HistoryEventModal from './HistoryEventModal'
  import pick from 'lodash.pick'
  import moment from 'moment'
  import pinyin from 'pinyin'
  import SelectPage from '@/components/jeecg/SelectPage'
  import DetailList from '@/components/tools/DetailList'
  const DetailListItem = DetailList.Item

  export default {
    name: 'TurnLitigationModal',
    components: {
      DetailList,
      DetailListItem,
      HistoryEventModal,
      SelectPage
    },
    data() {
      return {
        ids: '',
        model: {},
        allModel:{}, //所有表单的属性
        title: '转为诉讼',
        tabTitle:'诉讼事件申报',
        visible: false,
        confirmLoading: false,
        moment,
        flag:0, // 0工伤事件1非因工
        current: 0, //当前步骤
        rowEmpoyee:{}, //选中的员工信息
        settleDomainOptions: [],//结算主体
        eventTypeOptions:[], //事件类型
        businessTypeDicts:[], //业务类型
        disabledBtn:false, //是否可以进入下一步
        isCuringOption:['是','否'], //是否治疗
        treatmentTypeOption:[], //治疗类型
        insuranceInfo:{
          insuranceStr:''
        }, //社保商险信息
        remainParams:{}, //剩余字段
        contractCustomerName: '',
        customerTreeData: [], //客户单位

        riskForm: this.$form.createForm(this),
        thingForm: this.$form.createForm(this),
        planForm:this.$form.createForm(this),
        fileList: [],
        fileLists: [],
        attaIdArray:[], //附件数组
        validatorRules: {
          
          workLengthWxYear: { rules: [{ required: true, pattern:/^\d{1,2}$/,message: '年份不正确!' }] },
          workLengthCustomerYear: { rules: [{ required: true, pattern:/^\d{1,2}$/,message: '年份不正确!' }] },
          workLengthWxMonth: { rules: [{ required: true, pattern:/^[0-9]$|(1(0|1|2))$/,message: '月份不正确!' }] }, 
          workLengthCustomerMonth: { rules: [{ required: true, pattern:/^[0-9]$|(1(0|1|2))$/,message: '月份不正确!' }] }, 
        
          eventOccurrenceTime:{rules: [{ required: true, message: '请选择仲裁时间!' }]},
          eventThrough:{rules: [{ required: true, message: '请输入仲裁个人诉求!' },{max:500,message:'个人诉求最多500个字符!'}]},
          eventOccurrenceAddr:{rules: [{ required: true, message: '请输入事件说明!' },{max:500,message:'事件说明最多500个字符!'}]},
          payPlan:{rules: [{ required: true, message: '请输入赔付方案!' },{max:500,message:'赔付方案最多500个字符!'}]},
          customerOpinion:{rules: [{ required: true, message: '请输入客户意见!' },{max:500,message:'客户意见最多500个字符!'}]},
          organOpinion:{rules: [{ required: true, message: '请输入部门/子分公司处理方案、意见!' },{max:500,message:'部门/子分公司处理方案、意见最多500个字符!'}]},
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          getinfo: '/hrBase/temployeeinfo/', //根据员工ID查询员工信息
          list: '/hrBase/temployeeinfo/pageForEmergency?deleteFlag=0', //员工信息列表请求地址
          getCustomerById:'/hrBase/tcustomerinfo/getCusNameAndBusinessType', //查询客户单位
          getEmpInsurance:'/hrEmergency/tcomplaintevent/insertInfo/', //获取该员工社保商险信息
          importUrl:'/hrEmergency/fileUpload/ossUploadFile', //上传文件
          delAttachUrl:'/hrEmergency/fileUpload/ossFileDelete/',//附件删除
          getAttachUrl:'/hrEmergency/fileUpload/ossFileUrl/domain/', //获取附件
          submitUrl:'/hrEmergency/tlitigationevent', //提交诉讼
          getCustomerInfo: '/hrBase/tcustomerinfo/',
          getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        }
      }
    },
    methods: {
      handleSelect(val){
        this.$nextTick(() => {
          this.thingForm.setFieldsValue(pick({unitId:val},'unitId'))
        })
      },
      edit(record) {
        this.initDictConfig()
        this.riskForm.resetFields()
        this.thingForm.resetFields()
        // this.model = record
        this.insuranceInfo.empPhone = record.complaintEvent.empPhone
        this.insuranceInfo.post = record.complaintEvent.post
        this.insuranceInfo.empAge = record.complaintEvent.empAge
        if(record.complaintEvent.averageSalary != undefined){
          this.insuranceInfo.averageSalary = record.complaintEvent.averageSalary
        }
        this.remainParams = {
          empPhone:record.complaintEvent.empPhone,
          post:record.complaintEvent.post,
          empAge:record.complaintEvent.empAge,
          province:record.complaintEvent.province,
          provinceName:record.complaintEvent.provinceName,
          town:record.complaintEvent.town,
          townName:record.complaintEvent.townName,
          city:record.complaintEvent.city,
          cityName:record.complaintEvent.cityName,
          contractId:record.complaintEvent.contractId,
          contractEnd:record.complaintEvent.contractEnd,
          contractStart:record.complaintEvent.contractStart,
          emCusId:record.complaintEvent.emCusId,
          emIdCard:record.complaintEvent.emIdCard,
          emName:record.complaintEvent.emName,
          emSettleId:record.complaintEvent.emSettleId,
          empId:record.complaintEvent.empId,
          complaintId:record.complaintEvent.id,
          socialId:record.complaintEvent.socialId,
          socialStatus:record.complaintEvent.socialStatus,
          insuranceStatus:record.complaintEvent.insuranceStatus,
        }
        
        // 结算主体和所属单位
        getAllSettleDomainSelectVos().then((res) => {
          if (res.code === 200) {
            this.settleDomainOptions = res.data
          } else {
            this.$message.error('结算主体和所属单位数据请求失败！')
          }
        })
        //商险
        if(record.insurance){
          for(let item of record.insurance){
            this.insuranceInfo.insuranceStr += ' ' + item.insuranceTypeName
          }
        }
        //获取附件信息
        httpAction(this.url.getAttachUrl+record.complaintEvent.id+'?type='+this.flag,null,'get').then((res) => {
          if(res.code == 200 && res.data){
            this.fileLists = []
            for(let item of res.data){
              this.fileLists.push({
                uid:item.id,
                name:item.attaName,
                status:'done',
                url:item.attaSrc,
              })
            }
          }else{
            this.fileLists = []
          }
        });
        //社保购买地
        this.insuranceInfo.area = record.complaintEvent.provinceName + record.complaintEvent.cityName + record.complaintEvent.townName
        //社保状态
        switch(record.complaintEvent.socialStatus){
          case '0' :
            this.insuranceInfo.socialStatusStr = '已购买，与劳动合同起始时间一致'
            break
          case '1' :
            this.insuranceInfo.socialStatusStr = '已购买，与劳动合同起始时间不一致'
            break
          case '2' :
            this.insuranceInfo.socialStatusStr = '未购买'
            break
        }
        //合同期限 历史时间次数
        httpAction(this.url.getEmpInsurance+record.complaintEvent.empId,null,'get').then((res) => {
          if(Number(res.code) === 200 && res.data){
            this.insuranceInfo.contractStart = res.data.contractStart
            this.insuranceInfo.contractEnd = res.data.contractEnd
            this.insuranceInfo.record = res.data.record
          }
        });
        this.model = Object.assign({insurance:record.insurance}, record.complaintEvent)
        const _this = this
        httpAction(this.url.getinfo+record.complaintEvent.empId,null,'get').then((res) => {
          if(Number(res.code) === 200){
            _this.rowEmpoyee = res.data
            _this.rowEmpoyee.empSex = filterDictText(_this.sexOptions,_this.rowEmpoyee.empSex)
            //查询客户单位
            httpAction(`${_this.url.getCustomerById}?cusId=${_this.rowEmpoyee.belongUnit}&settleDomainId=${_this.rowEmpoyee.settleDomain}`,null,'get').then((result) => {
              if(Number(result.code) === 200 && result.data){
                _this.rowEmpoyee.customerName = result.data.cusName //客户单位 this.businessTypeDicts
                _this.remainParams.businessType = result.data.businessType
                _this.rowEmpoyee.businessTypeName = filterDict(_this.businessTypeDicts,result.data.businessType)
                _this.visible = true
              }else{
                _this.$message.warning(result.msg)
              }
            });
          }
        })
      },

      down(item){
        window.open(item.url)
      },

      next(){
        if(Number(this.current) === 0){
          //获取客户单位
          httpAction(this.url.getTreeData, null, 'get').then(res => {
            this.customerTreeData = res.data
          })
          //验证
          this.allModel = {}
          this.riskForm.validateFields((err, values) => {
            if(!err){
              values.averageSalary = this.insuranceInfo.averageSalary
              this.allModel = Object.assign(this.allModel, values)
              this.current++
            }
          })
          return false
        }
        if(Number(this.current) === 1){
          this.thingForm.validateFields((err, values) => {
            if(!err){
              this.getDiffrenceSetData(this.allModel,values)
              //处理时间格式 values.eventOccurrenceTime
              values.eventOccurrenceTime = moment(values.eventOccurrenceTime).format('YYYY-MM-DD HH:mm:ss');
              this.allModel = Object.assign(this.allModel, values)
              this.current++
            }
          })
          return false
        }
        if(Number(this.current) === 2){
          this.planForm.validateFields((err, values) => {
            if(!err){
              this.getDiffrenceSetData(this.allModel,values)
              this.allModel = Object.assign(this.allModel, values)
              this.current++
            }
          })
          return false
        }
        this.current++
      },

      prev() {//上一步
        this.current--
      },

      // 保存按钮
      handleOk() {
        const _this = this
        _this.confirmLoading = true
        let formData = Object.assign(this.allModel,this.remainParams)
        let params = {insurance:''}
        params.insurance = this.model.insurance
        if(Number(this.flag) === 0){
          // params.abitrationEvent = formData
        }else if(Number(this.flag) === 5){
          params.litigationEvent = formData
        }
        httpAction(`${this.url.submitUrl}?attaIdArray=${this.attaIdArray}`, params, 'post').then((res) => {
          const msg = res.msg || res.message
          if (Number(res.code) === 200) {
            _this.$message.success(`${_this.title}成功！`)
            _this.$emit('ok')
            _this.close()
          } else {
            _this.$message.warning(msg)
          }
        }).finally(() => {
          _this.confirmLoading = false
        })
      },

      //历史事件
      history(){
        if(this.insuranceInfo.record){
          this.$refs.HistoryEventModalForm.flag = this.flag
          this.$refs.HistoryEventModalForm.treatmentTypeOption = this.treatmentTypeOption
          this.$refs.HistoryEventModalForm.settleDomainOptions = this.settleDomainOptions
          this.$refs.HistoryEventModalForm.businessTypeDicts = this.businessTypeDicts
          this.$refs.HistoryEventModalForm.show(this.rowEmpoyee,this.insuranceInfo)
        }else{
          this.$message.warning('暂无历史事件')
        }
      },

      handleCancel() {
        this.close()
      },

      close() {
        this.riskForm.resetFields()
        this.$emit('close')
        this.visible = false
        this.current = 0
      },

      //取两个对象的差集
      getDiffrenceSetData(obj1,obj2){
        for(let item in obj2){
          if (item in obj1) {
            delete obj1[item]
          }
        }
      },

      disabledDate(current){
        return current > moment().endOf('day');
      },

      beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false;
      },

      //上传
      handleChange(){
        const { fileList } = this
        if(fileList[fileList.length - 1].name.length > 50){
          this.$message.warning(fileList[fileList.length - 1].name+`文件名称长度超过50个字符`)
          this.fileList.splice(this.fileList.length - 1, 1)
          return false
        }
        if(fileList[fileList.length - 1].size > 50*1024*1024){
          this.$message.warning(fileList[fileList.length - 1].name+`文件大小超过50M`)
          this.fileList.splice(this.fileList.length - 1, 1)
          return false
        }
        if (!/\.(gif|jpg|jpeg|png|xls|xlsx|csv|pdf|docx|doc|m4a|zip|rar)$/i.test(fileList[fileList.length - 1].name)) {  
          this.$message.warning(fileList[fileList.length - 1].name+`文件格式不正确`)
          this.fileList.splice(this.fileList.length - 1, 1)
          return false
        }
        this.confirmLoading = true
        this.uploadFilesChange(fileList[fileList.length - 1])
      },

      uploadFilesChange(file) {
        const formData = new FormData();
        formData.append("file", file);
        const contextType = {'Content-Type': 'multipart/form-data'};
        this.fileList.splice(this.fileList.length - 1, 1)
        postActionHeader(this.url.importUrl, formData,contextType,300000).then((res) => {
          if(Number(res.code) === 200){
            this.fileList.push(res.data)
            this.attaIdArray.push(res.data.uid)
            this.$message.success(`上传成功`)
          }else{
            this.$message.warning(res.msg)
          }
        }).finally(()=>{
          this.confirmLoading = false
        })
      },

      removeFile(fileInfo){
        const _this = this
        this.$confirm({
          title: '删除',
          content: '确定删除该附件？',
          okText: '确认',
          cancelText: '取消',
          onOk:function(){
            httpAction(_this.url.delAttachUrl+fileInfo.uid, null, 'get').then((res) => {
              if (Number(res.code) === 200) {
                _this.fileList.map((file,index)=>{
                  if(String(file.uid) === String(fileInfo.uid)){
                    //删除该附件
                    _this.fileList.splice(index,1);
                    _this.attaIdArray.splice(index,1);
                    return
                  }
                })
                _this.$message.success('删除附件成功！')
              } else {
                _this.$message.warning(res.msg)
              }
            })
          },
        });
        return false
      },

      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },

      // 数据字典
      initDictConfig() {
        // 性别
        initDictOptions('sex').then((res) => {
          if (Number(res.code) === 200) {
            this.sexOptions = res.data
          }
        })
        // 事件类别
        initDictOptions('emergency_event_type').then((res) => {
          if (Number(res.code) === 200) {
            this.eventTypeOptions = res.data
          }
        })
        //治疗类型
        initDictOptions('treatment_type').then((res) => {
          if (Number(res.code) === 200) {
            this.treatmentTypeOption = res.data;
          }
        })
      },

      // eslint-disable-next-line no-unused-vars
      treeSelectChange(value, label, extra) {
        httpAction(this.url.getCustomerInfo + value, null, 'GET').then(res => {
          if (Number(res.code) === 200) {
            const sz = pinyin(res.data.customerName, {
              style: pinyin.STYLE_FIRST_LETTER
            })
            let ename = ''
            if (sz.length > 0) {
              for (const i of sz) {
                ename += i[0]
              }
            }
            this.contractCustomerName = ename.toUpperCase()
          }
        })
      },
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
}
.no-bottom {
  margin-bottom: 0px !important;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
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
.content {
  margin-top: 16px;
  padding: 20px;
}
.num {
  color: #f30505;
  text-decoration: underline;
  cursor: pointer;
}
.mbot {
  margin-bottom: 20px;
}
</style>
