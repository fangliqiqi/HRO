<template>
  <a-modal
    :title="title"
    :width="850"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleEdit"
        :loading="confirmLoading"
        v-if="isEdit && (model.socialReduceDate || model.fundReduceDate)"
      >保存</a-button>
      <a-button
        v-if="isVerify"
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >审核</a-button>
    </template>

    <a-tabs
      :activeKey="activeKey"
      @change="tabsChange"
    >
      <a-tab-pane
        :forceRender="true"
        tab="详情"
        key="1"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="form"
            layout="inline"
            class="ant-advanced-search-form ant-disabled-form"
          >
            <a-row>
              <a-col :span="24">
                <a-form-item class="stepFormText" style="margin-left:125px;font-weight: bold;">
                  {{ model.empName }}
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="24">
                <a-form-item
                  label="身份证号"
                  class="stepFormText"
                >
                  {{ model.empIdcard }}
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  label="所属单位/结算主体"
                  class="stepFormText"
                >
                  {{ model.belongUnit }} / {{ model.settleDomain }}
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  label="联系方式"
                  class="stepFormText"
                >
                  {{ model.empPhone }}
                </a-form-item>
              </a-col>
              <a-col
                :span="8"
                v-if="(model.socialReduceDate ? true : false)"
              >
                <a-form-item
                  label="停缴社保日期"
                  class="stepFormText"
                >
                  <a-date-picker
                    :disabled="!isEdit"
                    :allowClear="false"
                    placeholder="请选择日期"
                    v-decorator="['socialReduceDate', {rules: [{ required: true, message: '请选择日期！' }]}]"
                    style="width: 110px"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :span="8"
                v-if="(model.fundReduceDate ? true : false)"
              >
                <a-form-item
                  label="停缴公积金日期"
                  class="stepFormText"
                >
                  <a-date-picker
                    :disabled="!isEdit"
                    :allowClear="false"
                    placeholder="请选择日期"
                    v-decorator="['fundReduceDate', {rules: [{ required: true, message: '请选择日期！' }]}]"
                    style="width: 110px"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :span="8"
                v-if="(model.leaveDate ? true : false)"
              >
                <a-form-item
                  label="离职日期"
                  class="stepFormText"
                >
                  <a-date-picker
                    :disabled="true"
                    placeholder="请选择日期"
                    v-decorator="['leaveDate', {}]"
                    style="width: 110px"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="8">
                <a-form-item
                  label="减少原因"
                  class="stepFormText"
                >
                  <a-select
                    :disabled="true"
                    placeholder="请选择原因"
                    v-decorator="['reduceReason', {}]"
                    style="width: 110px"
                  >
                    <a-select-option
                      v-for="(item, index) in reduceReasonBelongs"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="16">
                <a-form-item
                  label="备注"
                  class="stepFormText"
                >
                  <a-textarea
                    :disabled="true"
                    :rows="1"
                    placeholder="备注"
                    v-decorator="['reduceRemark', {}]"
                    style="width: 300px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>

      <a-tab-pane
        :forceRender="true"
        tab="流程进展明细"
        key="2"
      >
        <a-spin :spinning="confirmLoading">
          <a-form
            :form="auditForm"
            layout="inline"
            class="ant-advanced-search-form"
          >
            <a-row>
              <a-row type="flex" class="marginBot">
                <a-col flex="120px" class="th">派单状态：</a-col>
                <a-col flex="auto">
                  <template v-if="model.dispatchStatus != undefined">
                    {{ model.dispatchStatus.option }}
                  </template>
                </a-col>
              </a-row>
              <a-row type="flex" class="marginBot" v-if="model.socialHandleStatus != null">
                <a-col flex="120px" class="th">社保办理状态：</a-col>
                <a-col flex="auto">
                  <template>
                    {{ socialHandleStatusOption[model.socialHandleStatus] || '-' }}
                  </template>
                </a-col>
              </a-row>
              <div class="tags" v-if="model.socialHandleStatus != null">
                <span v-for="(item,index) in insuranceType" :key="index">
                  <span
                    v-if="item.val == 1"
                    class="successTag"
                  >{{ item.name }}</span>
                  <span
                    v-else-if="item.val == 2"
                    class="errorTag"
                  >{{ item.name }}</span>
                  <span
                    v-else
                    class="disTag"
                  >{{ item.name }}</span>
                </span>
              </div>
              <a-row type="flex" class="marginBot" v-if="model.fundReduceDate">
                <a-col flex="120px" class="th">公积金办理状态：</a-col>
                <a-col flex="auto">{{ fundStatus[model.fundStatus] || '-' }}</a-col>
              </a-row>
              <a-divider style="margin: 10px 0px;" v-if="model.fundReduceDate || model.socialHandleStatus != null"/>
              <a-row type="flex" style="margin-bottom:15px;">
                <a-col flex="80px" class="th">进展明细</a-col>
              </a-row>
              <a-col :span="24">
                <template v-if="auditList.length > 0">
                  <a-timeline>
                    <template v-for="(list, key) in auditList">
                      <a-timeline-item
                        :key="key"
                        :color="auditStatusOptions[list.auditStatus].color"
                      >
                        <p>{{ list.auditRemark ? list.auditRemark : '' }}</p>
                        <p>{{ list.auditUser ? list.auditUser : '' }}</p>
                        <p>{{ list.auditTime ? list.auditTime : '' }}</p>
                      </a-timeline-item>
                    </template>
                  </a-timeline>
                </template>
                <template v-else>
                  <section class="code-box-demo">
                    <div class="ant-empty">
                      <div class="ant-empty-image">
                        <img
                          alt="暂无数据"
                          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg0IiBoZWlnaHQ9IjE1MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQgMzEuNjcpIj4KICAgICAgPGVsbGlwc2UgZmlsbC1vcGFjaXR5PSIuOCIgZmlsbD0iI0Y1RjVGNyIgY3g9IjY3Ljc5NyIgY3k9IjEwNi44OSIgcng9IjY3Ljc5NyIgcnk9IjEyLjY2OCIvPgogICAgICA8cGF0aCBkPSJNMTIyLjAzNCA2OS42NzRMOTguMTA5IDQwLjIyOWMtMS4xNDgtMS4zODYtMi44MjYtMi4yMjUtNC41OTMtMi4yMjVoLTUxLjQ0Yy0xLjc2NiAwLTMuNDQ0LjgzOS00LjU5MiAyLjIyNUwxMy41NiA2OS42NzR2MTUuMzgzaDEwOC40NzVWNjkuNjc0eiIgZmlsbD0iI0FFQjhDMiIvPgogICAgICA8cGF0aCBkPSJNMTAxLjUzNyA4Ni4yMTRMODAuNjMgNjEuMTAyYy0xLjAwMS0xLjIwNy0yLjUwNy0xLjg2Ny00LjA0OC0xLjg2N0gzMS43MjRjLTEuNTQgMC0zLjA0Ny42Ni00LjA0OCAxLjg2N0w2Ljc2OSA4Ni4yMTR2MTMuNzkyaDk0Ljc2OFY4Ni4yMTR6IiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMy41NikiLz4KICAgICAgPHBhdGggZD0iTTMzLjgzIDBoNjcuOTMzYTQgNCAwIDAgMSA0IDR2OTMuMzQ0YTQgNCAwIDAgMS00IDRIMzMuODNhNCA0IDAgMCAxLTQtNFY0YTQgNCAwIDAgMSA0LTR6IiBmaWxsPSIjRjVGNUY3Ii8+CiAgICAgIDxwYXRoIGQ9Ik00Mi42NzggOS45NTNoNTAuMjM3YTIgMiAwIDAgMSAyIDJWMzYuOTFhMiAyIDAgMCAxLTIgMkg0Mi42NzhhMiAyIDAgMCAxLTItMlYxMS45NTNhMiAyIDAgMCAxIDItMnpNNDIuOTQgNDkuNzY3aDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI0SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjR6TTQyLjk0IDYxLjUzaDQ5LjcxM2EyLjI2MiAyLjI2MiAwIDEgMSAwIDQuNTI1SDQyLjk0YTIuMjYyIDIuMjYyIDAgMCAxIDAtNC41MjV6TTEyMS44MTMgMTA1LjAzMmMtLjc3NSAzLjA3MS0zLjQ5NyA1LjM2LTYuNzM1IDUuMzZIMjAuNTE1Yy0zLjIzOCAwLTUuOTYtMi4yOS02LjczNC01LjM2YTcuMzA5IDcuMzA5IDAgMCAxLS4yMjItMS43OVY2OS42NzVoMjYuMzE4YzIuOTA3IDAgNS4yNSAyLjQ0OCA1LjI1IDUuNDJ2LjA0YzAgMi45NzEgMi4zNyA1LjM3IDUuMjc3IDUuMzdoMzQuNzg1YzIuOTA3IDAgNS4yNzctMi40MjEgNS4yNzctNS4zOTNWNzUuMWMwLTIuOTcyIDIuMzQzLTUuNDI2IDUuMjUtNS40MjZoMjYuMzE4djMzLjU2OWMwIC42MTctLjA3NyAxLjIxNi0uMjIxIDEuNzg5eiIgZmlsbD0iI0RDRTBFNiIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTE0OS4xMjEgMzMuMjkybC02LjgzIDIuNjVhMSAxIDAgMCAxLTEuMzE3LTEuMjNsMS45MzctNi4yMDdjLTIuNTg5LTIuOTQ0LTQuMTA5LTYuNTM0LTQuMTA5LTEwLjQwOEMxMzguODAyIDguMTAyIDE0OC45MiAwIDE2MS40MDIgMCAxNzMuODgxIDAgMTg0IDguMTAyIDE4NCAxOC4wOTdjMCA5Ljk5NS0xMC4xMTggMTguMDk3LTIyLjU5OSAxOC4wOTctNC41MjggMC04Ljc0NC0xLjA2Ni0xMi4yOC0yLjkwMnoiIGZpbGw9IiNEQ0UwRTYiLz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS42NSAxNS4zODMpIiBmaWxsPSIjRkZGIj4KICAgICAgPGVsbGlwc2UgY3g9IjIwLjY1NCIgY3k9IjMuMTY3IiByeD0iMi44NDkiIHJ5PSIyLjgxNSIvPgogICAgICA8cGF0aCBkPSJNNS42OTggNS42M0gwTDIuODk4LjcwNHpNOS4yNTkuNzA0aDQuOTg1VjUuNjNIOS4yNTl6Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
                        >
                      </div>
                      <p class="ant-empty-description">暂无流程数据</p>
                    </div>
                  </section>
                </template>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
    <dispatch-verification-modal
      ref="dispatchVerificationModal"
      @ok="dispatchVerificationModalFormOk"
    ></dispatch-verification-modal>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'
  import DispatchVerificationModal from './DispatchVerificationModal'

  export default {
    name: 'DispatchReduceApplicationDetailModal',
    components: {
      DispatchVerificationModal,
    },
    props:{
      socialHandleStatusOption:{
        type: Object,
        default: ()=>{},
        required: false
      },
    },
    data() {
      return {
        moment,
        model: {},
        title: '操作',
        isEdit: false,  // 修改
        visible: false,
        isVerify: false, // 是否显示审核按钮
        confirmLoading: false,
        form: this.$form.createForm(this),
        auditForm: this.$form.createForm(this),
        dateFormat: "YYYY-MM-DD", // 时间格式化类型
        activeKey: '1', // 默认第一个tab
        auditList: [],  // 审核流程数据
        empTypeBelongs: [], // 员工类型
        nextUserIdBelongs: [], // 下一步操作人
        reduceReasonBelongs: [],  // 减少原因
        settleDomainBelongs: [],  // 结算主体和部门
        fundStatus:{'0':'待办理','1':'已办理','2':'办理失败'},
        auditStatusOptions: {
          '0': {'option': '提交/申请', 'color': 'blue'},
          '1': {'option': '重新申请', 'color': 'pink'},
          '2': {'option': '审核成功', 'color': 'green'},
          '3': {'option': '审核失败', 'color': 'red'},
          '4': {'option': '委派', 'color': 'cyan'},
          '5': {'option': '办理失败', 'color': 'red'},
          '6': {'option': '办理成功', 'color': 'green'},
        },
        insuranceType:{
          pensionHandle:{name:'养老',val:null},
          medicalHandle:{name:'医疗',val:null},
          unemployHandle:{name:'失业',val:null},
          workInjuryHandle:{name:'工伤',val:null},
          birthHandle:{name:'生育',val:null},
          bigailmentHandle:{name:'大病',val:null},
        },
        url: {
          edit: 'hrSocial/tdispatchinfo/editForAdmin',
        },
      }
    },
    methods: {
      edit(record, auditProcessUrl = '',status) {
        this.form.resetFields()
        this.auditForm.resetFields()
        this.model = Object.assign({dispatchStatus:status,fundStatus:record.tdispatchInfo.fundHandleStatus}, record.tdispatchInfo)
        
        if(record.tsocialInfo){
          this.insuranceType.pensionHandle.val = record.tsocialInfo.pensionHandle
          this.insuranceType.medicalHandle.val = record.tsocialInfo.medicalHandle
          this.insuranceType.unemployHandle.val = record.tsocialInfo.unemployHandle
          this.insuranceType.workInjuryHandle.val = record.tsocialInfo.workInjuryHandle
          this.insuranceType.birthHandle.val = record.tsocialInfo.birthHandle
          if(!this.socialIsIllness){
            delete this.insuranceType.bigailmentHandle
          }else{
            this.insuranceType.bigailmentHandle.val = record.tsocialInfo.bigailmentHandle
          }
        }

        this.visible = true
        // 流程进展明细
        if (auditProcessUrl) {
          let type = (this.model.typeSub != 2) ? (this.model.typeSub*1 + 1) : (this.model.typeSub*1 + 3)
          httpAction(auditProcessUrl + '?id=' + this.model.id + '&type=' + type, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.auditList = res.data
            } else {
              this.$message.error('流程进展数据不完整！')
            }
          })
        }
        /************************************************* 员工数据 *************************************************/
        // 员工类型
        this.model.empType = filterDictText(this.empTypeBelongs, this.model.empType)
        // 结算主体
        let settleDomainTemp = this.model.settleDomain // 用于取所属单位
        this.model.settleDomain = this.model.belongUnit = '-'

        if (Object.keys(this.settleDomainBelongs).length) {
          this.model.settleDomain = (this.settleDomainBelongs).hasOwnProperty(settleDomainTemp) ? this.settleDomainBelongs[settleDomainTemp]['departName'] : '-'
          this.model.belongUnit = (this.settleDomainBelongs).hasOwnProperty(settleDomainTemp) ? this.settleDomainBelongs[settleDomainTemp]['customerName'] : '-'
        }
        // 联系电话
        this.model.empPhone = this.model.empMobile ? this.model.empMobile : this.model.empPhone
        /************************************************* 表单数据 *************************************************/
        this.model.socialReduceDate = this.model.socialReduceDate ? moment(this.model.socialReduceDate, this.dateFormat) : null // 停缴社保日期
        
        if (this.model.socialReduceDate) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'socialReduceDate'))
          })
        }

        this.model.fundReduceDate = this.model.fundReduceDate ? moment(this.model.fundReduceDate, this.dateFormat) : null // 停缴公积金日期
        
        if (this.model.fundReduceDate) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'fundReduceDate'))
          })
        }

        this.model.leaveDate = this.model.leaveDate ? moment(this.model.leaveDate, this.dateFormat) : null // 离职日期

        if (this.model.leaveDate) {
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'leaveDate'))
          })
        }

        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'reduceReason', 'reduceRemark'))
        })
      },
      // 审核按钮
      handleOk() {
        this.$refs.dispatchVerificationModal.Type = '1' // 派减
        this.$refs.dispatchVerificationModal.title = '审核确认'
        this.$refs.dispatchVerificationModal.ids = this.model.id
        this.$refs.dispatchVerificationModal.nextUserIdBelongs = this.nextUserIdBelongs
        this.$refs.dispatchVerificationModal.edit()
      },
      // 编辑
      handleEdit() {
        const that = this
        let requestData = {}  // 请求数据
        requestData.id = that.model.id
        // 触发表单验证
        that.form.validateFields((err, values) => {
          if (!err) {
            values.socialReduceDate = values.socialReduceDate ? values.socialReduceDate.format(that.dateFormat) : null
            values.fundReduceDate = values.fundReduceDate ? values.fundReduceDate.format(that.dateFormat) : null

            if (values.socialReduceDate) {
              requestData.socialReduceDate = values.socialReduceDate  // 社保时间
            }

            if (values.fundReduceDate) {
              requestData.fundReduceDate = values.fundReduceDate  // 公积金时间
            }

            that.confirmLoading = true
            let httpurl = ''
            httpurl += that.url.edit
            const method = 'POST'
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
      // tab切换
      tabsChange(e) {
        this.activeKey = e
      },
      // 表单关闭
      handleCancel() {
        this.close()
      },
      // 关闭功能与数据重置
      close() {
        this.$emit('close')
        this.isEdit = false  // 修改
        this.activeKey = '1' // 默认第一个tab
        this.auditList = []  // 审核流程数据
        this.visible = false
        this.isVerify = false // 是否显示审核按钮
        this.nextUserIdBelongs = [] // 下一步操作人
        this.confirmLoading = false
        this.insuranceType = {
          pensionHandle:{name:'养老',val:null},
          medicalHandle:{name:'医疗',val:null},
          unemployHandle:{name:'失业',val:null},
          workInjuryHandle:{name:'工伤',val:null},
          birthHandle:{name:'生育',val:null},
          bigailmentHandle:{name:'大病',val:null},
        }
      },
      // ok数据回调
      dispatchVerificationModalFormOk() {
        this.close()
        this.$emit('ok')
      },
    }
  }
</script>

<style scoped>
.ant-advanced-search-form .code-box-demo {
  padding: 42px 24px 50px;
  color: rgba(0, 0, 0, 0.65);
}
.ant-advanced-search-form .ant-empty {
  margin: 0 8px;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}
.ant-advanced-search-form .ant-empty-description {
  margin: 0;
}
</style>

<style lang="less" scoped>
.stepFormText {
  :global(.ant-form-item-label) {
    width: 125px;
  }
}
.stepFormTextOfLeaveDate {
  :global(.ant-form-item-label) {
    width: 90px;
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

.marginBot{
  margin-bottom: 5px;
}
.th{
  color: #000000d9;
}
.tags{
    font-size: 12px;
    color:#000000a6;
    padding: 10px 15px;
    display: inline-block;
    margin: 0px 0px 10px 104px;
  }
.successTag{
  display: inline-block;
  width: 70px;
  height: 30px;
  line-height: 30px;
  color: #37B655;
  text-align: center;
  background: url('/images/check_icon.png');
  background-size: 100% 100%;
  margin-right: 8px;
}
.errorTag{
  display: inline-block;
  width: 70px;
  height: 30px;
  line-height: 30px;
  color: #E84E4E;
  text-align: center;
  background: url('/images/error_icon.png');
  background-size: 100% 100%;
  margin-right: 8px;
}
.disTag{
  display: inline-block;
  width: 70px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-right: 8px;
  background: #f9f3f3;
  color: #999;
}
/deep/ .ant-timeline-item-head-red{
  background: url(/images/time_error_icon.png) center center;
  width: 14px;
  height: 14px;
  border: none;
}
/deep/ .ant-timeline-item-head-green{
  background: url(/images/time_check_icon.png) center center;
  width: 14px;
  height: 14px;
  border: none;
}
/deep/ .ant-timeline-item-head-blue{
  background: url(/images/time_rehandle_icon.png) center center;
  width: 14px;
  height: 14px;
  border: none;
}
/deep/ .ant-timeline-item-tail{
  left: 6px;
}
</style>
