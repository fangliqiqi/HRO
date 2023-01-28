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
      <a-button
        key="back"
        @click="handleCancel"
      >关闭</a-button>
    </template>

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
              <div class="steps-content">
                <!-- 查询区域 -->
                <div class="table-page-search-wrapper">
                  <a-form layout="inline">
                    <a-row :gutter="24">
                      <a-col
                        :md="6"
                        :sm="8"
                      >
                        <a-form-item label="员工编码">
                          <a-input
                            placeholder="请输入员工编码"
                            v-model="queryParam.empNo"
                          ></a-input>
                        </a-form-item>
                      </a-col>

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
                        <span
                          style="float: left;overflow: hidden;"
                          class="table-page-search-submitButtons"
                        >
                          <a-button
                            type="primary"
                            @click="searchQuery"
                            icon="search"
                          >查询</a-button>
                          <a-button
                            type="primary"
                            @click="searchReset"
                            icon="reload"
                            style="margin-left: 8px"
                          >重置</a-button>
                        </span>
                      </a-col>
                    </a-row>
                  </a-form>
                </div>
                <!--列表-->
                <a-table
                  rowKey="id"
                  ref="table"
                  size="middle"
                  :bordered="true"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :customRow="rowSelect"
                  :loading="loading"
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
                  @change="handleTableChange"
                >
                </a-table>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <dispatch-add-application-modal
      ref="dispatchAddApplicationModal"
      @ok="dispatchAddApplicationModalFormOk"
    ></dispatch-add-application-modal>
  </a-modal>
</template>

<script>
import { filterObj } from '@/utils/util'
import { getHouseHold } from '@/api/api'
import { getAction, httpAction } from '@/api/manage'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import DispatchAddApplicationModal from './DispatchAddApplicationModal'

