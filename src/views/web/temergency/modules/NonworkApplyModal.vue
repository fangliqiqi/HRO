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
              <a-step title="选择人员" />
              <a-step title="基本信息" />
              <a-step title="事件信息" />
              <a-step title="方案意见" />
              <a-step title="材料附件" />
            </a-steps>
          </a-col>
        </a-row>
        <a-row v-show="current == 0">
          <a-col :span="24">
            <div class="steps-content">
              <!-- 查询区域 -->
              <div class="table-page-search-wrapper">
                <a-form layout="inline">
                  <a-row :gutter="24">
                    <a-col
                      :md="6"
                      :sm="8"
                    >
                      <a-form-item label="员工姓名">
                        <a-input
                          placeholder="请输入员工姓名"
                          v-model="queryParam.empName"
                        ></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col
                      :md="6"
                      :sm="8"
                    >
                      <a-form-item label="身份证号">
                        <a-input
                          placeholder="请输入身份证号"
                          v-model="queryParam.empIdcard"
                        ></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col
                      :md="6"
                      :sm="8"
                    >
                      <a-form-item label="结算主体">
                        <select-page
                          :searchUrl="'/hrBase/tsettledomain/page?selectType=0&departName='"
                          :title="'departName'"
                          :id="'id'"
                          :placeholder="'请输入结算主体'"
                          v-model="queryParam.settleDomain"
                        ></select-page>
                      </a-form-item>
                    </a-col>
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
                          @click="searchReset"
                          icon="reload"
                          style="margin-left: 8px"
                        >重置</a-button>
                        <a-button
                          type="primary"
                          @click="searchQuery"
                          icon="search"
                        >查询</a-button>
                      </span>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
              <!--列表-->
              <div
                class="ant-alert ant-alert-info"
                style="margin-bottom: 16px;text-align:left;"
              >
                已选择
                <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
                <a
                  style="margin-left: 24px"
                  @click="onClearSelected"
                >清空</a>
              </div>
              <a-table
                :columns="columns"
                :dataSource="dataSource"
                :bordered="true"
                ref="table"
                size="middle"
                rowKey="id"
                :pagination="ipaginations"
                :customRow="rowSelect"
                :loading="loading"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio'}"
                @change="handleTableChange"
              >
                <!-- 在职状态 -->
                <span
                  slot="workFlag"
                  slot-scope="text, record"
                >
                  <template v-for="(workFlag, key) in workFlagOptions">
                    <a-tag
                      :key="key"
                      v-if="record.workFlag == key"
                      :color="workFlag.color"
                    >{{ workFlag.option }}</a-tag>
                  </template>
                </span>
              </a-table>
            </div>
          </a-col>
        </a-row>
        <div
          class="content"
          v-show="current == 1"
        >
          <a-row class="mbot">
            <a-col
              :span="18"
              :offset="1"
            >
              <span class="name">{{ rowEmpoyee.empName }}</span>
              {{ rowEmpoyee.empAge }}岁
            </a-col>
            <a-col
              :span="3"
              :offset="1"
            >
              历史发生事件
              <span
                class="num"
                @click="history"
              >{{ insuranceInfo.record || 0 }}</span> 起
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
                >
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
                >{{ rowEmpoyee.empIdcard }}</a-form-item>
              </a-col>
              <a-col :span="12">
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
              <a-col
                :span="8"
                v-if="rowEmpoyee.settleDomain"
              >
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
          </a-form>
          <a-divider />
          <a-form
            :form="riskForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-col
                :span="6"
                :offset="1"
              >
                <a-form-item label="风险承担">
                  <a-select
                    placeholder="请选择"
                    @select="selectRow"
                    style="width: 130px"
                    v-decorator="['riskBear',validatorRules.riskBear]"
                  >
                    <a-select-option value="0">皖信</a-select-option>
                    <a-select-option value="1">客户单位</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :span="7"
                v-if="selectRowVal == 0"
              >
                <a-form-item label="皖信">
                  <a-select
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="children"
                    style="width: 200px"
                    :dropdownMatchSelectWidth="false"
                    v-decorator="['riskBearOrgan',validatorRules.riskBearOrgan]"
                  >
                    <a-select-option
                      v-for="(item, index) in organizationOption"
                      :key="index"
                      :value="item.id"
                    >{{ item.organName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :span="8"
                v-if="selectRowVal == 1"
              >
                <a-form-item label="客户单位">
                  <select-page
                    placeholder="请选择客户单位"
                    style="width: 265px"
                    v-decorator="['riskBearUnit', validatorRules.riskBearUnit]"
                    :searchUrl="'hrBase/tcustomerinfo/page?selectType=0&customerName='"
                    :title="'customerName'"
                    @select="handleSelect"
                    :id="'id'"
                  ></select-page>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="事件类别">
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
            </a-row>
          </a-form>
        </div>
        <div
          class="content"
          v-show="current == 2"
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
                    :disabledDate="disabledDate"
                    style="width: 200px"
                    v-decorator="['eventOccurrenceTime',validatorRules.eventOccurrenceTime]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  label="事件发生地点"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入事件发生地点"
                    style="width: 200px"
                    v-decorator="['eventOccurrenceAddr',validatorRules.eventOccurrenceAddr]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="伤害部位"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入伤害部位"
                    style="width: 200px"
                    v-decorator="['injuryPosition',validatorRules.injuryPosition]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="是否治疗"
                  class="stepFormText"
                >
                  <a-select
                    placeholder="请选择是否治疗"
                    @select="onSelect"
                    style="width: 150px"
                    v-decorator="['isCuring',validatorRules.isCuring]"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :span="8"
                v-if="isCuringShow"
              >
                <a-form-item
                  label="治疗类型"
                  class="stepFormText"
                >
                  <a-select
                    showSearch
                    placeholder="请选择治疗类型"
                    optionFilterProp="children"
                    :filterOption="filterOption"
                    style="width: 200px"
                    v-decorator="['curingType',validatorRules.curingType]"
                  >
                    <a-select-option
                      v-for="(item, index) in treatmentTypeOption"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :span="24"
                v-if="isCuringShow"
              >
                <a-form-item
                  label="就诊医院"
                  class="stepFormText"
                >
                  <a-input
                    placeholder="请输入就诊医院"
                    style="width: 200px"
                    v-decorator="['curingHospital',validatorRules.curingHospital]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  label="事件发生经过"
                  class="stepFormText"
                >
                  <a-textarea
                    rows="4"
                    cols="150"
                    placeholder="请输入事件发生经过"
                    v-decorator="['eventThrough',validatorRules.eventThrough]"
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
                    style="width:1000px;resize:none;"
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
                    style="width:1000px;resize:none;"
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
                    style="width:1000px;resize:none;"
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
          v-show="current == 4"
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

        <div
          class="steps-action"
          style="margin-top:10px;"
        >
          <a-button
            type="primary"
            style="margin-bottom:0px;"
            @click="next"
            v-if="current < 4"
            :disabled="disabledBtn"
          >下一步</a-button>
          <a-button
            type="primary"
            v-if="current == 4"
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
      <!--历史事件-->
      <History-Event-Modal ref="HistoryEventModalForm"></History-Event-Modal>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, getAction, postActionHeader } from '@/api/manage'
import { filterObj } from '@/utils/util'
import { initDictOptions, filterDictText, filterDict } from '@/components/dict/JDictSelectUtil'
import { getAreaData } from '@/utils/common'
import HistoryEventModal from './HistoryEventModal'
import SelectPage from '@/components/jeecg/SelectPage'
import moment from 'moment'
import pinyin from 'pinyin'
import pick from 'lodash.pick'

export default {
  name: 'NonworkApplyModal',
  components: {
    HistoryEventModal,
    SelectPage
  },
  data() {
    return {
      ids: '',
      model: {},
      allModel: {}, //所有表单的属性
      title: '事件申报',
      visible: false,
      confirmLoading: false,
      isCuringShow:true,
      /* 查询条件 */
      queryParam: {},
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipaginations: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} 共${total}条`
        },
        onChange: (page, pageSize) => {
          this.ipaginations.current = page
          this.ipaginations.pageSize = pageSize
          this.loadData()
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [], //选中员工id
      /* table选中records*/
      selectionRows: [],
      /* table选中records*/
      settleDomain: '', //结算主体id
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: '',
      getQueryParams() {
        //获取查询条件
        let sqp = {}
        if (this.superQueryParams) {
          sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
        //param.field = this.getQueryField()
        param.current = this.ipaginations.current
        param.size = this.ipaginations.pageSize
        return filterObj(param)
      },
      current: 0, //当前步骤
      settleDomainOptions: [], //结算主体
      eventTypeOptions: [], //事件类型
      businessTypeDicts: [], //业务类型
      workFlagOptions: { '0': { option: '在职', color: 'green' }, '1': { option: '离职', color: 'red' } },
      empTypeOptions: [], // 员工类型
      employeeLableOptions: [], // 员工标签
      disabledBtn: true, //是否可以进入下一步
      selectRowVal: -1, //0皖信1客户单位
      organizationOption: [], //皖信组织架构
      customerTreeData: [], //客户单位
      treatmentTypeOption: [], //治疗类型
      insuranceInfo: {}, //社保商险信息
      method: 'post',
      rowEmpoyee:{},
      contractCustomerName: '',
      defaultContract:[],
      flag:1, //1非因工2退工

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
          dataIndex: 'settleDomainName',
          // customRender: text => {
          //   return (this.settleDomainOptions && this.settleDomainOptions[text]) ? this.settleDomainOptions[text]['departName'] : '--'
          // }
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

      riskForm: this.$form.createForm(this),
      thingForm: this.$form.createForm(this),
      planForm: this.$form.createForm(this),
      empForm: this.$form.createForm(this),
      fileList: [],

      validatorRules: {
        empPhone: { rules: [{ required: true, message: '请输入联系方式!' },{validator:(rule, val, callback)=>{
          if(val){
            if( !/^((0\d{2,3}-?\d{7,8})|(1[3456789]\d{9}))$/.test(val) ){
              callback('联系方式格式不正确!')
            }
          }
          callback()
        }}] },
        post: { rules: [{ required: true,message: '请输入岗位!' },{max:20,message:'岗位最多20个字符!'}] },
        eventType: { rules: [{ required: true, message: '请选择事件类别!' }] },
        riskBear: { rules: [{ required: true, message: '请选择风险承担!' }] },
        riskBearOrgan: { rules: [{ required: true, message: '请选择皖信旗下公司!' }] },
        riskBearUnit: { rules: [{ required: true, message: '请选择客户单位!' }] },
        eventOccurrenceTime: { rules: [{ required: true, message: '请选择事件发生时间!' }] },
        eventOccurrenceAddr: { rules: [{ required: true, message: '请输入事件发生地点!' },{max:100,message:'最多100个字符!'}] },
        injuryPosition: { rules: [{ required: true, message: '请输入伤害部位!' },{max:50,message:'伤害部位最多50个字符!'}] },
        isCuring: { rules: [{ required: true, message: '请选择是否治疗!' }] },
        curingType: { rules: [{ required: true, message: '请选择治疗类型!' }] },
        curingHospital: { rules: [{ required: true, message: '请输入就诊医院!' },{max:100,message:'就诊医院最多100个字符!'}] },
        eventThrough: { rules: [{ required: true, message: '请输入事件发生经过!' },{max:500,message:'事件经过最多500个字符!'}] },
        payPlan: { rules: [{ required: true, message: '请输入赔付方案!' },{max:500,message:'赔付方案最多500个字符!'}] },
        customerOpinion: { rules: [{ required: true, message: '请输入客户意见!' },{max:500,message:'客户意见最多500个字符!'}] },
        organOpinion: { rules: [{ required: true, message: '请输入部门/子分公司处理方案、意见!' },{max:500,message:'方案意见最多500个字符!'}] },
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
        organization: '/admin/organizationinfo/getOrgForCus', //获取皖信组织架构
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        getCustomerInfo: '/hrBase/tcustomerinfo/',
        getCustomerById: '/hrBase/tcustomerinfo/getCusNameAndBusinessType', //查询客户单位
        getEmpInsurance: '/hrEmergency/tnonworkevent/insertInfo/', //获取该员工社保商险信息
        importUrl: '/hrEmergency/fileUpload/ossUploadFile', //上传文件
        delAttachUrl: '/hrEmergency/fileUpload/ossFileDelete/', //附件删除
        submitApplyUrl: '/hrEmergency/tnonworkevent', //非因工事件申报
        empValidator:'/hrEmergency/tnonworkevent/event/'
      }
    }
  },
  created(){
    this.initDictConfig()
  },
  methods: {
    moment,
    selectRow(val) {
      this.selectRowVal = val
    },
    handleSelect(val){
      this.riskForm.setFieldsValue(pick({riskBearUnit:val},'riskBearUnit'))
    },
    disabledDate(current){
      return current > moment().endOf('day');
    },
    onSelect(value){
      this.isCuringShow = (value == 1) ? false : true
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
      this.loadData()
    },
    next() {
      if (this.current == 0) {
        this.slectedRow(this.selectionRows)
        let _this = this
        //获取皖信组织构架
        httpAction(this.url.organization, {}, 'get').then(res => {
          if (Number(res.code) === 200) {
            this.organizationOption = res.data
          } else {
            _this.$message.warning(res.msg)
          }
        })
        //获取客户单位
        httpAction(this.url.getTreeData, null, 'get').then(res => {
          this.customerTreeData = res.data
        })
        
        this.$nextTick(() => {
          this.empForm.setFieldsValue(
            pick({ empPhone: this.selectionRows.empPhone, post: this.selectionRows.post }, 'empPhone', 'post')
          )
        })
        return false
      }
      if (this.current == 1) {
        this.allModel = {}
        let _this = this
        this.empForm.validateFields((err, values) => {
          if (!err) {
            values.empAge = this.selectionRows.empAge
            if(values.contractDate.length){
              values.contractStart = moment(values.contractDate[0]).format('YYYY-MM-DD')
              values.contractEnd = moment(values.contractDate[1]).format('YYYY-MM-DD')
            }
            delete values.contractDate
            this.allModel = Object.assign(this.allModel, values)
            _this.riskForm.validateFields((err, value) => {
              if (!err) {
                _this.allModel = Object.assign(this.allModel, value)
                _this.current++
              }
            })
          }
        })
        return false
      }
      if (this.current == 2) {
        this.thingForm.validateFields((err, values) => {
          if (!err) {
            this.getDiffrenceSetData(this.allModel, values)
            //处理时间格式 values.eventOccurrenceTime
            values.eventOccurrenceTime = moment(values.eventOccurrenceTime).format('YYYY-MM-DD HH:mm:ss')
            this.allModel = Object.assign(this.allModel, values)
            this.current++
          }
        })
        return false
      }
      if (this.current == 3) {
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
    // 保存按钮
    handleOk() {
      const _this = this
      _this.confirmLoading = true
      let attaIdArray = []
      for (let item of this.fileList) {
        attaIdArray.push(item.uid)
      }
      let formData = Object.assign(this.model, this.allModel, {
        insuranceStatus: this.insuranceInfo.insuranceStatus,
        socialId: this.insuranceInfo.socialId,
        empId: this.rowEmpoyee.id,
        emName: this.rowEmpoyee.empName,
        socialStatus: this.empForm.getFieldValue('socialStatus'),
        businessType:this.rowEmpoyee.businessType,
        // contractId: this.insuranceInfo.contractId,
        // contractStart:this.insuranceInfo.contractStart || '',
        // contractEnd:this.insuranceInfo.contractEnd || '',
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
      let params = {
        insurance: this.insuranceInfo.insuranceForWorkInjuryVo,
        nonWorkEvent:formData
      }
      httpAction(this.url.submitApplyUrl + '?attaIdArray=' + attaIdArray, params, this.method)
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
    close() {
      this.riskForm.resetFields()
      this.$emit('close')
      this.visible = false
      this.selectedRowKeys=this.fileList=[]
      this.queryParam={}
      this.current = 0
      this.ipaginations.current = 0
      this.defaultContract = []
    },
    //取两个对象的差集
    getDiffrenceSetData(obj1, obj2) {
      for (let item in obj2) {
        if (item in obj1) {
          delete obj1[item]
        }
      }
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipaginations.current = 1
      }
      var params = this.getQueryParams() //查询条件
      this.loading = true
      getAction(this.url.list, params).then(res => {
        if (res.code === 200 && res.data) {
          var listPath = this.$route.path
          var pathArr = listPath.split('/')
          this.dataSource = res.data.records
          if (pathArr[1] == 'dispose') {
            for (let item in this.dataSource) {
              if (this.dataSource[item].effectiveFlag == 1) {
                this.dataSource[item].effectiveFlagText = '有效'
              } else {
                this.dataSource[item].effectiveFlagText = '无效'
              }
            }
          }
          this.ipaginations.total = res.data.total
        }else{
          this.$message.warning(res.msg)
        }
      }).finally(()=>{
        this.loading = false
      })
    },
    handleTableChange(pagination, filters, sorter){
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipaginations = pagination
      this.loadData()
    },
    searchQuery() {
      this.loadData(1)
    },
    searchReset() {
      this.queryParam = {}
      this.loadData(1)
    },
    onClearSelected() {
      this.disabledBtn = true
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    onSelectChange(selectedRowKeys, selectedRow) {
      this.disabledBtn = false
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectedRow[0]
    },
    rowSelect(record) {
      return {
        on: {
          click: () => {
            this.disabledBtn = false
            this.selectedRowKeys = [record.id] //点击行选中
            this.selectionRows = record
          }
        }
      }
    },
    slectedRow(record) {
      //查看是否有未完成的事件
      httpAction(this.url.empValidator+record.id,null,'get').then(result=>{
        if(result.code == 200){
          if(result.data){
            this.$message.warning('该员工有未办结的事件')
            return false
          }else{
            //选中员工时的操作
            this.employeeInfo = {}
            this.rowEmpoyee = record
            this.rowEmpoyee.empSex = filterDictText(this.sexOptions, record.empSex)
            //查询客户单位合同相关信息
            httpAction(`${this.url.getCustomerById}?cusId=${this.rowEmpoyee.belongUnit}&settleDomainId=${this.rowEmpoyee.settleDomain}`,null,'get').then(res1 => {
              if(res1.code === 200){
                this.rowEmpoyee.customerName = res1.data.cusName //客户单位 this.businessTypeDicts
                this.rowEmpoyee.businessType = res1.data.businessType
                this.rowEmpoyee.businessTypeName = filterDict(this.businessTypeDicts, res1.data.businessType)
                
                //获取社保商险
                let areaTrees = getAreaData()
                httpAction(this.url.getEmpInsurance + this.rowEmpoyee.id+'?type=1', null, 'get').then(res => {
                  if (Number(res.code) === 200 && res.data) {
                    this.insuranceInfo = res.data
                    if (res.data.province) {
                      for (let item of areaTrees) {
                        if (item.id == res.data.province) {
                          this.insuranceInfo.area = item.areaName
                          this.insuranceInfo.provinceName = item.areaName
                          for (let c of item.children) {
                            if (c.id == res.data.city) {
                              this.insuranceInfo.area += '/' + c.areaName
                              this.insuranceInfo.cityName = c.areaName
                              for (let d of c.children) {
                                if (d.id == res.data.town) {
                                  this.insuranceInfo.area += '/' + d.areaName
                                  this.insuranceInfo.townName = d.areaName
                                  break
                                }
                              }
                              break
                            }
                          }
                          break
                        }
                      }
                    }
                    //默认合同时间
                    if(res.data.contractStart && res.data.contractEnd){
                      this.defaultContract = [moment(res.data.contractStart,'YYYY-MM-DD'),moment(res.data.contractEnd,'YYYY-MM-DD')]
                    }
                    this.$nextTick(() => {
                      this.empForm.setFieldsValue(pick({socialStatus:String(this.insuranceInfo.socialStatus)},'socialStatus'))
                    })

                    if (res.data.insuranceForWorkInjuryVo && res.data.insuranceForWorkInjuryVo.length) {
                      this.insuranceInfo.insuranceStatus = 0
                      this.insuranceInfo.insuranceArr = res.data.insuranceForWorkInjuryVo
                    } else {
                      this.insuranceInfo.insuranceStatus = 1
                      this.insuranceInfo.insuranceArr = []
                    }
                    this.insuranceInfo.insuranceStr = ''
                    for (let item of this.insuranceInfo.insuranceArr) {
                      this.insuranceInfo.insuranceStr += ' ' + item.insuranceTypeName
                    }
                  } else {
                    this.insuranceInfo = {}
                    this.$message.warning(res.msg)
                  }
                })
                this.current++
              }else{
                this.$message.warning(res1.msg)
              }
              
            })
          }
        }
      })
      
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    //上传
    handleChange() {
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
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', this.flag)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      this.fileList.splice(this.fileList.length - 1, 1)
      postActionHeader(this.url.importUrl, formData, contextType,300000).then(res => {
        if(res.code == 200){
          this.fileList.push(res.data)
          this.$message.success(`上传成功`)
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
      //治疗类型
      initDictOptions('treatment_type').then(res => {
        if (res.code === 200) {
          this.treatmentTypeOption = res.data
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    treeSelectChange(value, label, extra) {
      httpAction(this.url.getCustomerInfo + value, null, 'GET').then(res => {
        if (Number(res.code) === 200) {
          // this.model.customerCode = res.data.customerCode;
          // this.$nextTick(() => {
          //   this.riskForm.setFieldsValue(pick(this.model, 'customerCode'))
          // })

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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 120px;
  }
}
.stepFormlabel {
  :global(.ant-form-item-label) {
    width: 100px;
  }
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
  cursor: pointer;
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