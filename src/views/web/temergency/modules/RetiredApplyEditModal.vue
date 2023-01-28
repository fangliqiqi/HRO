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
    :destroyOnClose="true"
    :confirm-loading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        layout="inline"
        class="ant-advanced-search-form"
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
          </a-row>
          <a-form
            :form="empForm"
            layout="inline"
          >
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="性别"
                  class="stepFormlabel"
                >
                  {{ rowEmpoyee.empSex }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="社会保险"
                  class="stepFormlabel"
                >
                  <!-- {{ insuranceInfo.socialStatusStr || '未购买' }} -->
                  <a-select
                    style="width: 200px"
                    :dropdownMatchSelectWidth="false"
                    placeholder="请选择社会保险"
                    v-decorator="['socialStatus']"
                  >
                    <a-select-option value="0">已购买，与劳动合同起始时间一致</a-select-option>
                    <a-select-option value="1">已购买，与劳动合同起始时间不一致</a-select-option>
                    <a-select-option value="2">未购买</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="身份证"
                  class="stepFormlabel"
                >
                  {{ rowEmpoyee.empIdcard }}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="商业保险"
                  class="stepFormlabel"
                >
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      {{ insuranceInfo.insuranceStr || '未购买' }}
                    </template>
                    <span class="overflow">
                      {{ insuranceInfo.insuranceStr || '未购买' }}
                    </span>
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="联系方式"
                  class="stepFormlabel"
                >
                  <a-input
                    placeholder="请输入联系方式"
                    style="width: 200px"
                    v-decorator="['empPhone',validatorRules.empPhone]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="岗位"
                  class="stepFormlabel"
                >
                  <a-input
                    placeholder="请输入岗位"
                    style="width: 200px"
                    v-decorator="['post',validatorRules.post]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="客户单位"
                  class="stepFormlabel"
                >
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      {{ rowEmpoyee.customerName || '' }}
                    </template>
                    <span class="overflow">
                      {{ rowEmpoyee.customerName || '' }}
                    </span>
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="结算主体"
                  class="stepFormlabel"
                >
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      {{ (settleDomainOptions[rowEmpoyee.settleDomain]) ? settleDomainOptions[rowEmpoyee.settleDomain].departName : '' }}
                    </template>
                    <span class="overflow">
                      {{ (settleDomainOptions[rowEmpoyee.settleDomain]) ? settleDomainOptions[rowEmpoyee.settleDomain].departName : '' }}
                    </span>
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="业务类型"
                  class="stepFormlabel"
                >{{ rowEmpoyee.businessTypeName }}</a-form-item>
              </a-col>
              <a-col :span="16" v-if="insuranceInfo.employeeContractInfo">
                <a-form-item
                  label="已有劳动合同"
                  class="stepFormlabel"
                >
                  <span 
                    v-for="(item,index) in insuranceInfo.employeeContractInfo" 
                    :key="index"
                  >
                    <a-tag color="blue">{{ item.contractStart }} ~ {{ item.contractEnd }}</a-tag>
                  </span>
                </a-form-item>
              </a-col>

            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="社保参保地"
                  class="stepFormlabel"
                >{{ insuranceInfo.area || '暂无' }}</a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item
                  label="劳动合同期限"
                  class="stepFormlabel"
                >
                  <a-range-picker
                    style="width:200px;"
                    v-decorator="['contractDate',{initialValue:defaultContract}]"
                    :format="'YYYY-MM-DD'"
                  />
                </a-form-item>
              </a-col>
            </a-row>
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
              <a-col :span="8">
                <a-form-item
                  label="前12个月平均工资"
                  class="stepFormlabel"
                >
                  {{ remainParams.averageSalary || '--' }}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
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
          <!--           
          <detail-list>
            <detail-list-item term="联系方式">{{ insuranceInfo.empPhone }}</detail-list-item>
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
            <detail-list-item term="岗位">
              {{ insuranceInfo.post }}
            </detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="结算主体">
              <a-tooltip placement="topLeft">
                <template slot="title">
                  {{ (settleDomainOptions[rowEmpoyee.settleDomain]) ? settleDomainOptions[rowEmpoyee.settleDomain].departName : '' }}
                </template>
                <span class="overflow">
                  {{ (settleDomainOptions[rowEmpoyee.settleDomain]) ? settleDomainOptions[rowEmpoyee.settleDomain].departName : '' }}
                </span>
              </a-tooltip>
            </detail-list-item>
            <detail-list-item term="业务类型">{{ rowEmpoyee.businessTypeName }}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="劳动合同期限">
              <template v-if="insuranceInfo.contractStart">
                {{ insuranceInfo.contractStart }} ~ {{ insuranceInfo.contractEnd }}
              </template>
              <template v-else>
                暂无合同
              </template>
            </detail-list-item>
            <detail-list-item term="社保参保地">{{ insuranceInfo.area || '暂无' }}</detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="皖信工龄">
              {{ model.workLengthWx || '--' }}
            </detail-list-item>
            <detail-list-item term="前12个月平均工资">
              {{ model.averageSalary || '--' }}
            </detail-list-item>
          </detail-list>
          <detail-list>
            <detail-list-item term="客户单位工龄">
              {{ model.workLengthCustomer || '--' }}
            </detail-list-item>
          </detail-list> -->

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
                  label="事件发生时间"
                  class="stepFormText"
                >
                  <a-date-picker
                    placeholder="请输入事件发生时间"
                    style="width: 200px"
                    format="YYYY-MM-DD"
                    :disabledDate="disabledDate"
                    v-decorator="['eventOccurrenceTime',validatorRules.eventOccurrenceTime]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="事件类别"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    placeholder="请选择事件类别"
                    optionFilterProp="children"
                    :filterOption="filterOption"
                    style="width: 200px"
                    v-decorator="['eventType',validatorRules.eventType]"
                  >
                    <a-select-option
                      v-for="(item, index) in eventTypeOptions"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  label="事件说明"
                  class="stepFormText"
                >
                  <a-textarea
                    rows="4"
                    cols="150"
                    placeholder="请输入事件说明"
                    v-decorator="['eventThrough',validatorRules.eventThrough]"
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
                  label="赔付方案（需要写明算法）"
                  :label-col="{ span: 24 }"
                  :wrapper-col="{ span: 24 }"
                >
                  <a-textarea
                    rows="4"
                    cols="150"
                    placeholder="请输入赔付方案（需要写明算法）"
                    v-decorator="['payPlan',validatorRules.payPlan]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  label="客户意见"
                  :label-col="{ span: 24 }"
                  :wrapper-col="{ span: 24 }"
                >
                  <a-textarea
                    rows="4"
                    cols="150"
                    placeholder="请输入客户意见"
                    v-decorator="['customerOpinion',validatorRules.customerOpinion]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
              <!-- <a-col :span="24">
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
              </a-col> -->
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,postActionHeader } from '@/api/manage'
  // import { filterObj } from '@/utils/util'
  import { initDictOptions,filterDictText,filterDict } from '@/components/dict/JDictSelectUtil'
  import pick from 'lodash.pick'
  import moment from 'moment' 
  import DetailList from '@/components/tools/DetailList'
  const DetailListItem = DetailList.Item

  export default {
    name: 'RetiredApplyEditModal',
    components: {
      DetailList,
      DetailListItem,
    },
    data() {
      return {
        ids: '',
        model: {},
        allModel:{}, //所有表单的属性
        title: '工伤申报',
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
        insuranceInfo:{}, //社保商险信息
        insurance:[], //商险信息
        remainParams:{}, //剩余字段
        method:'PUT',
        defaultContract:[],//合同起止时间

        contractCustomerName: "",
        thingForm: this.$form.createForm(this),
        planForm:this.$form.createForm(this),
        empForm: this.$form.createForm(this),
        fileList: [],

        validatorRules: {
          empPhone: { rules: [{ required: true,pattern:/^((0\d{2,3}-?\d{7,8})|(1[3456789]\d{9}))$/, message: '联系方式格式不正确!' }] },
          post: { rules: [{ required: true,message: '请输入岗位!' },{max:20,message:'岗位最多20个字符!'}] },
          workLengthWxYear: { rules: [{ required: true, pattern:/^\d{1,2}$/,message: '年份不正确!' }] },
          workLengthCustomerYear: { rules: [{ required: true, pattern:/^\d{1,2}$/,message: '年份不正确!' }] },
          workLengthWxMonth: { rules: [{ required: true, pattern:/^[0-9]$|(1(0|1|2))$/,message: '月份不正确!' }] }, 
          workLengthCustomerMonth: { rules: [{ required: true, pattern:/^[0-9]$|(1(0|1|2))$/,message: '月份不正确!' }] }, 
          eventType: { rules: [{ required: true, message: '请选择事件类别!' }] },
          eventOccurrenceTime:{rules: [{ required: true, message: '请选择事件发生时间!' }]},
          curingType:{rules: [{ required: true, message: '请选择是否治疗!' }]},
          eventThrough:{rules: [{ required: true, message: '请输入事件发生经过!' }]},
          payPlan:{rules: [{ required: true, message: '请输入赔付方案!' }]},
          customerOpinion:{rules: [{ required: true, message: '请输入客户意见!' }]},
          organOpinion:{rules: [{ required: true, message: '请输入部门/子分公司处理方案、意见!' }]},
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
          getEmpInsurance:'/hrEmergency/tretiredworkevent/insertInfo/', //获取该员工社保商险信息
          importUrl:'/hrEmergency/fileUpload/ossUploadFile', //上传文件
          delAttachUrl:'/hrEmergency/fileUpload/ossFileDelete/',//附件删除
          getAttachUrl:'/hrEmergency/fileUpload/ossFileUrl/domain/', //获取附件
          submitUrl:'/hrEmergency/tretiredworkevent', //修改提交
        }
      }
    },
    created(){
      this.initDictConfig()
    },
    methods: {
      edit(record) {
        this.visible = true
        this.thingForm.resetFields()
        this.model = record.retiredWorkEvent
        this.insuranceInfo.empPhone = record.retiredWorkEvent.empPhone
        this.insuranceInfo.post = record.retiredWorkEvent.post
        this.insuranceInfo.empAge = record.retiredWorkEvent.empAge
        this.remainParams = {
          empPhone:record.retiredWorkEvent.empPhone,
          post:record.retiredWorkEvent.post,
          empAge:record.retiredWorkEvent.empAge,
          province:record.retiredWorkEvent.province,
          provinceName:record.retiredWorkEvent.provinceName,
          town:record.retiredWorkEvent.town,
          townName:record.retiredWorkEvent.townName,
          city:record.retiredWorkEvent.city,
          cityName:record.retiredWorkEvent.cityName,
          emCusId:record.retiredWorkEvent.emCusId,
          emIdCard:record.retiredWorkEvent.emIdCard,
          emName:record.retiredWorkEvent.emName,
          emSettleId:record.retiredWorkEvent.emSettleId,
          empId:record.retiredWorkEvent.empId,
          id:record.retiredWorkEvent.id,
          socialId:record.retiredWorkEvent.socialId,
          // socialStatus:record.retiredWorkEvent.socialStatus,
          averageSalary:record.retiredWorkEvent.averageSalary,
          insuranceStatus:record.retiredWorkEvent.insuranceStatus,
        }
        //合同期限 历史时间次数
        httpAction(this.url.getEmpInsurance+record.retiredWorkEvent.empId,null,'get').then((res) => {
          if(Number(res.code) === 200 && res.data){
            // 显示使用
            this.insuranceInfo.contractStart = res.data.contractStart
            this.insuranceInfo.contractEnd = res.data.contractEnd
            this.insuranceInfo.record = res.data.record //历史记录数
            this.insuranceInfo.employeeContractInfo = res.data.employeeContractInfo //合同起止时间
            if(Number(record.retiredWorkEvent.isBackData) === 0){
              //商险
              this.insuranceInfo.insuranceStr = ''
              if(res.data.insuranceForWorkInjuryVo){
                for(let item of res.data.insuranceForWorkInjuryVo){
                  this.insuranceInfo.insuranceStr += ' ' + item.insuranceTypeName
                }
              }
            }
            // 保存使用
            if(Number(record.retiredWorkEvent.isBackData) === 0){
              this.insurance = res.data.insuranceForWorkInjuryVo
            }
          }
        });
        if(Number(record.retiredWorkEvent.isBackData) === 1){
          //商险
          if(record.insurance){
            this.insuranceInfo.insuranceStr = ''
            for(let item of record.insurance){
              this.insuranceInfo.insuranceStr += ' ' + item.insuranceTypeName
            }
          }
          this.insurance = record.insurance
        }
        //社保购买地
        this.insuranceInfo.area = record.retiredWorkEvent.provinceName + record.retiredWorkEvent.cityName + record.retiredWorkEvent.townName
        //合同起止时间
        if(record.retiredWorkEvent.contractStart && record.retiredWorkEvent.contractEnd){
          this.defaultContract = [moment(record.retiredWorkEvent.contractStart,'YYYY-MM-DD'),moment(record.retiredWorkEvent.contractEnd,'YYYY-MM-DD')]
        }
        let _this = this
        httpAction(this.url.getinfo+record.retiredWorkEvent.empId,null,'get').then((res) => {
          if(Number(res.code) === 200){
            _this.rowEmpoyee = res.data
            _this.rowEmpoyee.empSex = filterDictText(_this.sexOptions,_this.rowEmpoyee.empSex)
            //查询客户单位
            httpAction(`${_this.url.getCustomerById}?cusId=${_this.rowEmpoyee.belongUnit}&settleDomainId=${_this.rowEmpoyee.settleDomain}`,null,'get').then((result) => {
              if(Number(result.code) === 200){
                _this.rowEmpoyee.customerName = result.data.cusName //客户单位 this.businessTypeDicts
                _this.rowEmpoyee.businessTypeName = filterDict(_this.businessTypeDicts,result.data.businessType)
              }else{
                _this.$message.warning(result.msg)
              }
            }).finally(()=>{
              //设置表单默认值
              _this.$nextTick(() => {
                _this.empForm.setFieldsValue(pick({empPhone:_this.model.empPhone,
                  post:_this.model.post,socialStatus:String(record.retiredWorkEvent.socialStatus),
                  workLengthWxYear:_this.model.workLengthWxYear,
                  workLengthWxMonth:_this.model.workLengthWxMonth,
                  workLengthCustomerYear:_this.model.workLengthCustomerYear,
                  workLengthCustomerMonth:_this.model.workLengthCustomerMonth,
                }, 
                  'empPhone','post','workLengthWxYear','workLengthWxMonth','workLengthCustomerYear','workLengthCustomerMonth','socialStatus'
                ))
              })
            })
          }
        })
      },

      disabledDate(current){
        return current > moment().endOf('day');
      },

      next(){
        if(Number(this.current) === 0){
          let _this = this
          this.empForm.validateFields((err, values) => {
            if (!err) {
              values.empAge = this.rowEmpoyee.empAge
              if(values.contractDate.length){
                values.contractStart = moment(values.contractDate[0]).format('YYYY-MM-DD')
                values.contractEnd = moment(values.contractDate[1]).format('YYYY-MM-DD')
              }
              delete values.contractDate
              _this.allModel = Object.assign(this.allModel, values)
              //设置表单默认值
              _this.$nextTick(() => {
                this.model.eventOccurrenceTime = moment(this.model.eventOccurrenceTime)
                this.thingForm.setFieldsValue(pick(this.model, 
                  'eventOccurrenceTime','eventThrough','eventType','curingType'
                ))
              })
              _this.current++
            }
          })
          return false
        }
        if(Number(this.current) === 1){
          this.$nextTick(() => {
            this.planForm.setFieldsValue(pick(this.model, 
              'payPlan','customerOpinion','organOpinion'
            ))
          })
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
          //获取附件信息
          httpAction(`${this.url.getAttachUrl}${this.model.id}?type=${this.flag}`,null,'get').then((res) => {
            if(Number(res.code) === 200 && res.data){
              this.fileList = []
              for(const item of res.data){
                this.fileList.push({
                  uid:item.id,
                  name:item.attaName,
                  status:'done',
                  url:item.attaSrc,
                })
              }
            }else{
              this.fileList = []
            }
          });
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
        let formData = {
          retiredWorkEvent:Object.assign(this.allModel,this.remainParams),
          insurance:this.insurance
        }
        httpAction(this.url.submitUrl, formData, this.method).then((res) => {
          const msg = res.msg || res.message
          if (Number(res.code) === 200) {
            _this.$message.success(_this.title + '成功！')
            _this.$emit('ok')
            _this.close()
          } else {
            _this.$message.warning(msg)
          }
        }).finally(() => {
          _this.confirmLoading = false
        })
      },

      handleCancel() {
        this.close()
      },

      close() {
        this.thingForm.resetFields()
        this.$emit('close')
        this.employeeInfo={}
        this.insuranceInfo={}
        this.visible = false
        this.current = 0
      },

      //取两个对象的差集
      getDiffrenceSetData(obj1,obj2){
        for(const item in obj2){
          if (item in obj1) {
            delete obj1[item]
          }
        }
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
        if(fileList[fileList.length - 1].size > 10*1024*1024){
          this.$message.warning(fileList[fileList.length - 1].name+`文件大小超过10M`)
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
        formData.append("type", this.flag);
        formData.append("domainId", this.remainParams.id);
        const contextType = {'Content-Type': 'multipart/form-data'};
        this.fileList.splice(this.fileList.length - 1, 1)
        postActionHeader(this.url.importUrl, formData,contextType,300000).then((res) => {
          if(Number(res.code) === 200){
            this.fileList.push(res.data)
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
                  if(file.uid == fileInfo.uid){
                    //删除该附件
                    _this.fileList.splice(index,1);
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
.stepFormlabel{
  :global(.ant-form-item-label) {
    width: 120px;
  }
}
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 0px !important;
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
}
.mbot {
  margin-bottom: 20px;
}
.overflow {
  display: inline-block;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