export default {
  name: 'DispatchAddApplicationEmployeeListModal',
  components: {
    DispatchAddApplicationModal,
  },
  data() {
    return {
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
          return `${range[0]}-${range[1]} 共${total}条`
        },
        onChange: (page, pageSize) => {
          this.ipagination.current = page
          this.ipagination.pageSize = pageSize
        },
        showQuickJumper: false,
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
        let sqp = {}

        if (this.superQueryParams) {
          sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        }

        var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
        param.current = this.ipagination.current
        param.size = this.ipagination.pageSize
        
        return filterObj(param)
      },
      columns: [
        {
          width: 125,
          ellipsis: true,
          title: '员工编码',
          align: 'center',
          dataIndex: 'empNo',
          customRender:(text) => {
            let str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 80,
          ellipsis: true,
          title: '员工姓名',
          align: 'center',
          dataIndex: 'empName',
          customRender:(text) => {
            let str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 160,
          ellipsis: true,
          title: '身份证号',
          align: 'center',
          dataIndex: 'empIdcard',
          customRender:(text) => {
            let str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 160,
          ellipsis: true,
          title: '客户单位',
          align: 'center',
          dataIndex: 'unitId',
          customRender:(text, record) => {
            let str = ((Object.keys(this.settleDomainBelongs).length) && (this.settleDomainBelongs).hasOwnProperty(record.settleDomain)) ? (this.settleDomainBelongs)[record.settleDomain]['customerName'] : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 160,
          ellipsis: true,
          title: '结算主体',
          align: 'center',
          dataIndex: 'settleDomain',
          customRender:(text, record) => {
            let str = ((Object.keys(this.settleDomainBelongs).length) && (this.settleDomainBelongs).hasOwnProperty(record.settleDomain)) ? (this.settleDomainBelongs)[record.settleDomain]['departName'] : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 90,
          ellipsis: true,
          title: '手机号',
          align: 'center',
          dataIndex: 'empPhone',
          customRender:(text) => {
            let str = text ? text : '-'
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
        {
          width: 80,
          ellipsis: true,
          title: '员工类型',
          align: 'center',
          dataIndex: 'empType',
          customRender:(text) => {
            let str = filterDictText(this.empTypeBelongs, text)
            return <a-tooltip placement="topLeft" title={str}>{str}</a-tooltip>
          },
        },
      ],
      title: '操作',
      visible: false,
      filterDictText,
      confirmLoading: false,
      form: this.$form.createForm(this),
      AreaTrees: [], // 三级地区
      houseHolds: [],
      empTypeBelongs: [], // 员工类型
      fundPayPointBelongs: [],  // 公积金单边小数点
      settleDomainBelongs: [],  // 结算主体和部门
      url: {
        list: 'hrBase/temployeeinfo/pageForDispatch?deleteFlag=0&searchType=0', // 员工信息列表[searchType:0可派增，1可派减]
        queryAllInfoById: 'hrSocial/tdispatchinfo/getSocialAndFundById',  // 派增详情（派单信息、员工信息）
      },
    }
  },
  methods: {
    async loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性！')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1  // 重置第一页
      }
      var params = this.getQueryParams()//查询条件
      this.loading = true;
      this.dataSource = [];
      this.ipagination.total = 0;
      const res = await getAction(this.url.list, params);
      if (res.code === 200) {
        if (res.data && res.data.records && res.data.records.length > 0) {
          this.dataSource = res.data.records;
          this.ipagination.total = res.data.total;
          // 获取结算主体数据
          const settleDomainIds = []
          res.data.records.reduce((acc,cur)=>{
            settleDomainIds.push(cur.settleDomain)
          },[])
          const ids = settleDomainIds.join(',')
          const resSet = await httpAction(`/hrBase/tsettledomain/selectSettleDomainAndCustomerMapByIds?ids=${ids}`,null,'get')
          if(Number(resSet.code) === 200) {
            this.settleDomainBelongs = resSet.data.settleDomainMap;
          }else {
            this.$message.error('结算主体和所属单位数据请求失败！')
          }
        }
      }
      this.loading = false;
      
    },
    // 条件查询
    searchQuery() {
      this.loadData(1)
    },
    // 条件重置
    searchReset() {
      this.queryParam = {}
      this.loadData(1)
    },
    //分页、排序、筛选变化时触发
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    // 点击按钮选中
    async onSelectChange(selectedRowKeys, selectionRows) {
      // if (!new RegExp(/^((0\d{2,3}-?\d{7,8})|(1[3456789]\d{9}))$/).test(selectionRows[0].empPhone)) {
      if (!selectionRows[0].empPhone) {
        this.$message.warning('员工没有手机号，请去档案更新后再派单！')
        return false
      }else if(!new RegExp(/^1[3456789]\d{9}$/).test(selectionRows[0].empPhone)){
        this.$message.warning('员工手机号码格式不正确，请去档案更新后再派单！')
        return false
      }
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
      // 判断能否派增
      const res = await httpAction(`/hrSocial/tfinancedispatch/judgeIsDispatchByUnitId?unitId=${selectionRows[0].belongUnit}`,null,'get');
      if(res.code === 200){
        this.openDispatchApplicationModal(selectionRows[0]) // 第一个
      }else{
        this.$message.warning(res.msg);
      }
    },
    // 点击整行选中
    rowSelect(record) {
      return {
        on: {
          click: async () => {
            if (!record.empPhone) {
              this.$message.warning('员工没有手机号，请去档案更新后再派单！')
              return false
            }else if(!new RegExp(/^1[3456789]\d{9}$/).test(record.empPhone)){
              this.$message.warning('员工手机号码格式不正确，请去档案更新后再派单！')
              return false
            }
            this.selectedRowKeys = [record.id]  // 点击行选中
            // 判断能否派增
            const res = await httpAction(`/hrSocial/tfinancedispatch/judgeIsDispatchByUnitId?unitId=${record.belongUnit}`,null,'get');
            if(res.code === 200){
              this.openDispatchApplicationModal(record)
            }else{
              this.$message.warning(res.msg);
            }
          }
        }
      }
    },
    // 添加
    add(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    // 打开表单页
    openDispatchApplicationModal(record) {
      if (record.empType == 2 || record.empType == 10 || record.empType == 17) {  // "2"："代发工资"；"17"："商险"；"10"："商险人员"
        this.$message.warning('派单的员工类型不可为“代发工资”、“商险”、“商险人员”，请去档案更新！')
        return false;
      }

      this.handleCancel() // 关闭列表页
      this.$refs.dispatchAddApplicationModal.title = '增加派单'
      this.$refs.dispatchAddApplicationModal.houseHolds = this.houseHolds
      this.$refs.dispatchAddApplicationModal.AreaTrees = this.AreaTrees
      this.$refs.dispatchAddApplicationModal.empTypeBelongs = this.empTypeBelongs
      this.$refs.dispatchAddApplicationModal.fundPayPointBelongs = this.fundPayPointBelongs
      this.$refs.dispatchAddApplicationModal.settleDomainBelongs = this.settleDomainBelongs
      
      httpAction(this.url.queryAllInfoById + '?empId=' + record.id, '', 'GET').then((res) => {
        if (Number(res.code) === 200 && res.data) {
          if (res.data.socialInfo && res.data.fund) { // 社保公积金都已存在
            this.$message.warning('社保、公积金数据已存在，无需再添加！')
          } else {
            if (res.data.socialInfo) {  // 已有社保数据
              // 获取社保户
              getHouseHold({id: res.data.socialInfo.socialHousehold}).then((socialHousehold) => {
                if (socialHousehold.code === 200 && socialHousehold.data.length > 0) {
                  this.$refs.dispatchAddApplicationModal.socialExist = true
                  this.$refs.dispatchAddApplicationModal.recordInfo = res.data
                  this.$refs.dispatchAddApplicationModal.selectHouseholdOptions = socialHousehold.data
                  this.$refs.dispatchAddApplicationModal.edit(res.data)
                } else {
                  this.$message.error('社保户数据请求失败！')
                }
              })
            } else if (res.data.fund) { // 已有公积金数据
              // 获取公积金户
              getHouseHold({id: res.data.fund.providentHousehold}).then((providentHousehold) => {
                if (providentHousehold.code === 200 && providentHousehold.data.length > 0) {
                  this.$refs.dispatchAddApplicationModal.fundExist = true
                  this.$refs.dispatchAddApplicationModal.recordInfo = res.data
                  this.$refs.dispatchAddApplicationModal.selectHouseholdOptions = providentHousehold.data
                  this.$refs.dispatchAddApplicationModal.edit(res.data)
                } else {
                  this.$message.error('公积金户数据请求失败！')
                }
              })
            } else {  // 社保、公积金都没有
              this.$refs.dispatchAddApplicationModal.edit(record)
            }
          }
        } else {
          this.$message.error('社保、公积金数据请求失败！')
        }
      })
    },
    // 新建弹框关闭
    dispatchAddApplicationModalFormOk() {
      this.$emit('ok')
    },
    // 表单关闭
    handleCancel() {
      this.close()
    },
    // 关闭功能与数据重置实现
    close() {
      this.$emit('close')
      this.queryParam = {}
      this.visible = false
      this.selectionRows = []
      this.selectedRowKeys = []
      this.confirmLoading = false
      this.ipagination.current = 1
    },
  }
}
</script>

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
