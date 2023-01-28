<template>
  <a-modal
    :title="title"
    :width="600"
    :closable="true"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        type="primary"
        @click="handleOk"
        :loading="confirmLoading"
      >保存</a-button>
    </template>

    <a-spin :spinning="spinning">
      <a-card
        :bordered="true"
        title="结算单信息"
        v-if="formTypeStatus==2"
      >
        <detail-list :col="2">
          <detail-list-item term="客户单位">{{ settleDomainSelected.unitName ? settleDomainSelected.unitName : '-' }}</detail-list-item>
          <detail-list-item term="结算主体">{{ settleDomainSelected.settleDomainName ? settleDomainSelected.settleDomainName : '-' }}</detail-list-item>
          <detail-list-item term="结算金额">{{ settleDomainSelected.settleDomainMoney ? settleDomainSelected.settleDomainMoney : 0 }}</detail-list-item>
          <detail-list-item term="结算月份">{{ settleDomainSelected.setlleMonth ? settleDomainSelected.setlleMonth : '-' }}</detail-list-item>
        </detail-list>
      </a-card>
      <a-card
        :bordered="true"
        title="结算单信息"
        v-if="formTypeStatus==3"
      >
        <detail-list :col="2">
          <detail-list-item term="客户单位">{{ settleDomainSelected.customerName ? settleDomainSelected.customerName : '-' }}</detail-list-item>
          <detail-list-item term="结算主体">{{ settleDomainSelected.departName ? settleDomainSelected.departName : '-' }}</detail-list-item>
          <detail-list-item term="结算金额（含税）">{{ settleDomainSelected.sumSettle ? settleDomainSelected.sumSettle : 0 }}</detail-list-item>
          <detail-list-item term="税金">{{ settleDomainSelected.taxAmount ? settleDomainSelected.taxAmount : 0 }}</detail-list-item>
          <detail-list-item term="业务收入">{{ settleDomainSelected.income ? settleDomainSelected.income : 0 }}</detail-list-item>
          <detail-list-item term="成本合计数据">{{ settleDomainSelected.costSum ? settleDomainSelected.costSum : 0 }}</detail-list-item>
          <detail-list-item term="结算时间">{{ settleDomainSelected.settleDate ? settleDomainSelected.settleDate : 0 }}</detail-list-item>
        </detail-list>
      </a-card>
    </a-spin>

  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import DetailList from '@/components/tools/DetailList'
  const DetailListItem = DetailList.Item

  export default {
    name: 'MatchInAccountOfStatementSubmitModal',
    components: {
      DetailList,
      DetailListItem,
    },
    data() {
      return {
        model: {},
        title: '操作',
        visible: false,
        confirmLoading: false,
        spinning: false,
        requestData: {},  // 请求的数据
        formTypeStatus: 2,  // 纯收入
        settleDomainSelected: {}, // 选中的结算单信息
        url: {
          add: 'salary/tmatchingclaime/saveSingle', // 纯收入
          billAdd: 'hrOneTime/tsettlebill/updateClaimIdById', // 事务性外包【removeFlag：移除标识(0:匹配 1:移除)】
        },
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit() {
        this.visible = true
      },
      // 保存按钮
      handleOk() {
        const that = this
        let method = ''
        let httpurl = ''
        let requestData = {}
        that.spinning = true
        that.confirmLoading = true
        if (String(this.formTypeStatus) === '2') { // 纯收入
          method += 'POST'
          httpurl += this.url.add
          requestData.matchingMoney = this.requestData.matchingMoney
          requestData.matchingClaimeList = JSON.stringify(this.requestData.matchingClaimeList)
          httpAction(httpurl, requestData, method).then((res) => {
            if (Number(res.code) === 200) {
              that.$message.success('匹配收入保存成功！')
              that.$emit('ok')
              that.close()
            } else {
              that.$message.warning(res.msg || res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
            that.spinning = false
          })
        } else {  // 事务性外包
          method += 'PUT'
          httpurl += this.url.billAdd
          let addRecordIds = '' // 新增id
          let keepRecordIds = ''  // 不变id
          let deleteRecordIds = ''  // 删除id
          let isDelete = false
          httpurl += (`?ids=${this.settleDomainSelected.id}&type=2`) // 结算单id, 1一个认领记录对应多个结算单。2 多个认领记录对应一个结算单 
          for (const matched of this.requestData.matchingClaimeList) {
            if (String(matched.flag) === '0') { // 新增的时候【新增】
              addRecordIds += (`${matched.recordId},`)
            }
            if (String(matched.flag) === '2') { // 编辑的时候【不变】
              isDelete = true
              keepRecordIds += (`${matched.recordId},`)
            }
            if (String(matched.flag) === '1') { // 编辑的时候【删除】
              isDelete = true
              deleteRecordIds += (`${matched.recordId},`)
            }
          }
          if (isDelete) { // 编辑
            const deleteIdsStr = (keepRecordIds + deleteRecordIds)
            let deleteUrl = httpurl
            deleteUrl += (`&removeFlag=1&claimIds=${deleteIdsStr.substring(0, deleteIdsStr.length - 1)}`) // 移除标识(0:匹配 1:移除)
            httpAction(deleteUrl, {}, method).then((res) => {  // 先删除
              if (Number(res.code) === 200) {
                const addIdsStr = (addRecordIds + keepRecordIds)
                let reqUrl = httpurl
                reqUrl += (`&removeFlag=0&claimIds=${addIdsStr.substring(0, addIdsStr.length - 1)}`) // 移除标识(0:匹配 1:移除)
                httpAction(reqUrl, {}, method).then((res) => {  // 再新增
                  if (Number(res.code) === 200) {
                    that.$message.success('匹配收入保存成功！')
                    that.$emit('ok')
                    that.close()
                  } else {
                    that.$message.warning(res.msg || res.message)
                  }
                }).finally(() => {
                  that.confirmLoading = false
                  that.spinning = false
                })
              } else {
                that.$message.warning(res.msg || res.message)
                that.confirmLoading = false
                that.spinning = false
              }
            })
          } else {  // 新增
            let reqUrl = httpurl
            reqUrl += (`&removeFlag=0&claimIds=${addRecordIds.substring(0, addRecordIds.length - 1)}`) // 移除标识(0:匹配 1:移除)
            httpAction(reqUrl, {}, method).then((res) => {
              if (Number(res.code) === 200) {
                that.$message.success('匹配收入保存成功！')
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.msg || res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.spinning = false
            })
          }
        }
      },
      // 关闭功能
      handleCancel() {
        this.close()
      },
      // 表单关闭与数据重置
      close() {
        this.$emit('close')
        this.visible = false
        this.requestData =  {}  // 请求的数据
        this.confirmLoading = false
        this.formTypeStatus = 2  // 纯收入
        this.settleDomainSelected = {} // 选中的结算单信息
      },
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
  margin-bottom: 0px;
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
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}
</style>
