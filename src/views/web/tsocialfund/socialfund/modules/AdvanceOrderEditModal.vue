<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :bodyStyle="{height:'550px',overflowY: 'scroll',padding:'18px'}"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        :loading="confirmLoading"
        @click="handleOk()"
      >确认编辑</a-button>
    </template>
    <div class="topStatusWrap">
      <div class="statusBox">
        <span class="title">单据状态：</span>
        <span
          class="status"
          :style="`color:${orderColor}`"
        >{{ orderStatus }}</span>
      </div>
      <div
        v-if="detailInfo.exceptionContent"
        class="statusBox"
        style="margin-top:8px;"
      >
        <span class="title">异常说明：</span>
        <p class="desc">{{ detailInfo.exceptionContent }}</p>
      </div>
    </div>
    <template v-if="isDispatchAdd">
      <a-form
        :form="form"
        class="ant-disabled-form"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="日期">
              <a-date-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYY-MM-DD'"
                placeholder="请选择日期"
                v-decorator="['date']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="接单分公司">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入接单分公司"
                v-decorator="['company']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="缴费地">
              <a-input
                :disabled="isDispath"
                placeholder="请输入缴费地"
                v-decorator="['payAddress',{rules: [{ required: true, message: '请输入缴费地！' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="客户名称">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入客户名称"
                v-decorator="['customerName']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="员工姓名">
              <a-input
                :disabled="isDispath"
                placeholder="请输入员工姓名"
                v-decorator="['empName',{rules: [{ required: true, message: '请输入员工姓名！' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="身份证号">
              <a-input
                :disabled="isDispath"
                :maxLength="22"
                placeholder="请输入身份证号"
                v-decorator="['empIdcard',{rules: [{ required: true, message: '请输入身份证号！' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="联系电话1">
              <a-input
                :disabled="isDispath"
                allowClear
                :maxLength="11"
                placeholder="请输入联系电话1"
                v-decorator="['telOne',{rules: [{required: true,pattern: /^(1[3456789]\d{9})$/, message: '请输入正确的手机号码！'}]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话2">
              <a-input
                :disabled="isDispath"
                allowClear
                :maxLength="12"
                placeholder="请输入联系电话2"
                v-decorator="['telTwo',{rules: [{pattern: /^(1[3456789]\d{9})$/, message: '请输入正确的手机号码！'}]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="入职日期">
              <a-date-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYY-MM-DD'"
                placeholder="请选择入职日期"
                v-decorator="['entryDate']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="正式工资">
              <a-input
                :disabled="isDispath"
                allowClear
                :maxLength="12"
                placeholder="请输入正式工资"
                v-decorator="['formalSalary']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="派遣开始日期">
              <a-date-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYY-MM-DD'"
                placeholder="请选择派遣开始日期"
                v-decorator="['dispatchStart']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="派遣结束日期">
              <a-date-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYY-MM-DD'"
                placeholder="请选择派遣结束日期"
                v-decorator="['dispatchEnd']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="合同开始日期">
              <a-date-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYY-MM-DD'"
                placeholder="请选择合同开始日期"
                v-decorator="['contractStart']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="合同终止日期">
              <a-date-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYY-MM-DD'"
                placeholder="请选择合同终止日期"
                v-decorator="['contractEnd']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="试用开始日期">
              <a-date-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYY-MM-DD'"
                placeholder="请选择试用开始日期"
                v-decorator="['trialStart']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="试用结束日期">
              <a-date-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYY-MM-DD'"
                placeholder="请选择试用结束日期"
                v-decorator="['trialEnd']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="试用期工资">
              <a-input
                :disabled="isDispath"
                allowClear
                :maxLength="12"
                placeholder="请输入试用期工资"
                v-decorator="['trialSalary']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工作制">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入工作制"
                v-decorator="['workingSystem']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="合同版本">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入合同版本"
                v-decorator="['contractVersion']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否电话通知">
              <a-select
                :disabled="isDispath"
                allowClear
                placeholder="请选择是否电话通知"
                optionFilterProp="children"
                v-decorator="['telNotice']"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="实际工作地">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入实际工作地"
                v-decorator="['workingAddress']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="备注说明1">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入备注说明1"
                v-decorator="['remarkOne']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="备注说明2">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入备注说明2"
                v-decorator="['remarkTwo']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="养老城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入养老城市"
                v-decorator="['pensionAddress']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="养老基数">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入养老基数"
                v-decorator="['pensionBase']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="养老起缴月">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择养老起缴月"
                v-decorator="['pensionStart']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="医疗城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入医疗城市"
                v-decorator="['medicalAddress']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="医疗基数">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入医疗基数"
                v-decorator="['medicalBase']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="医疗起缴月">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择医疗起缴月"
                v-decorator="['medicalStart']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="工伤城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入工伤城市"
                v-decorator="['injuryAddress']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工伤基数">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入工伤基数"
                v-decorator="['injuryBase']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工伤起缴月">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择工伤起缴月"
                v-decorator="['injuryStart']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="生育城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入生育城市"
                v-decorator="['birthAddress']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="生育基数">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入生育基数"
                v-decorator="['birthBase']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="生育起缴月">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择生育起缴月"
                v-decorator="['birthStart']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="失业城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入失业城市"
                v-decorator="['unemploymentAddress']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="失业基数">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入失业基数"
                v-decorator="['unemploymentBase']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="失业起缴月">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择失业起缴月"
                v-decorator="['unemploymentStart']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="公积金城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入公积金城市"
                v-decorator="['fundAddress']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="公积金基数">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入公积金基数"
                v-decorator="['fundBase']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="公积金个人比例">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入公积金个人比例"
                v-decorator="['fundPersonalPer']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="公积金企业比例">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入公积金企业比例"
                v-decorator="['fundCompanyPer']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="公积金起缴月">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择公积金起缴月"
                v-decorator="['fundStart']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="派单分公司">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入派单分公司"
                v-decorator="['dispatchCompany']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="派单客服">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入派单客服"
                v-decorator="['customerService']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="小合同名称">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入小合同名称"
                v-decorator="['contractMinorName']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="唯一号">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入唯一号"
                v-decorator="['uniqueNumber']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="合同类型">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入合同类型"
                v-decorator="['contractType']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="客户编号">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入客户编号"
                v-decorator="['customerNumber']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="服务类别">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入服务类别"
                v-decorator="['serviceType']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="资料是否提交">
              <a-select
                allowClear
                placeholder="请选择资料是否提交"
                optionFilterProp="children"
                v-decorator="['dataSubStatus']"
                :dropdownMatchSelectWidth="false"
              >
                <a-select-option value="0">是</a-select-option>
                <a-select-option value="1">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="备注">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入备注"
                v-decorator="['remark']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <template v-else>
      <a-form
        :form="form"
        class="ant-disabled-form"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="日期">
              <a-date-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYY-MM-DD'"
                placeholder="请选择日期"
                v-decorator="['date']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="接单分公司">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入接单分公司"
                v-decorator="['company']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="缴费地">
              <a-input
                :disabled="isDispath"
                placeholder="请输入缴费地"
                v-decorator="['payAddress',{rules: [{ required: true, message: '请输入缴费地！' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="客户名称">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入客户名称"
                v-decorator="['customerName']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="员工姓名">
              <a-input
                :disabled="isDispath"
                placeholder="请输入员工姓名"
                v-decorator="['empName',{rules: [{ required: true, message: '请输入员工姓名！' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="身份证号">
              <a-input
                :disabled="isDispath"
                :maxLength="22"
                placeholder="请输入身份证号"
                v-decorator="['empIdcard',{rules: [{ required: true, message: '请输入身份证号！' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="离职日期">
              <a-date-picker
                :disabled="isDispath"
                placeholder="请选择离职日期"
                v-decorator="['leaveDate']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="离职原因">
              <a-input
                :disabled="isDispath"
                placeholder="请输入离职原因"
                v-decorator="['leaveReason',{rules: [{ required: true, message: '请输入离职原因！' }]}]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话1">
              <a-input
                :disabled="isDispath"
                allowClear
                :maxLength="12"
                placeholder="请输入联系电话1"
                v-decorator="['telOne']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="联系电话2">
              <a-input
                :disabled="isDispath"
                allowClear
                :maxLength="12"
                placeholder="请输入联系电话2"
                v-decorator="['telTwo']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="备注说明1">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入备注说明1"
                v-decorator="['remarkOne']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="养老截止城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入养老截止城市"
                v-decorator="['pensionAddressReduce']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="养老截止时间">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择养老截止时间"
                v-decorator="['pensionEndReduce']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="医疗截止城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入医疗截止城市"
                v-decorator="['medicalAddressReduce']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="医疗截止时间">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择医疗截止时间"
                v-decorator="['medicalEndReduce']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="工伤截止城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入工伤截止城市"
                v-decorator="['injuryAddressReduce']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="工伤截止时间">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择工伤截止时间"
                v-decorator="['injuryEndReduce']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="生育截止城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入生育截止城市"
                v-decorator="['birthAddressReduce']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="生育截止时间">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择生育截止时间"
                v-decorator="['birthEndReduce']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="失业截止城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入失业截止城市"
                v-decorator="['unemploymentAddressReduce']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="失业截止时间">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择失业截止时间"
                v-decorator="['unemploymentEndReduce']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="公积金截止城市">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入公积金截止城市"
                v-decorator="['fundAddressReduce']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="公积金截止时间">
              <a-month-picker
                :disabled="isDispath"
                allowClear
                :format="'YYYYMM'"
                placeholder="请选择公积金截止时间"
                v-decorator="['fundEndReduce']"
                style="width:100%;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="派单分公司">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入派单分公司"
                v-decorator="['dispatchCompany']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="派单客服">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入派单客服"
                v-decorator="['customerService']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="小合同名称">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入小合同名称"
                v-decorator="['contractMinorName']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="合同类型">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入合同类型"
                v-decorator="['contractType']"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="备注">
              <a-input
                :disabled="isDispath"
                allowClear
                placeholder="请输入备注"
                v-decorator="['remark']"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>
    <a-divider orientation="left">
      合同信息 <a-tooltip title="合同时间重复，清空合同信息"><a-icon type="question-circle" /></a-tooltip>
    </a-divider>
    <a-form
      :form="contractForm"
      class="ant-disabled-form"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="合同类型">
            <a-select
              allowClear
              optionFilterProp="children"
              placeholder="请选择合同类型"
              v-decorator="['contractTypeAdd']"
              :dropdownMatchSelectWidth="false"
            >
              <a-select-option
                v-for="(item, index) in contractTypeOptions"
                :key="index"
                :value="item.value"
              >{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="合同名称">
            <a-input
              :disabled="isDispath"
              allowClear
              placeholder="请输入合同名称"
              v-decorator="['contractNameAdd']"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="合同期限">
            <a-input
              :disabled="isDispath"
              allowClear
              placeholder="请输入合同期限"
              v-decorator="['contractTermAdd']"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="合同开始时间">
            <a-date-picker
              :disabled="isDispath"
              allowClear
              :format="'YYYYMMDD'"
              placeholder="请选择开始日期"
              v-decorator="['contractStartAdd']"
              style="width:100%;"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="合同截止时间">
            <a-date-picker
              :disabled="isDispath"
              :disabledDate="disabledContractEnd"
              allowClear
              @change="endDatePickChange"
              :format="'YYYYMMDD'"
              placeholder="请选择截止日期"
              v-decorator="['contractEndAdd']"
              style="width:100%;"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <error-modal ref="errorModal" ></error-modal>
  </a-modal>
</template>
<script>
import { httpAction } from '@/api/manage'
import moment from 'moment'
import pick from 'lodash.pick'
import ErrorModal from '../../../global/modules/ErrorModal'

export default {
  components:{
    ErrorModal
  },
  data() {
    return {
      title: '编辑',
      visible: false,
      form: this.$form.createForm(this),
      contractForm:this.$form.createForm(this),
      confirmLoading: false, // 点击确认编辑加载动画
      detailInfo: {}, // 详情数据
      isDispath: false, // 是否是已派单状态(已派单状态，只能修改资料是否提交)
      isDispatchAdd: true, // 区分是派增还是派减，默认派增
      orderStatus:'', // 单据状态
      orderColor:'',// 单据状态颜色
      contractTypeOptions:[], // 员工合同类型
      statusOptons: {
        '0': { option: '正常未派单', color: 'blue' },
        '1': { option: '异常未派单', color: 'orange' },
        '2': { option: '已派单', color: 'purple' }
      }, // 派单状态
      url: {
        eidtUrl: '/hrSocial/tpredispatchinfo' // 编辑修改
      }
    }
  },
  methods: {
    // 显示
    show(data) {
      this.detailInfo = data.preDispatchInfo || {}
      const option = this.statusOptons[String(this.detailInfo.preStatus)]
      if(option){
        this.orderStatus = this.statusOptons[String(this.detailInfo.preStatus)].option
        this.orderColor = this.statusOptons[String(this.detailInfo.preStatus)].color
      }
      // 判断派单状态
      if (String(this.detailInfo.preStatus) === '2') {
        this.isDispath = true
      } else {
        this.isDispath = false
      }
      // 判断是派增还是派减type	派单类型:0 派增 1 派减
      if(Number(this.detailInfo.type) === 1){
        this.isDispatchAdd = false
        this.title = '派减-编辑'
      }else {
        this.isDispatchAdd = true
        this.title = '派增-编辑'
      }
      this.visible = true
      const that = this
      // 处理传入的数据
      const configData = that.detailInfo
      this.handleDateFormat(configData,true)
      if(this.isDispatchAdd){
        this.$nextTick(() => {
          that.form.setFieldsValue(pick(configData,'date', 'company', 'payAddress',
          'customerName',
          'empName', 'empIdcard', 'telOne',
          'telTwo', 'entryDate', 'formalSalary',
          'dispatchStart', 'dispatchEnd', 'contractStart',
          'contractEnd', 'trialStart', 'trialEnd',
          'trialSalary', 'workingSystem', 'contractVersion',
          'telNotice', 'workingAddress', 'remarkOne',
          'remarkTwo','remark',
          'pensionAddress', 'pensionBase','pensionStart',
          'medicalAddress', 'medicalBase','medicalStart',
          'injuryAddress', 'injuryBase','injuryStart',
          'birthAddress', 'birthBase','birthStart',
          'unemploymentAddress', 'unemploymentBase','unemploymentStart',
          'fundAddress','fundBase', 'fundPersonalPer',
          'fundCompanyPer','fundStart',
          'dispatchCompany', 'customerService','contractMinorName',
          'uniqueNumber', 'contractType',
          'customerNumber', 'serviceType','dataSubStatus'))
        })
      }else {
        setTimeout(function(){
          that.$nextTick(() => {
            that.form.setFieldsValue(pick(that.detailInfo,'date', 'company', 'payAddress',
            'customerName', 'empName', 'empIdcard','remark',
            'leaveDate', 'leaveReason', 'telOne', 'telTwo',
            'remarkOne', 'pensionAddressReduce', 'pensionEndReduce',
            'medicalAddressReduce', 'medicalEndReduce', 'injuryAddressReduce',
            'injuryEndReduce', 'birthAddressReduce', 'birthEndReduce',
            'unemploymentAddressReduce', 'unemploymentEndReduce', 'fundAddressReduce',
            'fundEndReduce', 'dispatchCompany','customerService',
            'contractMinorName', 'contractType'))
          })
        },500)
      }
      this.$nextTick(() => {
          that.contractForm.setFieldsValue(pick(that.detailInfo,'contractTypeAdd', 'contractNameAdd', 'contractTermAdd','contractStartAdd', 'contractEndAdd'))
        })
    },
    // 改变日期格式
    handleDateFormat(configData,isAssign){
      if(this.isDispatchAdd){
        configData.date = this.changeDateStyle(1,configData.date,isAssign)
        configData.entryDate = this.changeDateStyle(1,configData.entryDate,isAssign)
        configData.dispatchStart = this.changeDateStyle(1,configData.dispatchStart,isAssign)
        configData.dispatchEnd = this.changeDateStyle(1,configData.dispatchEnd,isAssign)
        configData.contractStart = this.changeDateStyle(1,configData.contractStart,isAssign)
        configData.contractEnd = this.changeDateStyle(1,configData.contractEnd,isAssign)
        configData.trialStart = this.changeDateStyle(1,configData.trialStart,isAssign)
        configData.trialEnd = this.changeDateStyle(1,configData.trialEnd,isAssign)
        configData.pensionStart = this.changeDateStyle(0,configData.pensionStart,isAssign)
        configData.medicalStart = this.changeDateStyle(0,configData.medicalStart,isAssign)
        configData.injuryStart = this.changeDateStyle(0,configData.injuryStart,isAssign)
        configData.birthStart = this.changeDateStyle(0,configData.birthStart,isAssign)
        configData.unemploymentStart = this.changeDateStyle(0,configData.unemploymentStart,isAssign)
        configData.fundStart = this.changeDateStyle(0,configData.fundStart,isAssign)
        configData.createTime = this.changeDateStyle(2,configData.createTime,isAssign)
      }else {
        configData.date = this.changeDateStyle(1,configData.date,isAssign)
        configData.leaveDate = this.changeDateStyle(1,configData.leaveDate,isAssign)
        configData.pensionEndReduce = this.changeDateStyle(0,configData.pensionEndReduce,isAssign)
        configData.medicalEndReduce = this.changeDateStyle(0,configData.medicalEndReduce,isAssign)
        configData.injuryEndReduce = this.changeDateStyle(0,configData.injuryEndReduce,isAssign)
        configData.birthEndReduce = this.changeDateStyle(0,configData.birthEndReduce,isAssign)
        configData.unemploymentEndReduce = this.changeDateStyle(0,configData.unemploymentEndReduce,isAssign)
        configData.fundEndReduce = this.changeDateStyle(0,configData.fundEndReduce,isAssign)
      }
      configData.contractStartAdd = this.changeDateStyle(3,configData.contractStartAdd,isAssign)
      configData.contractEndAdd = this.changeDateStyle(3,configData.contractEndAdd,isAssign)
      return configData
    },
    // 取消、关闭
    handleCancel() {
      this.form.resetFields()
      this.confirmLoading = false
      this.isDispath = false
      this.isDispatchAdd = true
      this.pensionRequeir = false
      this.visible = false
    },
    // 确认编辑
    handleOk() {
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          // 合同信息
          const contractData = that.contractForm.getFieldsValue()
          const parameters = Object.assign(values,contractData)
          const formData = that.handleDateFormat(parameters,false)
          // 校验
          const res = that.checkData(formData)
          if(!res){
            return
          }
          formData.id = that.detailInfo.id
          that.confirmLoading = true
          httpAction(that.url.eidtUrl, formData, 'PUT')
            .then(res => {
              const msg = res.message || res.msg
              if (res.errorMessageList !== null && res.errorMessageList.length) {
                that.confirmLoading = false
                that.$refs.errorModal.title = `编辑提示: ${msg}`
                that.$refs.errorModal.message = msg
                that.$refs.errorModal.showModal(res.errorMessageList)
              } else {
                that.confirmLoading = false
                if (Number(res.code) === 200) {
                  that.$message.success('编辑成功！')
                  that.$emit('ok')
                  that.handleCancel()
                }else {
                  that.$message.warn(res.msg || '编辑失败！')
                }
              }
            })
            .finally(() => {
              that.confirmLoading = false
          })
        }
      })
    },
    // 校验养老和公积金数据
    checkData(parameters){
      let persionAllEmpty = false
      let persionSomeEmpty = false
      let fundAllEmpty = false
      let fundSomeEmpty = false
      if(this.isDispatchAdd){
        persionAllEmpty = (!parameters.pensionAddress && !parameters.pensionBase && !parameters.pensionStart)
        persionSomeEmpty = (!parameters.pensionAddress || !parameters.pensionBase || !parameters.pensionStart)
        fundAllEmpty = (!parameters.fundAddress && !parameters.fundBase && !parameters.fundPersonalPer &&
          !parameters.fundCompanyPer && !parameters.fundStart)
        fundSomeEmpty = (!parameters.fundAddress || !parameters.fundBase || !parameters.fundPersonalPer ||
          !parameters.fundCompanyPer && !parameters.fundStart)
      }else {
        persionAllEmpty = (!parameters.pensionAddressReduce && !parameters.pensionEndReduce)
        persionSomeEmpty = (!parameters.pensionAddressReduce || !parameters.pensionEndReduce)
        fundAllEmpty = (!parameters.fundAddressReduce && !parameters.fundEndReduce)
        fundSomeEmpty = (!parameters.fundAddressReduce || !parameters.fundEndReduce)
      }
      if(persionAllEmpty){
        if(fundAllEmpty){
          this.$message.warn('养老数据和公积金数据不能同时为空,请完善！')
          return false
        }else if(fundSomeEmpty){
          this.$message.warn('公积金相关数据请填写完全！')
          return false
        }
      }else if(persionSomeEmpty){
        this.$message.warn('养老相关数据请填写完全！')
        return false
      }
      if(fundAllEmpty){
        if(persionAllEmpty){
          this.$message.warn('养老数据和公积金数据不能同时为空,请完善！')
          return false
        }else if(persionSomeEmpty){
          this.$message.warn('养老相关数据请填写完全！')
          return false
        }
      }else if(fundSomeEmpty){
        this.$message.warn('公积金相关数据请填写完全！')
        return false
      }
      return true
    },
    // 转换日期格式，type:格式类型，date:日期，isAssign:区分是赋值还是传给后台
    changeDateStyle(type,date,isAssign){
      let formatter = 'YYYY-MM-DD'
      switch(type){
        case 0:formatter = 'YYYYMM';
        break;
        case 1:formatter = 'YYYY-MM-DD';
        break;
        case 2:formatter = 'YYYY-MM-DD HH:mm:ss';
        break;
        case 3:formatter = 'YYYYMMDD';
        break;
      }
      if(isAssign){
        return date?moment(date, formatter):null
      }
      return date?date.format(formatter):null
    },
    // 合同截止日期可选取
    disabledContractEnd(endValue) {
      const contractStart = this.contractForm.getFieldValue('contractStartAdd')
      if (!endValue || !contractStart) {
        return endValue
      } else {
        return contractStart.valueOf() > endValue.valueOf()
      }
    },
    // 合同截止日期选择
    endDatePickChange(){
      let contractStart = this.contractForm.getFieldValue('contractStartAdd')
      contractStart = this.changeDateStyle(3,contractStart,false)
      if (!contractStart) {
        this.$message.warning('请先选择合同开始日期！')
        this.$nextTick(() => {
          this.form.setFieldsValue(pick({'contractEndAdd':null}, 'contractEndAdd'))
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 125px;
  }
}
.configInfoWrap {
  border: 1px dashed #e9e9e9;
  padding: 10px 15px;
}

.topStatusWrap {
  display: flex;
  flex-flow: column nowrap;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  margin-bottom: 18px;
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px;
  .statusBox {
    display: flex;
    flex-flow: row nowrap;
    .title {
      color: #333;
      font-size: 15px;
      font-weight: bold;
    }
    .status {
      color: salmon;
    }
    .desc {
      color: #333;
      margin: 0;
    }
  }
}
</style>
