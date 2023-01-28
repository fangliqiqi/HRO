<template>
  <a-modal
    :title="title"
    :width="800"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
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
            class="ant-advanced-search-form ant-form-detail"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="申请人员"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.apllyUserName ? model.apllyUserName : '-'"
                  >
                    {{ model.apllyUserName ? model.apllyUserName : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="解锁原因"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.unlockReason ? model.unlockReason : '-'"
                  >
                    {{ model.unlockReason ? model.unlockReason : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="员工姓名"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empName ? model.empName : '-'"
                  >
                    {{ model.empName ? model.empName : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="身份证号"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.empIdcard ? model.empIdcard : '-'"
                  >
                    {{ model.empIdcard ? model.empIdcard : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="结算主体"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.settleDomainName ? model.settleDomainName : '-'"
                  >
                    {{ model.settleDomainName ? model.settleDomainName : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="审核状态"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.applyStatus ? model.applyStatus : '-'"
                  >
                    {{ model.applyStatus ? model.applyStatus : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <a-col :span="12">
                <a-form-item
                  label="备注"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.remark ? model.remark : '-'"
                  >
                    {{ model.remark ? model.remark : '-' }}
                  </a-tooltip>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="申请时间"
                  class="stepFormText"
                >
                  <a-tooltip
                    placement="topLeft"
                    :title="model.applyTime ? model.applyTime : '-'"
                  >
                    {{ model.applyTime ? model.applyTime : '-' }}
                  </a-tooltip>
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
              <a-col :span="24">
                <template v-if="auditList.length > 0">
                  <a-timeline style="margin-left: 50px">
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
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { filterDictText } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'EmployeeUnlockDetailModal',
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        auditForm: this.$form.createForm(this),
        auditList: [],  // 列表数据
        activeKey: '1', // 默认第一个tab
        applyStatusBelongs: {}, // 状态
        unlockReasonBelongs: [],  // 原因
        auditStatusOptions: {
          '0': {'option': '申请', 'color': 'blue'},
          '1': {'option': '委派审核', 'color': 'cyan'},
          '2': {'option': '审核不通过', 'color': 'red'},
          '3': {'option': '重新申请', 'color': 'pink'},
          '4': {'option': '审核通过', 'color': 'green'},
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record, auditProcessUrl = '') {
        this.form.resetFields()
        this.auditForm.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.model.unlockReason = filterDictText(this.unlockReasonBelongs, this.model.unlockReason) // 申请原因

        // 审核状态
        for (const key in this.applyStatusBelongs) {
          if (String(this.model.applyStatus) === String(key)) {
            this.model.applyStatus = this.applyStatusBelongs[key]['option']
            break
          }
        }

        // 流程进展明细
        if (auditProcessUrl) {
          httpAction(`${auditProcessUrl}?id=${this.model.id}`, '', 'GET').then((res) => {
            if (Number(res.code) === 200 && res.data) {
              this.auditList = res.data
            } else {
              this.$message.error('流程进展数据不完整！')
            }
          })
        }
      },
      // tab切换
      tabsChange(e) {
        this.activeKey = e
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.auditList = []  // 列表数据
        this.activeKey = '1'  //默认第一个tab
        this.confirmLoading = false
        this.applyStatusBelongs = {} // 状态
        this.unlockReasonBelongs = []  // 原因
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  margin-bottom: 0px;
  :global(.ant-form-item-label) {
    width: 120px;
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

.ant-form-detail {
  :global(.ant-form-item-control .ant-form-item-children) {
    width: 240px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  :global(.form-item-remark .ant-form-item-control .ant-form-item-children) {
    width: 694px;
  }
}
</style>
<style scoped>
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
