<template>
  <a-modal
    :title="title"
    :width="1100"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    style="top: 20px;"
    cancelText="关闭"
    class="ant-modal_detail"
    :maskClosable="false"
    :destroyOnClose="true"

  >
    <page-layout
      :title="employeeInfo.empName"
      logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"
    >
      <a-tabs
        default-active-key="1"
        @change="tabsClickCallback"
        :activeKey="baseActiveTabKey"
      >
        <a-tab-pane
          key="1"
          tab="基本信息"
        >
          <a-card :bordered="false">
            <detail-list>
              <detail-list-item term="身份证号">{{ employeeInfo.empIdcard ? employeeInfo.empIdcard : '-' }}</detail-list-item>
              <detail-list-item term="身份证有效期">{{ employeeInfo.empIdcardValidity ? employeeInfo.empIdcardValidity : '-' }}</detail-list-item>
              <detail-list-item term="性别">{{ employeeInfo.empSex ? employeeInfo.empSex : '-' }}</detail-list-item>
              <detail-list-item term="年龄">{{ employeeInfo.empAge ? employeeInfo.empAge : '-' }}</detail-list-item>
              <detail-list-item term="出生日期">{{ employeeInfo.empBirthday ? (employeeInfo.empBirthday).substring(0, 10) : '-' }}</detail-list-item>
              <detail-list-item term="婚姻状况">{{ employeeInfo.empMarriStatu ? employeeInfo.empMarriStatu : '-' }}</detail-list-item>
              <detail-list-item term="民族">{{ employeeInfo.empNational ? employeeInfo.empNational : '-' }}</detail-list-item>
              <detail-list-item term="政治面貌">{{ employeeInfo.politicalStatus ? employeeInfo.politicalStatus : '-' }}</detail-list-item>
              <detail-list-item term="E-Mail">{{ employeeInfo.empEmail ? employeeInfo.empEmail : '-' }}</detail-list-item>
              <detail-list-item term="QQ">{{ employeeInfo.empQq ? employeeInfo.empQq : '-' }}</detail-list-item>
              <detail-list-item term="联系方式">{{ employeeInfo.empPhone ? employeeInfo.empPhone : '-' }}</detail-list-item>
              <detail-list-item term="员工类型">{{ employeeInfo.empType ? employeeInfo.empType : '-' }}</detail-list-item>
              <detail-list-item term="结算主体">{{ employeeInfo.settleDomain ? employeeInfo.settleDomain : '-' }}</detail-list-item>
              <detail-list-item term="所属单位">{{ employeeInfo.belongUnit ? employeeInfo.belongUnit : '-' }}</detail-list-item>
              <detail-list-item term="就职班组">{{ employeeInfo.inauguralTeam ? employeeInfo.inauguralTeam : '-' }}</detail-list-item>
              <detail-list-item term="工时制">{{ employeeInfo.workingHours }}</detail-list-item>
              <detail-list-item term="就职岗位">{{ employeeInfo.post ? employeeInfo.post : '-' }}</detail-list-item>
              <detail-list-item term="电信编号">{{ employeeInfo.telecomNumber ? employeeInfo.telecomNumber : '-' }}</detail-list-item>
              <detail-list-item term="户口性质">{{ employeeInfo.empRegisType ? employeeInfo.empRegisType : '-' }}</detail-list-item>
              <detail-list-item term="开户行">{{ employeeInfo.empBankName ? employeeInfo.empBankName : '-' }}</detail-list-item>
              <detail-list-item term="银行卡号">{{ employeeInfo.empBankNo ? employeeInfo.empBankNo : '-' }}</detail-list-item>
              <detail-list-item term="员工标签">{{ employeeInfo.empLabel ? employeeInfo.empLabel : '-' }}</detail-list-item>
              <detail-list-item term="入职日期">{{ employeeInfo.enjoinDate ? employeeInfo.enjoinDate : '-' }}</detail-list-item>
              <detail-list-item term="试用期">{{ employeeInfo.tryPeriod ? employeeInfo.tryPeriod + '个月' : '-' }}</detail-list-item>
              <detail-list-item term="计税月份">{{ employeeInfo.taxationMonth ? employeeInfo.taxationMonth : '-' }}</detail-list-item>
              <detail-list-item term="离职时间">{{ employeeInfo.leaveDate ? moment(employeeInfo.leaveDate,'YYYY-MM-DD H:i:s').format('YYYY-MM-DD') : '-' }}</detail-list-item>
              <detail-list-item term="离职原因">{{ employeeInfo.leaveReason ? employeeInfo.leaveReason : '-' }}</detail-list-item>
              <detail-list-item term="离职备注">{{ employeeInfo.leaveRemark ? employeeInfo.leaveRemark : '-' }}</detail-list-item>
              <detail-list-item term="身份证地址">
                {{ ((idAreaName = getAreaName(employeeInfo.idProvince, employeeInfo.idCity, employeeInfo.idTown, '')) || employeeInfo.idcardAddr) ?
                  (idAreaName + (employeeInfo.idcardAddr ? employeeInfo.idcardAddr : '')) : '-' }}
              </detail-list-item>
              <detail-list-item term="档案所在地">
                {{ ((fileAreaName = getAreaName(employeeInfo.fileProvince, employeeInfo.fileCity, employeeInfo.fileTown, '')) || employeeInfo.fileAddr) ?
                  (fileAreaName + (employeeInfo.fileAddr ? employeeInfo.fileAddr : '')) : '-' }}
              </detail-list-item>
              <detail-list-item term="承包商名称">{{ employeeInfo.contractorName ? employeeInfo.contractorName : '-' }}</detail-list-item>
              <detail-list-item term="备注">{{ employeeInfo.remark ? employeeInfo.remark : '-' }}</detail-list-item>
            </detail-list>
          </a-card>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="调基记录"
        >
          <a-card :bordered="false">
            <detail-list style="margin-bottom:20px">
              <detail-list-item term="调基时间">{{ currentBaseRecordData.createDate ? (currentBaseRecordData.createDate).substring(0, 10) : '-' }}</detail-list-item>
              <detail-list-item term="调基类型">{{ baseRecordType[currentBaseRecordData.paymentType] || '-' }}</detail-list-item>
              <detail-list-item term="调基人">{{ currentBaseRecordData.createUserName?currentBaseRecordData.createUserName:'-' }}</detail-list-item>
            </detail-list>
            <a-table
              :columns="modalationColumns"
              :dataSource="modulationRrecordDataSource"
              :pagination="false"
            ></a-table>

            <div class="basePaginationWrap">
              <a-pagination
                :current="basePageCurrent"
                :total="basePageTotal"
                :defaultPageSize="1"
                :hideOnSinglePage="true"
                @change="basePaginationChanged"
              />
            </div>
          </a-card>
        </a-tab-pane>
      </a-tabs>

      <a-card
        :bordered="false"
        title="附属信息"
      ></a-card>

      <!-- 员工附属信息 -->
      <a-card
        style="margin-top: 24px"
        :bordered="false"
        :tabList="tabList"
        :activeTabKey="activeTabKey"
        @tabChange="tabChange"
      >
        <!-- tab1 合同信息 -->
        <a-table
          v-if="activeTabKey === '1'"
          rowKey="id"
          :columns="employeeContractColumns"
          :dataSource="employeeContractList"
          :scroll="{x:1200}"
        >
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="handleContractDetail(record)">
              <a-tag color="blue">详情</a-tag>
            </a>
          </span>

          <!-- 列缩放隐藏模板 -->
          <template
            v-for="(defineColumn, key) in defineColumns"
            :slot="key"
            slot-scope="text, record"
          >
            <span
              :key="key"
              :style="handleColumnStyle(defineColumn.width)"
            >
              <!-- 结算主体或者单位 -->
              <a-tooltip
                v-if="defineColumn.type=='settle'"
                placement="topLeft"
                :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[key])) ?
                  (defineColumn.options)[record[key]][defineColumn.name] : '-'"
              >{{ tipTitle }}</a-tooltip>
              <!-- 字典数据 -->
              <a-tooltip
                v-else-if="defineColumn.type=='dict'"
                placement="topLeft"
                :title="filterDictText(defineColumn.options, record[key])"
              >{{ filterDictText(defineColumn.options, record[key]) }}</a-tooltip>
              <!-- 标签数据 -->
              <template
                v-else-if="defineColumn.type=='tag'"
                v-for="(item, tagKey) in defineColumn.options"
              >
                <a-tag
                  :key="tagKey"
                  v-if="record[key] == tagKey"
                  :color="item.color"
                >{{ item.option }}</a-tag>
              </template>
              <!-- 普通数据 -->
              <a-tooltip
                v-else
                placement="topLeft"
                :title="record[key] ? record[key] : '-'"
              >{{ record[key] ? record[key] : '-' }}</a-tooltip>
            </span>
          </template>
        </a-table>
        <!-- tab2 家庭信息 -->
        <a-table
          v-if="activeTabKey === '2'"
          rowKey="id"
          :columns="employeeFamilyColumns"
          :dataSource="employeeFamilyList"
        >
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="handleFamilyDetail(record)">
              <a-tag color="blue">详情</a-tag>
            </a>
          </span>

          <!-- 列缩放隐藏模板 -->
          <template
            v-for="(defineColumn, key) in defineColumns"
            :slot="key"
            slot-scope="text, record"
          >
            <span
              :key="key"
              :style="handleColumnStyle(defineColumn.width)"
            >
              <!-- 结算主体或者单位 -->
              <a-tooltip
                v-if="defineColumn.type=='settle'"
                placement="topLeft"
                :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[key])) ?
                  (defineColumn.options)[record[key]][defineColumn.name] : '-'"
              >{{ tipTitle }}</a-tooltip>
              <!-- 字典数据 -->
              <a-tooltip
                v-else-if="defineColumn.type=='dict'"
                placement="topLeft"
                :title="filterDictText(defineColumn.options, record[key])"
              >{{ filterDictText(defineColumn.options, record[key]) }}</a-tooltip>
              <!-- 标签数据 -->
              <template
                v-else-if="defineColumn.type=='tag'"
                v-for="(item, tagKey) in defineColumn.options"
              >
                <a-tag
                  :key="tagKey"
                  v-if="record[key] == tagKey"
                  :color="item.color"
                >{{ item.option }}</a-tag>
              </template>
              <!-- 普通数据 -->
              <a-tooltip
                v-else
                placement="topLeft"
                :title="record[key] ? record[key] : '-'"
              >{{ record[key] ? record[key] : '-' }}</a-tooltip>
            </span>
          </template>
        </a-table>
        <!-- tab3 工作记录 -->
        <a-table
          v-if="activeTabKey === '3'"
          rowKey="id"
          :columns="employeeWorkColumns"
          :dataSource="employeeWorkList"
        >
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="handleWorkDetail(record)">
              <a-tag color="blue">详情</a-tag>
            </a>
          </span>

          <!-- 列缩放隐藏模板 -->
          <template
            v-for="(defineColumn, key) in defineColumnsOfWork"
            :slot="key"
            slot-scope="text, record"
          >
            <span
              :key="key"
              :style="handleColumnStyle(defineColumn.width)"
            >
              <!-- 结算主体或者单位 -->
              <a-tooltip
                v-if="defineColumn.type=='settle'"
                placement="topLeft"
                :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[key])) ?
                  (defineColumn.options)[record[key]][defineColumn.name] : '-'"
              >{{ tipTitle }}</a-tooltip>
              <!-- 字典数据 -->
              <a-tooltip
                v-else-if="defineColumn.type=='dict'"
                placement="topLeft"
                :title="filterDictText(defineColumn.options, record[key])"
              >{{ filterDictText(defineColumn.options, record[key]) }}</a-tooltip>
              <!-- 标签数据 -->
              <template
                v-else-if="defineColumn.type=='tag'"
                v-for="(item, tagKey) in defineColumn.options"
              >
                <a-tag
                  :key="tagKey"
                  v-if="record[key] == tagKey"
                  :color="item.color"
                >{{ item.option }}</a-tag>
              </template>
              <!-- 普通数据 -->
              <a-tooltip
                v-else
                placement="topLeft"
                :title="record[key] ? record[key] : '-'"
              >{{ record[key] ? record[key] : '-' }}</a-tooltip>
            </span>
          </template>
        </a-table>
        <!-- tab4 学历信息 -->
        <a-table
          v-if="activeTabKey === '4'"
          rowKey="id"
          :columns="employeeEducationColumns"
          :dataSource="employeeEducationList"
        >
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="handleEducationDetail(record)">
              <a-tag color="blue">详情</a-tag>
            </a>
          </span>

          <!-- 列缩放隐藏模板 -->
          <template
            v-for="(defineColumn, key) in defineColumns"
            :slot="key"
            slot-scope="text, record"
          >
            <span
              :key="key"
              :style="handleColumnStyle(defineColumn.width)"
            >
              <!-- 结算主体或者单位 -->
              <a-tooltip
                v-if="defineColumn.type=='settle'"
                placement="topLeft"
                :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[key])) ?
                  (defineColumn.options)[record[key]][defineColumn.name] : '-'"
              >{{ tipTitle }}</a-tooltip>
              <!-- 字典数据 -->
              <a-tooltip
                v-else-if="defineColumn.type=='dict'"
                placement="topLeft"
                :title="filterDictText(defineColumn.options, record[key])"
              >{{ filterDictText(defineColumn.options, record[key]) }}</a-tooltip>
              <!-- 标签数据 -->
              <template
                v-else-if="defineColumn.type=='tag'"
                v-for="(item, tagKey) in defineColumn.options"
              >
                <a-tag
                  :key="tagKey"
                  v-if="record[key] == tagKey"
                  :color="item.color"
                >{{ item.option }}</a-tag>
              </template>
              <!-- 普通数据 -->
              <a-tooltip
                v-else
                placement="topLeft"
                :title="record[key] ? record[key] : '-'"
              >{{ record[key] ? record[key] : '-' }}</a-tooltip>
            </span>
          </template>
        </a-table>
        <!-- tab5 伤残信息 -->
        <a-table
          v-if="activeTabKey === '5'"
          rowKey="id"
          :columns="employeeDisabilityColumns"
          :dataSource="employeeDisabilityList"
        >
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="handleDisabilityDetail(record)">
              <a-tag color="blue">详情</a-tag>
            </a>
          </span>

          <!-- 列缩放隐藏模板 -->
          <template
            v-for="(defineColumn, key) in defineColumns"
            :slot="key"
            slot-scope="text, record"
          >
            <span
              :key="key"
              :style="handleColumnStyle(defineColumn.width)"
            >
              <!-- 结算主体或者单位 -->
              <a-tooltip
                v-if="defineColumn.type=='settle'"
                placement="topLeft"
                :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[key])) ?
                  (defineColumn.options)[record[key]][defineColumn.name] : '-'"
              >{{ tipTitle }}</a-tooltip>
              <!-- 字典数据 -->
              <a-tooltip
                v-else-if="defineColumn.type=='dict'"
                placement="topLeft"
                :title="filterDictText(defineColumn.options, record[key])"
              >{{ filterDictText(defineColumn.options, record[key]) }}</a-tooltip>
              <!-- 标签数据 -->
              <template
                v-else-if="defineColumn.type=='tag'"
                v-for="(item, tagKey) in defineColumn.options"
              >
                <a-tag
                  :key="tagKey"
                  v-if="record[key] == tagKey"
                  :color="item.color"
                >{{ item.option }}</a-tag>
              </template>
              <!-- 普通数据 -->
              <a-tooltip
                v-else
                placement="topLeft"
                :title="record[key] ? record[key] : '-'"
              >{{ record[key] ? record[key] : '-' }}</a-tooltip>
            </span>
          </template>
        </a-table>
        <!-- tab6 职业资格 -->
        <a-table
          v-if="activeTabKey === '6'"
          rowKey="id"
          :columns="employeeProfessionalQualificationColumns"
          :dataSource="employeeProfessionalQualificationList"
        >
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="handleProfessionalQualificationDetail(record)">
              <a-tag color="blue">详情</a-tag>
            </a>
          </span>

          <!-- 列缩放隐藏模板 -->
          <template
            v-for="(defineColumn, key) in defineColumns"
            :slot="key"
            slot-scope="text, record"
          >
            <span
              :key="key"
              :style="handleColumnStyle(defineColumn.width)"
            >
              <!-- 结算主体或者单位 -->
              <a-tooltip
                v-if="defineColumn.type=='settle'"
                placement="topLeft"
                :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[key])) ?
                  (defineColumn.options)[record[key]][defineColumn.name] : '-'"
              >{{ tipTitle }}</a-tooltip>
              <!-- 字典数据 -->
              <a-tooltip
                v-else-if="defineColumn.type=='dict'"
                placement="topLeft"
                :title="filterDictText(defineColumn.options, record[key])"
              >{{ filterDictText(defineColumn.options, record[key]) }}</a-tooltip>
              <!-- 标签数据 -->
              <template
                v-else-if="defineColumn.type=='tag'"
                v-for="(item, tagKey) in defineColumn.options"
              >
                <a-tag
                  :key="tagKey"
                  v-if="record[key] == tagKey"
                  :color="item.color"
                >{{ item.option }}</a-tag>
              </template>
              <!-- 普通数据 -->
              <a-tooltip
                v-else
                placement="topLeft"
                :title="record[key] ? record[key] : '-'"
              >{{ record[key] ? record[key] : '-' }}</a-tooltip>
            </span>
          </template>
        </a-table>
        <!-- tab7 社保信息 -->
        <template v-if="activeTabKey === '7'">
          <a-form
            v-if="showSocial && socialData.handleStatus != 2"
            :form="socialForm"
            layout="inline"
            class="ant-form-detail"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="办理状态"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="socialData ? handleStatusOption[socialData.handleStatus] : '-'"
                  >{{ socialData ? handleStatusOption[socialData.handleStatus] : '-' }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="派减日期"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="socialData.socialReduceDate ? (socialData.socialReduceDate).substring(0, 10) : ''"
                  >{{ socialData.socialReduceDate ? (socialData.socialReduceDate).substring(0, 10) : '' }}</a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider
              dashed
              style="margin: 0px;"
            />
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="社保户"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="socialData.socialHouseholdName ? socialData.socialHouseholdName : '-'"
                  >{{ socialData.socialHouseholdName ? socialData.socialHouseholdName : '-' }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="社保缴纳地"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(socialName = getAreaName(socialData.socialProvince, socialData.socialCity, socialData.socialTown)) ? socialName : '-'"
                  >{{ socialName ? socialName : '-' }}</a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="社保起缴日期"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="socialData.socialStartDate ? (socialData.socialStartDate).substring(0, 10) : '-'"
                  >{{ socialData.socialStartDate ? (socialData.socialStartDate).substring(0, 10) : '-' }}</a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" v-if="insuranceTypeStatus.pensionHandle == '1'">
                <a-form-item
                  label="单位养老"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="dwyl = '基数：' + socialData.unitPensionCardinal + ' 比例：' + socialData.unitPensionPer + ' 金额：' + socialData.unitPersionMoney +' 起缴日期：'+ (socialData.pensionStart ? (socialData.pensionStart).substring(0, 10) : '-')"
                  >{{ dwyl }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="insuranceTypeStatus.medicalHandle == '1'">
                <a-form-item
                  label="单位医疗"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="dwyll = '基数：' + socialData.unitMedicalCardinal + ' 比例：' + socialData.unitMedicalPer + ' 金额：' + socialData.unitMedicalMoney+' 起缴日期：'+ (socialData.medicalStart ? (socialData.medicalStart).substring(0, 10) : '-')"
                  >{{ dwyll }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="insuranceTypeStatus.unemployHandle == '1'">
                <a-form-item
                  label="单位失业"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="dwsy = '基数：' + socialData.unitUnemploymentCardinal + ' 比例：' + socialData.unitUnemploymentPer + ' 金额：' + socialData.unitUnemploymentMoney+' 起缴日期：'+ (socialData.unemployStart ? (socialData.unemployStart).substring(0, 10) : '-')"
                  >{{ dwsy }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="insuranceTypeStatus.workInjuryHandle == '1'">
                <a-form-item
                  label="单位工伤"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="dwgs = '基数：' + socialData.unitWorkInjuryCardinal + ' 比例：' + socialData.unitWorkUnjuryPer + ' 金额：' + socialData.unitInjuryMoney+' 起缴日期：'+ (socialData.workInjuryStart ? (socialData.workInjuryStart).substring(0, 10) : '-')"
                  >{{ dwgs }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="insuranceTypeStatus.birthHandle == '1'">
                <a-form-item
                  label="单位生育"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="dwsy = '基数：' + socialData.unitBirthCardinal + ' 比例：' + socialData.unitBirthPer + ' 金额：' + socialData.unitBirthMoney+' 起缴日期：'+ (socialData.birthStart ? (socialData.birthStart).substring(0, 10) : '-')"
                  >{{ dwsy }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="insuranceTypeStatus.bigailmentHandle == '1'">
                <a-form-item
                  label="单位大病"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="dwdb = socialData.unitBigailmentCardinal ?
                      ('基数：' + socialData.unitBigailmentCardinal + ' 比例：' + socialData.unitBigailmentPer + ' 金额：' + socialData.unitBigailmentMoney) :
                      ('金额：' + socialData.unitBigailmentMoney) +' 起缴日期：'+ (socialData.bigailmentStart ? (socialData.bigailmentStart).substring(0, 10) : '-')"
                  >
                    {{ dwdb }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="insuranceTypeStatus.pensionHandle == '1'">
                <a-form-item
                  label="个人养老"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="'基数：' + socialData.personalPensionCardinal + ' 比例：' + socialData.personalPensionPer + ' 金额：' + socialData.personalPersionMoney"
                  >{{ '基数：' + socialData.personalPensionCardinal + ' 比例：' + socialData.personalPensionPer + ' 金额：' + socialData.personalPersionMoney }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="insuranceTypeStatus.medicalHandle == '1'">
                <a-form-item
                  label="个人医疗"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="'基数：' + socialData.personalMedicalCardinal + ' 比例：' + socialData.personalMedicalPer + ' 金额：' + socialData.personalMedicalMoney"
                  >{{ '基数：' + socialData.personalMedicalCardinal + ' 比例：' + socialData.personalMedicalPer + ' 金额：' + socialData.personalMedicalMoney }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="insuranceTypeStatus.unemployHandle == '1'">
                <a-form-item
                  label="个人失业"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="'基数：' + socialData.personalUnemploymentCardinal + ' 比例：' + socialData.personalUnemploymentPer + ' 金额：' + socialData.personalUnemploymentMoney"
                  >{{ '基数：' + socialData.personalUnemploymentCardinal + ' 比例：' + socialData.personalUnemploymentPer + ' 金额：' + socialData.personalUnemploymentMoney }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="insuranceTypeStatus.bigailmentHandle == '1'">
                <a-form-item
                  label="个人大病"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="socialData.personalBigailmentCardinal ?
                      ('基数：' + socialData.personalBigailmentCardinal + ' 比例：' + socialData.personalBigailmentPer + ' 金额：' + socialData.personalBigailmentMoney) :
                      ('金额：' + socialData.personalBigailmentMoney)"
                  >
                    {{ socialData.personalBigailmentCardinal ?
                      ('基数：' + socialData.personalBigailmentCardinal + ' 比例：' + socialData.personalBigailmentPer + ' 金额：' + socialData.personalBigailmentMoney) :
                      ('金额：' + socialData.personalBigailmentMoney) }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <template v-else>
            <section class="code-box-demo">
              <div class="ant-empty">
                <div class="ant-empty-image">
                  <img
                    alt="暂无数据"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                  />
                </div>
                <p class="ant-empty-description">暂无社保数据</p>
              </div>
            </section>
          </template>
        </template>
        <!-- tab8 公积金 -->
        <template v-if="activeTabKey === '8'">
          <a-form
            v-if="showFund"
            :form="fundForm"
            layout="inline"
            class="ant-form-detail"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="办理状态"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="fundData ? handleStatusOption[fundData.handleStatus] : '-'"
                  >{{ fundData ? handleStatusOption[fundData.handleStatus] : '-' }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="派减日期"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="fundData.fundReduceDate ? (fundData.fundReduceDate).substring(0, 10) : ''"
                  >{{ fundData.fundReduceDate ? (fundData.fundReduceDate).substring(0, 10) : '' }}</a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider
              dashed
              style="margin: 0px;"
            />
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="公积金户"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="fundData.providentHouseholdName ? fundData.providentHouseholdName : '-'"
                  >{{ fundData.providentHouseholdName ? fundData.providentHouseholdName : '-' }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="公积金缴纳地"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="(fundName = getAreaName(fundData.fundProvince, fundData.fundCity, fundData.fundTown)) ? fundName : '-'"
                  >{{ fundName ? fundName : '-' }}</a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="公积金起缴日期"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="fundData.providentStart ? (fundData.providentStart).substring(0, 10) : '-'"
                  >{{ fundData.providentStart ? (fundData.providentStart).substring(0, 10) : '-' }}</a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="单位公积金"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="'基数：' + fundData.unitProvidengCardinal + ' 比例：' + fundData.unitProvidentPer + ' 金额：' + fundData.unitProvidentFee"
                  >{{ '基数：' + fundData.unitProvidengCardinal + ' 比例：' + fundData.unitProvidentPer + ' 金额：' + fundData.unitProvidentFee }}</a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="个人公积金"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="'基数：' + fundData.personalProvidentCardinal + ' 比例：' + fundData.personalProvidentPer + ' 金额：' + fundData.personalProvidentFee"
                  >{{ '基数：' + fundData.personalProvidentCardinal + ' 比例：' + fundData.personalProvidentPer + ' 金额：' + fundData.personalProvidentFee }}</a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <template v-else>
            <section class="code-box-demo">
              <div class="ant-empty">
                <div class="ant-empty-image">
                  <img
                    alt="暂无数据"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                  />
                </div>
                <p class="ant-empty-description">暂无公积金数据</p>
              </div>
            </section>
          </template>
        </template>
        <!-- tab9 缴费库 -->
        <div v-if="activeTabKey === '9'">
          <a-table
            rowKey="id"
            :columns="paymentInfoColumns"
            :dataSource="paymentInfoList"
            v-if="showSocial || showFund"
          >
            <span
              slot="action"
              slot-scope="text, record"
            >
              <a @click="handlePaymentDetail(record)">
                <a-tag color="blue">详情</a-tag>
              </a>
            </span>
            <!-- 列缩放隐藏模板 -->
            <template
              v-for="(defineColumn, key) in defineColumns"
              :slot="key"
              slot-scope="text, record"
            >
              <span
                :key="key"
                :style="handleColumnStyle(defineColumn.width)"
              >
                <!-- 结算主体或者单位 -->
                <a-tooltip
                  v-if="defineColumn.type=='settle'"
                  placement="topLeft"
                  :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ?
                    (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-'">
                  {{ tipTitle }}
                </a-tooltip>
                <!-- 字典数据 -->
                <a-tooltip
                  v-else-if="defineColumn.type=='dict'"
                  placement="topLeft"
                  :title="filterDictText(defineColumn.options, record[key])"
                >{{ filterDictText(defineColumn.options, record[key]) }}</a-tooltip>
                <!-- 标签数据 -->
                <template
                  v-else-if="defineColumn.type=='tag'"
                  v-for="(item, tagKey) in defineColumn.options"
                >
                  <a-tag
                    :key="tagKey"
                    v-if="record[key] == tagKey"
                    :color="item.color"
                  >{{ item.option }}</a-tag>
                </template>
                <!-- 普通数据 -->
                <a-tooltip
                  v-else
                  placement="topLeft"
                  :title="record[key] ? record[key] : '-'"
                >{{ record[key] ? record[key] : '-' }}</a-tooltip>
              </span>
            </template>
            <!-- 社保结算 -->
            <span
              slot="socialSettlementFlag"
              slot-scope="text, record"
              :style="handleColumnStyle(90)"
            >
              <template v-if="record.socialSettlementId">
                <template v-for="(item, tagKey) in flagOptions">
                  <a-tag
                    :key="tagKey"
                    v-if="text == tagKey"
                    :color="item.color"
                  >{{ item.option }}</a-tag>
                </template>
              </template>
              <template v-else>-</template>
            </span>
            <!-- 公积金结算 -->
            <span
              slot="fundSettlementFlag"
              slot-scope="text, record"
              :style="handleColumnStyle(90)"
            >
              <template v-if="record.fundSettlementId">
                <template v-for="(item, tagKey) in flagOptions">
                  <a-tag
                    :key="tagKey"
                    v-if="text == tagKey"
                    :color="item.color"
                  >{{ item.option }}</a-tag>
                </template>
              </template>
              <template v-else>-</template>
            </span>
          </a-table>
          <template v-else>
            <section class="code-box-demo">
              <div class="ant-empty">
                <div class="ant-empty-image">
                  <img
                    alt="暂无数据"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                  />
                </div>
                <p class="ant-empty-description">暂无缴费库数据</p>
              </div>
            </section>
          </template>
        </div>
        <!-- tab10 变更记录 -->
        <a-table
          v-if="activeTabKey === '10'"
          rowKey="id"
          :columns="employeeProfessionalQualificationColumns"
          :dataSource="employeeProfessionalQualificationList"
        >
          <span
            slot="action"
            slot-scope="text, record"
          >
            <a @click="handleProfessionalQualificationDetail(record)">
              <a-tag color="blue">详情</a-tag>
            </a>
          </span>

          <!-- 列缩放隐藏模板 -->
          <template
            v-for="(defineColumn, key) in defineColumns"
            :slot="key"
            slot-scope="text, record"
          >
            <span
              :key="key"
              :style="handleColumnStyle(defineColumn.width)"
            >
              <!-- 结算主体或者单位 -->
              <a-tooltip
                v-if="defineColumn.type=='settle'"
                placement="topLeft"
                :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[key])) ?
                  (defineColumn.options)[record[key]][defineColumn.name] : '-'"
              >{{ tipTitle }}</a-tooltip>
              <!-- 字典数据 -->
              <a-tooltip
                v-else-if="defineColumn.type=='dict'"
                placement="topLeft"
                :title="filterDictText(defineColumn.options, record[key])"
              >{{ filterDictText(defineColumn.options, record[key]) }}</a-tooltip>
              <!-- 标签数据 -->
              <template
                v-else-if="defineColumn.type=='tag'"
                v-for="(item, tagKey) in defineColumn.options"
              >
                <a-tag
                  :key="tagKey"
                  v-if="record[key] == tagKey"
                  :color="item.color"
                >{{ item.option }}</a-tag>
              </template>
              <!-- 普通数据 -->
              <a-tooltip
                v-else
                placement="topLeft"
                :title="record[key] ? record[key] : '-'"
              >{{ record[key] ? record[key] : '-' }}</a-tooltip>
            </span>
          </template>
        </a-table>
        <!-- tab11 调动记录-->
        <a-table
          v-if="activeTabKey === '11'"
          rowKey="id"
          :columns="employeeMoveInfoColumns"
          :dataSource="employeeMoveInfoList"
        >
          <!-- 列缩放隐藏模板 -->
          <template
            v-for="(defineColumn, key) in defineColumns"
            :slot="key"
            slot-scope="text, record"
          >
            <span
              :key="key"
              :style="handleColumnStyle(defineColumn.width)"
            >
              <!-- 结算主体或者单位 -->
              <a-tooltip
                v-if="defineColumn.type=='settle'"
                placement="topLeft"
                :title="tipTitle = ((Object.keys(defineColumn.options).length) && (defineColumn.options).hasOwnProperty(record[defineColumn.key])) ?
                  (defineColumn.options)[record[defineColumn.key]][defineColumn.name] : '-'"
              >{{ tipTitle }}</a-tooltip>
              <!-- 字典数据 -->
              <a-tooltip
                v-else-if="defineColumn.type=='dict'"
                placement="topLeft"
                :title="filterDictText(defineColumn.options, record[key])"
              >{{ filterDictText(defineColumn.options, record[key]) }}</a-tooltip>
              <!-- 标签数据 -->
              <template
                v-else-if="defineColumn.type=='tag'"
                v-for="(item, tagKey) in defineColumn.options"
              >
                <a-tag
                  :key="tagKey"
                  v-if="record[key] == tagKey"
                  :color="item.color"
                >{{ item.option }}</a-tag>
              </template>
              <!-- 普通数据 -->
              <a-tooltip
                v-else
                placement="topLeft"
                :title="record[key] ? record[key] : '-'"
              >{{ record[key] ? record[key] : '-' }}</a-tooltip>
            </span>
          </template>
        </a-table>
      </a-card>
    </page-layout>

    <payment-detail-modal ref="paymentDetailModal"></payment-detail-modal>
    <employee-work-detail-modal ref="employeeWorkDetailModal"></employee-work-detail-modal>
    <employee-family-detail-modal ref="employeeFamilyDetailModal"></employee-family-detail-modal>
    <employee-contract-detail-modal ref="employeeContractDetailModal"></employee-contract-detail-modal>
    <employee-education-detail-modal ref="employeeEducationDetailModal"></employee-education-detail-modal>
    <employee-disability-detail-modal ref="employeeDisabilityDetailModal"></employee-disability-detail-modal>
    <employee-professional-qualification-detail-modal ref="employeeProfessionalQualificationDetailModal"></employee-professional-qualification-detail-modal>
  </a-modal>
</template>

<script>
import { getHouseHold } from '@/api/api'
import { httpAction } from '@/api/manage'
import { getAreaName } from '@/utils/common'
import { mixinDevice } from '@/utils/mixin.js'
import DepartList from '../../../system/DepartList'
import PageLayout from '@/components/page/PageLayout'
import DetailList from '@/components/tools/DetailList'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import PaymentDetailModal from './PaymentDetailModal'
import EmployeeWorkDetailModal from './EmployeeWorkDetailModal'
import EmployeeFamilyDetailModal from './EmployeeFamilyDetailModal'
import EmployeeContractDetailModal from './EmployeeContractDetailModal'
import EmployeeEducationDetailModal from './EmployeeEducationDetailModal'
import EmployeeDisabilityDetailModal from './EmployeeDisabilityDetailModal'
import EmployeeProfessionalQualificationDetailModal from './EmployeeProfessionalQualificationDetailModal'
import moment from 'moment'
const DetailListItem = DetailList.Item

export default {
  name: 'CustomerAllDetailModal',
  mixins: [mixinDevice],
  components: {
    DepartList,
    PageLayout,
    DetailList,
    DetailListItem,
    PaymentDetailModal,
    EmployeeWorkDetailModal,
    EmployeeFamilyDetailModal,
    EmployeeContractDetailModal,
    EmployeeEducationDetailModal,
    EmployeeDisabilityDetailModal,
    EmployeeProfessionalQualificationDetailModal
  },
  data() {
    return {
      model: {},
      title: '详细',
      filterDictText,
      getAreaName,
      visible: false,
      fundForm: this.$form.createForm(this),
      socialForm: this.$form.createForm(this),
      activeTabKey: '1', // 默认第一个tab
      employeeInfo: {}, // 基本信息
      employeeWorkList: [], // 工作记录
      employeeFamilyList: [], // 家庭信息
      employeeContractList: [], // 合同列表
      employeeEducationList: [], // 学历信息
      employeeDisabilityList: [], // 伤残信息
      paymentInfoList: [], // 预估库
      employeeMoveInfoList: [], // 调动记录
      employeeProfessionalQualificationList: [], // 职业资格
      showSocial: false,
      showFund: false,
      type: 0, // 1离职库详情0其他
      fundData: {}, // 公积金数据
      socialData: {}, // 社保数据
      areaTrees: [], // 地区数据
      areaCitys: [], // 城市数据
      areaTowns: [], // 区县数据
      sexBelongs: [], // 性别字典
      bankBelongs: [], // 银行字典
      empTypeBelongs: [], // 员工类型字典
      workTypeBelongs: [], // 工作类型
      empMarriBelongs: [], // 婚姻状况字典
      politicalBelongs: [], // 政治面貌字典
      educationBelongs: [], // 学历级别
      obtainTypeBelongs: [], // 获取方式
      empNationalBelongs: [], // 民族字典
      workingHoursBelongs: [], // 工时制
      settleDomainBelongs: [], // 结算主体字典
      situationTypeBelongs: [], // 签订情况
      empRegisTypeBelongs: [], // 户口性质字典
      educationTypeBelongs: [], // 学历类型
      employeeLableBelongs: [], // 员工标签字典
      disabilityLevelBelongs: [], // 伤残等级
      educationSystemBelongs: [], // 学制类型
      relationshipSelfBelongs: [], // 与本人关系
      qualificationTypeBelongs: [], // 资格类型
      qualificationLevelBelongs: [], // 资格等级
      employeeContractTypeBelongs: [], // 员工合同类型
      reduceReasonBelongs: [], // 离职原因
      loadMessage: '基础数据加载中，如果多次尝试依旧如此请刷新页面重新加载！',
      handleStatusOption: ['未办理', '办理成功', '办理失败', '已派减','办理中','部分办理失败'], // 办理状态
      flagOptions: {
        '0': { option: '未结算', color: 'blue' },
        '1': { option: '待结算', color: 'pink' },
        '2': { option: '已结算', color: 'green' }
      },
      workingStatusBelongs: { '0': { option: '在职', color: 'green' }, '1': { option: '离职', color: 'red' } }, // 是否在岗
      hightIdentificationBelongs: { '0': { option: '是', color: 'green' }, '1': { option: '否', color: 'red' } }, // 最高学历
      injuryIdentificationBelongs: { '0': { option: '是', color: 'green' }, '1': { option: '否', color: 'red' } }, // 是否工伤
      heightIdentificationBelongs: { '0': { option: '是', color: 'green' }, '1': { option: '否', color: 'red' } }, // 是否最高资格
      currentBaseRecordData: {}, // 当前第n条调基记录
      modulationRrecordDataSource: [], // 调基记录
      basePageCurrent: 1, // 调基记录分页控制器的当前页
      basePageTotal: 0, // 调基记录总条数
      baseActiveTabKey: '1', // 调基和基本信息Tab切换默认激活tabIndex
      employList:{},
      baseRecordType: { 0: '最低缴纳', 1: '自定义缴纳', 2: '最高缴纳' },
      // 隐藏列字段数组
      defineColumns: {
        // 合同信息
        contractName: { width: 200 },
        contractNo: { width: 150 },
        contractType: { width: 100, type: 'dict', options: [] },
        contractStart: { width: 100 },
        contractEnd: { width: 100 },
        contractTerm: { width: 60 },
        // 家庭信息
        familyName: { width: 100 },
        relationshipSelf: { width: 80, type: 'dict', options: [] },
        birthday: { width: 130 },
        workUnit: { width: 250 },
        contractTel: { width: 140 },
        // 学历信息
        school: { width: 130 },
        collageSystem: { width: 130 },
        bachelorScience: { width: 130 },
        educationName: { width: 80, type: 'dict', options: [] },
        type: { width: 80, type: 'dict', options: [] },
        hightIdentification: { width: 60, type: 'tag', options: [] },
        educationSystem: { width: 80, type: 'dict', options: [] },
        // 伤残信息
        disabilityName: { width: 200 },
        occupationalDisease: { width: 200 },
        disabilityLevel: { width: 80, type: 'dict', options: [] },
        startTime: { width: 110 },
        endTime: { width: 110 },
        injuryIdentification: { width: 60, type: 'tag', options: [] },
        // 职业资格
        certificationNo: { width: 200 },
        declareYear: { width: 60 },
        assessmentUnit: { width: 200 },
        obtainType: { width: 80, type: 'dict', options: [] },
        qualificationType: { width: 80, type: 'dict', options: [] },
        qualificationLevel: { width: 80, type: 'dict', options: [] },
        heightIdentification: { width: 100, type: 'tag', options: [] },
        // 预估库
        unitId: { key: 'settleDomainId', width: 140, type: 'settle', options: [], name: 'customerName' },
        settleDomainId: { key: 'settleDomainId', width: 140, type: 'settle', options: [], name: 'departName' },
        socialPayAddr: { width: 90 },
        socialPayMonth: { width: 50 },
        socialCreateMonth: { width: 50 },
        providentPayAddr: { width: 90 },
        providentPayMonth: { width: 50 },
        providentCreateMonth: { width: 50 },
        // 调动记录
        oldDepart: { key: 'oldDepart', width: 200, type: 'settle', options: [], name: 'departName' },
        newDepart: { key: 'newDepart', width: 200, type: 'settle', options: [], name: 'departName' },
        moveManName: { width: 200 },
        createDate: { width: 200 }
      },
      // 工作记录隐藏列字段数组
      defineColumnsOfWork: {
        workUnit: { width: 200 },
        workDepart: { width: 200 },
        workJob: { width: 200 },
        workingType: { width: 80, type: 'dict', options: [] },
        workingStatus: { width: 60, type: 'tag', options: [] }
      },
      tabList: [
        {
          key: '1',
          tab: '合同信息'
        },
        {
          key: '2',
          tab: '家庭信息'
        },
        {
          key: '3',
          tab: '工作记录'
        },
        {
          key: '4',
          tab: '学历信息'
        },
        {
          key: '5',
          tab: '伤残信息'
        },
        {
          key: '6',
          tab: '职业资格'
        },
        {
          key: '7',
          tab: '社保'
        },
        {
          key: '8',
          tab: '公积金'
        },
        {
          key: '9',
          tab: '缴费库'
        },
        // {
        //   key: '10',
        //   tab: '变更记录',
        // },
        {
          key: '11',
          tab: '调动记录'
        }
      ],
      // tab1员工合同列表标题
      employeeContractColumns: [
        {
          title: '合同名称',
          align: 'center',
          dataIndex: 'contractName',
          scopedSlots: { customRender: 'contractName' }
        },
        {
          title: '合同编码',
          align: 'center',
          dataIndex: 'contractNo',
          scopedSlots: { customRender: 'contractNo' }
        },
        {
          title: '合同类型',
          align: 'center',
          dataIndex: 'contractType',
          scopedSlots: { customRender: 'contractType' }
        },
        {
          title: '合同起始日期',
          align: 'center',
          dataIndex: 'contractStart',
          scopedSlots: { customRender: 'contractStart' }
        },
        {
          title: '合同截止日期',
          align: 'center',
          dataIndex: 'contractEnd',
          scopedSlots: { customRender: 'contractEnd' }
        },
        {
          title: '合同年限',
          align: 'center',
          dataIndex: 'contractTerm',
          scopedSlots: { customRender: 'contractTerm' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // tab2员工家庭列表标题
      employeeFamilyColumns: [
        {
          title: '成员姓名',
          align: 'center',
          dataIndex: 'familyName',
          scopedSlots: { customRender: 'familyName' }
        },
        {
          title: '与本人关系',
          align: 'center',
          dataIndex: 'relationshipSelf',
          scopedSlots: { customRender: 'relationshipSelf' }
        },
        {
          title: '出生日期',
          align: 'center',
          dataIndex: 'birthday',
          scopedSlots: { customRender: 'birthday' }
        },
        {
          title: '工作单位',
          align: 'center',
          dataIndex: 'workUnit',
          scopedSlots: { customRender: 'workUnit' }
        },
        {
          title: '联系电话',
          align: 'center',
          dataIndex: 'contractTel',
          scopedSlots: { customRender: 'contractTel' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // tab3工作记录列表标题
      employeeWorkColumns: [
        {
          title: '工作单位',
          align: 'center',
          dataIndex: 'workUnit',
          scopedSlots: { customRender: 'workUnit' }
        },
        {
          title: '工作部门',
          align: 'center',
          dataIndex: 'workDepart',
          scopedSlots: { customRender: 'workDepart' }
        },
        {
          title: '工作岗位',
          align: 'center',
          dataIndex: 'workJob',
          scopedSlots: { customRender: 'workJob' }
        },
        {
          title: '工作类型',
          align: 'center',
          dataIndex: 'workingType',
          scopedSlots: { customRender: 'workingType' }
        },
        {
          title: '在职状态',
          align: 'center',
          dataIndex: 'workingStatus',
          scopedSlots: { customRender: 'workingStatus' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // tab4学历信息列表标题
      employeeEducationColumns: [
        {
          title: '学校',
          align: 'center',
          dataIndex: 'school',
          scopedSlots: { customRender: 'school' }
        },
        {
          title: '院系名称',
          align: 'center',
          dataIndex: 'collageSystem',
          scopedSlots: { customRender: 'collageSystem' }
        },
        {
          title: '专业',
          align: 'center',
          dataIndex: 'bachelorScience',
          scopedSlots: { customRender: 'bachelorScience' }
        },
        {
          title: '学历',
          align: 'center',
          dataIndex: 'educationName',
          scopedSlots: { customRender: 'educationName' }
        },
        {
          title: '学历类型',
          align: 'center',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '最高学历',
          align: 'center',
          dataIndex: 'hightIdentification',
          scopedSlots: { customRender: 'hightIdentification' }
        },
        {
          title: '学制类型',
          align: 'center',
          dataIndex: 'educationSystem',
          scopedSlots: { customRender: 'educationSystem' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // tab5伤残信息列表标题
      employeeDisabilityColumns: [
        {
          title: '伤残病名称',
          align: 'center',
          dataIndex: 'disabilityName',
          scopedSlots: { customRender: 'disabilityName' }
        },
        {
          title: '职业病名称',
          align: 'center',
          dataIndex: 'occupationalDisease',
          scopedSlots: { customRender: 'occupationalDisease' }
        },
        {
          title: '伤残等级',
          align: 'center',
          dataIndex: 'disabilityLevel',
          scopedSlots: { customRender: 'disabilityLevel' }
        },
        {
          title: '伤残开始日期',
          align: 'center',
          dataIndex: 'startTime',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '伤残结束日期',
          align: 'center',
          dataIndex: 'endTime',
          scopedSlots: { customRender: 'endTime' }
        },
        {
          title: '是否工伤',
          align: 'center',
          dataIndex: 'injuryIdentification',
          scopedSlots: { customRender: 'injuryIdentification' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // tab6职业资格列表标题
      employeeProfessionalQualificationColumns: [
        {
          title: '证书编号',
          align: 'center',
          dataIndex: 'certificationNo',
          scopedSlots: { customRender: 'certificationNo' }
        },
        {
          title: '申报年度',
          align: 'center',
          dataIndex: 'declareYear',
          scopedSlots: { customRender: 'declareYear' }
        },
        {
          title: '评定机构',
          align: 'center',
          dataIndex: 'assessmentUnit',
          scopedSlots: { customRender: 'assessmentUnit' }
        },
        {
          title: '获取方式',
          align: 'center',
          dataIndex: 'obtainType',
          scopedSlots: { customRender: 'obtainType' }
        },
        {
          title: '资格类型',
          align: 'center',
          dataIndex: 'qualificationType',
          scopedSlots: { customRender: 'qualificationType' }
        },
        {
          title: '资格等级',
          align: 'center',
          dataIndex: 'qualificationLevel',
          scopedSlots: { customRender: 'qualificationLevel' }
        },
        {
          title: '最高资格',
          align: 'center',
          dataIndex: 'heightIdentification',
          scopedSlots: { customRender: 'heightIdentification' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // tab9预估库列表标题
      paymentInfoColumns: [
        {
          title: '单位名称',
          align: 'center',
          dataIndex: 'unitId',
          scopedSlots: { customRender: 'unitId' }
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDomainId',
          scopedSlots: { customRender: 'settleDomainId' }
        },
        {
          title: '社保缴纳地',
          align: 'center',
          dataIndex: 'socialPayAddr',
          scopedSlots: { customRender: 'socialPayAddr' }
        },
        {
          title: '社保缴纳月',
          align: 'center',
          dataIndex: 'socialPayMonth',
          scopedSlots: { customRender: 'socialPayMonth' }
        },
        {
          title: '社保生成月',
          align: 'center',
          dataIndex: 'socialCreateMonth',
          scopedSlots: { customRender: 'socialCreateMonth' }
        },
        // {
        //   title: '社保结算',
        //   align: 'center',
        //   dataIndex: 'socialSettlementFlag',
        //   scopedSlots: { customRender: 'socialSettlementFlag' },
        // },
        {
          title: '公积金缴纳地',
          align: 'center',
          dataIndex: 'providentPayAddr',
          scopedSlots: { customRender: 'providentPayAddr' }
        },
        {
          title: '公积金缴纳月',
          align: 'center',
          dataIndex: 'providentPayMonth',
          scopedSlots: { customRender: 'providentPayMonth' }
        },
        {
          title: '公积金生成月',
          align: 'center',
          dataIndex: 'providentCreateMonth',
          scopedSlots: { customRender: 'providentCreateMonth' }
        },
        // {
        //   title: '公积金结算',
        //   align: 'center',
        //   dataIndex: 'fundSettlementFlag',
        //   scopedSlots: { customRender: 'fundSettlementFlag' },
        // },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // tab11调动记录列表标题
      employeeMoveInfoColumns: [
        {
          title: '原始部门',
          align: 'center',
          dataIndex: 'oldDepart',
          scopedSlots: { customRender: 'oldDepart' }
        },
        {
          title: '调动部门',
          align: 'center',
          dataIndex: 'newDepart',
          scopedSlots: { customRender: 'newDepart' }
        },
        {
          title: '调动人',
          align: 'center',
          dataIndex: 'moveManName',
          scopedSlots: { customRender: 'moveManName' }
        },
        {
          title: '调动时间',
          align: 'center',
          dataIndex: 'createDate',
          scopedSlots: { customRender: 'createDate' }
        }
      ],
      // 调基记录表格标题
      modalationColumns: [
        {
          title: '缴费科目',
          dataIndex: 'name',
          customRender: text => {
            return text || text === 0 ? `${text}` : '-'
          }
        },
        {
          title: '缴纳基数',
          dataIndex: 'basic',
          customRender: text => (text ? text : '-')
        },
        {
          title: '个人比例',
          dataIndex: 'personalPropor',
          customRender: text => {
            return text || text === 0 ? `${text}%` : '-'
          }
        },
        {
          title: '个人缴纳',
          dataIndex: 'personalPay',
          customRender:text => (text || text === 0) ? text : '-'
        },
        {
          title: '公司比例',
          dataIndex: 'companyPropor',
          customRender: text => {
            return text || text === 0 ? `${text}%` : '-'
          }
        },
        {
          title:'公司缴纳',
          dataIndex:'companyPay',
          customRender:text => (text || text === 0) ? text : '-'
        }
      ],

      url: {
        queryWorkAllInfoById: 'hrBase/tempworkrecording/',
        queryFamilyAllInfoById: 'hrBase/tempfamily/',
        queryPaymentAllInfoById: 'hrSocial/tpaymentinfo/allInfo/',
        queryContractAllInfoById: 'hrBase/temployeecontractinfo/vo/',
        queryEducationAllInfoById: 'hrBase/tempeducation/vo/',
        queryDisabilityAllInfoById: 'hrBase/tempdisabilityinfo/vo/',
        queryProfessionalQualificationAllInfoById: 'hrBase/tempprofessionalqualification/vo/',
        queryModulationRecord: 'hrSocial/tsocialfundhistory/page'
      },
      insuranceTypeStatus:{
        bigailmentHandle:'',
        birthHandle:'',
        medicalHandle:'',
        pensionHandle:'',
        unemployHandle:'',
        workInjuryHandle:'',
      }
    }
  },
  methods: {
    moment,
    async edit(record) {
      this.model = Object.assign({}, record)
      this.employeeContractList = this.model.employeeContractInfoVo
      this.employeeFamilyList = this.model.empFamily
      this.employeeWorkList = this.model.empWorkRecording
      this.employeeEducationList = this.model.empEducationVo
      this.employeeDisabilityList = this.model.empDisabilityInfoVo
      this.visible = true
      /*********************************************  基本信息  *********************************************/
      this.employeeInfo = this.model.employeeInfo
      if(this.type){ //离职库
        this.showSocial = (this.model.social && this.model.social.id) ? true : false
        this.showFund = (this.model.fund && this.model.fund.id) ? true : false
      }else{
        // 其他
        this.showSocial = (this.model.social && this.model.social.id && (this.employeeInfo.socialLifeline != null || this.employeeInfo.fundLifeline != null)) ? true : false
        this.showFund = (this.model.fund && this.model.fund.id && (this.employeeInfo.socialLifeline != null || this.employeeInfo.fundLifeline != null)) ? true : false
      }
      // 性别
      this.employeeInfo.empSex = this.employeeInfo.empSex
        ? filterDictText(this.sexBelongs, this.employeeInfo.empSex)
        : '-'
      // 婚姻状况
      this.employeeInfo.empMarriStatu = this.employeeInfo.empMarriStatu
        ? filterDictText(this.empMarriBelongs, this.employeeInfo.empMarriStatu)
        : '-'
      // 民族
      this.employeeInfo.empNational = this.employeeInfo.empNational
        ? filterDictText(this.empNationalBelongs, this.employeeInfo.empNational)
        : '-'
      // 政治面貌
      this.employeeInfo.politicalStatus = this.employeeInfo.politicalStatus
        ? filterDictText(this.politicalBelongs, this.employeeInfo.politicalStatus)
        : '-'
      // 员工类型
      this.employeeInfo.empType = this.employeeInfo.empType
        ? filterDictText(this.empTypeBelongs, this.employeeInfo.empType)
        : '-'
      this.employeeInfo.leaveReason = this.employeeInfo.leaveReason
        ? filterDictText(this.reduceReasonBelongs, this.employeeInfo.leaveReason)
        : '-'

      this.employeeInfo.workingHours = this.employeeInfo.workingHours
        ? filterDictText(this.workingHoursBelongs, this.employeeInfo.workingHours)
        : '-'
      // 结算主体、单位

      // const settleDomainTemp = this.employeeInfo.settleDomain // 用于取所属单位
      // this.employeeInfo.settleDomain = this.employeeInfo.belongUnit = '-'

      // if (Object.keys(this.settleDomainBelongs).length) {
      //   this.employeeInfo.settleDomain = this.settleDomainBelongs.hasOwnProperty(settleDomainTemp)
      //     ? this.settleDomainBelongs[settleDomainTemp]['departName']
      //     : '-'
      //   this.employeeInfo.belongUnit = this.settleDomainBelongs.hasOwnProperty(settleDomainTemp)
      //     ? this.settleDomainBelongs[settleDomainTemp]['customerName']
      //     : '-'
      // }

      // 职业资格
      this.employeeProfessionalQualificationList = this.model.empProfessionalQualificationVo.length
        ? this.model.empProfessionalQualificationVo
        : []
      // 合同类型
      this.defineColumns.contractType.options = this.employeeContractTypeBelongs
      // 与本人关系
      this.defineColumns.relationshipSelf.options = this.relationshipSelfBelongs
      // 工作类型
      this.defineColumnsOfWork.workingType.options = this.workTypeBelongs
      // 在职状态
      this.defineColumnsOfWork.workingStatus.options = this.workingStatusBelongs
      // 学历级别
      this.defineColumns.educationName.options = this.educationBelongs
      // 学历类型
      this.defineColumns.type.options = this.educationTypeBelongs
      // 最高学历
      this.defineColumns.hightIdentification.options = this.hightIdentificationBelongs
      // 学制类型
      this.defineColumns.educationSystem.options = this.educationSystemBelongs
      // 伤残等级
      this.defineColumns.disabilityLevel.options = this.disabilityLevelBelongs
      // 是否工伤
      this.defineColumns.injuryIdentification.options = this.injuryIdentificationBelongs
      // 获取方式
      this.defineColumns.obtainType.options = this.obtainTypeBelongs
      // 资格类型
      this.defineColumns.qualificationType.options = this.qualificationTypeBelongs
      // 资格等级
      this.defineColumns.qualificationLevel.options = this.qualificationLevelBelongs
      // 最高资格
      this.defineColumns.heightIdentification.options = this.heightIdentificationBelongs
      this.employeeInfo.empRegisType = (this.employeeInfo.empRegisType !== null) ? filterDictText(this.empRegisTypeBelongs, this.employeeInfo.empRegisType) : '-'
      this.employeeInfo.empLabel = (this.employeeInfo.empLabel !== null) ? filterDictText(this.employeeLableBelongs, this.employeeInfo.empLabel) : '-'
      /*********************************************  社保、公积金信息  *********************************************/
      this.fundData = this.model.fund ? this.model.fund : {}

      if (this.model.fund) {
        // 获取公积金户
        getHouseHold({ id: this.model.fund.providentHousehold }).then(providentHousehold => {
          if (providentHousehold.code === 200 && providentHousehold.data.length > 0) {
            this.fundData.providentHouseholdName = providentHousehold.data[0].name
          } else {
            this.$message.warning('公积金户数据请求失败！')
          }
        })
      }

      this.socialData = this.model.social ? this.model.social : {}
      if (this.model.social) {
        // 各险种状态
        this.insuranceTypeStatus = {
          bigailmentHandle:this.socialData.bigailmentHandle,
          birthHandle:this.socialData.birthHandle,
          medicalHandle:this.socialData.medicalHandle,
          pensionHandle:this.socialData.pensionHandle,
          unemployHandle:this.socialData.unemployHandle,
          workInjuryHandle:this.socialData.workInjuryHandle
        }
        // 获取社保户
        getHouseHold({ id: this.model.social.socialHousehold }).then(socialHousehold => {
          if (socialHousehold.code === 200 && socialHousehold.data.length > 0) {
            this.socialData.socialHouseholdName = socialHousehold.data[0].name
          } else {
            this.$message.error('社保户数据请求失败！')
          }
        })
      }
      // 获取结算主体
      let departs = []
      
      this.model.employeeMoveInfoList.map(item=>{
        departs.push(item.oldDepart)
        departs.push(item.newDepart)
      })
      this.model.paymentInfoList.map(item=>{
        departs.push(item.settleDomainId)
      })
      let ids = [...new Set(departs)].join(',')
      if(ids){
        const resSet = await httpAction(`/hrBase/tsettledomain/selectSettleDomainAndCustomerMapByIds?ids=${ids}`,null,'get')
        if(Number(resSet.code) === 200) {
          this.settleDomainBelongs = resSet.data.settleDomainMap
          }else {
            this.$message.error('结算主体和所属单位数据请求失败！子组件')
        }
      }
      
      /*********************************************  预估库/缴费库 *********************************************/
      this.defineColumns.unitId.options = this.defineColumns.settleDomainId.options = this.settleDomainBelongs
      this.paymentInfoList = this.model.paymentInfoList.length ? this.model.paymentInfoList : []

      /*********************************************  调动记录  *********************************************/
      this.employeeMoveInfoList = this.model.employeeMoveInfoList.length ? this.model.employeeMoveInfoList : []
      this.defineColumns.oldDepart.options = this.defineColumns.newDepart.options = this.settleDomainBelongs
      
    },
    tabChange(key) {
      this.activeTabKey = key
    },
    // 确定按钮
    handleOk() {
      this.close()
    },
    // Tab每项切换事件
    tabsClickCallback(key) {
      this.baseActiveTabKey = key
      if (Number(key) === 2) {
        this.loadBaseRecordData()
      }
    },
    // 调基记录分页控制器页码改变的回调
    basePaginationChanged(current) {
      this.basePageCurrent = current
      this.loadBaseRecordData()
    },
    // 调用获取调基记录接口
    loadBaseRecordData() {
      const partOne = `${this.url.queryModulationRecord}?employeeId=${this.employeeInfo.id}&size=1&current=${this.basePageCurrent}`
      const partTwo = `&orders%5B0%5D.asc=false&orders%5B0%5D.column=CREATE_DATE`
      const url = partOne + partTwo
      httpAction(url, '', 'GET').then(res => {
        if (res.code === 200) {
          this.basePageCurrent = res.data.current
          this.basePageTotal = res.data.total
          if (res.data.records && res.data.records.length) {
            this.currentBaseRecordData = res.data.records[0] || {}
            this.modulationRrecordDataSource = this.handleListData(this.currentBaseRecordData)
          } else {
            this.modulationRrecordDataSource = []
          }
        } else {
          this.basePageCurrent = 1
          this.basePageTotal = 0
          this.$message.error('调基记录获取失败！')
        }
      })
    },

    // 整合调基记录数据
    handleListData(data) {
      const temp = []
      temp.push({
        id: 0,
        name: '养老',
        basic: data.unitPensionBase,
        personalPropor: data.personalPersionPro,
        personalPay: data.personalPersionMoney,
        companyPropor: data.unitPersionPro,
        companyPay: data.unitPersionMoney,
      })

      temp.push({
        id: 1,
        name: '医疗',
        basic: data.unitMedicalBase,
        personalPropor: data.personalMedicalPro,
        personalPay: data.personalMedicalMoney,
        companyPropor: data.unitMedicalPro,
        companyPay: data.unitMedicalMoney
      })

      temp.push({
        id: 2,
        name: '大病医疗保险',
        basic: data.unitBigailmentBase,
        personalPropor: data.personalBigailmentPro,
        personalPay: data.personalBigailmentMoney,
        companyPropor: data.unitBigailmentPro,
        companyPay: data.unitBigailmentMoney
      })

      temp.push({
        id: 3,
        name: '失业',
        basic: data.unitUnemploymentBase,
        personalPropor: data.personalUnemploymentPro,
        personalPay: data.personalUnemploymentMoney,
        companyPropor: data.unitUnemploymentPro,
        companyPay: data.unitUnemploymentMoney
      })

      temp.push({
        id: 4,
        name: '工伤',
        basic: data.unitInjuryBase,
        personalPropor: '',
        personalPay: '',
        companyPropor: data.unitInjuryPro,
        companyPay: data.unitInjuryMoney
      })

      temp.push({
        id: 5,
        name: '生育',
        basic: data.unitBirthBase,
        personalPropor: '',
        personalPay: '',
        companyPropor: data.unitBirthPro,
        companyPay: data.unitBirthMoney
      })

      temp.push({
        id: 6,
        name: '公积金',
        basic: data.unitFundBase,
        personalPropor: data.personalFundProp,
        personalPay: data.personalFundMoney,
        companyPropor: data.unitFundProp,
        companyPay: data.unitFundMoney
      })
      return temp
    },
    // 关闭按钮
    handleCancel() {
      this.close()
      this.employeeInfo = {}
    },
    // 关闭功能及数据重置
    close() {
      this.$emit('close')
      this.visible = false
      this.activeTabKey = '1'
      this.baseActiveTabKey = '1'
      this.basePageCurrent = 1
      this.type = 0
      this.currentBaseRecordData = {}
    },
    // 合同信息详情
    handleContractDetail(record) {
      this.$refs.employeeContractDetailModal.title = '员工合同详情'
      this.$refs.employeeContractDetailModal.workingHoursBelongs = this.workingHoursBelongs
      this.$refs.employeeContractDetailModal.situationTypeBelongs = this.situationTypeBelongs
      this.$refs.employeeContractDetailModal.employeeContractTypeBelongs = this.employeeContractTypeBelongs
      httpAction(this.url.queryContractAllInfoById + record.id, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeContractDetailModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 家庭信息详情
    handleFamilyDetail(record) {
      this.$refs.employeeFamilyDetailModal.title = '家庭信息详情'
      this.$refs.employeeFamilyDetailModal.relationshipSelfBelongs = this.relationshipSelfBelongs
      httpAction(this.url.queryFamilyAllInfoById + record.id, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeFamilyDetailModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 工作记录详情
    handleWorkDetail(record) {
      this.$refs.employeeWorkDetailModal.title = '工作记录详情'
      this.$refs.employeeWorkDetailModal.workTypeBelongs = this.workTypeBelongs
      this.$refs.employeeWorkDetailModal.workingStatusBelongs = this.workingStatusBelongs
      httpAction(this.url.queryWorkAllInfoById + record.id, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeWorkDetailModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 学历信息详情
    handleEducationDetail(record) {
      this.$refs.employeeEducationDetailModal.title = '学历信息详情'
      this.$refs.employeeEducationDetailModal.educationBelongs = this.educationBelongs
      this.$refs.employeeEducationDetailModal.educationTypeBelongs = this.educationTypeBelongs
      this.$refs.employeeEducationDetailModal.educationSystemBelongs = this.educationSystemBelongs
      this.$refs.employeeEducationDetailModal.hightIdentificationBelongs = this.hightIdentificationBelongs
      httpAction(this.url.queryEducationAllInfoById + record.id, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeEducationDetailModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 伤残信息详情
    handleDisabilityDetail(record) {
      this.$refs.employeeDisabilityDetailModal.title = '伤残信息详情'
      this.$refs.employeeDisabilityDetailModal.disabilityLevelBelongs = this.disabilityLevelBelongs
      this.$refs.employeeDisabilityDetailModal.injuryIdentificationBelongs = this.injuryIdentificationBelongs
      httpAction(this.url.queryDisabilityAllInfoById + record.id, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeDisabilityDetailModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 职业资格详情
    handleProfessionalQualificationDetail(record) {
      this.$refs.employeeProfessionalQualificationDetailModal.title = '职业资格详情'
      this.$refs.employeeProfessionalQualificationDetailModal.obtainTypeBelongs = this.obtainTypeBelongs
      this.$refs.employeeProfessionalQualificationDetailModal.qualificationTypeBelongs = this.qualificationTypeBelongs
      this.$refs.employeeProfessionalQualificationDetailModal.qualificationLevelBelongs = this.qualificationLevelBelongs
      this.$refs.employeeProfessionalQualificationDetailModal.heightIdentificationBelongs = this.heightIdentificationBelongs
      httpAction(this.url.queryProfessionalQualificationAllInfoById + record.id, '', 'GET').then(res => {
        if (Number(res.code) === 200 && res.data) {
          this.$refs.employeeProfessionalQualificationDetailModal.edit(res.data)
        } else {
          this.$message.error('数据不完整！')
        }
      })
    },
    // 缴费库信息详情
    handlePaymentDetail(record) {
      this.$refs.paymentDetailModal.editButton = false
      this.$refs.paymentDetailModal.title = '缴费明细详情'
      this.$refs.paymentDetailModal.settleDomainBelongs = this.settleDomainBelongs

      if (Object.keys(this.settleDomainBelongs).length > 0) {
        httpAction(this.url.queryPaymentAllInfoById + record.id, '', 'GET').then(res => {
          // console.log(res.data);
          if (Number(res.code) === 200 && res.data) {
            const houseHoldsSelect = []
            // 有社保有公积金
            if (res.data.socialHousehold && res.data.providentHousehold) {
              // 获取社保户
              getHouseHold({ id: res.data.socialHousehold }).then(socialHousehold => {
                // console.log(socialHousehold);
                if (Number(socialHousehold.code) == 200 && socialHousehold.data.length > 0) {
                  houseHoldsSelect.push(socialHousehold.data[0])
                  // 获取公积金户
                  getHouseHold({ id: res.data.providentHousehold }).then(providentHousehold => {
                    if (Number(providentHousehold.code) === 200 && providentHousehold.data.length) {
                      houseHoldsSelect.push(res.data[0])
                      this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                      this.$refs.paymentDetailModal.edit(res.data)
                    } else {
                      this.$message.error('公积金户数据请求失败！')
                    }
                  })
                } else {
                  this.$message.error('社保户数据请求失败！')
                }
              })
            } else if (res.data.socialHousehold && !res.data.providentHousehold) {
              // 只有社保 获取社保户
              getHouseHold({ id: res.data.socialHousehold }).then(socialHousehold => {
                if (Number(socialHousehold.code) === 200 && socialHousehold.data.length > 0) {
                  houseHoldsSelect.push(socialHousehold.data[0])
                  this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                  this.$refs.paymentDetailModal.edit(res.data)
                } else {
                  this.$message.error('社保户数据请求失败！')
                }
              })
            } else if (!res.data.socialHousehold && res.data.providentHousehold) {
              // 只有公积金 获取公积金户
              getHouseHold({ id: res.data.providentHousehold }).then(providentHousehold => {
                if (Number(providentHousehold.code) === 200 && providentHousehold.data.length > 0) {
                  houseHoldsSelect.push(providentHousehold.data[0])
                  this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
                  this.$refs.paymentDetailModal.edit(res.data)
                } else {
                  this.$message.error('公积金户数据请求失败！')
                }
              })
            } else {
              // 社保户、公积金户都没有
              this.$refs.paymentDetailModal.organizationBelongs = houseHoldsSelect
              this.$refs.paymentDetailModal.edit(res.data)
            }
          } else {
            this.$message.error('数据请求失败！')
          }
        })
      } else {
        if (Object.keys(this.settleDomainBelongs).length === 0) {
          this.$message.error(`"结算主体"${this.loadMessage}`)
        }
      }
    },
    // 隐藏列样式
    handleColumnStyle(width) {
      if (width) {
        return (
          `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width:${width}px;`
        )
      }

      return 'overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 100px;'
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-layout {
  margin-left: 44px;
}
.text {
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
}
.basePaginationWrap {
  margin-top: 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}

.no-data {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }
  .status-list {
    text-align: left;
  }
}
.ant-modal_detail {
  margin-top: 65px;
}
</style>

<style lang="less" scoped>
.ant-form-detail {
  :global(.ant-form-item-control .ant-form-item-children) {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
}

.stepFormText {
  :global(.ant-form-item-label) {
    width: 110px;
  }
}
</style>
