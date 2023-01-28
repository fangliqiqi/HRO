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
          <a-col
            :span="22"
            :offset="1"
          >
            <a-steps
              :current="current"
              status="error"
            >
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
            <a-col
              :span="18"
              :offset="1"
            >
              <span class="name">{{ rowEmpoyee.empName }}</span>
              {{ rowEmpoyee.empAge }}岁
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
                >{{ rowEmpoyee.empSex }}</a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="社会保险"
                  class="stepFormlabel"
                >{{ insuranceInfo.socialStatusStr || '未购买' }}</a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="身份证"
                  class="stepFormlabel"
                >{{ rowEmpoyee.empIdcard }}</a-form-item>
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
              <a-col :span="8">
                <a-form-item
                  label="劳动合同期限"
                  class="stepFormlabel"
                >
                  <template v-if="insuranceInfo.contractStart">
                    {{ insuranceInfo.contractStart }} ~ {{ insuranceInfo.contractEnd }}
                  </template>
                  <template v-else>
                    暂无合同
                  </template>
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
                  {{ insuranceInfo.averageSalary || '--' }}
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
              <div v-if="flag == 3">
                <a-col :span="24">
                  <a-form-item
                    label="仲裁时间"
                    class="stepFormText"
                  >
                    <a-date-picker
                      placeholder="请选择仲裁时间"
                      style="width: 200px"
                      format="YYYY-MM-DD"
                      v-decorator="['eventOccurrenceTime',validatorRules.eventOccurrenceTime]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item
                    label="仲裁委员会"
                    class="stepFormText"
                  >
                    <a-textarea
                      rows="4"
                      cols="150"
                      placeholder="请输入仲裁委员会"
                      v-decorator="['eventOccurrenceAddr',{rules: [{ required: true, message: '请输入仲裁委员会!' },{max:50,message:'仲裁委员会最多50个字符!'}] }]"
                    ></a-textarea>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item
                    label="个人诉求"
                    class="stepFormText"
                  >
                    <a-textarea
                      rows="4"
                      cols="150"
                      placeholder="请输入个人诉求"
                      v-decorator="['eventThrough',{rules: [{ required: true, message: '请输入个人诉求!' },{max:500,message:'个人诉求最多500个字符!'}] }]"
                    ></a-textarea>
                  </a-form-item>
                </a-col>
              </div>
              <div v-if="flag == 4">
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
                      :resList="resList"
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
              </div>
              <div v-if="flag == 5">
                <a-col :span="24">
                  <a-form-item
                    label="发生时间"
                    class="stepFormText"
                  >
                    <a-date-picker
                      placeholder="请选择发生时间"
                      style="width: 200px"
                      format="YYYY-MM-DD"
                      v-decorator="['eventOccurrenceTime',validatorRules.eventOccurrenceTime]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="劳动保障部门"
                    class="stepFormText"
                  >
                    <a-input
                      style="width:200px;"
                      placeholder="请输入劳动保障行政部门"
                      v-decorator="['eventOccurrenceAddr',{rules: [{ required: true, message: '请输入劳动保障行政部门!' },{max:50,message:'劳动保障行政部门最多50个字符!'}] }]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="16">
                  <a-form-item
                    label="投诉渠道"
                    class="stepFormText"
                  >
                    <a-select
                      style="width:200px;"
                      placeholder="请选择投诉渠道"
                      v-decorator="['eventResource',{rules: [{ required: true, message: '请选择投诉渠道!' }] }]"
                    >
                      <a-select-option value="0">电话</a-select-option>
                      <a-select-option value="1">纸质</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item
                    label="投诉内容"
                    class="stepFormText"
                  >
                    <a-textarea
                      rows="4"
                      cols="130"
                      style="resize:none"
                      placeholder="请输入投诉内容"
                      v-decorator="['eventThrough',{rules: [{ required: true, message: '请输入投诉内容!' },{max:500,message:'投诉内容最多500个字符!'}] }]"
                    ></a-textarea>
                  </a-form-item>
                </a-col>
              </div>
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
              <a-col
                :span="24"
                v-if="flag != 3 && flag != 4"
              >
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
              <!-- <a-col :span="24">
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
              </a-col> -->
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, postActionHeader } from '@/api/manage'
import { initDictOptions, filterDictText,filterDict } from '@/components/dict/JDictSelectUtil'
// import { getAllSettleDomainSelectVos } from '@/api/api'
import moment from 'moment'
import pick from 'lodash.pick'
import pinyin from 'pinyin'
import SelectPage from '@/components/jeecg/SelectPage'
// import Vue from 'vue'

