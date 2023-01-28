<template>
  <a-modal
    :title="title"
    :width="900"
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
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="详情">
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
                  <label>社会保险</label>
                  <span>{{ socialStatus[model.socialStatus] }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>结算主体</label>
                  <span>{{ departName }}</span>
                </td>
                <td>
                  <label>业务类型</label>
                  <span>{{ businessTypeName }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>风险承担</label>
                  <span>{{ model.riskBearName }}</span>
                </td>
                <td>
                  <label>事件类型</label>
                  <span>{{ model.eventTypeName }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <label>商业保险</label>
                  <span>{{ model.insuranceStr || '未购买' }}</span>
                </td>
                <td>
                  <label>社保参保地</label>
                  <span v-if="model.provinceName">{{ model.provinceName }} {{ model.cityName }} {{ model.townName }}</span>
                  <span v-else>暂无</span>
                </td>
              </tr>
              <tr>
                <td>
                  <label>伤残等级</label>
                  <span>{{ model.disabilityLevel }}</span>
                </td>
                <td colspan="2">
                  <label>劳动合同期限</label>
                  <span v-if="model.contractStart">{{ model.contractStart }} ~ {{ model.contractEnd }}</span>
                </td>
              </tr>
            </table>
            <a-divider>事件信息</a-divider>
            <table class="detailTable">
              <tr v-if="isRetired">
                <td>
                  <label>事件发生时间</label>
                  <span>{{ moment(model.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                </td>
                <td>
                  <label>事件类别</label>
                  <span>{{ eventTypeName || '' }}</span>
                </td>
              </tr>
              <tr v-if="isNonwork">
                <td>
                  <label>事件编码</label>
                  <span>{{ model.eventCode }}</span>
                </td>
                <td>
                  <label>事件发生时间</label>
                  <span>{{ moment(model.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                </td>
                <td>
                  <label>事件发生地点</label>
                  <span>{{ model.eventOccurrenceAddr }}</span>
                </td>
              </tr>
              <tr v-if="isNonwork">
                <td>
                  <label>伤害部位</label>
                  <span>{{ model.injuryPosition }}</span>
                </td>
                <td>
                  <label>是否治疗</label>
                  <span>{{ isCuringOtion[model.isCuring] }}</span>
                </td>
                <td>
                  <label>治疗类型</label>
                  <span>{{ curingTypeName }}</span>
                </td>
              </tr>
              <tr v-if="isNonwork">
                <td>
                  <label>就诊医院</label>
                  <span>{{ model.curingHospital }}</span>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colspan="3">
                  <label>事件发生经过</label>
                  <span>{{ model.eventThrough }}</span>
                </td>
              </tr>
            </table>
            <a-divider>方案意见</a-divider>
            <table class="detailTable">
              <tr>
                <td colspan="3">
                  <label>赔付方案</label>
                  <span>{{ model.payPlan }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <label>客户意见</label>
                  <span>{{ model.customerOpinion }}</span>
                </td>
              </tr>
              <!-- <tr>
                <td colspan="3">
                  <label>部门/子分公司处理方案、意见</label>
                  <span>{{ model.organOpinion }}</span>
                </td>
              </tr> -->
              <tr v-if="replaceSpace(model.organOpinion)">
                <td colspan="3">
                  <label> {{ model.auditTwoMan ? '分公司负责人处理方案、意见' : '部门负责人处理方案、意见' }} </label>
                  <span>{{ model.organOpinion }}</span>
                </td>
              </tr>

              <tr v-if="replaceSpace(model.auditTwoOpinion)">
                <td colspan="3">
                  <label>大区总处理方案、意见</label>
                  <span>{{ model.auditTwoOpinion }}</span>
                </td>
              </tr>

              <tr v-if="replaceSpace(model.superviseOpinion)">
                <td colspan="3">
                  <label>督查办处理方案、意见</label>
                  <span>{{ model.superviseOpinion }}</span>
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
                @preview="preview"
                accept="image/*,.xls,.xlsx,.csv,.pdf,.doc,.docx,.m4a,.mp3,.zip,.rar"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">点击或者拖拽上传</p>
              </a-upload-dragger>

              <a-row class="mbot" v-if="fileList.length" style="margin-top: 15px">
                <a-col :span="2" :offset="1" style="margin-top: 10px">
                  <a-button type="primary" @click="downAll">一键打包下载</a-button>
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
            <a-row v-if="processList.length == 0">暂无记录</a-row>
            <a-row v-if="processList.length">
              <a-col :span="24">
                <a-steps direction="vertical" :current="processList.length - 1">
                  <a-step v-for="(item, index) in processList" :key="index" :title="item.operationTime">
                    <span slot="description">{{ item.operationUserName }} {{ item.nodeName }} 备注:{{ item.remark || '无' }}</span>
                  </a-step>
                </a-steps>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="4">
            <span slot="tab">
              过往发生事件
              <a-badge :count="record" />
            </span>
            <a-empty v-if="historyList.length == 0" description="暂无历史事件" />
            <a-tabs default-active-key="0" v-if="historyList.length">
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
                      <label>社会保险</label>
                      <span>{{ socialStatus[item.socialStatus] }}</span>
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
                      <label>风险承担</label>
                      <span>{{ item.riskBearName }}</span>
                    </td>
                    <td>
                      <label>事件类型</label>
                      <span>{{ filterDictText(eventTypeOptions, item.eventType) }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <label>商业保险</label>
                      <span>{{ item.insuranceStr || '未购买' }}</span>
                    </td>
                    <td>
                      <label>社保参保地</label>
                      <span v-if="item.provinceName">{{ item.provinceName }} {{ item.cityName }} {{ item.townName }}</span>
                      <span v-else>暂无</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>伤残等级</label>
                      <span>{{ item.disabilityLevel }}</span>
                    </td>
                    <td colspan="2">
                      <label>劳动合同期限</label>
                      <span>{{ item.contractStart }} ~ {{ item.contractEnd }}</span>
                    </td>
                  </tr>
                </table>
                <a-divider>事件信息</a-divider>
                <table class="detailTable">
                  <tr>
                    <td>
                      <label>事件发生时间</label>
                      <span>{{ moment(item.eventOccurrenceTime).format('YYYY-MM-DD') }}</span>
                    </td>
                    <td>
                      <label>事件发生地点</label>
                      <span>{{ item.eventOccurrenceAddr }}</span>
                    </td>
                    <td>
                      <label>伤害部位</label>
                      <span>{{ item.injuryPosition }}</span>
                    </td>
                  </tr>
                  <tr v-if="isNonwork">
                    <td>
                      <label>是否治疗</label>
                      <span>{{ isCuringOtion[item.isCuring] }}</span>
                    </td>
                    <td>
                      <label>治疗类型</label>
                      <span>{{ item.curingTypeName }}</span>
                    </td>
                    <td>
                      <label>就诊医院</label>
                      <span>{{ item.curingHospital }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <label>事件发生经过</label>
                      <span>{{ item.eventThrough }}</span>
                    </td>
                  </tr>
                </table>
                <a-divider>方案意见</a-divider>
                <table class="detailTable">
                  <tr>
                    <td colspan="3">
                      <label>赔付方案</label>
                      <span>{{ item.payPlan }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <label>客户意见</label>
                      <span>{{ item.customerOpinion }}</span>
                    </td>
                  </tr>
                  <!-- <tr>
                    <td colspan="3">
                      <label>部门/子分公司处理方案、意见</label>
                      <span>{{ item.organOpinion }}</span>
                    </td>
                  </tr> -->
                  <tr v-if="replaceSpace(item.organOpinion)">
                    <td colspan="3">
                      <label>
                        {{ item.auditTwoMan ? '分公司负责人处理方案、意见' : '部门负责人处理方案、意见' }}
                      </label>
                      <span>{{ item.organOpinion }}</span>
                    </td>
                  </tr>

                  <tr v-if="replaceSpace(item.auditTwoOpinion)">
                    <td colspan="3">
                      <label>大区总处理方案、意见</label>
                      <span>{{ item.auditTwoOpinion }}</span>
                    </td>
                  </tr>

                  <tr v-if="replaceSpace(item.superviseOpinion)">
                    <td colspan="3">
                      <label>督查办处理方案、意见</label>
                      <span>{{ item.superviseOpinion }}</span>
                    </td>
                  </tr>

                </table>
                <a-divider>材料附件</a-divider>
                <a-card :bordered="false">
                  <a-empty v-if="attachList[index] == null" description="暂无附件" />
                  <ul class="filelist" v-if="attachList[index] != null">
                    <li v-for="(items, indexs) in attachList[index]" :key="indexs" :value="items.id">
                      <span class="filename">{{ items.attaName }}</span>
                      <span class="down" @click="down(items)">下载</span>
                    </li>
                  </ul>
                </a-card>
              </a-tab-pane>
            </a-tabs>
          </a-tab-pane>
          <a-tab-pane key="6" tab="商险理赔" v-if="showFee">
            <handle-record ref="HandleRecordForm" :feeTypeOption="feeTypeOption" @ok="handleCancel"></handle-record>
          </a-tab-pane>

        </a-tabs>
      </div>

      <a-row class="dialogBottom" v-if="isOperate">
        <a-col :span="11" :offset="12">
          <a-button class="changeEventBtn" @click="operateDialog('event', true)" v-if="turnEvent">转为重大事件</a-button>
          <a-button class="accessBtn" @click="operateDialog('access', true)">审核通过</a-button>
          <a-button class="extraBtn" @click="operateDialog('extra', true)">待补充</a-button>
          <a-button class="backBtn" @click="operateDialog('back', true)">退回</a-button>
          <a-button @click="handleCancel">关闭</a-button>
        </a-col>
      </a-row>

      <a-row class="dialogBottom" v-if="isRetired">
        <a-col :span="11" :offset="12">
          <a-button class="changeEventBtn" @click="operateDialog('event', true)">转为重大事件</a-button>
          <a-button class="accessBtn" @click="operateDialog('access', true)">审核通过</a-button>
          <a-button class="extraBtn" @click="operateDialog('extra', true)">待补充</a-button>
          <a-button class="backBtn" @click="operateDialog('back', true)">退回</a-button>
          <a-button @click="handleCancel">关闭</a-button>
        </a-col>
      </a-row>

      <!--各种弹窗内容-->
      <a-modal
        title="转为重大事件"
        @ok="submitEvent"
        :visible="eventVisible"
        @cancel="operateDialog('event', false)"
        :confirmLoading="dialogConfirmLoading"
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
        @cancel="operateDialog('access', false)"
        :confirmLoading="dialogConfirmLoading"
        okText="确认"
        cancelText="关闭"
        :maskClosable="false"
        wrapClassName="wrapClass"
      >
        <!-- <p>确定通过审核，转交办理吗？</p> -->
        <a-form layout="vertical" :form="auditForm">
          <a-form-item label="审批意见">
            <a-textarea
              placeholder="请填写审批意见"
              v-decorator="['info', validatorRules.auditInfo]"
              rows="4"
            ></a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        title="待补充"
        @ok="handleExtra"
        :visible="extraVisible"
        @cancel="operateDialog('extra', false)"
        :confirmLoading="dialogConfirmLoading"
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

      <a-modal :visible="previewVisible" :footer="null" :width="'80%'" @cancel="handlePreviwCancel">
        <img alt="example" style="max-width: 100%" :src="previewImage" />
      </a-modal>
    </a-spin>
  </a-modal>
</template>
    
  
<script>
import { filterDict, filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
import { httpAction, downFile, postActionHeader } from '@/api/manage'
import { getNameFromTree, getNameFromArr } from '@/utils/common'
import HandleRecord from './HandleRecord'
import moment from 'moment'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: 'NonworkAuditModal',
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
      dialogConfirmLoading: false,
      isOperate: true,
      confirmLoading: false,
      isNonwork: true, //非因工事件信息显示
      turnEvent: true, //是否显示转重大
      isRetired: false, //退工事件信息显示
      eventTypeName: '', //事件类别
      auditStatus: '', //状态
      businessTypeDicts: [], //业务类型
      isCuringOtion: ['是', '否'], //是否治疗
      socialStatus: ['已购买，与劳动合同起始时间一致', '已购买，与劳动合同起始时间不一致', '未购买'],
      treatmentTypeOption: [], //治疗类型
      settleDomainOptions: [], //结算主体
      departName: '', //结算主体名称
      fileList: [], //附件列表
      employeeInfo: {}, //员工信息
      customerName: '', //客户单位
      businessTypeName: '', //业务类型名称
      curingTypeName: '', //治疗类型
      record: 0, //历史次数
      customerTreeData: [], //客户单位
      eventTypeOptions: [],
      organizationOption: [],
      historyList: [], //历史事件详情
      attachList: [], //历史事件附件
      sexOptions: [],
      previewVisible: false,
      previewImage: '',
      fileTypeOfOffice: ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf'],

      flag: 1,
      extraForm: this.$form.createForm(this),
      backForm: this.$form.createForm(this),
      auditForm: this.$form.createForm(this),
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
        auditInfo: {
          // 非空校验就不加了
          rules: [
            { required: true, message: '请填写审核意见!' },
            {
              max: 50,
              message: '审核意见最多50个字符!',
              // validator: (rule, value, callback) => {
              //   if(!value || value.trim().length === 0){
              //      callback(new Error("审核意见不能为空!"));
              //   }else if(value.trim().length > 50){
              //       callback(new Error("审核意见最多50个字符!"));
              //   }
              //   callback();
              // }
            },
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
        getDetailById: '/hrEmergency/tnonworkevent/', //获取当条记录详情
        getCustomerById: '/hrBase/tcustomerinfo/getCusNameAndBusinessType', //查询客户单位
        down: '/hrEmergency/fileUpload/ossFileZip/domain/', //一键下载
        getEmpInsurance: '/hrEmergency/tnonworkevent/insertInfo/', //查询员工社保商险基本情况
        extraUrl: '/hrEmergency/tnonworkevent/toSupplemented', //材料待补充
        backUrl: '/hrEmergency/tnonworkevent/back', //退回地址
        accessUrl: '/hrEmergency/tnonworkevent/auditPass', //审核通过
        getAttachUrl: '/hrEmergency/fileUpload/ossFileUrl/domain/', //获取附件列表
        toMajor: '/hrEmergency/tnonworkevent/toMajor/', //转为重大
        organization: '/admin/organizationinfo/getOrgForCus', //获取皖信组织架构
        delAttachUrl: '/hrEmergency/fileUpload/ossFileDelete/', //删除附件
        importUrl: '/hrEmergency/fileUpload/ossUploadFile', //上传附件
        getRecordUrl: '/hrEmergency/recordeventoperation/record', //获取记录
        getContractHistory: '/hrBase/temployeecontractinfo/getEmployeeContractByIdCard',
        getInsuranceHistory: '/busiInsurance/tbusinessinsurance/getVopage',
        getSocialByIdcard: '/hrSocial/tpaymentinfo/getSocialByIdCardAndmonth/',
        injuryClaims:'/hrEmergency/tdealinfo/record', //商险理赔记录
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
      isRequest: true,
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
      showFee: false,
      statusTxt: ''

    }
  },
  created() {
    this.initDictConfig()
    httpAction(`/admin/dict/getByParentId?parentId=1753`,null,'get').then(res=>{
      if(res.code === 200){
        this.feeTypeOption = res.data
      }
    })
  },
  methods: {
    moment,
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
    callback(key) {
      if (key == 2 && this.isRequest) {
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
      }

      if (key == 3 && this.processList.length == 0) {
        httpAction(this.url.getRecordUrl + '?id=' + this.id + '&type=1', null, 'get').then((res) => {
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

      if(key == 6){
        //获取记录
        httpAction(this.url.injuryClaims+'?id='+this.model.id+'&payMainType=1&type=1',null,'get').then((res)=>{
          if(res.code == 200){
            this.$refs.HandleRecordForm.status = this.statusTxt
            this.$refs.HandleRecordForm.show(this.model,res.data,1)
          }else{
            this.$message.warning(res.msg)
          }
        })
      }

    },
    replaceSpace(str){
      return str ? str.replace(/(^\s*)|(\s*$)/g,'') : ''
    },
    edit(record,show,status) {
      this.showFee = show ? true : false;
      this.statusTxt = status;
      this.model = Object.assign({ insurance: record.insurance }, record.nonWorkEvent)
      
      this.model.auditTwoOpinion = this.replaceSpace(this.model.auditTwoOpinion)
      this.model.organOpinion = this.replaceSpace(this.model.organOpinion)
      this.model.superviseOpinion = this.replaceSpace(this.model.superviseOpinion)

      this.id = record.nonWorkEvent.id
      this.visible = true
      this.model.insuranceStr = ''
      this.model.riskBearName =
        this.model.riskBear == 1
          ? getNameFromTree(this.customerTreeData, this.model.riskBearUnit, 'value', 'title')
          : getNameFromArr(this.organizationOption, this.model.riskBearOrgan, 'id', 'organName')
      httpAction(this.url.getinfo + this.model.empId, null, 'get').then((res) => {
        if (res.code == 200) {
          this.model.empSex = filterDictText(this.sexOptions, res.data.empSex)
        }
      })

      if (record.insurance) {
        //存在商险
        for (let item of record.insurance) {
          this.model.insuranceStr += ' ' + item.insuranceTypeName
        }
      }
      this.curingTypeName = filterDictText(this.treatmentTypeOption, this.model.curingType) //治疗类型
      // 结算主体
      this.departName = this.settleDomainOptions[this.model.emSettleId]
        ? this.settleDomainOptions[this.model.emSettleId].departName
        : ''
      //事件类型
      this.model.eventTypeName = filterDictText(this.eventTypeOptions, this.model.eventType)

      //查询客户单位合同相关信息
      httpAction(
        this.url.getCustomerById + '?cusId=' + this.model.emCusId + '&settleDomainId=' + this.model.emSettleId,
        null,
        'get'
      ).then((res) => {
        if (Number(res.code) === 200 && res.data) {
          this.customerName = res.data.cusName //客户单位
          this.businessTypeName = filterDict(this.businessTypeDicts, res.data.businessType)
        }
      })
      //获取历史次数
      httpAction(this.url.getEmpInsurance + this.model.empId + '?type=0', null, 'get').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          this.record = res.data.record
        }
      })
      this.fileList = []
      //获取附件信息
      httpAction(this.url.getAttachUrl + this.model.id + '?type=' + this.flag, null, 'get').then((res) => {
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
      const tabData = [
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
          label3: '社会保险',
          text3: this.socialStatus[this.model.socialStatus],
        },
        {
          label1: '结算主体',
          text1: this.departName,
          label2: '',
          text2: '',
          label3: '业务类型',
          text3: this.businessTypeName,
        },
        {
          label1: '风险承担',
          text1: this.model.riskBearName,
          label2: '',
          text2: '',
          label3: '事件类型',
          text3: this.model.eventTypeName,
        },
        {
          label1: '商业保险',
          text1: this.model.insuranceStr,
          label2: '',
          text2: '',
          label3: '社保参保地',
          text3: this.model.provinceName ? this.model.provinceName + this.model.cityName : '',
        },
        {
          label1: '伤残等级',
          text1: this.model.disabilityLevel || '',
          label2: '劳动合同期限',
          text2: this.model.contractStart ? `${this.model.contractStart}~${this.model.contractEnd}` : '',
          label3: '',
          text3: '',
        },
        { label1: '事件信息', text1: '', label2: '', text2: '', label3: '', text3: '' },
        {
          label1: '事件编码',
          text1: this.model.eventCode || '',
          label2: '事件发生时间',
          text2: moment(this.model.eventOccurrenceTime).format('YYYY-MM-DD'),
          label3: '事件发生地点',
          text3: this.model.eventOccurrenceAddr,
        },
        {
          label1: '伤害部位',
          text1: this.model.injuryPosition,
          label2: '是否治疗',
          text2: this.isCuringOtion[this.model.isCuring],
          label3: '治疗类型',
          text3: this.curingTypeName,
        },
        {
          label1: '就诊医院',
          text1: this.model.curingHospital || '',
          label2: '状态',
          text2: this.auditStatus.replace(/状态：/, ''),
          label3: '申报人',
          text3: this.model.reportUserName,
        },
        { label1: '申报时间', text1: this.model.reportDate, label2: '', text2: '', label3: '', text3: '' },
        { label1: '事件发生经过', text1: this.model.eventThrough, label2: '', text2: '', label3: '', text3: '' },
        { label1: '方案意见', text1: '', label2: '', text2: '', label3: '', text3: '' },
        { label1: '赔付方案', text1: this.model.payPlan, label2: '', text2: '', label3: '', text3: '' },
        { label1: '客户意见', text1: this.model.customerOpinion, label2: '', text2: '', label3: '', text3: '' },
        // {
        //   label1: '部门/子分公司处理方案、意见',
        //   text1: this.model.organOpinion,
        //   label2: '',
        //   text2: '',
        //   label3: '',
        //   text3: '',
        // },
        // { label1: '附件', text1: '', label2: '', text2: '', label3: '', text3: '' },
      ]


        // 第一个处理方案、意见
      if (this.model.organOpinion) {
        tabData.push({
          label1: this.model.auditTwoMan ? '分公司负责人处理方案、意见' : '部门负责人处理方案、意见',
          text1: this.model.organOpinion,
          label2: '',
          text2: '',
          label3: '',
          text3: '',
        })
      }

      if (this.model.auditTwoOpinion) {
        // 若是分公司审核时，需要添加大区总处理方案、意见
        tabData.push({
          label1: '大区总处理方案、意见',
          text1: this.model.auditTwoOpinion,
          label2: '',
          text2: '',
          label3: '',
          text3: '',
        })
      }

      if (this.model.superviseOpinion) {
        // 督查办意见
        tabData.push({
          label1: '督查办处理方案、意见',
          text1: this.model.superviseOpinion,
          label2: '',
          text2: '',
          label3: '',
          text3: '',
        })
      }

      tabData.push({ label1: '附件', text1: '', label2: '', text2: '', label3: '', text3: '' })

      this.fileList.forEach((item) => {
        tabData.push({ label1: item.name, text1: '', label2: '', text2: '', label3: '', text3: '' })
      })
      // 封面数据
      const excelDatas = [
        {
          tHeader: ['label1', 'text1', 'label2', 'text2', 'label3', 'text3'],
          filterVal: ['label1', 'text1', 'label2', 'text2', 'label3', 'text3'],
          tableDatas: tabData,
          sheetName: `非因工事件`,
        },
      ]
      this.json2excel(excelDatas, `非因工事件-${this.model.emName}`, true, 'xlsx', 1, this.fileList.length)
    },
    json2excel(tableJson, filenames, autowidth, bookTypes, type, typeLength) {
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
          autoLength: typeLength,
          type: type,
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
    //下载附件
    down(record) {
      window.open(record.attaSrc, '_blank')
      // window.open('https://view.officeapps.live.com/op/view.aspx?src='+record.attaSrc,"_blank");
    },
    history() {
      // if(this.record == 0){
      //   this.$message.warning('暂无历史事件');
      //   return false
      // }
      // this.operateDialog('history',true)
      const _this = this
      httpAction('/hrEmergency/tnonworkevent/old/' + this.model.empId, null, 'get').then((res) => {
        if (res.code == 200 && res.data) {
          // nonWorkEvent

          for (let [index, item] of res.data.entries()) {
            _this.$set(_this.historyList, index, item.nonWorkEvent)
            //获取附件
            httpAction(_this.url.getAttachUrl + item.nonWorkEvent.id + '?type=' + _this.flag, null, 'get').then(
              (result) => {
                _this.attachList[index] = result.data
              }
            )
            // _this.$set(_this.historyList[index],`curingTypeName`,filterDictText(this.treatmentTypeOption, item.nonWorkEvent.curingType)) //治疗类型
            _this.historyList[index].curingTypeName = filterDictText(
              this.treatmentTypeOption,
              item.nonWorkEvent.curingType
            ) //治疗类型
            // 结算主体
            _this.historyList[index].departName = this.settleDomainOptions[item.nonWorkEvent.emSettleId]
              ? this.settleDomainOptions[item.nonWorkEvent.emSettleId].departName
              : ''
            _this.historyList[index].riskBearName =
              item.nonWorkEvent.riskBear == 1
                ? getNameFromTree(this.customerTreeData, item.nonWorkEvent.riskBearUnit, 'value', 'title')
                : getNameFromArr(this.organizationOption, item.nonWorkEvent.riskBearOrgan, 'id', 'organName')

            //查询客户单位合同相关信息
            httpAction(
              this.url.getCustomerById +
                '?cusId=' +
                item.nonWorkEvent.emCusId +
                '&settleDomainId=' +
                item.nonWorkEvent.emSettleId,
              null,
              'get'
            ).then((ress) => {
              _this.$set(_this.historyList[index], `customerName`, ress.data.cusName)
              _this.$set(
                _this.historyList[index],
                `businessTypeName`,
                filterDict(this.businessTypeDicts, ress.data.businessType)
              )
            })
          }
        }
      })
    },
    downAll() {
      let httpurl = this.url.down + this.id + '?type=' + this.flag
      const _this = this
      downFile(httpurl, null).then((res) => {
        let data = res
        let fileReader = new FileReader()
        fileReader.onload = function () {
          try {
            let jsonData = JSON.parse(this.result)
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
            downloadElement.download = _this.model.emName + '的非因工材料附件' + '.zip' // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
          }
        }
        fileReader.readAsText(data)
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
    // 预览
    preview(file) {
      let fileExt = file.name.replace(/.+\./, '')
      if (this.fileTypeOfOffice.indexOf(fileExt) != -1) {
        window.open(
          `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.url || file.thumbUrl)}`,
          '_blank'
        )
      } else {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      }
    },
    handlePreviwCancel() {
      this.previewVisible = false
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
      this.auditForm.validateFields((err, values) => {
        if (!err) {
          this.dialogConfirmLoading = true
          httpAction(this.url.accessUrl + '?id=' + this.id + '&info=' + values.info, null, 'post')
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
      this.extraForm
        .validateFields((err, values) => {
          if (!err) {
            this.dialogConfirmLoading = true
            httpAction(this.url.extraUrl + '?id=' + this.id + '&info=' + values.info, null, 'post').then((res) => {
              if (Number(res.code) === 200) {
                this.$message.success('操作成功！')
                this.operateDialog('extra', false)
                this.handleCancel()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
        .finally(() => {
          this.dialogConfirmLoading = false
        })
    },
    handleCancel() {
      this.close()
    },
    close() {
      if (this.isOperate || this.isRetired) {
        this.$emit('ok')
      }
      this.historyList = []
      this.processList = []
      this.customerName = this.businessTypeName = this.curingTypeName = this.auditStatus = ''
      this.visible = false
      this.turnEvent = true
      this.statusTxt = ''
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
    initDictConfig() {
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
  width: 200px;
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

