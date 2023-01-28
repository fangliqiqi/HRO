<template>
  <a-modal
    :title="title"
    :width="1200"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        v-if="editButton"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form ant-disabled-form"
      >
        <!------------------------------------- 基本数据详情 ------------------------------------->
        <a-row>
          <a-col :span="24">
            <a-form-item style="font-size: 16px; font-weight:bold; margin-bottom: 0px">
              {{ model.empName }}
            </a-form-item>
          </a-col>
        </a-row>
        
        <!------------------------------------- 表单数据详情 ------------------------------------->
        <a-row>
          <a-tabs :activeKey="activeKey" @change="tabChange">
            <a-tab-pane :key="1" tab="差余额信息">
              <a-row>
                <a-col :span="8">
                  <a-form-item
                    label="员工编码"
                    class="stepFormText"
                  >
                    {{ model.empNo }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="社保缴纳月份"
                    class="stepFormText"
                  >
                    {{ model.socialSecurityMonth }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="社保生成月份"
                    class="stepFormText"
                  >
                    {{ model.socialSecurityMonthCreate }}
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="8">
                  <a-form-item
                    label="缴纳地区"
                    class="stepFormText"
                  >
                    {{ model.socialSecurityAddr }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="公积金缴纳月份"
                    class="stepFormText"
                  >
                    {{ model.providentMonth }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="公积金生成月份"
                    class="stepFormText"
                  >
                    {{ model.fundCreateMonth }}
                  </a-form-item>
                </a-col>
              </a-row>
              <table class="table1" aria-describedby="差余额信息">
                <!-- 单位数据 -->
                <tr class="tr1">
                  <th
                    class="tit td1"
                    rowspan="2"
                    scope="col"
                    style="background-color: #2FA5ED; color: #fff;"
                  >单位</th>
                  <th class="tit td1" scope="col">类型</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >养老保险</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >医疗保险</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >失业保险</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >工伤保险</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >生育保险</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >大病救助</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >补缴利息</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >社保总计</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >住房公积金</th>
                  <th
                    class="tit td1"
                    scope="col"
                  >合计差额</th>
                </tr>
                <tr class="tr1">
                  <td class="tit td1">单位差额</td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.unitPensionDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.unitMedicalDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.unitUnemploymetDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.unitInjuryDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.unitBirthDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.unitBigailmentDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.unitSocialBackInterest }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item class="tableFormItem">
                      <span>{{ model.socialSecurityCompanySum }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.providentCompanyDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item class="tableFormItem">
                      <span>{{ model.companySumDiff }}</span>
                    </a-form-item>
                  </td>
                </tr>
                <!-- 个人数据 -->
                <tr class="tr1">
                  <td
                    class="tit td1"
                    rowspan="4"
                    style="background-color: #2FA5ED; color: #fff;"
                  >个人</td>
                  <td class="tit td1">个人差额</td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.personalPensionDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.personalMedicalDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.personalUnemploymentDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >-</td>
                  <td
                    class="tit td1"
                  >-</td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.personalBigmailmentDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.personalSocialBackInterest }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item class="tableFormItem">
                      <span>{{ model.socialSecurityPersonalSum }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item
                      class="tableRedFormItem"
                    >
                      <span>{{ model.providentPersonalDiff }}</span>
                    </a-form-item>
                  </td>
                  <td
                    class="tit td1"
                  >
                    <a-form-item class="tableFormItem">
                      <span>{{ model.personalSumDiff }}</span>
                    </a-form-item>
                  </td>
                </tr>
              </table>
              <a-row>
                <a-col :span="8">
                  <a-form-item
                    label="单位"
                    class="labelTxt"
                  >
                    {{ model.customerName }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="结算主体"
                    class="labelTxt"
                  >
                    {{ model.departName }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="导入日期"
                    class="labelTxt"
                  >
                    {{ model.createTime || '-' }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="原因大类"
                    class="labelTxt"
                  >
                    <template v-if="editField">
                      {{ filterDictText(reasonPrimaryTypeList,model.reasonPrimaryType) }}
                    </template>
                    <a-select style="width: 150px" :allowClear="true" v-else v-decorator="['reasonPrimaryType']" placeholder="原因大类">
                      <a-select-option
                        v-for="item in reasonPrimaryTypeList"
                        :key="item.id"
                        :value="item.value"
                      >{{ item.label }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="原因小类"
                    class="labelTxt"
                  >
                    <template v-if="editField">
                      {{ filterDictText(reasonTypeList,model.reasonType) }}
                    </template>
                    <a-select style="width: 150px" :allowClear="true" v-else v-decorator="['reasonType']" placeholder="原因小类">
                      <a-select-option
                        v-for="item in reasonTypeList"
                        :key="item.id"
                        :value="item.value"
                      >{{ item.label }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="原因备注"
                    class="labelTxt"
                  >
                    <template v-if="editField">
                      {{ model.reasonRemark || '-' }}
                    </template>
                    <a-textarea placeholder="原因备注" v-else v-decorator="['reasonRemark',{rules:[{max: 50, message: '最多50个字符!'}]}]" style="width:260px;height: 36px;"/>
                  </a-form-item>
                </a-col>
                
                <a-col :span="8">
                  <a-form-item label="是否结算" class="labelTxt">
                    <template v-if="editField">
                      {{ model.settlementFlag == 1 ? '否' : '是' }}
                    </template>
                    <a-select style="width: 150px" v-else v-decorator="['settlementFlag', {rules:[{required: true, message: '请选择是否结算!'}]}]" placeholder="是否结算">
                      <a-select-option value="0">是</a-select-option>
                      <a-select-option value="1">否</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="结算状态" class="labelTxt">
                    {{ model.clearingStatus == 1 ? '已结算' : '未结算' }}
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="生成月份" class="labelTxt">
                    {{ model.createMonth }}
                  </a-form-item>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="预估数据" v-if="model.forecastLibrary && model.forecastLibrary.length">
              <div v-for="(item,index) in model.forecastLibrary" :key="index">
                <a-row>
                  <a-col :span="8">
                    <a-form-item
                      label="社保缴纳地"
                      class="stepFormText"
                    >
                      {{ getAreaName(item.socialProvince,item.socialCity,item.socialTown) }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="社保缴纳月份"
                      class="stepFormText"
                    >
                      {{ item.socialPayMonth }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="社保生成月份"
                      class="stepFormText"
                    >
                      {{ item.socialCreateMonth }}
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8">
                    <a-form-item
                      label="公积金缴纳地"
                      class="stepFormText"
                    >
                      {{ getAreaName(item.fundProvince,item.fundCity,item.fundTown) }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="公积金缴纳月份"
                      class="stepFormText"
                    >
                      {{ item.providentPayMonth }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="公积金生成月份"
                      class="stepFormText"
                    >
                      {{ item.providentCreateMonth }}
                    </a-form-item>
                  </a-col>
                </a-row>
                <table class="table1" aria-describedby="预估数据">
                  <!-- 单位数据 -->
                  <tr class="tr1">
                    <th
                      class="tit td1"
                      rowspan="4"
                      scope="col"
                      style="background-color: #2FA5ED; color: #fff;"
                    >单位</th>
                    <th class="tit td1" scope="col">类型</th>
                    <th
                      class="tit td1"
                      scope="col"
                    >养老保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                    >医疗保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                    >失业保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                    >工伤保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                    >生育保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                    >大病救助</th>
                    <th
                      class="tit td1"
                      scope="col"
                    >补缴利息</th>
                    <th
                      class="tit td1"
                      scope="col"
                    >社保总计</th>
                    <th
                      class="tit td1"
                      scope="col"
                    >住房公积金</th>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">单位基数</td>
                    <td
                      class="tit td1"
                    >{{ item.unitPensionBase }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitMedicalBase }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitUnemploymentBase }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitInjuryBase }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitBirthBase }}</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="fundShow"
                    >{{ item.unitFundBase }}</td>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">单位比例</td>
                    <td
                      class="tit td1"
                    >{{ item.unitPersionPro }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitMedicalPro }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitUnemploymentPro }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitInjuryPro }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitBirthPro }}</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >{{ item.unitFundProp }}</td>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">单位金额</td>
                    <td
                      class="tit td1"
                    >{{ item.unitPensionFee }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitMedicalFee }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitUnemploymentFee }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitWorkInjuryFee }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitBirthFee }}</td>
                    <td
                      class="tit td1"
                    >{{ item.unitBitmailmentFee }}</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >{{ item.unitSocialSum }}</td>
                    <td
                      class="tit td1"
                      v-if="fundShow"
                    >{{ item.unitFundSum }}</td>
                  </tr>
                  
                  <!-- 个人数据 -->
                  <tr class="tr1">
                    <td
                      class="tit td1"
                      rowspan="4"
                      style="background-color: #2FA5ED; color: #fff;"
                    >个人</td>
                    <td class="tit td1">个人基数</td>
                    <td
                      class="tit td1"
                    >{{ item.personalPensionBase }}</td>
                    <td
                      class="tit td1"
                    >{{ item.personalMedicalBase }}</td>
                    <td
                      class="tit td1"
                    >{{ item.personalUnemploymentBase }}</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >{{ item.personalFundBase }}</td>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">个人比例</td>
                    <td
                      class="tit td1"
                    >{{ item.personalPersionPro }}</td>
                    <td
                      class="tit td1"
                    >{{ item.personalMedicalPro }}</td>
                    <td
                      class="tit td1"
                    >{{ item.personalUnemploymentPro }}</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >{{ item.personalFundProp }}</td>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">个人金额</td>
                    <td
                      class="tit td1"
                    >{{ item.personalPensionFee }}</td>
                    <td
                      class="tit td1"
                    >{{ item.personalMedicalFee }}</td>
                    <td
                      class="tit td1"
                    >{{ item.personalUnemploymentFee }}</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >{{ item.personalBigmailmentFee }}</td>
                    <td
                      class="tit td1"
                    >-</td>
                    <td
                      class="tit td1"
                    >{{ item.personalSocialSum }}</td>
                    <td
                      class="tit td1"
                    >{{ item.personalFundSum }}</td>
                  </tr>
                </table>
              </div>
            </a-tab-pane>
            <a-tab-pane :key="3" tab="缴费库数据" v-if="model.paymentInfo">
              <div v-for="(item,index) in model.paymentInfo" :key="index">
                <a-row>
                  <a-col :span="8">
                    <a-form-item
                      label="社保缴纳地"
                      class="stepFormText"
                    >
                      {{ getAreaName(item.socialProvince,item.socialCity,item.socialTown) }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="社保缴纳月份"
                      class="stepFormText"
                    >
                      {{ item.socialPayMonth }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="社保生成月份"
                      class="stepFormText"
                    >
                      {{ item.socialCreateMonth }}
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="8">
                    <a-form-item
                      label="公积金缴纳地"
                      class="stepFormText"
                    >
                      {{ getAreaName(item.fundProvince,item.fundCity,item.fundTown) }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="公积金缴纳月份"
                      class="stepFormText"
                    >
                      {{ item.providentPayMonth }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item
                      label="公积金生成月份"
                      class="stepFormText"
                    >
                      {{ item.providentCreateMonth }}
                    </a-form-item>
                  </a-col>
                </a-row>
                <table class="table1" aria-describedby="缴费库数据" v-if="showPayDetail">
                  <!-- 单位数据 -->
                  <tr class="tr1">
                    <th
                      class="tit td1"
                      rowspan="4"
                      scope="col"
                      style="background-color: #2FA5ED; color: #fff;"
                    >单位</th>
                    <th class="tit td1" scope="col">类型</th>
                    <th
                      class="tit td1"
                      scope="col"
                      v-if="socialShow"
                    >养老保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                      v-if="socialShow"
                    >医疗保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                      v-if="socialShow"
                    >失业保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                      v-if="socialShow"
                    >工伤保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                      v-if="socialShow"
                    >生育保险</th>
                    <th
                      class="tit td1"
                      scope="col"
                      v-if="socialShow"
                    >大病救助</th>
                    <th
                      class="tit td1"
                      scope="col"
                      v-if="socialShow"
                    >补缴利息</th>
                    <th
                      class="tit td1"
                      scope="col"
                      v-if="socialShow"
                    >社保总计</th>
                    <th
                      class="tit td1"
                      scope="col"
                      v-if="fundShow"
                    >住房公积金</th>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">单位基数</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitPensionSet'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitMedicalSet'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitUnemploymentSet'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitInjurySet'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitBirthSet'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="fundShow"
                    >{{ paymentDetail[index]['unitProvidentSet'] }}</td>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">单位比例</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitPensionPer'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitMedicalPer'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitUnemploymentPer'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitInjuryPer'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitBirthPer'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="fundShow"
                    >{{ paymentDetail[index]['providentPercent'] }}</td>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">单位金额</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitPensionMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitMedicalMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitUnemploymentMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitInjuryMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitBirthMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitBigmailmentMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['companyAccrual'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['unitSocialSum'] }}</td>
                    <td
                      class="tit td1"
                      v-if="fundShow"
                    >{{ paymentDetail[index]['unitProvidentSum'] }}</td>
                  </tr>
                  
                  <!-- 个人数据 -->
                  <tr class="tr1">
                    <td
                      class="tit td1"
                      rowspan="4"
                      style="background-color: #2FA5ED; color: #fff;"
                    >个人</td>
                    <td class="tit td1">个人基数</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalPensionSet'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalMedicalSet'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalUnemploymentSet'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="fundShow"
                    >{{ paymentDetail[index]['personalProidentSet'] }}</td>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">个人比例</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalPensionPer'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalMedicalPer'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalUnemploymentPer'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="fundShow"
                    >{{ paymentDetail[index]['providentPercent'] }}</td>
                  </tr>
                  <tr class="tr1">
                    <td class="tit td1">个人金额</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalPensionMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalMedicalMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalUnemploymentMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >-</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalBigmailmentMoney'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['personalAccrual'] }}</td>
                    <td
                      class="tit td1"
                      v-if="socialShow"
                    >{{ paymentDetail[index]['socialSecurityPersonalSum'] }}</td>
                    <td
                      class="tit td1"
                      v-if="fundShow"
                    >{{ paymentDetail[index]['personalProvidentSum'] }}</td>
                  </tr>
                </table>
              </div>
              <a-empty v-if="model.paymentInfo.length==0"/>
            </a-tab-pane>
          </a-tabs>

          
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import { getAreaName } from '@/utils/common'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'ComparisonLibraryDetailModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        fundShow: true, // 公积金是否存在
        socialShow: true, // 社保是否存在
        editButton: false, // 是否显示提交修改按钮
        confirmLoading: false,
        msg: '请输入两位有效数字！', // 提示
        styleWidth: 'width: 75px;height:23px;',
        form: this.$form.createForm(this),
        fundInfo: {}, // 公积金数据
        socialInfo: {}, // 社保数据
        dateFormat: 'YYYYMM',  // 时间格式化类型
        settleDomainBelongs: [],  // 结算主体和单位
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          add: 'hrSocial/tcomparisonlibrary',
        },
        activeKey:1,
        paymentDetail:[],
        showPayDetail:false,
        reasonPrimaryTypeList:[],
        reasonTypeList:[],
        editField: false, // 是否可编辑
      }
    },
    methods: {
      getAreaName,
      filterDictText,
      add() {
        this.edit({})
      },
      getInfo(id,index){
        httpAction(`/hrSocial/tpaymentinfo/allInfo/${id}`,null,'get').then(res=>{
          if(res.code === 200){
            this.paymentDetail[index] = res.data
          }
        })
      },
      tabChange(key){
        this.activeKey = key
        if(key === 3 && !this.showPayDetail){
          this.paymentDetail = []
          this.model.paymentInfo.forEach((item,index)=>{
            this.getInfo(item.id,index)
          })
          setTimeout(() => {
            this.showPayDetail = true
          },1000)
        }
      },
      edit(record,reasonPrimaryTypeList,reasonTypeList) {
        this.reasonPrimaryTypeList = reasonPrimaryTypeList
        this.reasonTypeList = reasonTypeList
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        if (!this.model.socialInfo) { // 是否有社保
          this.socialShow = false
        } else {
          this.socialInfo = this.model.socialInfo // 社保数据
        }
        if (!this.model.fund) { // 是否有公积金
          this.fundShow = false
        } else {
          this.fundInfo = this.model.fund // 公积金数据
        }
        this.model.socialSecurityMonth = this.model.socialSecurityMonth ? this.model.socialSecurityMonth : '-' // 社保缴纳月
        this.model.socialSecurityMonthCreate = this.model.socialSecurityMonthCreate ? this.model.socialSecurityMonthCreate : '-'  // 社保生成月
        this.model.socialSecurityAddr = this.model.socialSecurityAddr ? this.model.socialSecurityAddr : '-'  // 社保缴纳地
        this.model.providentMonth = this.model.providentMonth ? this.model.providentMonth : '-' // 公积金缴纳月
        this.model.fundCreateMonth = this.model.fundCreateMonth ? this.model.fundCreateMonth : '-'  // 公积金生成月
        this.model.customerName = this.model.departName = '-' // 单位、结算主体
        if (Object.keys(this.settleDomainBelongs).length) { // 单位、结算主体
          this.model.customerName = (this.settleDomainBelongs).hasOwnProperty(this.model.departId) ? this.settleDomainBelongs[this.model.departId]['customerName'] : '-'
          this.model.departName = (this.settleDomainBelongs).hasOwnProperty(this.model.departId) ? this.settleDomainBelongs[this.model.departId]['departName'] : '-'
        }
        this.model.unitPensionDiff += 0
        this.model.unitMedicalDiff += 0
        this.model.unitUnemploymetDiff += 0
        this.model.unitInjuryDiff += 0
        this.model.unitBirthDiff += 0
        this.model.unitBigailmentDiff += 0
        this.model.unitSocialBackInterest += 0
        this.model.socialSecurityCompanySum += 0
        this.model.providentCompanyDiff += 0
        this.model.companySumDiff += 0
        this.model.personalPensionDiff += 0
        this.model.personalMedicalDiff += 0
        this.model.personalUnemploymentDiff += 0
        this.model.personalBigmailmentDiff += 0
        this.model.personalSocialBackInterest += 0
        this.model.socialSecurityPersonalSum += 0
        this.model.providentPersonalDiff += 0
        this.model.personalSumDiff += 0
        if(record.clearingStatus === '0' && this.editButton){
          this.editField = false
          const obj = {
            settlementFlag: this.model.settlementFlag,
            reasonType: this.model.reasonType === null ? undefined : this.model.reasonType,
            reasonPrimaryType: this.model.reasonType === null ? undefined : this.model.reasonPrimaryType,
            reasonRemark: this.model.reasonRemark,
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(obj, 'settlementFlag', 'reasonType','reasonPrimaryType','reasonRemark'))
          })
        }else{
          this.editField = true
        }

        if (this.editButton) {
          if (this.socialShow) {
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'unitPensionDiff', 'unitMedicalDiff', 'unitUnemploymetDiff', 'unitInjuryDiff', 'unitBirthDiff', 'unitBigailmentDiff', 'unitSocialBackInterest', 'socialSecurityCompanySum', 'companySumDiff',
              'personalPensionDiff', 'personalMedicalDiff', 'personalUnemploymentDiff', 'personalBigmailmentDiff', 'personalSocialBackInterest', 'socialSecurityPersonalSum', 'personalSumDiff'
              ))
            })
          }
          if (this.fundShow) {
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'providentCompanyDiff', 'providentPersonalDiff'))
            })
          }
        }
      },
      // 保存按钮
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            const httpurl = this.url.add
            const method = 'put'
            const formData = Object.assign(this.model, values)
            const requestData = {}
            requestData.id = formData.id
            requestData.unitPensionDiff = formData.unitPensionDiff
            requestData.unitMedicalDiff = formData.unitMedicalDiff
            requestData.unitUnemploymetDiff = formData.unitUnemploymetDiff
            requestData.unitInjuryDiff = formData.unitInjuryDiff
            requestData.unitBirthDiff = formData.unitBirthDiff
            requestData.unitBigailmentDiff = formData.unitBigailmentDiff
            requestData.unitSocialBackInterest = formData.unitSocialBackInterest
            requestData.socialSecurityCompanySum = formData.socialSecurityCompanySum
            requestData.providentCompanyDiff = formData.providentCompanyDiff
            requestData.companySumDiff = formData.companySumDiff
            requestData.personalPensionDiff = formData.personalPensionDiff
            requestData.personalMedicalDiff = formData.personalMedicalDiff
            requestData.personalUnemploymentDiff = formData.personalUnemploymentDiff
            requestData.personalBigmailmentDiff = formData.personalBigmailmentDiff
            requestData.personalSocialBackInterest = formData.personalSocialBackInterest
            requestData.socialSecurityPersonalSum = formData.socialSecurityPersonalSum
            requestData.providentPersonalDiff = formData.providentPersonalDiff
            requestData.personalSumDiff = formData.personalSumDiff
            requestData.reasonPrimaryType = formData.reasonPrimaryType === undefined ? '' : formData.reasonPrimaryType
            requestData.reasonType = formData.reasonType === undefined ? '' : formData.reasonType
            requestData.settlementFlag = formData.settlementFlag
            requestData.reasonRemark = formData.reasonRemark
            httpAction(httpurl, requestData, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success(`${that.title}成功！`)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message || res.msg)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 关闭功能与数据重置
      close() {
        this.visible = false
        this.msg = '请输入两位有效数字！' // 提示
        this.$emit('close')
        this.fundShow = true // 公积金是否存在
        this.fundInfo = {} // 公积金数据
        this.socialInfo = {} // 社保数据
        this.socialShow = true // 社保是否存在
        this.editButton = false // 是否显示提交修改按钮
        this.confirmLoading = false
        this.settleDomainBelongs = [] // 单位和结算主体
        this.activeKey = 1
        this.showPayDetail = false
      },
      /******************************************* 验证规则 *******************************************/
      // 单位差额->养老保险
      validateUnitPensionDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityCompanySum = this.formatFloat(value*1 + this.form.getFieldValue('unitMedicalDiff')*1 + this.form.getFieldValue('unitUnemploymetDiff')*1 + this.form.getFieldValue('unitInjuryDiff')*1 + this.form.getFieldValue('unitBirthDiff')*1 + this.form.getFieldValue('unitBigailmentDiff')*1 + this.form.getFieldValue('unitSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityCompanySum'))
          this.model.companySumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityCompanySum*1 + this.form.getFieldValue('providentCompanyDiff')*1) : this.model.socialSecurityCompanySum
          this.form.setFieldsValue(pick(this.model, 'companySumDiff'))
        }
      },
      // 单位差额->医疗保险
      validateUnitMedicalDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityCompanySum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionDiff')*1 + this.form.getFieldValue('unitUnemploymetDiff')*1 + this.form.getFieldValue('unitInjuryDiff')*1 + this.form.getFieldValue('unitBirthDiff')*1 + this.form.getFieldValue('unitBigailmentDiff')*1 + this.form.getFieldValue('unitSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityCompanySum'))
          this.model.companySumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityCompanySum*1 + this.form.getFieldValue('providentCompanyDiff')*1) : this.model.socialSecurityCompanySum
          this.form.setFieldsValue(pick(this.model, 'companySumDiff'))
        }
      },
      // 单位差额->失业保险
      validateUnitUnemploymetDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityCompanySum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionDiff')*1 + this.form.getFieldValue('unitMedicalDiff')*1 + this.form.getFieldValue('unitInjuryDiff')*1 + this.form.getFieldValue('unitBirthDiff')*1 + this.form.getFieldValue('unitBigailmentDiff')*1 + this.form.getFieldValue('unitSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityCompanySum'))
          this.model.companySumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityCompanySum*1 + this.form.getFieldValue('providentCompanyDiff')*1) : this.model.socialSecurityCompanySum
          this.form.setFieldsValue(pick(this.model, 'companySumDiff'))
        }
      },
      // 单位差额->工伤保险
      validateUnitInjuryDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityCompanySum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionDiff')*1 + this.form.getFieldValue('unitMedicalDiff')*1 + this.form.getFieldValue('unitUnemploymetDiff')*1 + this.form.getFieldValue('unitBirthDiff')*1 + this.form.getFieldValue('unitBigailmentDiff')*1 + this.form.getFieldValue('unitSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityCompanySum'))
          this.model.companySumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityCompanySum*1 + this.form.getFieldValue('providentCompanyDiff')*1) : this.model.socialSecurityCompanySum
          this.form.setFieldsValue(pick(this.model, 'companySumDiff'))
        }
      },
      // 单位差额->生育保险
      validateUnitBirthDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityCompanySum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionDiff')*1 + this.form.getFieldValue('unitMedicalDiff')*1 + this.form.getFieldValue('unitUnemploymetDiff')*1 + this.form.getFieldValue('unitInjuryDiff')*1 + this.form.getFieldValue('unitBigailmentDiff')*1 + this.form.getFieldValue('unitSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityCompanySum'))
          this.model.companySumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityCompanySum*1 + this.form.getFieldValue('providentCompanyDiff')*1) : this.model.socialSecurityCompanySum
          this.form.setFieldsValue(pick(this.model, 'companySumDiff'))
        }
      },
      // 单位差额->大病救助
      validateUnitBigailmentDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityCompanySum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionDiff')*1 + this.form.getFieldValue('unitMedicalDiff')*1 + this.form.getFieldValue('unitUnemploymetDiff')*1 + this.form.getFieldValue('unitInjuryDiff')*1 + this.form.getFieldValue('unitBirthDiff')*1 + this.form.getFieldValue('unitSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityCompanySum'))
          this.model.companySumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityCompanySum*1 + this.form.getFieldValue('providentCompanyDiff')*1) : this.model.socialSecurityCompanySum
          this.form.setFieldsValue(pick(this.model, 'companySumDiff'))
        }
      },
      // 单位差额->补缴利息
      validateUnitSocialBackInterest(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityCompanySum = this.formatFloat(value*1 + this.form.getFieldValue('unitPensionDiff')*1 + this.form.getFieldValue('unitMedicalDiff')*1 + this.form.getFieldValue('unitUnemploymetDiff')*1 + this.form.getFieldValue('unitInjuryDiff')*1 + this.form.getFieldValue('unitBirthDiff')*1 + this.form.getFieldValue('unitBigailmentDiff')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityCompanySum'))
          this.model.companySumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityCompanySum*1 + this.form.getFieldValue('providentCompanyDiff')*1) : this.model.socialSecurityCompanySum
          this.form.setFieldsValue(pick(this.model, 'companySumDiff'))
        }
      },
      // 单位差额->住房公积金
      validateProvidentCompanyDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityCompanySum = 0
          if (this.socialShow) {
            this.model.socialSecurityCompanySum = this.formatFloat(this.form.getFieldValue('unitPensionDiff')*1 + this.form.getFieldValue('unitMedicalDiff')*1 + this.form.getFieldValue('unitUnemploymetDiff')*1 + this.form.getFieldValue('unitInjuryDiff')*1 + this.form.getFieldValue('unitBirthDiff')*1 + this.form.getFieldValue('unitBigailmentDiff')*1+ this.form.getFieldValue('unitSocialBackInterest')*1)
            this.model.companySumDiff = this.formatFloat(this.model.socialSecurityCompanySum*1 + value*1)
            this.form.setFieldsValue(pick(this.model, 'companySumDiff'))
          }
          // this.model.companySumDiff = this.formatFloat(this.model.socialSecurityCompanySum*1 + value*1)
          // this.form.setFieldsValue(pick(this.model, 'companySumDiff'))
        }
      },
      // 个人差额->养老保险
      validatePersonalPensionDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalMedicalDiff')*1 + this.form.getFieldValue('personalUnemploymentDiff')*1 + this.form.getFieldValue('personalBigmailmentDiff')*1 + this.form.getFieldValue('personalSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
          this.model.personalSumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityPersonalSum*1 + this.form.getFieldValue('providentPersonalDiff')*1) : this.model.socialSecurityPersonalSum
          this.form.setFieldsValue(pick(this.model, 'personalSumDiff'))
        }
      },
      // 个人差额->医疗保险
      validatePersonalMedicalDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalPensionDiff')*1 + this.form.getFieldValue('personalUnemploymentDiff')*1 + this.form.getFieldValue('personalBigmailmentDiff')*1 + this.form.getFieldValue('personalSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
          this.model.personalSumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityPersonalSum*1 + this.form.getFieldValue('providentPersonalDiff')*1) : this.model.socialSecurityPersonalSum
          this.form.setFieldsValue(pick(this.model, 'personalSumDiff'))
        }
      },
      // 个人差额->失业保险
      validatePersonalUnemploymentDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalPensionDiff')*1 + this.form.getFieldValue('personalMedicalDiff')*1 + this.form.getFieldValue('personalBigmailmentDiff')*1 + this.form.getFieldValue('personalSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
          this.model.personalSumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityPersonalSum*1 + this.form.getFieldValue('providentPersonalDiff')*1) : this.model.socialSecurityPersonalSum
          this.form.setFieldsValue(pick(this.model, 'personalSumDiff'))
        }
      },
      // 个人差额->大病救助
      validatePersonalBigmailmentDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalPensionDiff')*1 + this.form.getFieldValue('personalMedicalDiff')*1 + this.form.getFieldValue('personalUnemploymentDiff')*1 + this.form.getFieldValue('personalSocialBackInterest')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
          this.model.personalSumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityPersonalSum*1 + this.form.getFieldValue('providentPersonalDiff')*1) : this.model.socialSecurityPersonalSum
          this.form.setFieldsValue(pick(this.model, 'personalSumDiff'))
        }
      },
      // 个人差额->补缴利息
      validatePersonalSocialBackInterest(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = this.formatFloat(value*1 + this.form.getFieldValue('personalPensionDiff')*1 + this.form.getFieldValue('personalMedicalDiff')*1 + this.form.getFieldValue('personalUnemploymentDiff')*1 + this.form.getFieldValue('personalBigmailmentDiff')*1)
          this.form.setFieldsValue(pick(this.model, 'socialSecurityPersonalSum'))
          this.model.personalSumDiff = this.fundShow ? this.formatFloat(this.model.socialSecurityPersonalSum*1 + this.form.getFieldValue('providentPersonalDiff')*1) : this.model.socialSecurityPersonalSum
          this.form.setFieldsValue(pick(this.model, 'personalSumDiff'))
        }
      },
      // 个人差额->住房公积金
      validateProvidentPersonalDiff(rule, value, callback) {
        if (this.validateMoney(rule, value, callback)) {
          this.model.socialSecurityPersonalSum = 0

          if (this.socialShow) {
            this.model.socialSecurityPersonalSum = this.formatFloat(this.form.getFieldValue('personalPensionDiff')*1 + this.form.getFieldValue('personalMedicalDiff')*1 + this.form.getFieldValue('personalUnemploymentDiff')*1 + this.form.getFieldValue('personalBigmailmentDiff')*1 + this.form.getFieldValue('personalSocialBackInterest')*1)
            this.form.setFieldsValue(pick(this.model, 'personalSumDiff'))
          }
          
          // this.model.personalSumDiff = this.formatFloat(this.model.socialSecurityPersonalSum*1 + value*1)
          // this.form.setFieldsValue(pick(this.model, 'personalSumDiff'))
        }
      },
      // 金额验证
      validateMoney(rule, value, callback) {
        value = value.toString()
        if (!new RegExp(/((^[1-9-]\d*)|^0)(\.\d{1,2})?$/).test(value)) { // 数字验证
          callback('')
          return false
        } else if (value.length == 1 && ((value.split('-')).length - 1) == 1) {
          callback('')
          return false
        } else if (value.indexOf('-') == 0 && value.indexOf('.') == 1) {
          callback('')
          return false
        }
        callback()
        return true
      },
      // 精度处理
      formatFloat(f, digit = 2) {
        const m = Math.pow(10, digit)
        return Math.round(f * m) / m
      },
    }
  }