export default {
  name: 'AbitrationApplyEditModal',
  components: {
    SelectPage
  },
  data() {
    return {
      ids: '',
      model: {},
      allModel: {}, //所有表单的属性
      title: '编辑',
      visible: false,
      confirmLoading: false,
      moment,
      contractCustomerName: '',
      customerTreeData: [], //客户单位
      current: 0, //当前步骤
      settleDomainOptions: [], //结算主体
      businessTypeDicts: [], //业务类型
      workFlagOptions: { '0': { option: '在职', color: 'green' }, '1': { option: '离职', color: 'red' } },
      empTypeOptions: [], // 员工类型
      employeeLableOptions: [], // 员工标签
      disabledBtn: false, //是否可以进入下一步
      flag:3,
      insuranceInfo: {}, //社保商险信息
      method: 'post',
      rowEmpoyee:{},
      resList:[],
      columns: [
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'empName'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcard'
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDomain',
          customRender: text => {
            return Object.keys(this.settleDomainOptions).length ? this.settleDomainOptions[text]['departName'] : ''
          }
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'empPhone'
        },
        // {
        //   title: '在职状态',
        //   align: 'center',
        //   dataIndex: 'workFlag',
        //   scopedSlots: { customRender: 'workFlag' }
        // },
        // {
        //   title: '员工类型',
        //   align: 'center',
        //   dataIndex: 'empType',
        //   customRender: text => {
        //     return filterDictText(this.empTypeOptions, text)
        //   }
        // }
      ],

      thingForm: this.$form.createForm(this),
      planForm: this.$form.createForm(this),
      empForm: this.$form.createForm(this),
      fileList: [],

      validatorRules: {
        empPhone: { rules: [{ required: true,pattern:/^((0\d{2,3}-?\d{7,8})|(1[3456789]\d{9}))$/, message: '联系方式格式不正确!' }] },
        post: { rules: [{ required: true,message: '请输入岗位!' },{max:20,message:'岗位最多20个字符!'}] },
        // workLengthWx: { rules: [{ required: true,pattern:/^[1-9]\d{0,1}$|0$/, message: '皖信工龄格式不正确!' }] },
        // workLengthCustomer: { rules: [{ required: true, pattern:/^[1-9]\d{0,1}$|0$/,message: '客户单位工龄格式不正确!' }] },
        workLengthWxYear: { rules: [{ required: true, pattern:/^\d{1,2}$/,message: '年份不正确!' }] },
        workLengthCustomerYear: { rules: [{ required: true, pattern:/^\d{1,2}$/,message: '年份不正确!' }] },
        workLengthWxMonth: { rules: [{ required: true, pattern:/^[0-9]$|(1(0|1|2))$/,message: '月份不正确!' }] }, 
        workLengthCustomerMonth: { rules: [{ required: true, pattern:/^[0-9]$|(1(0|1|2))$/,message: '月份不正确!' }] }, 
        eventOccurrenceTime: { rules: [{ required: true, message: '请选择仲裁时间!' }] },
        eventThrough: { rules: [{ required: true, message: '请输入个人诉求!' },{max:500,message:'个人诉求最多500个字符!'}] },
        payPlan: { rules: [{ required: true, message: '请输入赔付方案!' },{max:500,message:'赔付方案最多500个字符!'}] },
        customerOpinion: { rules: [{ required: true, message: '请输入法务意见!' },{max:500,message:'法务意见最多500个字符!'}] },
        organOpinion: { rules: [{ required: true, message: '请输入部门/子分公司处理方案、意见!' },{max:500,message:'方案意见最多500个字符!'}] },
        eventOccurrenceAddr:{rules: [{ required: true, message: '请输入仲裁委员会!' },{max:50,message:'仲裁委员会最多50个字符!'}] },
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      url: {
        getinfo: '/hrBase/temployeeinfo/', //根据员工ID查询员工信息
        list: '/hrBase/temployeeinfo/pageForEmergency?deleteFlag=0', //员工信息列表请求地址
        getCustomerById: '/hrBase/tcustomerinfo/', //查询客户单位
        getEmpInsurance: '/hrEmergency/tworkinjuryevent/insertInfo/', //获取该员工社保商险信息
        importUrl: '/hrEmergency/fileUpload/ossUploadFile', //上传文件
        delAttachUrl: '/hrEmergency/fileUpload/ossFileDelete/', //附件删除
        submitApplyUrl: '/hrEmergency/tabitrationevent', //仲裁事件申报
        getAttachUrl:'/hrEmergency/fileUpload/ossFileUrl/domain/', //获取附件
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
      }
    }
  },
  created(){
    // 结算主体和所属单位
    // getAllSettleDomainSelectVos().then((res) => {
    //   if (res.code === 200) {
    //     this.settleDomainOptions = res.data
    //   } else {
    //     this.$message.error('结算主体和所属单位数据请求失败！')
    //   }
    // })
    this.initDictConfig()
  },
  methods: {
    edit(record,empInfo) {
      if(this.flag == 4){
        // 事件信息客户单位
        httpAction(this.url.getCustomerById+record.abitrationEvent.unitId,null,'get').then((res)=>{
          if(res.code == 200){
            this.resList.push({
              id:record.abitrationEvent.unitId,
              title:res.data.customerName
            })
            this.visible = true
            this.$nextTick(() => {
              this.empForm.setFieldsValue(pick({empPhone:record.abitrationEvent.empPhone,
                post:record.abitrationEvent.post,workLengthWxYear:record.abitrationEvent.workLengthWxYear,
                workLengthWxMonth:record.abitrationEvent.workLengthWxMonth,
                workLengthCustomerYear:record.abitrationEvent.workLengthCustomerYear,
                workLengthCustomerMonth:record.abitrationEvent.workLengthCustomerMonth,
              }, 
                'empPhone','post','workLengthWxYear','workLengthWxMonth','workLengthCustomerYear','workLengthCustomerMonth'
              ))
              
              this.thingForm.setFieldsValue(pick({unitId:record.abitrationEvent.unitId},'unitId'))
            })
          }
        })

      }else{
        this.visible = true
        this.$nextTick(() => {
          this.empForm.setFieldsValue(pick({empPhone:record.abitrationEvent.empPhone,
            post:record.abitrationEvent.post,workLengthWxYear:record.abitrationEvent.workLengthWxYear,
            workLengthWxMonth:record.abitrationEvent.workLengthWxMonth,
            workLengthCustomerYear:record.abitrationEvent.workLengthCustomerYear,
            workLengthCustomerMonth:record.abitrationEvent.workLengthCustomerMonth,
          }, 
            'empPhone','post','workLengthWxYear','workLengthWxMonth','workLengthCustomerYear','workLengthCustomerMonth'
          ))
        })
      }

      this.remainParams = {
        empPhone:record.abitrationEvent.empPhone,
        post:record.abitrationEvent.post,
        empAge:record.abitrationEvent.empAge,
        province:record.abitrationEvent.province,
        provinceName:record.abitrationEvent.provinceName,
        town:record.abitrationEvent.town,
        townName:record.abitrationEvent.townName,
        city:record.abitrationEvent.city,
        cityName:record.abitrationEvent.cityName,
        contractId:record.abitrationEvent.contractId,
        contractEnd:record.abitrationEvent.contractEnd,
        contractStart:record.abitrationEvent.contractStart,
        emCusId:record.abitrationEvent.emCusId,
        emIdCard:record.abitrationEvent.emIdCard,
        emName:record.abitrationEvent.emName,
        emSettleId:record.abitrationEvent.emSettleId,
        empId:record.abitrationEvent.empId,
        id:record.abitrationEvent.id,
        socialId:record.abitrationEvent.socialId,
        socialStatus:record.abitrationEvent.socialStatus,
        insuranceStatus:record.abitrationEvent.insuranceStatus,
      }
      
      //商险
      if(record.insurance){
        this.insuranceInfo.insuranceStr = ''
        for(let item of record.insurance){
          this.insuranceInfo.insuranceStr += ' ' + item.insuranceTypeName
        }
      }
      
      //社保购买地
      this.insuranceInfo.area = record.abitrationEvent.provinceName + record.abitrationEvent.cityName + record.abitrationEvent.townName
      //社保状态
      switch(record.abitrationEvent.socialStatus){
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
      httpAction(this.url.getEmpInsurance+record.abitrationEvent.empId,null,'get').then((res) => {
        if(res.code == 200 && res.data){
          this.insuranceInfo.contractStart = res.data.contractStart
          this.insuranceInfo.contractEnd = res.data.contractEnd
          this.insuranceInfo.record = res.data.record
        }
      });
      

      this.model = Object.assign({}, record.abitrationEvent)
      
      this.rowEmpoyee = empInfo
      this.rowEmpoyee.empSex = filterDictText(this.sexOptions,empInfo.empSex)
      this.rowEmpoyee.customerName = empInfo.customerName //客户单位
      this.rowEmpoyee.businessTypeName = filterDict(this.businessTypeDicts,empInfo.businessType)
      
    },
    next() {
      if (this.current == 0) {
        this.allModel = {}
        let _this = this
        if(this.flag == 4){
          //获取客户单位
          httpAction(this.url.getTreeData, null, 'get').then(res => {
            this.customerTreeData = res.data
          })
        }
        this.empForm.validateFields((err, values) => {
          if (!err) {
            _this.current++
            values.empAge = this.rowEmpoyee.empAge
            _this.allModel = Object.assign(this.allModel, values)
            //设置表单默认值
            _this.$nextTick(() => {
              let eventOccurrenceTime = moment(this.model.eventOccurrenceTime)
              this.thingForm.setFieldsValue(pick({eventOccurrenceTime:eventOccurrenceTime,
              eventThrough:_this.model.eventThrough,eventOccurrenceAddr:_this.model.eventOccurrenceAddr}, 
                'eventOccurrenceTime','eventThrough','eventOccurrenceAddr'
              ))
              if(this.flag == 4){
                this.thingForm.setFieldsValue(pick({unitId:this.model.unitId,plaintiffOrDefendant:this.model.plaintiffOrDefendant}, 
                  'unitId','plaintiffOrDefendant'
                ))
              }
              if(this.flag == 5){
                this.thingForm.setFieldsValue(pick({eventResource:this.model.eventResource},
                  'eventResource'
                ))
              }
            })
            
          }
        })
        return false
      }
      if (this.current == 1) {
        let _this = this
        this.thingForm.validateFields((err, values) => {
          if (!err) {
            this.getDiffrenceSetData(this.allModel, values)
            //处理时间格式 values.eventOccurrenceTime
            values.eventOccurrenceTime = moment(values.eventOccurrenceTime).format('YYYY-MM-DD HH:mm:ss')
            this.allModel = Object.assign(this.allModel, values)
             //设置表单默认值
            _this.$nextTick(() => {
              this.planForm.setFieldsValue(pick({payPlan:this.model.payPlan,
              customerOpinion:this.model.customerOpinion,organOpinion:this.model.organOpinion}, 
                'payPlan','customerOpinion','organOpinion'
              ))
            })
            this.current++
          }
        })
        return false
      }
      if (this.current == 2) {
        //获取附件信息
        httpAction(this.url.getAttachUrl+this.model.id+'?type='+this.flag,null,'get').then((res) => {
          if(res.code == 200 && res.data){
            this.fileList = []
            for(let item of res.data){
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
          if (!err) {
            this.getDiffrenceSetData(this.allModel, values)
            this.allModel = Object.assign(this.allModel, values)
            this.current++
            
          }
        })
        return false
      }
      this.current++
    },
    prev() {
      //上一步
      this.current--
    },
    handleSelect(val){
      this.$nextTick(() => {
        this.thingForm.setFieldsValue(pick({unitId:val},'unitId'))
      })
    },
    // 保存按钮
    handleOk() {
      const _this = this
      _this.confirmLoading = true
      let formData = Object.assign(this.model, this.allModel, {
        insuranceStatus: this.remainParams.insuranceStatus,
        socialId: this.insuranceInfo.socialId,
        empId: this.rowEmpoyee.id,
        emName: this.rowEmpoyee.empName,
        socialStatus: this.remainParams.socialStatus,
        contractId: this.insuranceInfo.contractId,
        emIdCard: this.rowEmpoyee.empIdcard,
        emCusId: this.rowEmpoyee.belongUnit,
        emSettleId: this.rowEmpoyee.settleDomain,
        province: this.insuranceInfo.province,
        provinceName: this.insuranceInfo.provinceName,
        town: this.insuranceInfo.town,
        townName: this.insuranceInfo.townName,
        city: this.insuranceInfo.city,
        cityName: this.insuranceInfo.cityName
      })
      httpAction(this.url.submitApplyUrl, formData, this.method)
        .then(res => {
          let msg = res.msg || res.message
          if (res.code === 200) {
            _this.$message.success(_this.title + '成功！')
            _this.$emit('ok')
            _this.close()
          } else {
            _this.$message.warning(msg)
          }
        })
        .finally(() => {
          _this.confirmLoading = false
        })
    },
    handleCancel() {
      this.close()
    },
    disabledDate(current){
      return current > moment().endOf('day');
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.selectedRowKeys=this.resList=[]
      this.current = 0
    },
    //取两个对象的差集
    getDiffrenceSetData(obj1, obj2) {
      for (let item in obj2) {
        if (item in obj1) {
          delete obj1[item]
        }
      }
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    //上传
    handleChange() {
      const { fileList } = this;
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
      const formData = new FormData()
      formData.append('file', file)
      formData.append('domainId', this.model.id)
      formData.append('type', this.flag)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      this.fileList.splice(this.fileList.length - 1, 1)
      postActionHeader(this.url.importUrl, formData, contextType,300000).then(res => {
        if(res.code == 200){
          this.fileList.push(res.data)
        }else{
          this.$message.warning(res.msg)
        }
      }).finally(()=>{
        this.confirmLoading = false
      })
    },
    removeFile(fileInfo) {
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          httpAction(_this.url.delAttachUrl + fileInfo.uid, null, 'get').then(res => {
            if (res.code === 200) {
              _this.fileList.map((file, index) => {
                if (file.uid == fileInfo.uid) {
                  //删除该附件
                  _this.fileList.splice(index, 1)
                  return
                }
              })
              _this.$message.success('删除附件成功！')
            } else {
              _this.$message.warning(res.msg)
            }
          })
        }
      })
      return false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 数据字典
    initDictConfig() {
      // 员工类型
      initDictOptions('personnel_type').then(res => {
        if (res.code === 200) {
          this.empTypeOptions = res.data
        }
      })
      // 性别
      initDictOptions('sex').then(res => {
        if (res.code === 200) {
          this.sexOptions = res.data
        }
      })
      // 员工类型
      initDictOptions('personnel_type').then(res => {
        if (res.code === 200) {
          this.empTypeOptions = res.data
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    treeSelectChange(value, label, extra) {
      httpAction(this.url.getCustomerInfo + value, null, 'GET').then(res => {
        if (Number(res.code) === 200) {
          
          let sz = pinyin(res.data.customerName, {
            style: pinyin.STYLE_FIRST_LETTER
          })
          let ename = ''
          if (sz.length > 0) {
            for (let i of sz) {
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
.stepFormlabel {
  :global(.ant-form-item-label) {
    width: 120px;
  }
  margin-bottom: 0px;
}
.stepFormlabel1{
  margin-bottom: 0px;
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
  width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>