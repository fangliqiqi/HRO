<template>
  <a-modal
    :title="title"
    :width="700"
    placement="right"
    :closable="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="提交"
    :visible="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
      >
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="结算主体"
              class="stepFormText"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                placeholder="请搜索选择结算主体"
                v-decorator="['settlementOrgan', { rules: [{ required: true, message: '请搜索选择结算主体!' }] }]"
                style="width: 191px"
                @change="settleDomainChange"
                @search="handleSearch"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
              >
                <a-select-option
                  v-for="(value, key) in settleDomains"
                  :key="key"
                  :value="value.id"
                >{{ value.departName }}</a-select-option>
                <!-- <div
                  slot="dropdownRender"
                  slot-scope="menu"
                >
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0;" />
                  <a-pagination
                    style="text-align:center"
                    size="small"
                    :total="totalPage"
                    @change="handleChange"
                  />
                </div> -->
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="结算月份"
              class="stepFormText"
            >
              <a-month-picker
                placeholder="请选择结算月份"
                :format="'YYYYMM'"
                style="width: 200px"
                v-decorator="['settleMonth',{ rules: [{ required: true, message: '请选择结算月份!' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="备注"
              class="stepFormText"
            >
              <a-textarea
                :rows="3"
                placeholder="请填写备注"
                v-decorator="['remark']"
                style="width: 450px;resize:none;"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :pagination="ipagination"
            @change="handleTableChange"
            rowKey="id"
          >
          </a-table>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import moment from 'moment'

  export default {
    name: 'GenerateSettlementBillModal',
    components: {
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    data() {
      return {
        ids: '',
        model: {},
        title: '生成结算单',
        visible: false,
        confirmLoading: false,
        settleDomains:[],
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        url: {
          generateSettlementBill: '/busiInsurance/tbusinessinsurance/generateSettlementBill',
          setteleDomain:'/hrBase/tsettledomain/getSettleDomainSelectVos',
          getSettleDomainList: '/hrBase/tsettledomain/getSettleDomainSelectVosDomainNameOrCode', //查询结算主体
          getSettleDomainPage:'/hrBase/tsettledomain/page'
        },
        
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
          total: 0
        },
        columns:[
          {
            title: '结算月份',
            dataIndex: 'settlementMonth',
            width: 80,
            ellipsis: true,
            align: 'center',
          },
          {
            title: '结算主体',
            dataIndex: 'settleDomainName',
            width: 80,
            ellipsis: true,
            align: 'center',
          },
          {
            title: '预估差额',
            dataIndex: 'balance',
            width: 80,
            ellipsis: true,
            align: 'center',
          }
        ],
        dataSource:[],
      }
    },
    methods: {
      getPageDate(current,size){
        const params = {
          status:0,
          current:current,
          size:size,
          createUserId:this.$store.getters.userInfo.id,
          settleDomainId:this.settleDomain ? this.settleDomain.id : ''
        }
        const qs = require('qs')
        httpAction(`/busiInsurance/aloneforecastbuypayform/page?${qs.stringify(params)}`,null,'get').then((res) => {
          if(res.code === 200 && res.data){
            this.dataSource = res.data.records
            this.ipagination.total = res.data.total
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      handleTableChange(pagination){
        //分页、排序、筛选变化时触发
        this.ipagination = pagination
        this.getPageDate(pagination.current,pagination.pageSize)
      },
      popupScroll(e){
        const { target } = e
        // scrollHeight：代表包括当前不可见部分的元素的高度
        // scrollTop：代表当有滚动条时滚动条向下滚动的距离，也就是元素顶部被遮住的高度
        // clientHeight：包括padding但不包括border、水平滚动条、margin的元素的高度
        const rmHeight = target.scrollHeight - target.scrollTop;
        const clHeight = target.clientHeight //250
        console.log(rmHeight,clHeight,target.scrollTop + target.offsetHeight,target.scrollHeight)
      },
      handleSearch(value) {
        this.settleDomains = [];
        httpAction(this.url.getSettleDomainList + "?departName=" + value + '&departNo=' + value ,null,'GET').then((res) => {
          if(res.code == 200 ) {
            this.settleDomains = res.data
          }
        })
      },
      settleDomainChange(v) {
        for (let item of this.settleDomains) {
          if(item.id == v) {
            this.settleDomain = item
          }
        }
        this.getPageDate(1,10)
      },
      edit(record) {
        this.model = Object.assign({}, record)
        this.visible = true
        this.getPageDate(1,10)
      },
      // 保存按钮
      handleOk() {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            _this.confirmLoading = true
            const httpurl = this.url.generateSettlementBill
            const method = 'put'
            values.settleMonth = moment(values.settleMonth).format('YYYYMM');
            httpAction(httpurl, values, method).then((res) => {
              if (res.code === 200) {
                _this.$message.success(`${_this.title}成功！`)
                _this.$emit('ok')
                _this.close()
              } else {
                _this.$message.warning(res.msg)
              }
            }).finally(() => {
              _this.confirmLoading = false
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.form.resetFields()
        this.$emit('close')
        this.visible = false
      }
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
.stepFormText {
  :global(.ant-form-item-label) {
    width: 100px;
  }
}
</style>