</script>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
  margin-bottom: 0px;
}
.labelTxt{
  :global(.ant-form-item-label) {
    width: 80px;
  }
  :global(.ant-form-item-control-wrapper){
    max-width: 280px;
  }
  :global(.ant-form-item-control){
    line-height: 20px;
    margin-top: 10px;
  }
  margin-bottom: 0px;
}
.tableFormItem {
  margin-bottom: 0px;
  margin-right: 0px;
  width: 75px;
  height: 23px;
  :global(.ant-form-item-control) {
    line-height: 23px;
  }
}
.tableRedFormItem {
  margin-bottom: 0px;
  margin-right: 0px;
  width: 75px;
  height: 23px;
  background-color: #f97676;
  :global(.ant-form-item-control) {
    line-height: 23px;
  }
  :global(.ant-input-disabled) {
    background-color: #f97676;
  }
}
.ant-disabled-form {
  :global(.ant-input-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-select-disabled) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-checkbox-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
  :global(.ant-radio-wrapper-disabled span) {
    color: rgba(0, 0, 0, 0.65);
  }
}
.ant-advanced-search-form input {
  text-align: center;
}
</style>

<style scoped>
.table1 {
  border: 1px solid #ccc;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.table1 .tr1 {
  margin: 0px;
  padding: 0;
  width: 100%;
}
.table1 .td1 {
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  text-align: center;
  width: auto;
  /* width: 20%; */
}
.table1 .td2 {
  border: 1px solid #ccc;
  margin-left: 10px;
  height: 40px;
  padding: 10px;
  width: 17%;
  text-align: center;
}
.table1 .tit {
  font-weight: bolder;
}
.table1 .input1 {
  height: 35px;
  width: 100%;
  padding: 0 5px;
}
.table1 .btn {
  width: 20%;
  font-size: 16px;
  border: none;
  background: red;
  color: #fff;
  float: right;
}
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
/* .staffCard{
  border:1px solid #fff;
  box-shadow:0 0 1px 1px #aaa,3px 0 5px 0 #aaa,0 4px 7px 0 #aaa;
} */
</style>
