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
  >
    <a-spin :spinning="confirmLoading">
      <div class="dialogBody">
        <a-row style="margin-bottom:15px">
          <a-col
            :span="2"
            :offset="22"
          >
            <a-switch
              :checkedChildren="auditStatus"
              :disabled="true"
              defaultChecked
            />
          </a-col>
        </a-row>
        <a-row>
          <a-divider orientation="left">{{ titleName }}</a-divider>
          <a-col :span="17">
            <ul class="record">
              <li
                v-for="(item,index) in detail.dealInfo"
                :key="index"
              >
                {{ index+1 }}、
                {{ moment(item.recordingDate).format("YYYY-MM-DD") }}
                <!-- 《{{ item.recordingUserName }}》 提交内容为： -->
                {{ item.recordingContent }};
                <span v-if="item.payType != null">
                  理赔项目:{{ filterDictText(socialClaimsFeeTypeDicts,item.payType) }};
                  理赔金额:{{ item.payFee }}元
                </span>
              </li>
            </ul>
          </a-col>
        </a-row>
        
        <a-row>
          <a-divider orientation="left">成本支出记录</a-divider>
          <a-col :span="17">
            <ul class="record">
              <li
                v-for="(item,index) in detail.costExpenditure"
                :key="index"
              >
                {{ index+1 }}、
                {{ item.recordingDate }} -- 
                {{ filterDictText(injuryCostTypeDicts,item.costExpenditureType) }} --
                {{ item.costExpenditureFee }}元
              </li>
            </ul>
          </a-col>
          <a-col
            :span="6"
            :offset="1"
          >
            <a-card>
              <p>累计成本支出</p>
              <h2>{{ detail.sumCostExpenditureFee }}元</h2>
            </a-card>
          </a-col>
        </a-row>
      </div>

    </a-spin>
  </a-modal>
</template>
    
<script>
import moment from 'moment'
import { filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'SocialClaimsRecordModal',
  data() {
    return {
      title: '工伤理赔办理记录',
      visible: false,
      confirmLoading:false,
      detail:{},
      titleName:'工伤办理记录',
      socialClaimsFeeTypeDicts:[], //工伤理赔费用类型
      injuryCostTypeDicts:[], //工伤成本类型
      auditStatus:'', //状态
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
    }
  },
  methods: {
    filterDictText,
    moment,
    edit() {
      this.visible = true
    },
    
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('ok')
      this.visible = false
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

.dialogBig .ant-card-wider-padding .ant-card-body {
  padding: 0px 5% !important;
}
.ant-skeleton-title {
  width: 50% !important;
}
.stepFormText {
  :global(.ant-form-item-label) {
    width: 75px;
  }
}
.textareaForm {
  margin-left: 75px;
}
.record {
  min-height: 127px;
  border: 1px solid #e8e8e8;
  margin-bottom: 0px;
  padding: 8px 15px;
}
.record li {
  list-style: none;
}

.wrapClass .ant-modal-footer {
  overflow: hidden;
}
.wrapClass .ant-form-item {
  margin-bottom: 0px !important;
}
</style>

