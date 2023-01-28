<template>
  <a-modal
    :title="title"
    :width="1200"
    placement="right"
    :closable="true"
    @ok="handleOk"
    okText="替换"
    @cancel="handleCancel"
    cancelText="关闭"
    :visible="visible"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        :form="form"
        layout="inline"
        class="ant-advanced-search-form"
        style="padding:0px;"
      >
        <a-row>
          <a-col :span="24">
            <div>

              <!-- 查询区域 -->
              <div class="table-page-search-wrapper">
                <a-form layout="inline">
                  <a-row :gutter="24">
                    <a-col
                      :md="6"
                      :sm="8"
                    >
                      <a-form-item label="员工姓名">
                        <a-input
                          placeholder="请输入员工姓名"
                          v-model="queryParam.empName"
                        ></a-input>
                      </a-form-item>
                    </a-col>

                    <a-col
                      :md="6"
                      :sm="8"
                    >
                      <a-form-item label="身份证号">
                        <a-input
                          placeholder="请输入身份证号"
                          v-model="queryParam.empIdcard"
                        ></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col
                      :md="6"
                      :sm="8"
                    >
                      <a-form-item label="结算主体">
                        <a-select
                          v-model="queryParam.settleDomain"
                          placeholder="请选择结算主体查询"
                        >
                          <a-select-option value="">全部</a-select-option>
                          <a-select-option
                            v-for="(value, key) in settleDomainOptions"
                            :key="key"
                            :value="value.id"
                          >{{ value.departName }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>

                    <a-col
                      :md="6"
                      :sm="8"
                    >
                      <span
                        style="float: left;overflow: hidden;"
                        class="table-page-search-submitButtons"
                      >
                        <a-button
                          type="primary"
                          @click="searchReset"
                          icon="reload"
                          style="margin-left: 8px"
                        >重置</a-button>
                        <a-button
                          type="primary"
                          @click="searchQuery"
                          icon="search"
                        >查询</a-button>
                      </span>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
              <!--列表-->
              <a-table
                :columns="columns"
                :dataSource="dataSource"
                :bordered="true"
                ref="table"
                size="middle"
                rowKey="id"
                :pagination="ipagination"
                :customRow="rowSelect"
                :loading="loading"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio'}"
              >
                <!-- 在职状态 -->
                <span
                  slot="workFlag"
                  slot-scope="text, record"
                >
                  <template v-for="(workFlag, key) in workFlagOptions">
                    <a-tag
                      :key="key"
                      v-if="record.workFlag == key"
                      :color="workFlag.color"
                    >{{ workFlag.option }}</a-tag>
                  </template>
                </span>
              </a-table>

            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { filterObj } from '@/utils/util'
import { httpAction,getAction } from '@/api/manage'
import { initDictOptions,filterDictText } from '@/components/dict/JDictSelectUtil'
import { getAllSettleDomainSelectVos } from '@/api/api'

export default {
  name: 'EmployeeListModal',
  // mixins: [JeecgListMixin],
  data() {
    return {
      title: '替换',
      moment,
      /* 查询条件 */
      queryParam: {},
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]}共${total}条`
        },
        onChange:(page,pageSize)=>{
          this.ipagination.current=page
          this.ipagination.pageSize=pageSize;
          this.loadDatas()
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: '',
      getQueryParams() {
        //获取查询条件
        const sqp = {}
        if (this.superQueryParams) {
          sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
        //param.field = this.getQueryField()
        param.current = this.ipagination.current
        param.size = this.ipagination.pageSize
        return filterObj(param)
      },
      empTypeOptions:[], //人员类型
      settleDomainOptions:[], //结算主体
      replaceEmpId:'', //替换的员工id
      workFlagOptions: {'0': {'option': '在职', 'color': 'green'}, '1': {'option': '离职', 'color': 'red'}},

      columns: [
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'empName'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcard'
        },
        {
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDomain',
          customRender: (text) => {
            return Object.keys(this.settleDomainOptions).length ? this.settleDomainOptions[text]['departName'] : ''
          }
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'empPhone'
        },
        {
          title: '在职状态',
          align: 'center',
          dataIndex: 'workFlag',
          scopedSlots: { customRender: 'workFlag' },
        },
        {
          title: '员工类型',
          align: 'center',
          dataIndex: 'empType',
          customRender: (text) => {
            return filterDictText(this.empTypeOptions, text)
          }
        }
      ],
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      dateFormat: 'YYYY-MM-DD',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      url: {
        list: '/hrBase/temployeeinfo/page', //员工信息列表请求地址
        replaceOneUrl:'/busiInsurance/tbusinessinsurance/replaceOne' //替换
      }
    }
  },
  methods: {
    loadDatas(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()//查询条件
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        if (res.code === 200) {
          var listPath = this.$route.path
          var pathArr = listPath.split('/')
          this.dataSource = res.data.records
          if(String(pathArr[1]) === 'dispose'){
            for(const item in this.dataSource){
              if(String(this.dataSource[item].effectiveFlag) === '1'){
                this.dataSource[item].effectiveFlagText = '有效'
              }else{
                this.dataSource[item].effectiveFlagText = '无效'
              }
            }
          }
          this.ipagination.total = res.data.total
          this.loading = false;
        }
      })
    },
    searchQuery() {
      this.loadDatas(1)
    },
    searchReset() {
      this.queryParam = {}
      this.loadDatas(1)
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      this.replaceEmpId = this.selectedRowKeys[0]
    },
    rowSelect(record){
        return {
            on: {
               click: () => {
                this.selectedRowKeys=[record.id] //点击行选中
                this.replaceEmpId=record.id
               }
            }
        }
    },
    // 数据字典
    initDictConfig() {
      // 员工类型
      initDictOptions('personnel_type').then((res) => {
        if (res.code === 200) {
          this.empTypeOptions = res.data
        }
      });
      // 结算主体和所属单位
      getAllSettleDomainSelectVos().then((res) => {
        if (res.code === 200) {
          this.settleDomainOptions = res.data
        } else {
          this.$message.error('结算主体和所属单位数据请求失败！')
        }
      })
    },

    handleOk(){ //提交表单
      const _this = this
      if(!this.replaceEmpId){
        this.$message.error('请先选择替换的员工!')
        return false
      }
      if(String(this.empId) === String(this.replaceEmpId)){
        this.$message.error('替换的员工不能与原来的员工相同!')
        return false
      }
      this.confirmLoading=true
      httpAction(this.url.replaceOneUrl, {id:this.id,newEmpId:this.replaceEmpId}, 'PUT').then((res) => {
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
    },
    add(record) {
      this.model = Object.assign({}, record)
      this.loadDatas()
      this.initDictConfig()
      this.visible = true
    },
    handleCancel() {
      this.close()
    },
    close() {
      // this.$emit('close')
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

.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px 0px;
}

.steps-action {
  margin-top: 24px;
}

.select-list {
  text-align: left;
}
.select-list label {
  display: inline-block;
  text-align: right;
  width: 100px;
  margin-right: 15px;
}
.select-list span {
  color: #0f0202;
}
</style>
