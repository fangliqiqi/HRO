<template>
  <a-modal
    :title="title"
    :width="1200"
    placement="right"
    :closable="true"
    :footer="null"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
        style="padding:0px;"
      >
        <a-row>
          <a-col :span="24">
            <div>
              <a-steps
                :current="current"
                style="width:800px;margin:0 auto;"
              >
                <a-step
                  v-for="item in steps"
                  :key="item.title"
                  :title="item.title"
                />
              </a-steps>

              <div
                class="steps-content"
                v-show="current == 0"
              >
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
                          <a-select
                            v-model="queryParam.settleDomain"
                            placeholder="请选择结算主体查询"
                            style="width:190px;"
                          >
                            <a-select-option value="">全部</a-select-option>
                            <a-select-option
                              v-for="(value, key) in settleDomainBelongs"
                              :key="key"
                              :value="value.id"
                            >{{ value.departName }}</a-select-option>
                          </a-select>
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
                  已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> 项
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
                  <!-- <span
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
                  </span> -->
                  <span
                    slot="belongUnit"
                    slot-scope="text, record"
                  >
                    {{ settleDomainBelongs[record.settleDomain] ? settleDomainBelongs[record.settleDomain]['customerName'] : '' }}
                  </span>

                </a-table>

              </div>
              <div
                class="steps-content select-list"
                v-show="current == 1"
              >
                <detail-list v-if="this.selectedRowKeys[0]">
                  <detail-list-item term="姓名">{{ employeeInfo.empName }}</detail-list-item>
                  <detail-list-item term="身份证号">{{ employeeInfo.empIdcard }}</detail-list-item>
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
                  <detail-list-item term="所属单位">{{ employeeInfo.belongUnit || '--' }}</detail-list-item>
                  <detail-list-item term="就职班组">{{ employeeInfo.inauguralTeam || '--' }}</detail-list-item>
                  <detail-list-item term="就职岗位">{{ employeeInfo.post || '--' }}</detail-list-item>
                  <detail-list-item term="电信编号">{{ employeeInfo.telecomNumber || '--' }}</detail-list-item>
                  <detail-list-item term="户口性质">{{ employeeInfo.empRegisType || '--' }}</detail-list-item>
                  <detail-list-item term="开户行" style="height:38px;">
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        {{ employeeInfo.empBankName || '--' }}
                      </template>
                      <span class="overflow">{{ employeeInfo.empBankName || '--' }}</span>
                    </a-tooltip>
                  </detail-list-item>
                  <detail-list-item term="银行卡号">
                    {{ employeeInfo.empBankNo || '--' }}
                  </detail-list-item>
                  <detail-list-item term="员工标签">{{ employeeInfo.empLabel || '--' }}</detail-list-item>
                  <detail-list-item term="身份证地址">
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        {{ employeeInfo.idArea + (employeeInfo.idcardAddr || '') }}
                      </template>
                      <span class="overflow">
                        {{ employeeInfo.idArea + (employeeInfo.idcardAddr || '') }}
                      </span>
                    </a-tooltip>
                  </detail-list-item>
                  <detail-list-item term="档案所在地">
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        {{ employeeInfo.fileArea + (employeeInfo.fileAddr || ' ') }}
                      </template>
                      <span class="overflow">
                        {{ employeeInfo.fileArea + (employeeInfo.fileAddr || ' ') }}
                      </span>
                    </a-tooltip>
                  </detail-list-item>
                  <detail-list-item term="备注">{{ employeeInfo.remark || '--' }}</detail-list-item>
                </detail-list>
              </div>
              <div
                class="steps-content"
                v-show="current == 2"
              >
                <a-form
                  :form="form"
                  layout="vertical"
                  class="ant-advanced-search-form"
                  style="text-align: left;margin-bottom:0px;"
                >
                  <a-row :gutter="24">
                    <a-col :span="5">
                      <a-form-item label="保险公司">
                        <a-select
                          showSearch
                          optionFilterProp="children"
                          placeholder="请选择保险公司"
                          v-decorator="['insuranceCompany', validatorRules.insuranceCompany]"
                          @search="handleSearchInsuranceCompany"
                          @change="handleIdInsuranceCompanyChange"
                          :dropdownMatchSelectWidth="false"
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                          style="width: 200px"
                        >
                          <a-select-option
                            v-for="(item, index) in insuranceCompanyBelongs"
                            :key="index"
                            :value="item.id"
                          >{{ item.companyName }}</a-select-option>
                          
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="险 种">
                        <a-select
                          showSearch
                          optionFilterProp="children"
                          placeholder="请选择险种"
                          v-decorator="['insuranceType', validatorRules.insuranceType]"
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                          style="width: 200px"
                        >
                          <a-select-option
                            v-for="(item, index) in insuranceTypeNames.records"
                            :key="index"
                            :value="item.id"
                          >{{ item.name }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="购买标准">
                        <a-input
                          placeholder="请选择购买标准"
                          v-decorator="['buyStandard', validatorRules.buyStandard]"
                          style="width: 200px"
                          autocomplete="off"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="5">
                      <a-form-item label="保单开始日期">
                        <a-date-picker
                          :disabledDate="disabledStartDate"
                          format="YYYY-MM-DD"
                          style="width: 200px"
                          v-decorator="['policyStart', validatorRules.policyStart]"
                          placeholder="选择日期"
                          @openChange="handleStartOpenChange"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="保单结束日期">
                        <a-date-picker
                          :disabledDate="disabledEndDate"
                          format="YYYY-MM-DD"
                          style="width: 200px"
                          placeholder="选择日期"
                          v-decorator="['policyEnd', validatorRules.policyEnd]"
                          :open="endOpen"
                          @openChange="handleEndOpenChange"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="保单生效时间">
                        <a-date-picker
                          format="YYYY-MM-DD"
                          :disabled="true"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="替换日期">
                        <a-date-picker
                          format="YYYY-MM-DD"
                          placeholder="选择日期"
                          :disabled="true"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="4">
                      <a-form-item label="替换状态">
                        <a-select
                          style="width: 150px"
                          placeholder="请选择替换状态"
                          :disabled="true"
                        >
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="5">
                      <a-form-item label="实际保费">
                        <a-input
                          placeholder="请输入实际保费"
                          v-decorator="['buyPay', validatorRules.buyPay]"
                          style="width: 200px"
                          autocomplete="off"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="身故或残疾金额">
                        <a-input
                          placeholder="请输入身故或残疾金额"
                          v-decorator="['deathDisabilityMoney', validatorRules.deathDisabilityMoney]"
                          style="width: 200px"
                          autocomplete="off"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="医疗额度">
                        <a-input
                          placeholder="请输入医疗额度"
                          v-decorator="['medicalMoney', validatorRules.medicalMoney]"
                          style="width: 200px"
                          autocomplete="off"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="保单号">
                        <a-input
                          placeholder="请输入保单号"
                          style="width: 200px"
                          v-decorator="['policyNo']"
                          :disabled="true"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="5">
                      <a-form-item label="结算类型">
                        <a-select
                          showSearch
                          optionFilterProp="children"
                          placeholder="请选择结算类型"
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                          v-decorator="['settleType', validatorRules.settleType]"
                          style="width: 200px"
                        >
                          <a-select-option
                            v-for="(item, index) in settleTypeOptions"
                            :key="index"
                            :value="item.value"
                          >{{ item.label }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="结算主体">
                        <a-select
                          showSearch
                          optionFilterProp="children"
                          placeholder="请选择结算主体查询"
                          v-decorator="['settlementOrgan',{rules: [{ required: true, message: '请选择结算主体!' }]}]"
                          :disabled="true"
                          style="width: 200px"
                        >
                          <a-select-option
                            v-for="(value, key) in settleDomainBelongs"
                            :key="key"
                            :value="value.id"
                          >{{ value.departName }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="结算月份">
                        <a-month-picker
                          format="YYYYMM"
                          placeholder="请选择结算月份"
                          v-decorator="['settleMonth', validatorRules.settleMonth]"
                          style="width: 200px"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="发票号">
                        <a-input
                          placeholder="请输入发票号"
                          style="width: 200px"
                          v-decorator="['invoiceNo']"
                          autocomplete="off"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="5">
                      <a-form-item label="购买月数">
                        <a-input-number
                          :min="1"
                          :max="12"
                          placeholder="请输入购买月数"
                          style="width: 200px"
                          v-decorator="['buyMonth',validatorRules.buyMonth]"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label="商险购买地">
                        <a-select
                          showSearch
                          placeholder="选择省份"
                          optionFilterProp="children"
                          style="width: 200px"
                          v-decorator="['businessInsuranceProvId', validatorRules.businessInsuranceProvId]"
                          @change="handleIdProvinceChange"
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                        >
                          <a-select-option
                            v-for="(item, index) in idAreaTrees"
                            :key="index"
                            :value="String(item.id)"
                          >{{ item.areaName }}</a-select-option>
                        </a-select>
                      </a-form-item>
                      
                    </a-col>
                    <a-col :span="5">
                      <a-form-item label=" " class="city">
                        <a-select
                          showSearch
                          placeholder="选择城市"
                          optionFilterProp="children"
                          style="width: 200px"
                          v-decorator="['businessInsuranceAddrId',validatorRules.businessInsuranceAddrId]"
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                        >
                          <a-select-option
                            v-for="(item, index) in idAreaCitys"
                            :key="index"
                            :value="String(item.id)"
                          >{{ item.areaName }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="10">
                      <a-form-item label="备注">
                        <a-textarea
                          autocomplete="off"
                          placeholder="请输入备注"
                          v-decorator="['remark']"
                          cols="120"
                          rows="3"
                          style="resize:none"
                        ></a-textarea>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
              <div
                class="steps-content"
                v-show="current == 3"
              >
                <a-row>
                  <a-col
                    :span="5"
                    style="text-align:left;margin: 18px 0px;color:#999999"
                  >
                    选择要上传的附件
                  </a-col>
                </a-row>
                <a-row style="text-align:left;">
                  <a-col :span="24" style="margin-bottom: 22px;">
                    <a-upload-dragger
                      :multiple="true"
                      name="file"
                      :fileList="fileList"
                      :beforeUpload="beforeUpload"
                      :remove="removeFile"
                      @change="handleChange"
                      accept="image/*,.xls,.xlsx,.csv,.pdf"
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
                  v-if="current < steps.length - 2"
                  type="primary"
                  :disabled="disabledBtn"
                  style="margin-bottom:0px;"
                  @click="next"
                >下一步</a-button>
                <a-button
                  v-if="current == 2"
                  type="primary"
                  style="margin-bottom:0px;"
                  @click="submitDispatchApply"
                >保存</a-button>
                <a-button
                  v-if="current>0 && current != 3"
                  style="margin-left: 8px;margin-bottom:0px;"
                  @click="prev"
                >上一步</a-button>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import moment from 'moment'
import { filterObj } from '@/utils/util'
import { httpAction,getAction,postActionHeader } from '@/api/manage'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import { getAreaName,getAreaData } from '@/utils/common'
import pick from 'lodash.pick'
// import JSettlement from '@/components/jeecg/JSettlement'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: 'DispatchApplyModal',
  components: {
    DetailList,
    DetailListItem,
  },
  data() {
    return {
      title: '操作',
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
          return `${range[0]}-${range[1]}共${total}条`
        },
        change:(page,pageSize)=>{
          this.ipaginations.current=page
          this.ipaginations.pageSize=pageSize;
          this.loadData()
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0
      },
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* table选中records*/
      settleDomain:'', //结算主体id
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: '',
      getQueryParams() {
        //获取查询条件
        const sqp = {}
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
      steps: [
        {
          title: '选择人员',
          index: 0
        },
        {
          title: '基本信息',
          index: 1
        },
        {
          title: '商险事项',
          index: 2
        },
        {
          title: '附件',
          index: 3
        }
      ],
      model: {},
      form: this.$form.createForm(this),
      employeeInfo:{}, //员工信息
      sexOptions: [], // 性别
      empTypeOptions: [], // 员工类型
      employeeLableOptions: [],  // 员工标签
      empMarriOptions: [],  // 婚姻状况
      educationOptions: [], // 学历级别
      politicalOptions: [], // 政治面貌
      empRegisTypeOptions: [],  // 户口性质
      empNationalOptions: [], // 民族
      settleDomainBelongs:[],
      insuranceCompanyBelongs:[],//保险公司列表
      insuranceTypeNames:[],//险种
      settleTypeOptions:[],//结算类型
      insuranceId:'', //新增的商险派单申请id
      fileLists:{}, //上传的文件信息
      workFlagOptions: {'0': {'option': '在职', 'color': 'green'}, '1': {'option': '离职', 'color': 'red'}},
      rowEmpoyee:{}, //选中员工信息
      disabledBtn:true, //是否可以进入下一步
      idAreaTrees: [],
      idAreaCitys: [],
      isUpload:true,
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
          customRender: (text) => {
            return this.settleDomainBelongs[text] ? this.settleDomainBelongs[text]['departName'] : ''
          },
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'belongUnit',
          scopedSlots: { customRender: 'belongUnit' },
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
        //   scopedSlots: { customRender: 'workFlag' },
        // },
        {
          title: '员工类型',
          align: 'center',
          dataIndex: 'empType',
          customRender: (text) => {
            return filterDictText(this.empTypeOptions, text)
          },
        },
      ],
      visible: false,
      endOpen: false,
      info:'',
      fileList: [],
      confirmLoading: false,
      dateFormat: 'YYYY-MM-DD',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      validatorRules: {
        insuranceCompany: { rules: [{ required: true, message: '请选择保险公司!' }] },
        insuranceType: { rules: [{ required: true, message: '请选择险种!' }] },
        buyStandard: { rules: [{ required: true,message:'请输入购买标准!' },{validator: (rule,value, callback)=>{
          if(value){
            if( ! /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value) || value < 0.01 ){
              callback('购买标准格式不正确!')
            }
          }
          callback()
        }}] },
        policyStart: { rules: [{ required: true, message: '请选择保单开始时间!' }] },
        policyEnd: { rules: [{ required: true, message: '请选择保单结束时间!' }] },
        buyMonth: { rules: [{ required: true, message: '请输入购买月数!' },{ pattern: /^([1-9]|11|12|10)$/, message: '请输入正确的购买月数!' }] },
        buyPay: { rules: [{validator: (rule,value, callback)=>{
          if(value){
            if( ! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value) || value < 0.01){
              callback('实际保费格式不正确!')
            }
          }
          callback()
        }}] },
        deathDisabilityMoney: { rules: [{ required: true, message: '请输入身故或残疾金额!' },{validator: (rule,value, callback)=>{
          if(value){
            if( ! /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value) || value < 0.01 ){
              callback('身故或残疾金额格式不正确!')
            }
          }
          callback()
        }}] },
        medicalMoney: { rules: [{required: true,validator: (rule,value, callback)=>{
          if(value){
            if( ! /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value) || value < 0.01 ){
              callback('医疗额度格式不正确!')
            }
          }
          callback()
        }}]},
        settleMonth: { rules: [{ required: true, message: '请选择结算月份!' }] },
        settleType: { rules: [{ required: true, message: '请选择结算类型!' }] },
        businessInsuranceProvId: { rules: [{ required: true, message: '请选择省份!' }] },
        businessInsuranceAddrId: { rules: [{ required: true, message: '请选择市!' }] },
      },
      url: {
        add:'/busiInsurance/tbusinessinsurance', //新增商险派单信息
        getinfo: '/hrBase/temployeeinfo/', //根据员工ID查询员工信息
        list: '/hrBase/temployeeinfo/page?workFlag=0', //员工信息列表请求地址
        insuranceCompanyInfo:'/busiInsurance/tinsurancecompany/page?size=50', //获取保险公司列表
        insuranceType:'/busiInsurance/tinsurancetype/page/', //根据保险公司选择险种
        importUrl:'/busiInsurance/tinsuranceatta/upload', //上传文件
        delAttachUrl:'/busiInsurance/tinsuranceatta/'
      }
    }
  },
  created(){
    this.idAreaTrees = getAreaData()
  },
  methods: {
    moment,
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipaginations.current = 1
      }
      var params = this.getQueryParams()//查询条件
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        if (res.code === 200 && res.data) {
          var listPath = this.$route.path
          var pathArr = listPath.split('/')
          this.dataSource = res.data.records
          if(String(pathArr[1]) === 'dispose'){
            for(const item in this.dataSource){
              if(String(this.dataSource[item].effectiveFlag) === '1'){
                this.dataSource[item].effectiveFlagText = '有效'
              }else{
                this.dataSource[item].effectiveFlagText = '无效'
              }
            }
          }
          this.ipaginations.total = res.data.total
        }
      }).finally(()=>{
        this.loading = false
      })
    },
    searchQuery() {
      this.loadData(1)
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
    searchReset() {
      this.queryParam = {}
      this.loadData(1)
    },
    onClearSelected() {
      this.disabledBtn=true
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    onSelectChange(selectedRowKeys,selectedRows) {
      this.disabledBtn=false
      this.selectedRowKeys = selectedRowKeys
      this.rowEmpoyee = selectedRows[0]
    },
    rowSelect(record){
      return {
        on: {
            click: () => {
              this.disabledBtn=false
            this.employeeInfo={}
            this.selectedRowKeys=[record.id] //点击行选中
            this.rowEmpoyee=record
            }
        }
      }
    },
    next() { //下一步
      if(this.current === 0){
        if(!this.selectedRowKeys[0]){
          this.$message.error('请先选择人员')
          return false
        }
        this.rowEmpoyee.empTypeName = filterDictText(this.empTypeOptions, this.rowEmpoyee.empType)
        this.rowEmpoyee.settleDomainName = (this.settleDomainBelongs[this.rowEmpoyee.settleDomain]) ? this.settleDomainBelongs[this.rowEmpoyee.settleDomain]['departName'] : ""
        this.model = Object.assign(this.model, {settlementOrgan:this.rowEmpoyee.settleDomain})
        this.employeeInfo={}
        //获取员工信息
        httpAction(this.url.getinfo+this.selectedRowKeys[0], '', 'GET').then((res) => {
          if (res.code === 200 && res.data) {
            this.disabledBtn = false
            this.employeeInfo = res.data
            this.employeeInfo.empSex = filterDictText(this.sexOptions, this.employeeInfo.empSex)
            this.employeeInfo.empMarriStatu = filterDictText(this.empMarriOptions, this.employeeInfo.empMarriStatu)
            this.employeeInfo.empNational = filterDictText(this.empNationalOptions, this.employeeInfo.empNational)
            this.employeeInfo.politicalStatus = filterDictText(this.politicalOptions, this.employeeInfo.politicalStatus)
            this.employeeInfo.empType = filterDictText(this.empTypeOptions, this.employeeInfo.empType)
            this.employeeInfo.empRegisType = filterDictText(this.empRegisTypeOptions, this.employeeInfo.empRegisType)
            this.employeeInfo.empLabel = filterDictText(this.employeeLableOptions, this.employeeInfo.empLabel)
            this.employeeInfo.idArea = getAreaName(this.employeeInfo.idProvince,this.employeeInfo.idCity,this.employeeInfo.idTown,'-')
            this.employeeInfo.fileArea = getAreaName(this.employeeInfo.fileProvince,this.employeeInfo.fileCity,this.employeeInfo.fileTown,'-')
            
            const settleDomainTemp = this.employeeInfo.settleDomain // 用于取所属单位
            this.employeeInfo.belongUnit = (this.settleDomainBelongs[settleDomainTemp]) ? this.settleDomainBelongs[settleDomainTemp].customerName : ''
          }else{
            this.disabledBtn = true
            this.$message.warning('获取员工信息错误')
          }
        })

      }else if(this.current === 1){
        //结算类型
        initDictOptions('settlementType').then((res) => {
          if (res.code === 200) {
            this.settleTypeOptions = res.data
          }
        })
        this.form.setFieldsValue(pick({settlementOrgan:this.rowEmpoyee.settleDomain,settleMonth:moment()},'settlementOrgan','settleMonth'))
        httpAction(this.url.insuranceCompanyInfo, '','GET').then((res) => {
          if(res.code === 200) {
            this.insuranceCompanyBelongs = res.data.records
          }
        })
      }
      this.current++
    },
    submitDispatchApply(){ //提交表单
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          const httpurl = this.url.add
          const method = 'post'
          values.policyStart = values.policyStart.format(this.dateFormat)
          values.policyEnd = values.policyEnd.format(this.dateFormat)
          values.settleMonth = values.settleMonth.format('YYYYMM')
          values.empId = that.selectedRowKeys[0]
          let addr = getAreaName(values.businessInsuranceProvId,values.businessInsuranceAddrId,'-').split('-')
          values.businessInsuranceProv = addr[0]
          values.businessInsuranceAddr = addr[1]
          const formData = Object.assign(this.model, values)
          httpAction(httpurl, formData, method).then((res) => {
            if (res.code === 200) {
              that.$message.success(`${that.title}成功！`)
              that.current++
              this.insuranceId = res.data
            } else {
              that.$message.warning(res.msg)
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
      })
    },
    prev() {//上一步
      if(this.current === 1){
        this.onClearSelected()
      }
      this.current--
    },
    add(record) {
      this.model = Object.assign({}, record)
      this.visible = true
      this.initDictConfig()
    },
    handleIdProvinceChange(value) {
      this.idAreaCitys = []
      for (var c of this.idAreaTrees[value - 1].children) {
        this.idAreaCitys.push(c)
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick({businessInsuranceAddrId:String(this.idAreaCitys[0].id)}, 'businessInsuranceAddrId'))
      })
    },
    handleIdInsuranceCompanyChange(value){ //根据保险公司选择险种
      const url = `${this.url.insuranceType}?companyId=${value}`
      httpAction(url, '','GET').then((res) => {
        if(res.code === 200) {
          this.insuranceTypeNames=res.data
          this.$nextTick(() => {
            this.form.setFieldsValue(pick({insuranceType:''},'insuranceType'))
          })
        }
      })
    },
    // 搜索保险公司请求
    handleSearchInsuranceCompany(value) {
      if (value) {
        const that = this
        const method = 'get'
        const httpurl = `${this.url.insuranceCompanyInfo}?companyName=${value}`
        httpAction(httpurl, '', method).then((res) => {
            if (res.code === 200) {
              if  (res.data.records.length > 0) {
                this.insuranceCompanyBelongs = res.data.records
              }
            } else {
              that.$message.warning('接口异常！')
            }
        })
      }
    },
    // 数据字典
    initDictConfig() {
      // 员工类型
      initDictOptions('personnel_type').then((res) => {
        if (res.code === 200) {
          this.empTypeOptions = res.data
        }
      })
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
    handleCancel() {
      this.close()
      this.current=0
    },
    close() {
      this.$emit('ok')
      this.visible = false
      this.disabledBtn = true
      this.fileList = []
      this.ipaginations.current = 1
      this.onClearSelected()
    },
    disabledStartDate (policyStart) {
      const policyEnd = this.form.getFieldValue('policyEnd');
      if (!policyStart || !policyEnd) {
        return policyStart && policyStart < moment().endOf('day')
      }
      return policyStart < moment().endOf('day') || policyStart.valueOf() > policyEnd.valueOf();
    },
    disabledEndDate (policyEnd) {
      const policyStart =  this.form.getFieldValue('policyStart');
      if (!policyEnd || !policyStart) {
        return policyEnd && policyEnd < moment().add(1,'days').valueOf()
      }
      return policyStart.valueOf() > policyEnd.valueOf();
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open;
    },
    removeFile(fileInfo) {
      this.isUpload = false
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          httpAction(_this.url.delAttachUrl + fileInfo.uid, null, 'DELETE').then(res => {
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
          }).finally(()=>{
            _this.isUpload = true
          })
        }
      })
      return false
    },
    //上传
    handleChange(file) {
      // const { fileList } = this
      // this.uploadFilesChange(fileList[fileList.length - 1])
      if(this.isUpload) this.uploadFilesChange(file.file)
    },
    beforeUpload() {
      // this.fileList = [...this.fileList, file]
      return false;
    },
    uploadFilesChange(file) { // 上传图片
      const _this = this
      const formData = new FormData()
      formData.append('file', file)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      postActionHeader(this.url.importUrl+'?policyType=0&insuranceId='+this.insuranceId, formData, contextType).then((res) => {
        if(res.code == 200 && res.data){
          let obj = {
            uid:res.data.id,
            name:res.data.attaName,
            url:res.data.attaUrl,
            status: 'done',
          }
          _this.fileList = [..._this.fileList, obj]
          this.$message.success('上传附件成功')
        }else{
          this.$message.warning(res.msg)
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
  padding: 0px 0px 20px 0px;
}
.ant-advanced-search-form .ant-form-item {
  margin-bottom: 15px;
}

.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 180px;
  text-align: center;
  padding: 20px 20px 0px;
}

.steps-action {
  margin-top: 24px;
}

.select-list {
  text-align: left;
}
.select-list label {
  display: inline-block;
  text-align: right;
  width: 100px;
  margin-right: 15px;
}
.select-list span {
  color: #0f0202;
}
.overflow {
  display: inline-block;
  width: 280px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  color: #000000a6 !important;
}
.city {
  :global(.ant-form-item-label) {
    width: 75px;
  }
}
</style>
