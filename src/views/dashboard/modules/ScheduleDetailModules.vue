<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    okText="保存"
    @cancel="handleCancel"
    :maskClosable="false"
    cancelText="关闭"
    :footer="null"
    :destroyOnClose="true"
  >
    <!-- <happy-scroll
      color="rgba(23, 22, 22, 0.68)"
      size="5"
      style="max-height:300px;width:700px;"
      resize
    > -->
    <a-row :gutter="24">
      <a-col :span="24">
        <a-table
          ref="table"
          size="middle"
          rowKey="id"
          bordered
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
        >
          <template
            slot="priority"
            slot-scope="text"
          >
            <a-tag :color="priorityOption[text].color">{{ priorityOption[text].text }}</a-tag>
          </template>
          <template
            slot="status"
            slot-scope="text"
          >
            <a-tag :color="statusOption[text].color">{{ statusOption[text].text }}</a-tag>
          </template>
          <a-card
            slot="expandedRowRender"
            slot-scope="text"
          >
            <a-row :gutter="24">
              <a-col :span="13">
                <a-card class="detail">
                  <h4><strong>描述</strong></h4>
                  <p>{{ text.description }}</p>
                  <!-- <a-divider />
                  <h4><b>历史记录</b></h4>
                  <p>2143242345324324245324</p> -->
                </a-card>
                <a-row
                  :gutter="24"
                  :style="{marginTop:'15px',textAlign:'center'}"
                >
                  <div class="btnDiv">
                    <a @click="handleEdit(text)">
                      <a-icon
                        type="edit"
                        :style="{fontSize:'20px',color:'#fff'}"
                      /></a>
                    <a-popconfirm
                      title="删除后相应的提醒将消失，确认删除？"
                      @confirm="confirm(text.id)"
                      okText="是"
                      cancelText="否"
                    >
                      <a-icon
                        type="delete"
                        :style="{fontSize:'20px',color:'#fff'}"
                      />
                    </a-popconfirm>
                    <a
                      title="完成"
                      @click="handleFinish(text)"
                      v-if="text.status < 2"
                    >
                      <a-icon
                        type="check-square"
                        :style="{fontSize:'20px',color:'#fff'}"
                      /></a>
                  </div>
                </a-row>
              </a-col>
              <a-col :span="11">
                <a-card class="dlist">
                  <h4><strong>基本信息</strong></h4>
                  <p>
                    <label>优先级</label>
                    <span>
                      <a-tag :color="priorityOption[text.priority].color">{{ priorityOption[text.priority].text }}</a-tag>
                    </span>
                  </p>
                  <p>
                    <label>状态</label>
                    <span>
                      <a-tag :color="statusOption[text.status].color">{{ statusOption[text.status].text }}</a-tag>
                    </span>
                  </p>
                  <p>
                    <label>类型</label>
                    <span>{{ typeOption[text.type] }}</span>
                  </p>
                  <p>
                    <label>所有者</label>
                    <span>{{ nickname() }}</span>
                  </p>
                  <p>
                    <label>日期</label>
                    <span>{{ formatDate(text.doDate,"YYYY-MM-DD") }}</span>
                  </p>
                  <p>
                    <label>起止时间</label>
                    <span>{{ formatDate(text.startTime,"HH:mm:ss") }} ~ {{ formatDate(text.endTime,"HH:mm:ss") }}</span>
                  </p>
                </a-card>
              </a-col>
            </a-row>
          </a-card>
        </a-table>
      </a-col>
    </a-row>
    <!-- </happy-scroll> -->
    <schedule-edit-modules ref="ScheduleEditModules"></schedule-edit-modules>
  </a-modal>
</template>
  
<script>
  import moment from 'moment'
  import { httpAction } from '@/api/manage'
  import ScheduleEditModules from './ScheduleEditModules'
  import { mapGetters } from 'vuex'
  import { HappyScroll } from 'vue-happy-scroll'
  import 'vue-happy-scroll/docs/happy-scroll.css'

  export default {
    name:'ScheduleDetailModules',
    components: {
      HappyScroll,
      ScheduleEditModules
    }, //在组件内注册
    data() {
      return {
        title: '待办事项列表',
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          todoName: { rules: [{ required: true, message: '请输入待办名称!' }] },
        },
        typeOption:['自定义','日常任务'],
        priorityOption:[{color:'#2db7f5',text:'一般'},{color:'#FF82AB',text:'最高'},{color:'green',text:'较高'},{color:'blue',text:'最低'}],
        statusOption:[{color:'orange',text:'未开始'},{color:'#2db7f5',text:'进行中'},{color:'green',text:'已完成'},{color:'#5b6f7d',text:'已关闭'}],
        currentDate:'', //当前日期
        url:{
          modify:'hrGeneral/ttodolistdiy',
          del:'hrGeneral/ttodolistdiy/',
          get:'hrGeneral/ttodolistdiy/getThisMonthToDoList'
        },
        
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 }
        },
        // 表头
        columns: [
          {
            title: '名称',
            align: 'center',
            dataIndex: 'todoName',
          },
          {
            title: '日期',
            align: 'center',
            dataIndex: 'doDate',
            customRender:(text) => {
              if(moment.isMoment(text)){
                return text.format("YYYY-MM-DD")
              }else{
                return text
              }
            }
          },
          {
            title: '类型',
            align: 'center',
            dataIndex: 'type',
            customRender:(text) => {
              return this.typeOption[text]
            }
          },
          {
            title: '优先级',
            align: 'center',
            dataIndex: 'priority',
            scopedSlots: { customRender: 'priority' }
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
            // customRender:(text) => {
            //   return this.statusOption[text]
            // }
          },
        ],
        dataSource:[]
      }
    },
     methods: {
      moment,
      formatDate(date,mat){
        return moment.isMoment(date) ? date.format(mat) : date
      },
      ...mapGetters(["nickname"]),
      show(record,date) {
        this.currentDate = date
        this.dataSource = record
        this.visible = true
      },
      //删除确认
      confirm(id){
        httpAction(this.url.del+id,null,'delete').then((res)=>{
          if(res.code == 200){
            this.$message.success("删除成功")
          }else{
            this.$message.warning("删除失败")
          }
        })
      },
      handleEdit(text){
        this.$refs.ScheduleEditModules.edit(text)
      },
      handleFinish(text){
        text.status = 2
        delete text.privateFlag
        httpAction(this.url.modify,text,'put').then((res)=>{
          if(res.code == 200){
            this.$message.success("操作成功")
          }else{
            this.$message.warning("操作失败")
          }
        })
      },
      handleCancel() {
        this.close();
      },
      close() {
        this.$emit('ok')
        this.visible = false
      },
    }
  }
  </script>
  
  <style lang="less" scoped>
.dlist p label {
  width: 60px;
  text-align: right;
  display: inline-block;
  margin-right: 10px;
}
.btnDiv {
  background: #717171;
  background-color: rgba(90, 90, 90, 0.85);
  border-radius: 4px;
  padding: 9px 12px 6px;
  display: inline;
}
.btnDiv a {
  line-height: 37px;
  margin: 0px 4px;
}
</style>