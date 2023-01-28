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
    wrapClassName="dialogBig"
    :destroyOnClose="true"
    :confirm-loading="confirmLoading"
  >
    <a-spin :spinning="confirmLoading">
      <div class="dialogBody">
        <a-tabs defaultActiveKey="0" @change="changeTab">
          <a-tab-pane :tab="tabTitle" key="0">
            <a-row>
              <a-col :span="24">
                <a-alert :message="auditStatus" type="info" />
              </a-col>
            </a-row>
            <a-divider>基本信息</a-divider>
            <table class="detailTable">
              <tr>
                <td>
                  <label>姓名</label>
                  <span>{{ model.emName }}</span>
                </td>
                <td>
                  <label>年龄</label>
                  <span>{{ model.empAge }}</span>
                </td>
                <td>
                  <label>性别</label>
                  <span>{{ model.empSex }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>联系方式</label>
                  <span>{{ model.empPhone }}</span>
                </td>
                <td>
                  <label>身份证</label>
                  <span>{{ model.emIdCard }}</span>
                </td>
                <td>
                  <label>岗位</label>
                  <span>{{ model.post }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>客户单位</label>
                  <span>{{ customerName }}</span>
                </td>
                <td>
                  <label>劳动合同期限</label>
                  <span>{{ model.contractStart }} ~ {{ model.contractEnd }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>结算主体</label>
                  <span>{{ model.departName }}</span>
                </td>
                <td>
                  <label>业务类型</label>
                  <span>{{ businessTypeName }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>商业保险</label>
                  <span>{{ model.insuranceStr || '未购买' }}</span>
                </td>
                <td>
                  <label>社保参保地</label>
                  <span v-if="model.provinceName">{{ model.provinceName }} {{ model.cityName }} {{ model.townName }}</span
                  >
                  <span v-else>暂无</span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <label>社会保险</label>
                  <span>{{ model.socialStatusStr || '未购买' }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>皖信工龄</label>
                  <span>{{ model.workLengthWxYear || '0' }}年{{ model.workLengthWxMonth || '0' }}月</span>
                </td>
                <td>
                  <label>客户单位工龄</label>
                  <span>{{ model.workLengthCustomerYear || '0' }}年{{ model.workLengthCustomerMonth || '0' }}月</span>
                </td>
                <td>
                  <label>前12个月平均工资</label>
                  <span>{{ model.averageSalary || '--' }}</span>
                </td>
              </tr>
            </table>
            <a-divider>事件信息</a-divider>
            <table class="detailTable">
              <tr v-if="flag == 3">
                <td>
                  <label>事件编码</label>
                  <span>{{ model.eventCode }}</span>
                </td>
                <td>
                  <label>仲裁时间</label>
                  <span>{{ moment(model.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                </td>
                <td>
                  <label>仲裁委员会</label>
                  <span>{{ model.eventOccurrenceAddr }}</span>
                </td>
              </tr>
              <tr v-if="flag == 3">
                <td colspan="3">
                  <label>仲裁个人诉求</label>
                  <span>{{ model.eventThrough }}</span>
                </td>
              </tr>
              <tr v-if="flag == 4">
                <td>
                  <label>事件编码</label>
                  <span>{{ model.eventCode }}</span>
                </td>
                <td>
                  <label>原告/被告</label>
                  <span>{{ model.plaintiffOrDefendant == 0 ? '原告' : '被告' }}</span>
                </td>
                <td>
                  <label>诉讼时间</label>
                  <span>{{ moment(model.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                </td>
              </tr>
              <tr v-if="flag == 4">
                <td colspan="2">
                  <label>客户单位</label>
                  <span>{{ model.unitIdName }}</span>
                </td>
                <td>
                  <label>法院</label>
                  <span>{{ model.eventOccurrenceAddr }}</span>
                </td>
              </tr>
              <tr v-if="flag == 4">
                <td colspan="3">
                  <label>原告诉求</label>
                  <span>{{ model.eventThrough }}</span>
                </td>
              </tr>
              <tr v-if="flag == 5">
                <td>
                  <label>事件编码</label>
                  <span>{{ model.eventCode }}</span>
                </td>
                <td>
                  <label>发生时间</label>
                  <span>{{ moment(model.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                </td>
                <td>
                  <label>劳动保障部门</label>
                  <span>{{ model.eventOccurrenceAddr }}</span>
                </td>
              </tr>
              <tr v-if="flag == 5">
                <td>
                  <label>投诉渠道</label>
                  <span>{{ model.eventResource == 0 ? '电话' : '纸质' }}</span>
                </td>
                <td colspan="2">
                  <label>投诉内容</label>
                  <span>{{ model.eventThrough }}</span>
                </td>
              </tr>
            </table>
            <a-divider>方案意见</a-divider>
            <table class="detailTable">
              <tr v-if="flag != 3 && flag != 4">
                <td colspan="3">
                  <label>赔付方案</label>
                  <span>{{ model.payPlan }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <label>部门/子分公司处理方案、意见</label>
                  <span>{{ model.organOpinion }}</span>
                </td>
              </tr>
              <tr v-if="model.customerOpinion">
                <td colspan="3">
                  <label>法务意见</label>
                  <span>{{ model.customerOpinion }}</span>
                </td>
              </tr>
            </table>
            <a-divider>材料附件</a-divider>
            <a-card :bordered="false">
              <a-upload-dragger
                :multiple="true"
                name="file"
                :fileList="fileList"
                :beforeUpload="beforeUpload"
                :remove="removeFile"
                @change="handleChange"
                :showUploadList="{ showRemoveIcon: false }"
                accept="image/*,.xls,.xlsx,.csv,.pdf,.doc,.docx,.m4a,.mp3,.zip,.rar"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">点击或者拖拽上传</p>
              </a-upload-dragger>
              <a-row class="mbot" v-if="fileList.length">
                <a-col :span="2" :offset="1">
                  <a-button style="background: #1890ff; color: #fff; margin-top: 10px" @click="downAll(model.id, flag)">一键打包下载</a-button
                  >
                </a-col>
              </a-row>
            </a-card>
            <a-row style="margin-top: 20px">
              <a-col :span="4" :offset="20">
                <a-button @click="exportExcel"> <a-icon type="export" />导出 </a-button>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" tab="历史合同商险">
            <a-divider>历史合同</a-divider>
            <a-table
              bordered
              rowKey="id"
              :columns="contractColumns"
              :dataSource="contractData"
              :pagination="false"
              :scroll="{ x: 1 }"
            >
            </a-table>
            <a-divider>历史商险</a-divider>
            <a-table
              bordered
              rowKey="id"
              :columns="insuranceColumns"
              :dataSource="insuranceData"
              :pagination="ipagination"
              @change="handleTableChange"
              :scroll="{ x: 1 }"
            >
            </a-table>
            <a-divider id="tabledesc1">社保信息</a-divider>
            <a-empty v-if="!paymentSocial.startSocialCreateMonth && !paymentSocial.paymentSocial" />
            <table class="social" aria-describedby="tabledesc1" v-else>
              <tr>
                <th colspan="9">社保的初次生成月份 {{ paymentSocial.startSocialCreateMonth }}</th>
              </tr>
              <tr>
                <td rowspan="5" class="tit">单位</td>
                <td class="tit">大病比例</td>
                <td class="tit">大病金额</td>
                <td class="tit">生育金额</td>
                <td class="tit">生育比例</td>
                <td class="tit">生育基数</td>
                <td class="tit">工伤金额</td>
                <td class="tit">工伤比例</td>
                <td class="tit">工伤基数</td>
              </tr>
              <tr>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitBigailmentPer }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitBigmailmentMoney }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitBirthMoney }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitBirthPer }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitBirthSet }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitInjuryMoney }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitInjuryPer }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitInjurySet }}</span>
                  <span v-else>&nbsp;</span>
                </td>
              </tr>
              <tr>
                <td class="tit">医疗金额</td>
                <td class="tit">医疗比例</td>
                <td class="tit">医疗基数</td>
                <td class="tit">养老金额</td>
                <td class="tit">养老比例</td>
                <td class="tit">养老基数</td>
                <td class="tit">失业金额</td>
                <td class="tit">失业比例</td>
              </tr>
              <tr>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitMedicalMoney }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitMedicalPer }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitMedicalSet }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitPensionMoney }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitPensionPer }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitPensionSet }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{
                    paymentSocial.paymentSocial.unitUnemploymentMoney
                  }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitUnemploymentPer }}</span>
                  <span v-else>&nbsp;</span>
                </td>
              </tr>
              <tr>
                <td class="tit">失业基数</td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.unitUnemploymentSet }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td class="tit">单位社保补缴利息</td>
                <td colspan="5" style="text-align: left">
                  <span v-if="paymentSocial.paymentSocial">
                    {{ paymentSocial.paymentSocial.companyAccrual }}
                  </span>
                  <span v-else>&nbsp;</span>
                </td>
              </tr>
              <tr>
                <td rowspan="4" class="tit">个人</td>
                <td class="tit">大病比例</td>
                <td class="tit">大病金额</td>
                <td class="tit">医疗金额</td>
                <td class="tit">医疗比例</td>
                <td class="tit">医疗基数</td>
                <td class="tit">养老金额</td>
                <td class="tit">养老比例</td>
                <td class="tit">养老基数</td>
              </tr>
              <tr>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{
                    paymentSocial.paymentSocial.personalBigailmentPer
                  }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{
                    paymentSocial.paymentSocial.personalBigmailmentMoney
                  }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.personalMedicalMoney }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.personalMedicalPer }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.personalMedicalSet }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.personalPensionMoney }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.personalPensionPer }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.personalPensionSet }}</span>
                  <span v-else>&nbsp;</span>
                </td>
              </tr>
              <tr>
                <td class="tit">失业金额</td>
                <td class="tit">失业比例</td>
                <td class="tit">失业基数</td>
                <td class="tit">个人社保补缴利息</td>
              </tr>
              <tr>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{
                    paymentSocial.paymentSocial.personalUnemploymentMoney
                  }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{
                    paymentSocial.paymentSocial.personalUnemploymentPer
                  }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{
                    paymentSocial.paymentSocial.personalUnemploymentSet
                  }}</span>
                  <span v-else>&nbsp;</span>
                </td>
                <td>
                  <span v-if="paymentSocial.paymentSocial">{{ paymentSocial.paymentSocial.personalAccrual }}</span>
                  <span v-else>&nbsp;</span>
                </td>
              </tr>
            </table>
          </a-tab-pane>
          <a-tab-pane key="3" tab="流程记录">
            <a-empty v-if="processList.length == 0" description="暂无记录" />
            <a-row v-if="processList.length">
              <a-col :span="24">
                <a-steps direction="vertical" :current="processList.length - 1">
                  <a-step v-for="(item, index) in processList" :key="index" :title="item.operationTime">
                    <span slot="description">{{ item.operationUserName }} {{ item.nodeName }} 备注:{{ item.remark || '无' }}</span
                    >
                  </a-step>
                </a-steps>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="4">
            <span slot="tab">
              过往发生事件
              <a-badge :count="count" />
            </span>
            <a-empty v-if="historyList.length == 0" description="暂无历史事件" />
            <a-tabs defaultActiveKey="0" v-if="historyList.length">
              <a-tab-pane v-for="(item, index) in historyList" :key="index" :tab="'历史事件' + (index + 1)">
                <a-divider>基本信息</a-divider>
                <table class="detailTable">
                  <tr>
                    <td>
                      <label>姓名</label>
                      <span>{{ item.emName }}</span>
                    </td>
                    <td>
                      <label>年龄</label>
                      <span>{{ item.empAge }}</span>
                    </td>
                    <td>
                      <label>性别</label>
                      <span>{{ model.empSex }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>联系方式</label>
                      <span>{{ item.empPhone }}</span>
                    </td>
                    <td>
                      <label>身份证</label>
                      <span>{{ item.emIdCard }}</span>
                    </td>
                    <td>
                      <label>岗位</label>
                      <span>{{ item.post }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <label>客户单位</label>
                      <span>{{ item.customerName }}</span>
                    </td>
                    <td>
                      <label>劳动合同期限</label>
                      <span>{{ item.contractStart }} ~ {{ item.contractEnd }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <label>结算主体</label>
                      <span>{{ item.departName }}</span>
                    </td>
                    <td>
                      <label>业务类型</label>
                      <span>{{ item.businessTypeName }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <label>商业保险</label>
                      <span>{{ item.insuranceStr || '未购买' }}</span>
                    </td>
                    <td>
                      <label>社保参保地</label>
                      <span v-if="item.provinceName">{{ item.provinceName }} {{ item.cityName }} {{ item.townName }}</span
                      >
                      <span v-else>暂无</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <label>社会保险</label>
                      <span>{{ socialStatusArr[item.socialStatus] }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>皖信工龄</label>
                      <span>{{ item.workLengthWxYear || '0' }}年{{ item.workLengthWxMonth || '0' }}月</span>
                    </td>
                    <td>
                      <label>客户单位工龄</label>
                      <span>{{ item.workLengthCustomerYear || '0' }}年{{ item.workLengthCustomerMonth || '0' }}月</span>
                    </td>
                    <td>
                      <label>前12个月平均工资</label>
                      <span>{{ item.averageSalary || '--' }}</span>
                    </td>
                  </tr>
                </table>
                <a-divider>事件信息</a-divider>
                <table class="detailTable">
                  <tr v-if="flag == 3">
                    <td>
                      <label>仲裁时间</label>
                      <span>{{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                    </td>
                    <td colspan="2">
                      <label>仲裁委员会</label>
                      <span>{{ item.eventOccurrenceAddr }}</span>
                    </td>
                  </tr>
                  <tr v-if="flag == 3">
                    <td colspan="3">
                      <label>仲裁诉求</label>
                      <span>{{ item.eventThrough }}</span>
                    </td>
                  </tr>
                  <tr v-if="flag == 4">
                    <td>
                      <label>原告/被告</label>
                      <span>{{ item.plaintiffOrDefendant == 0 ? '原告' : '被告' }}</span>
                    </td>
                    <td colspan="2">
                      <label>客户单位</label>
                      <span>{{ customerDict(customerTreeData, item.unitId) }}</span>
                    </td>
                  </tr>
                  <tr v-if="flag == 4">
                    <td>
                      <label>诉讼时间</label>
                      <span>{{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                    </td>
                    <td colspan="2">
                      <label>法院</label>
                      <span>{{ item.eventOccurrenceAddr }}</span>
                    </td>
                  </tr>
                  <tr v-if="flag == 4">
                    <td colspan="3">
                      <label>原告诉求</label>
                      <span>{{ item.eventThrough }}</span>
                    </td>
                  </tr>
                  <tr v-if="flag == 5">
                    <td>
                      <label>发生时间</label>
                      <span>{{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                    </td>
                    <td>
                      <label>劳动保障部门</label>
                      <span>{{ item.eventOccurrenceAddr }}</span>
                    </td>
                    <td>
                      <label>投诉渠道</label>
                      <span>{{ item.eventResource == 0 ? '电话' : '纸质' }}</span>
                    </td>
                  </tr>
                  <tr v-if="flag == 5">
                    <td colspan="3">
                      <label>投诉内容</label>
                      <span>{{ item.eventThrough }}</span>
                    </td>
                  </tr>
                </table>
                <a-divider>方案意见</a-divider>
                <table class="detailTable">
                  <tr v-if="flag != 3 && flag != 4">
                    <td colspan="3">
                      <label>赔付方案</label>
                      <span>{{ item.payPlan }}</span>
                    </td>
                  </tr>

                  <tr v-if="flag != 3 && flag != 4">
                    <td colspan="3">
                      <label>客户意见</label>
                      <span>{{ item.customerOpinion }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <label>部门/子分公司处理方案、意见</label>
                      <span>{{ item.organOpinion }}</span>
                    </td>
                  </tr>

                  <tr v-if="flag == 3 || flag == 4">
                    <td colspan="3">
                      <label>法务意见</label>
                      <span>{{ item.customerOpinion }}</span>
                    </td>
                  </tr>
                </table>
                <a-divider>材料附件</a-divider>
                <a-divider orientation="left">材料附件</a-divider>
                <a-card :bordered="false">
                  <a-empty v-if="attachList[index] == null" />
                  <ul class="filelist" v-if="attachList[index] != null">
                    <li v-for="(items, indexs) in attachList[index]" :key="indexs" :value="item.id">
                      <span class="filename">{{ items.attaName }}</span>
                      <span class="down" @click="down(item)">下载</span>
                    </li>
                  </ul>
                  <a-row class="mbot" v-if="attachList[index] != null">
                    <a-col :span="2" :offset="1">
                      <a-button style="background: #1890ff; color: #fff" @click="downAll(items.id, type)">一键打包下载</a-button
                      >
                    </a-col>
                  </a-row>
                </a-card>
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
          <a-tab-pane :tab="tabTit" v-if="type != null" key="1">
            <a-row>
              <a-col :span="24">
                <a-alert :message="sourceAuditStatus" type="info" />
              </a-col>
            </a-row>
            <a-divider>基本信息</a-divider>
            <table class="detailTable">
              <tr>
                <td>
                  <label>姓名</label>
                  <span>{{ sourceModel.emName }}</span>
                </td>
                <td>
                  <label>年龄</label>
                  <span>{{ sourceModel.empAge }}</span>
                </td>
                <td>
                  <label>性别</label>
                  <span>{{ model.empSex }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>联系方式</label>
                  <span>{{ sourceModel.empPhone }}</span>
                </td>
                <td>
                  <label>身份证</label>
                  <span>{{ sourceModel.emIdCard }}</span>
                </td>
                <td>
                  <label>岗位</label>
                  <span>{{ sourceModel.post }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>客户单位</label>
                  <span>{{ sourceCustomerName }}</span>
                </td>
                <td>
                  <label>劳动合同期限</label>
                  <span>{{ sourceModel.contractStart }} ~ {{ sourceModel.contractEnd }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>结算主体</label>
                  <span>{{ sourceModel.departName }}</span>
                </td>
                <td>
                  <label>业务类型</label>
                  <span>{{ sourceBusinessTypeName }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>商业保险</label>
                  <span>{{ model.insuranceStr || '未购买' }}</span>
                </td>
                <td>
                  <label>社保参保地</label>
                  <span v-if="sourceModel.provinceName">{{ sourceModel.provinceName }} {{ sourceModel.cityName }} {{ sourceModel.townName }}</span
                  >
                  <span v-else>暂无</span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <label>社会保险</label>
                  <span>{{ sourceModel.socialStatusStr || '未购买' }}</span>
                </td>
              </tr>
              <tr v-if="type == 0 || type == 1">
                <td colspan="2">
                  <label>风险承担</label>
                  <span>{{ sourceModel.customerName }}</span>
                </td>
                <td>
                  <label>事件类型</label>
                  <span>{{ filterDictText(eventTypeOptions, sourceModel.eventType) }}</span>
                </td>
              </tr>
              <tr v-if="type == 2">
                <td>
                  <label>皖信工龄</label>
                  <span>{{ sourceModel.workLengthWxYear || '0' }}年{{ sourceModel.workLengthWxMonth || '0' }}月</span>
                </td>
                <td>
                  <label>客户单位工龄</label>
                  <span
                  >{{ sourceModel.workLengthCustomerYear || '0' }}年{{
                    sourceModel.workLengthCustomerMonth || '0'
                  }}月</span
                  >
                </td>
                <td>
                  <label>前12个月平均工资</label>
                  <span>{{ sourceModel.averageSalary || '--' }}</span>
                </td>
              </tr>
            </table>
            <a-divider>事件信息</a-divider>
            <table class="detailTable">
              <tr v-if="type == 0 || type == 1">
                <td>
                  <label>事件发生时间</label>
                  <span>{{ moment(sourceModel.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                </td>
                <td>
                  <label>事件发生地点</label>
                  <span>{{ sourceModel.eventOccurrenceAddr }}</span>
                </td>
                <td>
                  <label>伤害部位</label>
                  <span>{{ sourceModel.injuryPosition }}</span>
                </td>
              </tr>
              <tr v-if="type == 0 || type == 1">
                <td>
                  <label>是否治疗</label>
                  <span>{{ isCuringOption[sourceModel.isCuring] }}</span>
                </td>
                <td>
                  <label>治疗类型</label>
                  <span>{{ filterDictText(treatmentTypeOption, sourceModel.curingType) }}</span>
                </td>
                <td>
                  <label>就诊医院</label>
                  <span>{{ sourceModel.curingHospital }}</span>
                </td>
              </tr>
              <tr v-if="type == 0 || type == 1">
                <td colspan="3">
                  <label>事件发生经过</label>
                  <span>{{ sourceModel.eventThrough }}</span>
                </td>
              </tr>
              <tr v-if="type == 2">
                <td colspan="2">
                  <label>发生时间</label>
                  <span>{{ moment(sourceModel.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                </td>
                <td>
                  <label>事件类别</label>
                  <span>{{ filterDictText(retiredTypeOption, sourceModel.eventType) }}</span>
                </td>
              </tr>
              <tr v-if="type == 2">
                <td colspan="3">
                  <label>事件说明</label>
                  <span>{{ sourceModel.eventThrough }}</span>
                </td>
              </tr>
            </table>
            <a-divider>方案意见</a-divider>
            <table class="detailTable">
              <tr>
                <td colspan="3">
                  <label>赔付方案</label>
                  <span>{{ sourceModel.payPlan }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <label>法务意见</label>
                  <span>{{ sourceModel.customerOpinion }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <label>部门/子分公司处理方案、意见</label>
                  <span>{{ sourceModel.organOpinion }}</span>
                </td>
              </tr>
            </table>
            <a-divider>材料附件</a-divider>
            <a-card :bordered="false">
              <a-empty v-if="sourceFileList.length == 0" description="暂无附件" />
              <ul class="filelist" v-if="sourceFileList.length">
                <li v-for="(item, index) in sourceFileList" :key="index" :value="item.id">
                  <span class="filename">{{ item.attaName }}</span>
                  <span class="down" @click="down(item)">下载</span>
                </li>
              </ul>
              <a-row class="mbot" v-if="sourceFileList.length">
                <a-col :span="2" :offset="1">
                  <a-button
                    style="background: #1890ff; color: #fff; margin-top: 10px"
                    @click="downAll(sourceModel.id, type)"
                  >一键打包下载</a-button
                  >
                </a-col>
              </a-row>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="5" tab="办结记录" v-if="showFee">
            <handle-record ref="HandleRecordForm" :feeTypeOption="feeTypeOption" @ok="handleCancel"></handle-record>
          </a-tab-pane>

        </a-tabs>
      </div>

      <a-row class="dialogBottom" v-if="isOperate">
        <a-col :span="11" :offset="12">
          <a-button class="accessBtn" v-has="auditPass" @click="operateDialog('access', true)">审核通过</a-button>
          <a-button class="extraBtn" v-has="auditExtra" @click="operateDialog('extra', true)">待补充</a-button>
          <a-button class="backBtn" v-has="auditBack" @click="operateDialog('back', true)">退回</a-button>
          <a-button @click="handleCancel">关闭</a-button>
        </a-col>
      </a-row>

      <!--各种弹窗内容-->
      <a-modal
        title="转为重大事件"
        @ok="submitEvent"
        :visible="eventVisible"
        :confirmLoading="dialogConfirmLoading"
        @cancel="operateDialog('event', false)"
        okText="确认"
        cancelText="关闭"
        :maskClosable="false"
        wrapClassName="wrapClass"
      >
        <p>确定转为重大事件，提交督查办审核吗？</p>
      </a-modal>
      <a-modal
        title="审核通过"
        @ok="handleAccess"
        :visible="accessVisible"
        :confirmLoading="dialogConfirmLoading"
        @cancel="operateDialog('access', false)"
        okText="确认"
        cancelText="关闭"
        :maskClosable="false"
        wrapClassName="wrapClass"
      >
        <a-form layout="vertical" :form="accessForm">
          <a-form-item label="法务意见">
            <a-textarea
              placeholder="请填写法务意见"
              v-decorator="[
                'legalAdvice',
                {
                  rules: [
                    { required: true, message: '请填写法务意见!' },
                    { max: 200, message: '法务意见最多200个字符!' },
                  ],
                },
              ]"
              rows="5"
            ></a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        title="待补充"
        @ok="handleExtra"
        :visible="extraVisible"
        :confirmLoading="dialogConfirmLoading"
        @cancel="operateDialog('extra', false)"
        okText="确定"
        cancelText="关闭"
        :maskClosable="false"
        wrapClassName="wrapClass"
      >
        <a-form layout="vertical" :form="extraForm">
          <a-form-item label="待补充内容">
            <a-textarea
              placeholder="请填写待补充内容或材料"
              v-decorator="['info', validatorRules.info]"
              rows="4"
            ></a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        title="审核退回"
        @ok="handleBack"
        :visible="backVisible"
        :confirmLoading="dialogConfirmLoading"
        @cancel="operateDialog('back', false)"
        okText="确定"
        cancelText="关闭"
        :maskClosable="false"
        wrapClassName="wrapClass"
      >
        <a-form layout="vertical" :form="backForm">
          <a-form-item label="退回原因">
            <a-textarea placeholder="请填写退回的原因" rows="4" v-decorator="['backInfo', validatorRules.backInfo]">
            </a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
        title="历史事件"
        :visible="historyVisible"
        :width="'90%'"
        @cancel="operateDialog('history', false)"
        :footer="null"
        :maskClosable="false"
        :destroyOnClose="true"
        wrapClassName="wrapClass"
      >
        <a-tabs defaultActiveKey="0">
          <a-tab-pane
            v-for="(item, index) in historyList"
            :key="index"
            style="height: 500px; overflow-y: scroll"
            :tab="'历史事件' + (index + 1)"
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
                <detail-list-item term="性别">{{ model.empSex }}</detail-list-item>
                <detail-list-item term="社会保险">{{ socialStatusArr[item.socialStatus] }}</detail-list-item>
              </detail-list>
              <detail-list>
                <detail-list-item term="身份证">{{ item.emIdCard }}</detail-list-item>
                <detail-list-item term="商业保险">
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      {{ item.insuranceStr || '未购买' }}
                    </template>
                    <span class="overflow">
                      {{ item.insuranceStr || '未购买' }}
                    </span>
                  </a-tooltip>
                </detail-list-item>
              </detail-list>
              <detail-list>
                <detail-list-item term="联系方式">{{ item.empPhone }}</detail-list-item>
                <detail-list-item term="岗位">{{ item.post }}</detail-list-item>
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
              </detail-list>
              <detail-list>
                <detail-list-item term="劳动合同期限">
                  <template v-if="item.contractStart"> {{ item.contractStart }} ~ {{ item.contractEnd }} </template>
                  <template v-else> 暂无合同 </template>
                </detail-list-item>
                <detail-list-item term="业务类型">{{ item.businessTypeName }}</detail-list-item>
              </detail-list>
              <detail-list>
                <detail-list-item term="社保参保地">
                  <template v-if="item.provinceName">
                    {{ item.provinceName }} {{ item.cityName }} {{ item.townName }}
                  </template>
                  <span v-else>暂无</span>
                </detail-list-item>
              </detail-list>
            </a-card>
            <a-divider orientation="left">事件信息</a-divider>
            <a-card :bordered="false">
              <div v-if="flag == 3">
                <detail-list>
                  <detail-list-item term="仲裁时间">
                    {{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD') }}
                  </detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="仲裁委员会">
                    {{ item.eventOccurrenceAddr }}
                  </detail-list-item>
                </detail-list>
                <detail-list layout="vertical" :col="24">
                  <detail-list-item term="仲裁诉求">
                    {{ item.eventThrough }}
                  </detail-list-item>
                </detail-list>
              </div>
              <div v-if="flag == 4">
                <detail-list>
                  <detail-list-item term="原告/被告">{{
                    item.plaintiffOrDefendant == 0 ? '原告' : '被告'
                  }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="客户单位">{{ customerDict(customerTreeData, item.unitId) }}</detail-list-item>
                </detail-list>
                <detail-list>
                  <detail-list-item term="诉讼时间">{{
                    moment(item.eventOccurrenceTime).format('YYYY-MM-DD')
                  }}</detail-list-item>
                  <detail-list-item term="法院">{{ item.eventOccurrenceAddr }}</detail-list-item>
                </detail-list>
                <detail-list layout="vertical" :col="24">
                  <detail-list-item term="原告诉求">{{ item.eventThrough }}</detail-list-item>
                </detail-list>
              </div>
              <div v-if="flag == 5">
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
                  <detail-list-item term="投诉渠道">{{ item.eventResource == 0 ? '电话' : '纸质' }}</detail-list-item>
                </detail-list>
                <detail-list layout="vertical" :col="24">
                  <detail-list-item term="投诉内容"> {{ item.eventThrough }}</detail-list-item>
                </detail-list>
              </div>
            </a-card>
            <a-divider orientation="left">方案意见</a-divider>
            <a-card :bordered="false">
              <detail-list v-if="flag != 3 && flag != 4" layout="vertical" :col="24">
                <detail-list-item term="赔付方案">{{ item.payPlan }}</detail-list-item>
              </detail-list>
              <detail-list layout="vertical" :col="24">
                <detail-list-item term="法务意见" v-if="flag == 3 || flag == 4">{{
                  item.customerOpinion
                }}</detail-list-item>
              </detail-list>
              <detail-list layout="vertical" :col="24">
                <detail-list-item term="客户意见" v-if="flag != 3 && flag != 4">{{
                  item.customerOpinion
                }}</detail-list-item>
              </detail-list>
              <detail-list layout="vertical" :col="24">
                <detail-list-item term="部门/子分公司处理方案、意见">{{ item.organOpinion }}</detail-list-item>
              </detail-list>
            </a-card>
            <a-divider orientation="left">材料附件</a-divider>
            <a-card :bordered="false">
              <a-empty v-if="attachList[index] == null" />
              <ul class="filelist" v-if="attachList[index] != null">
                <li v-for="(items, indexs) in attachList[index]" :key="indexs" :value="item.id">
                  <span class="filename">{{ items.attaName }}</span>
                  <span class="down" @click="down(item)">下载</span>
                </li>
              </ul>
              <a-row class="mbot" v-if="attachList[index] != null">
                <a-col :span="2" :offset="1">
                  <a-button style="background: #1890ff; color: #fff" @click="downAll(items.id, type)">一键打包下载</a-button
                  >
                </a-col>
              </a-row>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    </a-spin>
  </a-modal>
</template>
    
  
<script>
import { initDictOptions, filterDict, filterDictText, customerDict, organDict } from '@/components/dict/JDictSelectUtil'
import { httpAction, downFile, postActionHeader, httpActionHeader } from '@/api/manage'
import DetailList from '@/components/tools/DetailList'
import HandleRecord from './HandleRecord'
import moment from 'moment'
const DetailListItem = DetailList.Item

export default {
  name: 'AbitrationAuditModal',
  components: {
    DetailList,
    DetailListItem,
    HandleRecord
  },
  data() {
    return {
      id: '',
      model: {},
      title: '详情',
      visible: false,
      eventVisible: false,
      accessVisible: false,
      extraVisible: false,
      backVisible: false,
      historyVisible: false,
      isOperate: true,
      confirmLoading: false,
      dialogConfirmLoading: false,
      auditStatus: '', //状态
      auditStatusOption: [],
      tabTit: '', //原事件类型
      sourceAuditStatus: '', //原事件状态
      businessTypeDicts: [], //业务类型
      treatmentTypeOption: [], //治疗类型
      settleDomainOptions: [], //结算主体
      fileList: [], //附件列表
      sourceFileList: [],
      customerName: '', // 客户单位
      businessTypeName: '', //业务类型名称
      retiredTypeOption: [], //退工事件类型
      sourceCustomerName: '',
      sourceBusinessTypeName: '',
      eventTypeOptions: [],
      organizationOption: [],
      customerTreeData: [],
      isCuringOption: ['是', '否'],
      tabTitle: '仲裁事件',
      flag: 3,
      sexOptions: [],
      type: '', //0工伤事件转1非因工事件转
      sourceModel: {}, //原事件
      isRequest: true, //是否请求
      socialStatusArr: ['已购买，与劳动合同起始时间一致', '已购买，与劳动合同起始时间不一致', '未购买'],
      count: 0, // 历史次数
      historyList: [], //历史事件
      attachList: [], //历史事件附件
      auditPass: 'wxhr:tAbitrationEvent_audit_pass',
      auditExtra: 'wxhr:tAbitrationEvent_to_supplemented',
      auditBack: 'wxhr:tAbitrationEvent_back',
      extraForm: this.$form.createForm(this),
      backForm: this.$form.createForm(this),
      accessForm: this.$form.createForm(this),
      validatorRules: {
        info: {
          rules: [
            { required: true, message: '请输入待补充内容!' },
            { max: 50, message: '待补充内容最多50个字符!' },
          ],
        },
        backInfo: {
          rules: [
            { required: true, message: '请输入退回原因!' },
            { max: 50, message: '退回原因最多50个字符!' },
          ],
        },
        legalAdvice: {
          rules: [
            { required: true, message: '请输入法务意见!' },
            { max: 500, message: '最多500个字符!' },
          ],
        },
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
        getDetailById: '/hrEmergency/tabitrationevent/', //获取当条记录详情
        getHistory: '/hrEmergency/tabitrationevent/old/',
        getCustomerById: '/hrBase/tcustomerinfo/getCusNameAndBusinessType', //查询客户单位
        getEmpInsurance: '/hrEmergency/tabitrationevent/insertInfo/', //获取该员工社保商险信息
        extraUrl: '/hrEmergency/tabitrationevent/toSupplemented', //材料待补充
        backUrl: '/hrEmergency/tabitrationevent/back', //退回地址
        accessUrl: '/hrEmergency/tabitrationevent/auditPass', //审核通过
        getAttachUrl: '/hrEmergency/fileUpload/ossFileUrl/domain/', //获取附件列表
        toMajor: '/hrEmergency/tabitrationevent/toMajor/', //转为重大
        getInjury: '/hrEmergency/tworkinjuryevent/vo/', //工伤详情
        getNonWork: '/hrEmergency/tnonworkevent/vo/', //非因工
        getRetired: '/hrEmergency/tretiredworkevent/vo/',
        getComplaint: '/hrEmergency/tcomplaintevent/vo/',
        getTreeData: '/hrBase/tcustomerinfo/ValueTree',
        organization: '/admin/organizationinfo/getOrgForCus', //获取皖信组织架构
        down: '/hrEmergency/fileUpload/ossFileZip/domain/', //一键下载
        delAttachUrl: '/hrEmergency/fileUpload/ossFileDelete/', //删除附件
        importUrl: '/hrEmergency/fileUpload/ossUploadFile', //上传附件
        getRecordUrl: '/hrEmergency/recordeventoperation/record', //获取记录
        getContractHistory: '/hrBase/temployeecontractinfo/getEmployeeContractByIdCard',
        getInsuranceHistory: '/busiInsurance/tbusinessinsurance/getVopage',
        getSocialByIdcard: '/hrSocial/tpaymentinfo/getSocialByIdCardAndmonth/',
        injuryClaims:'/hrEmergency/tdealinfo/record', //办结记录
      },
      processList: [], //流程
      employeeContractTypeOptions: [], // 员工合同类型
      workingHoursOptions: [], // 工时制
      situationTypeOptions: [], // 签订情况
      contractData: [], //历史合同信息
      contractColumns: [
        {
          title: '合同名称',
          align: 'center',
          ellipsis: true,
          width: 100,
          dataIndex: 'contractName',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '合同编码',
          align: 'center',
          ellipsis: true,
          width: 100,
          dataIndex: 'contractNo',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '合同类型',
          align: 'center',
          ellipsis: true,
          width: 120,
          dataIndex: 'contractType',
          customRender: (text) => {
            const contractType = filterDictText(this.employeeContractTypeOptions, text)
            return (
              <a-tooltip placement="topLeft" title={contractType}>
                {contractType}
              </a-tooltip>
            )
          },
        },
        {
          title: '合同时间',
          align: 'center',
          ellipsis: true,
          width: 200,
          dataIndex: 'contractStart',
          customRender: (text, record) => {
            const range = text + '~' + record.contractEnd
            return (
              <a-tooltip placement="topLeft" title={range}>
                {range}
              </a-tooltip>
            )
          },
        },
        {
          title: '合同年限',
          align: 'center',
          ellipsis: true,
          width: 120,
          dataIndex: 'contractTerm',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '主体部门',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'subjectDepart',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '主体单位',
          align: 'center',
          ellipsis: true,
          width: 250,
          dataIndex: 'subjectUnit',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '合同岗位',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'post',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '工时制',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'workingHours',
          customRender: (text) => {
            const workingHours = filterDictText(this.workingHoursOptions, text)
            return (
              <a-tooltip placement="topLeft" title={workingHours}>
                {workingHours}
              </a-tooltip>
            )
          },
        },
        {
          title: '档案柜号',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'fileCabinetNo',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '签订情况',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'situation',
          customRender: (text) => {
            const situation = filterDictText(this.situationTypeOptions, text)
            return (
              <a-tooltip placement="topLeft" title={situation}>
                {situation}
              </a-tooltip>
            )
          },
        },
        {
          title: '备注',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'remark',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
      ],
      insuranceData: [],
      settleTypeOptions: [], //结算类型
      statusOptions: [], // 商险状态
      insuranceColumns: [
        {
          title: '员工姓名',
          align: 'center',
          ellipsis: true,
          width: 100,
          dataIndex: 'empName',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '结算主体编码',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'settlementOrganNo',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '结算主体名称',
          align: 'center',
          ellipsis: true,
          width: 200,
          dataIndex: 'settlementOrganName',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '身份证号',
          align: 'center',
          ellipsis: true,
          width: 180,
          dataIndex: 'empIdcardNo',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '结算类型',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'settleType',
          customRender: (text) => {
            const settleType = filterDictText(this.settleTypeOptions, text)
            return <a-tag color="blue">{settleType}</a-tag>
          },
        },
        {
          title: '保险公司',
          align: 'center',
          ellipsis: true,
          width: 160,
          dataIndex: 'insuranceCompanyName',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '险种',
          align: 'center',
          ellipsis: true,
          width: 160,
          dataIndex: 'insuranceTypeName',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '保单起止时间',
          align: 'center',
          ellipsis: true,
          width: 200,
          dataIndex: 'policyStart',
          customRender: (text, record) => {
            const range = text + '~' + record.policyEnd
            return (
              <a-tooltip placement="topLeft" title={range}>
                {range}
              </a-tooltip>
            )
          },
        },
        {
          title: '购买标准',
          align: 'center',
          ellipsis: true,
          width: 160,
          dataIndex: 'buyStandard',
          customRender: (text) => {
            return (
              <a-tooltip placement="topLeft" title={text}>
                {text}
              </a-tooltip>
            )
          },
        },
        {
          title: '派单类型',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'fromEmpName',
          customRender: (text) => {
            if (text) {
              return <a-tag color="purple">替换</a-tag>
            } else {
              return <a-tag color="blue">新增</a-tag>
            }
          },
        },
        {
          title: '是否有效',
          align: 'center',
          ellipsis: true,
          width: 160,
          dataIndex: 'validFlag',
          customRender: (text) => {
            if (text == 0) {
              return <a-tag color="green">有效</a-tag>
            } else {
              return <a-tag color="red">无效</a-tag>
            }
          },
        },
        {
          title: '是否过期',
          align: 'center',
          ellipsis: true,
          width: 150,
          dataIndex: 'expireFlag',
          customRender: (text) => {
            return text == 0 ? '未过期' : '已过期'
          },
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          width: 130,
          ellipsis: true,
          customRender: (text) => {
            const status = filterDictText(this.statusOptions, text)
            return (
              <a-tooltip placement="topLeft" title={status}>
                {status}
              </a-tooltip>
            )
          },
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
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
      ],
      paymentSocial: {}, //缴费库信息
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
        total: 0,
      },
      feeTypeOption: [],
      showFee: false,
      urlType:''

    }
  },
  created() {
    this.loadCustomerTreeData()
    this.loadOrgination()
    this.initDictConfig()
    httpAction(`/admin/dict/getByParentId?parentId=1753`,null,'get').then(res=>{
      if(res.code === 200){
        this.feeTypeOption = res.data
      }
    })
  },
  methods: {
    moment,
    customerDict,
    filterDictText,
    getPageDate(current) {
      httpAction(
        this.url.getInsuranceHistory + '?current=' + current + '&size=10&empIdcardNo=' + this.model.emIdCard,
        null,
        'get'
      ).then((res) => {
        if (res.code == 200 && res.data) {
          this.insuranceData = res.data.records
          this.ipagination.total = res.data.total
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.getPageDate(pagination.current)
    },
    edit(record, id,show,type) {
      this.urlType = type
      this.showFee = show ? true : false;

      this.id = id
      this.visible = true
      this.model = Object.assign({ insurance: record.insurance }, record.abitrationEvent)

      //查询客户单位合同相关信息
      httpAction(
        this.url.getCustomerById + '?cusId=' + this.model.emCusId + '&settleDomainId=' + this.model.emSettleId,
        null,
        'get'
      ).then((ress) => {
        this.customerName = ress.data.cusName //客户单位 this.businessTypeDicts
        this.businessTypeName = filterDict(this.businessTypeDicts, ress.data.businessType)
      })
      httpAction(this.url.getinfo + this.model.empId, null, 'get').then((res) => {
        if (res.code == 200) {
          this.model.empSex = filterDictText(this.sexOptions, res.data.empSex)
        }
      })
      if (this.flag == 4) {
        this.model.unitIdName = customerDict(this.customerTreeData, this.model.unitId)
      }
      //社保状态
      this.model.socialStatusStr = this.socialStatusArr[this.model.socialStatus]
      switch (this.type) {
        case 0:
          this.tabTit = '原工伤事件'
          break
        case 1:
          this.tabTit = '原非因工事件'
          break
        case 2:
          this.tabTit = '原退工事件'
          break
        case 5:
          this.tabTit = '原监察诉讼事件'
          break
      }
      if (this.model.insurance) {
        let insuranceStr = ''
        for (let item of this.model.insurance) {
          insuranceStr += ' ' + item.insuranceTypeName
        }
        this.model.insuranceStr = insuranceStr
      } else {
        this.model.insuranceStr = '未购买'
      }
      //获取历史次数
      // let param = this.model.id+'?empIdcard='+this.model.emIdCard+'&settleDepartId='+this.model.emSettleId
      httpAction(this.url.getEmpInsurance + this.model.empId + '?type=0', null, 'get').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          this.count = res.data.record
        }
      })
      this.fileList = []
      //获取附件信息
      httpAction(this.url.getAttachUrl + id + '?type=' + this.flag, null, 'get').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          for (let item of res.data) {
            this.fileList.push({
              uid: item.id,
              url: item.attaSrc,
              status: 'done',
              name: item.attaName,
            })
          }
        }
      })
    },
    exportExcel() {
      let tabData = []
      let excelDatas = []

      switch (this.flag) {
        case 3:
          tabData = [
            { label1: '基本信息', text1: '', label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '姓名',
              text1: this.model.emName,
              label2: '年龄',
              text2: this.model.empAge,
              label3: '性别',
              text3: this.model.empSex,
            },
            {
              label1: '联系方式',
              text1: this.model.empPhone,
              label2: '身份证',
              text2: this.model.emIdCard,
              label3: '岗位',
              text3: this.model.post,
            },
            {
              label1: '客户单位',
              text1: this.customerName,
              label2: '',
              text2: '',
              label3: '劳动合同期限',
              text3: this.model.contractStart ? `${this.model.contractStart}~${this.model.contractEnd}` : '',
            },
            {
              label1: '结算主体',
              text1: this.model.departName,
              label2: '',
              text2: '',
              label3: '业务类型',
              text3: this.businessTypeName,
            },
            {
              label1: '商业保险',
              text1: this.model.insuranceStr,
              label2: '',
              text2: '',
              label3: '社保参保地',
              text3: this.model.provinceName ? this.model.provinceName + this.model.cityName : '',
            },
            { label1: '社会保险', text1: this.model.socialStatusStr, label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '皖信工龄',
              text1: `${this.model.workLengthWxYear}年${this.model.workLengthWxMonth}月`,
              label2: '客户单位工龄',
              text2: `${this.model.workLengthCustomerYear}年${this.model.workLengthCustomerMonth}月`,
              label3: '前12个月平均工资',
              text3: this.model.averageSalary || '',
            },
            { label1: '事件信息', text1: '', label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '事件编码',
              text1: this.model.eventCode || '',
              label2: '仲裁时间',
              text2: moment(this.model.eventOccurrenceTime).format('YYYY-MM-DD'),
              label3: '仲裁委员会',
              text3: this.model.eventOccurrenceAddr,
            },
            {
              label1: '状态',
              text1: this.auditStatus.replace(/状态：/, ''),
              label2: '申报人',
              text2: this.model.reportUserName,
              label3: '申报时间',
              text3: this.model.reportDate,
            },
            { label1: '仲裁个人诉求', text1: this.model.eventThrough, label2: '', text2: '', label3: '', text3: '' },
            { label1: '方案意见', text1: '', label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '部门/子分公司处理方案、意见',
              text1: this.model.organOpinion,
              label2: '',
              text2: '',
              label3: '',
              text3: '',
            },
            { label1: '法务意见', text1: this.model.customerOpinion, label2: '', text2: '', label3: '', text3: '' },
            { label1: '附件', text1: '', label2: '', text2: '', label3: '', text3: '' },
          ]
          this.fileList.forEach((item) => {
            tabData.push({ label1: item.name, text1: '', label2: '', text2: '', label3: '', text3: '' })
          })
          excelDatas = [
            {
              tHeader: ['label1', 'text1', 'label2', 'text2', 'label3', 'text3'],
              filterVal: ['label1', 'text1', 'label2', 'text2', 'label3', 'text3'],
              tableDatas: tabData,
              sheetName: this.title.replace(/_详情/, ''),
            },
          ]
          break
        case 4:
          tabData = [
            { label1: '基本信息', text1: '', label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '姓名',
              text1: this.model.emName,
              label2: '年龄',
              text2: this.model.empAge,
              label3: '性别',
              text3: this.model.empSex,
            },
            {
              label1: '联系方式',
              text1: this.model.empPhone,
              label2: '身份证',
              text2: this.model.emIdCard,
              label3: '岗位',
              text3: this.model.post,
            },
            {
              label1: '客户单位',
              text1: this.customerName,
              label2: '',
              text2: '',
              label3: '劳动合同期限',
              text3: this.model.contractStart ? `${this.model.contractStart}~${this.model.contractEnd}` : '',
            },
            {
              label1: '结算主体',
              text1: this.model.departName,
              label2: '',
              text2: '',
              label3: '业务类型',
              text3: this.businessTypeName,
            },
            {
              label1: '商业保险',
              text1: this.model.insuranceStr,
              label2: '',
              text2: '',
              label3: '社保参保地',
              text3: this.model.provinceName ? this.model.provinceName + this.model.cityName : '',
            },
            { label1: '社会保险', text1: this.model.socialStatusStr, label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '皖信工龄',
              text1: `${this.model.workLengthWxYear}年${this.model.workLengthWxMonth}月`,
              label2: '客户单位工龄',
              text2: `${this.model.workLengthCustomerYear}年${this.model.workLengthCustomerMonth}月`,
              label3: '前12个月平均工资',
              text3: this.model.averageSalary || '',
            },
            { label1: '事件信息', text1: '', label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '事件编码',
              text1: this.model.eventCode || '',
              label2: '原告/被告',
              text2: this.model.plaintiffOrDefendantName == 0 ? '原告' : '被告',
              label3: '诉讼时间',
              text3: this.model.eventOccurrenceTime,
            },
            { label1: '客户单位', text1: this.model.unitIdName, label2: '', text2: '', label3: '法院', text3: '' },
            {
              label1: '状态',
              text1: this.auditStatus.replace(/状态：/, ''),
              label2: '申报人',
              text2: this.model.reportUserName,
              label3: '申报时间',
              text3: this.model.reportDate,
            },
            {
              label1: '原告诉求',
              text1: this.model.eventThrough,
              label2: this.model.eventThrough,
              text2: '',
              label3: '',
              text3: '',
            },
            { label1: '方案意见', text1: '', label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '部门/子分公司处理方案、意见',
              text1: this.model.organOpinion,
              label2: '',
              text2: '',
              label3: '',
              text3: '',
            },
            { label1: '附件', text1: '', label2: '', text2: '', label3: '', text3: '' },
          ]
          this.fileList.forEach((item) => {
            tabData.push({ label1: item.name, text1: '', label2: '', text2: '', label3: '', text3: '' })
          })
          excelDatas = [
            {
              tHeader: ['label1', 'text1', 'label2', 'text2', 'label3', 'text3'],
              filterVal: ['label1', 'text1', 'label2', 'text2', 'label3', 'text3'],
              tableDatas: tabData,
              sheetName: '诉讼事件',
            },
          ]
          break
        case 5:
          tabData = [
            { label1: '基本信息', text1: '', label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '姓名',
              text1: this.model.emName,
              label2: '年龄',
              text2: this.model.empAge,
              label3: '性别',
              text3: this.model.empSex,
            },
            {
              label1: '联系方式',
              text1: this.model.empPhone,
              label2: '身份证',
              text2: this.model.emIdCard,
              label3: '岗位',
              text3: this.model.post,
            },
            {
              label1: '客户单位',
              text1: this.customerName,
              label2: '',
              text2: '',
              label3: '劳动合同期限',
              text3: this.model.contractStart ? `${this.model.contractStart}~${this.model.contractEnd}` : '',
            },
            {
              label1: '结算主体',
              text1: this.model.departName,
              label2: '',
              text2: '',
              label3: '业务类型',
              text3: this.businessTypeName,
            },
            {
              label1: '商业保险',
              text1: this.model.insuranceStr,
              label2: '',
              text2: '',
              label3: '社保参保地',
              text3: this.model.provinceName ? this.model.provinceName + this.model.cityName : '',
            },
            { label1: '社会保险', text1: this.model.socialStatusStr, label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '皖信工龄',
              text1: `${this.model.workLengthWxYear}年${this.model.workLengthWxMonth}月`,
              label2: '客户单位工龄',
              text2: `${this.model.workLengthCustomerYear}年${this.model.workLengthCustomerMonth}月`,
              label3: '前12个月平均工资',
              text3: this.model.averageSalary || '',
            },
            { label1: '事件信息', text1: '', label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '事件编码',
              text1: this.model.eventCode || '',
              label2: '发生时间',
              text2: this.model.eventOccurrenceTime,
              label3: '劳动保障部门',
              text3: this.model.eventOccurrenceAddr,
            },
            {
              label1: '投诉渠道',
              text1: this.model.eventResource == 0 ? '电话' : '纸质',
              label2: '状态',
              text2: this.auditStatus.replace(/状态：/, ''),
              label3: '申报人',
              text3: this.model.reportUserName,
            },
            { label1: '申报时间', text1: this.model.reportDate, label2: '', text2: '', label3: '', text3: '' },
            { label1: '投诉内容', text1: this.model.eventThrough, label2: '', text2: '', label3: '', text3: '' },
            { label1: '方案意见', text1: '', label2: '', text2: '', label3: '', text3: '' },
            { label1: '赔付方案', text1: this.model.payPlan, label2: '', text2: '', label3: '', text3: '' },
            {
              label1: '部门/子分公司处理方案、意见',
              text1: this.model.organOpinion,
              label2: '',
              text2: '',
              label3: '',
              text3: '',
            },
            { label1: '附件', text1: '', label2: '', text2: '', label3: '', text3: '' },
          ]
          this.fileList.forEach((item) => {
            tabData.push({ label1: item.name, text1: '', label2: '', text2: '', label3: '', text3: '' })
          })
          excelDatas = [
            {
              tHeader: ['label1', 'text1', 'label2', 'text2', 'label3', 'text3'],
              filterVal: ['label1', 'text1', 'label2', 'text2', 'label3', 'text3'],
              tableDatas: tabData,
              sheetName: '监察投诉事件',
            },
          ]
          break
      }

      this.json2excel(
        excelDatas,
        `${this.title.replace(/_详情/, '')}-${this.model.emName}`,
        true,
        'xlsx',
        this.flag,
        this.fileList.length
      )
    },
    json2excel(tableJson, filenames, autowidth, bookTypes, type, autoLength) {
      var that = this
      import('../xlsx/ExportEmergece').then((excel) => {
        var tHeader = []
        var dataArr = []
        var sheetnames = []
        for (var i in tableJson) {
          tHeader.push(tableJson[i].tHeader)
          dataArr.push(that.formatJson(tableJson[i].filterVal, tableJson[i].tableDatas))
          sheetnames.push(tableJson[i].sheetName)
        }
        excel.export_json_to_excel_more_sheet({
          header: tHeader,
          data: dataArr,
          sheetname: sheetnames,
          filename: filenames,
          autoWidth: autowidth,
          bookType: bookTypes,
          type: type,
          autoLength: autoLength, // 所有类型长度
        })
        that.confirmLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
    },
    sorceDetail(url, attachId) {
      httpAction(url, null, 'get').then((res) => {
        if (res.code == 200) {
          switch (this.type) {
            case 0:
              this.sourceModel = Object.assign({ insurance: res.data.insurance }, res.data.workInjuryEvent)
              this.sourceModel.departName = this.settleDomainOptions[res.data.workInjuryEvent.emSettleId]
                ? this.settleDomainOptions[res.data.workInjuryEvent.emSettleId].departName
                : ''
              this.sourceModel.eventTypeName = filterDictText(this.eventTypeOptions, this.sourceModel.eventType)
              break
            case 1:
              this.sourceModel = Object.assign({ insurance: res.data.insurance }, res.data.nonWorkEvent)
              this.sourceModel.departName = this.settleDomainOptions[res.data.nonWorkEvent.emSettleId]
                ? this.settleDomainOptions[res.data.nonWorkEvent.emSettleId].departName
                : ''
              break
            case 2:
              this.sourceModel = Object.assign({ insurance: res.data.insurance }, res.data.retiredWorkEvent)
              this.sourceModel.departName = this.settleDomainOptions[res.data.retiredWorkEvent.emSettleId]
                ? this.settleDomainOptions[res.data.retiredWorkEvent.emSettleId].departName
                : ''
              break
            case 5:
              this.sourceModel = Object.assign({ insurance: res.data.insurance }, res.data.complaintEvent)
              this.sourceModel.departName = this.settleDomainOptions[res.data.complaintEvent.emSettleId]
                ? this.settleDomainOptions[res.data.complaintEvent.emSettleId].departName
                : ''
              break
          }
          this.sourceAuditStatus = '状态：' + filterDictText(this.auditStatusOption, this.sourceModel.auditStatus)
          this.sourceModel.customerName =
            this.sourceModel.riskBear == 1
              ? customerDict(this.customerTreeData, this.sourceModel.riskBearUnit)
              : organDict(this.organizationOption, this.sourceModel.riskBearOrgan)
          this.getContract()
          //获取附件信息
          httpAction(this.url.getAttachUrl + attachId + '?type=' + this.type, null, 'get').then((res) => {
            if (Number(res.code) === 200) {
              this.sourceFileList = res.data
            }
          })
          this.isRequest = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getContract() {
      //查询客户单位合同相关信息
      httpAction(
        this.url.getCustomerById +
          '?cusId=' +
          this.sourceModel.emCusId +
          '&settleDomainId=' +
          this.sourceModel.emSettleId,
        null,
        'get'
      ).then((ress) => {
        this.sourceCustomerName = ress.data.cusName //客户单位 this.businessTypeDicts
        this.sourceBusinessTypeName = filterDict(this.businessTypeDicts, ress.data.businessType)
      })
      this.sourceModel.socialStatusStr = this.socialStatusArr[this.sourceModel.socialStatus]
      if (this.sourceModel.insurance) {
        let insuranceStr = ''
        for (let item of this.sourceModel.insurance) {
          insuranceStr += ' ' + item.insuranceTypeName
        }
        this.sourceModel.insuranceStr = insuranceStr
      } else {
        this.sourceModel.insuranceStr = '未购买'
      }
    },
    historyContract() {
      httpAction(this.url.getContractHistory + '?idCard=' + this.model.emIdCard, null, 'get').then((res) => {
        if (res.code == 200 && res.data) {
          this.contractData = res.data
        } else {
          this.$message.warning(res.msg)
        }
      })
      this.getPageDate(1)
      httpAction(
        this.url.getSocialByIdcard +
          this.model.emIdCard +
          '?month=' +
          moment(this.model.eventOccurrenceTime).format('YYYYMM'),
        null,
        'get'
      ).then((res) => {
        if (res.code == 200 && res.data) {
          this.paymentSocial = res.data
        } else {
          this.$message.warning(res.msg)
        }
      })
      this.isRequest = false
    },
    changeTab(key) {
      if (key == 1 && this.isRequest) {
        let url
        let attachId
        switch (this.type) {
          case 0:
            url = this.url.getInjury + this.model.workInjuryId
            attachId = this.model.workInjuryId
            break
          case 1:
            url = this.url.getNonWork + this.model.nonWorkId
            attachId = this.model.nonWorkId
            break
          case 2:
            url = this.url.getRetired + this.model.retiredId
            attachId = this.model.retiredId
            break
          case 5:
            url = this.url.getComplaint + this.model.complaintId
            attachId = this.model.complaintId
            break
        }
        this.sorceDetail(url, attachId)
      }
      if (key == 1) {
        this.isOperate = false
      } else {
        if (this.flag == 3) {
          this.isOperate = true
        }
      }
      if (key == 2 && this.isRequest) {
        this.historyContract()
      }
      if (key == 3 && this.processList.length == 0) {
        httpAction(this.url.getRecordUrl + '?id=' + this.id + '&type=' + this.flag, null, 'get').then((res) => {
          if (res.code == 200 && res.data) {
            this.processList = res.data
          } else {
            this.$message.warning(res.msg)
          }
        })
      }
      if (key == 4 && this.historyList.length == 0) {
        this.history()
      }
      if(key == 5){
        //获取记录
        httpAction(this.url.injuryClaims+'?id='+this.model.id+'&payMainType=0&type='+this.urlType,null,'get').then((res)=>{
          if(res.code == 200){
            this.$refs.HandleRecordForm.status = filterDictText(this.auditStatusOption, this.model.auditStatus)
            this.$refs.HandleRecordForm.show(this.model,res.data,0)
          }else{
            this.$message.warning(res.msg)
          }
        })
      }
    },
    //下载附件
    down(record) {
      window.open(record.attaSrc, '_blank')
      // window.open('https://view.officeapps.live.com/op/view.aspx?src='+record.attaSrc,"_blank");
    },
    downAll(id, type) {
      let httpurl = this.url.down + id + '?type=' + type
      let attname = ''
      switch (type) {
        case 0:
          attname = '工伤事件'
          break
        case 1:
          attname = '非因工事件'
          break
        case 2:
          attname = '退工事件'
          break
        case 3:
          attname = '仲裁事件'
          break
        case 4:
          attname = '诉讼事件'
          break
        case 5:
          attname = '监察投诉事件'
          break
      }
      const _this = this
      downFile(httpurl, null).then((res) => {
        const data = res
        const fileReader = new FileReader()
        fileReader.onload = function () {
          try {
            const jsonData = JSON.parse(this.result)
            let msg = '下载失败'
            if (jsonData.msg) {
              // 说明是普通对象数据，后台转换失败
              msg += ',' + jsonData.msg
            }
            _this.$message.warning(msg)
            return false
          } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            var blob = new Blob([res], { type: 'application/zip' }) // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
            var downloadElement = document.createElement('a')
            var href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.href = href
            downloadElement.download = _this.model.emName + attname + '材料附件' + '.zip' // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
          }
        }
        fileReader.readAsText(data)
      })
    },
    //退回
    handleBack() {
      this.backForm.validateFields((err, values) => {
        if (!err) {
          this.dialogConfirmLoading = true
          httpAction(this.url.backUrl + '?id=' + this.id + '&info=' + values.backInfo, null, 'post')
            .then((res) => {
              if (Number(res.code) === 200) {
                this.$message.success('操作成功！')
                this.operateDialog('back', false)
                this.handleCancel()
              } else {
                this.$message.error(res.msg)
              }
            })
            .finally(() => {
              this.dialogConfirmLoading = false
            })
        }
      })
    },
    //转为重大事件
    submitEvent() {
      this.dialogConfirmLoading = true
      httpAction(this.url.toMajor + this.id, null, 'post')
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('操作成功！')
            this.operateDialog('event', false)
            this.handleCancel()
          } else {
            this.$message.warning(res.msg)
          }
        })
        .finally(() => {
          this.dialogConfirmLoading = false
        })
    },
    //审核通过
    handleAccess() {
      this.accessForm.validateFields((err, values) => {
        if (!err) {
          this.dialogConfirmLoading = true
          let contextType = { 'Content-Type': 'application/json' }
          httpActionHeader(this.url.accessUrl + '?id=' + this.id, values.legalAdvice, 'post', contextType)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('操作成功！')
                this.operateDialog('access', false)
                this.handleCancel()
              } else {
                this.$message.warning(res.msg)
              }
            })
            .finally(() => {
              this.dialogConfirmLoading = false
            })
        }
      })
    },
    //待补充
    handleExtra() {
      this.extraForm.validateFields((err, values) => {
        if (!err) {
          this.dialogConfirmLoading = true
          httpAction(this.url.extraUrl + '?id=' + this.id + '&info=' + values.info, null, 'post')
            .then((res) => {
              if (Number(res.code) === 200) {
                this.$message.success('操作成功！')
                this.operateDialog('extra', false)
                this.handleCancel()
              } else {
                this.$message.error(res.msg)
              }
            })
            .finally(() => {
              this.dialogConfirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      if (this.isOperate) {
        this.$emit('ok')
      }
      this.visible = false
      this.isRequest = true
      this.isOperate = true
      this.model = {}
      this.sourceModel = {}
      this.historyList = []
      this.auditStatus = this.sourceAuditStatus = ''
      this.processList = []
    },
    //操作弹框
    operateDialog(flag, status) {
      switch (flag) {
        case 'event':
          this.eventVisible = status == true ? true : false
          break
        case 'access':
          this.accessVisible = status == true ? true : false
          break
        case 'extra':
          this.extraVisible = status == true ? true : false
          break
        case 'back':
          this.backVisible = status == true ? true : false
          break
        case 'history':
          this.historyVisible = status == true ? true : false
          break
      }
      this.dialogConfirmLoading = false
    },
    history() {
      // if(this.record == 0){
      //   this.$message.warning('暂无历史事件');
      //   return false
      // }
      // this.operateDialog('history',true)
      const _this = this
      httpAction(this.url.getHistory + this.model.empId, null, 'get').then((res) => {
        if (res.code == 200 && res.data) {
          for (let [index, item] of res.data.entries()) {
            if (this.flag == 4) {
              item.abitrationEvent = item.litigationEvent
            } else if (this.flag == 5) {
              item.abitrationEvent = item.complaintEvent
            }
            _this.$set(_this.historyList, index, item.abitrationEvent)
            //获取附件
            httpAction(_this.url.getAttachUrl + item.abitrationEvent.id + '?type=' + _this.flag, null, 'get').then(
              (result) => {
                _this.$set(_this.attachList, index, result.data)
              }
            )
            _this.historyList[index].curingTypeName = filterDictText(
              this.treatmentTypeOption,
              item.abitrationEvent.curingType
            ) //治疗类型
            // 结算主体
            _this.historyList[index].departName = this.settleDomainOptions[item.abitrationEvent.emSettleId]
              ? this.settleDomainOptions[item.abitrationEvent.emSettleId].departName
              : ''
            //商险
            let insuranceStr = ''
            if (item.insurance) {
              for (let items of item.insurance) {
                insuranceStr += items.insuranceTypeName + ' '
              }
            }
            _this.$set(_this.historyList[index], `insuranceStr`, insuranceStr)
            //查询客户单位合同相关信息
            httpAction(
              this.url.getCustomerById +
                '?cusId=' +
                item.abitrationEvent.emCusId +
                '&settleDomainId=' +
                item.abitrationEvent.emSettleId,
              null,
              'get'
            ).then((ress) => {
              _this.$set(_this.historyList[index], `customerName`, ress.data.cusName)
              _this.$set(
                _this.historyList[index],
                `businessTypeName`,
                filterDict(_this.businessTypeDicts, ress.data.businessType)
              )
            })
          }
        }
      })
    },
    loadCustomerTreeData() {
      httpAction(this.url.getTreeData, null, 'get').then((res) => {
        if (res.code == 200) {
          this.customerTreeData = res.data
        }
      })
    },
    loadOrgination() {
      //获取皖信组织构架
      httpAction(this.url.organization, {}, 'get').then((res) => {
        if (res.code == 200) {
          this.organizationOption = res.data
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 数据字典
    initDictConfig() {
      //治疗类型
      initDictOptions('treatment_type').then((res) => {
        if (res.code === 200) {
          this.treatmentTypeOption = res.data
        }
      })
      // 事件类别
      initDictOptions('emergency_event_type').then((res) => {
        if (res.code === 200) {
          this.eventTypeOptions = res.data
        }
      })
      // 性别
      initDictOptions('sex').then((res) => {
        if (res.code === 200) {
          this.sexOptions = res.data
        }
      })
      // 员工合同类型
      initDictOptions('employee_contract_type').then((res) => {
        if (res.code === 200) {
          this.employeeContractTypeOptions = res.data
        }
      })
      // 工时制
      initDictOptions('working_hours').then((res) => {
        if (res.code === 200) {
          this.workingHoursOptions = res.data
        }
      })
      // 签订情况
      initDictOptions('situation_type').then((res) => {
        if (res.code === 200) {
          this.situationTypeOptions = res.data
        }
      })
      //结算类型
      initDictOptions('settlementType').then((res) => {
        if (res.code === 200) {
          this.settleTypeOptions = res.data
        }
      })
      // 状态
      initDictOptions('Insurance_record_status').then((res) => {
        if (res.code === 200) {
          this.statusOptions = res.data
        }
      })
    },

    removeFile(fileInfo) {
      const _this = this
      this.$confirm({
        title: '删除',
        content: '确定删除该附件？',
        okText: '确认',
        cancelText: '取消',
        onOk: function () {
          httpAction(_this.url.delAttachUrl + fileInfo.uid, null, 'get').then((res) => {
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
        },
      })
      return false
    },
    //上传
    handleChange() {
      const { fileList } = this
      if (fileList[fileList.length - 1].name.length > 50) {
        this.$message.warning(fileList[fileList.length - 1].name + `文件名称长度超过50个字符`)
        this.fileList.splice(this.fileList.length - 1, 1)
        return false
      }
      if (fileList[fileList.length - 1].size > 50 * 1024 * 1024) {
        this.$message.warning(fileList[fileList.length - 1].name + `文件大小超过50M`)
        this.fileList.splice(this.fileList.length - 1, 1)
        return false
      }
      if (!/\.(gif|jpg|jpeg|png|xls|xlsx|csv|pdf|docx|doc|m4a|zip|rar)$/i.test(fileList[fileList.length - 1].name)) {
        this.$message.warning(fileList[fileList.length - 1].name + `文件格式不正确`)
        this.fileList.splice(this.fileList.length - 1, 1)
        return false
      }
      this.confirmLoading = true
      this.uploadFilesChange(fileList[fileList.length - 1])
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    uploadFilesChange(file) {
      // 上传图片
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', this.flag)
      formData.append('domainId', this.id)
      let contextType = { 'Content-Type': 'multipart/form-data' }
      this.fileList.splice(this.fileList.length - 1, 1)
      postActionHeader(this.url.importUrl, formData, contextType, 300000)
        .then((res) => {
          if (res.code == 200) {
            this.fileList.push(res.data)
            this.$message.success(`上传成功`)
          } else {
            this.$message.warning(res.msg)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
  },
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

.dialogBig .ant-card-wider-padding .ant-card-body {
  padding: 0px 5% !important;
}
.ant-skeleton-title {
  width: 50% !important;
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
  color: #1890ff;
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
  padding-right: 20px;
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
.detailTable {
  width: 100%;
  border: 1px solid #c1c1c1;
  margin: 20px 0px;
}
.detailTable tr {
  height: 30px;
  line-height: 30px;
}
.detailTable tr td {
  width: 266.6px;
}

.detailTable tr.label {
  width: 100px;
}
.detailTable td {
  border: 1px solid #c1c1c1;
}
.detailTable td label {
  margin: 0px 10px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}
.social {
  width: 100%;
  border: 1px solid #c1c1c1;
  margin: 20px 0px;
}
.social tr {
  height: 30px;
  line-height: 30px;
}
.social td {
  border: 1px solid #c1c1c1;
  text-align: center;
  padding: 8px;
}
.social th {
  text-align: center;
  padding: 8px;
}
.social td.tit {
  font-weight: bold;
}
</style>

