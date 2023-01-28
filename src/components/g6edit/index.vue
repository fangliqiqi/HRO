<template>
  <div id="vue-g6-editor">
    <!-- 工具栏 -->
    <a-row v-if="oprator != -1">
      <a-col :span="24">
        <div id="toolbar">
          <i
            data-command="save"
            class="command fa fa-floppy-o"
            title="保存"
          ></i>
          <i
            class="fa fa-history"
            title="历史数据"
            @click="readHistoryData"
          ></i>
          <i
            class="fa fa-hdd-o"
            title="上传数据"
            @click="readUploadData"
          ></i>
          <i
            class="fa fa-download"
            title="另存为文件"
            @click="saveAsFile"
          ></i>
          <i
            data-command="undo"
            class="command fa fa-undo"
            title="撤销"
          ></i>
          <i
            data-command="redo"
            class="command fa fa-repeat"
            title="重做"
          ></i>
          <i
            data-command="delete"
            class="command fa fa-trash-o"
            title="删除"
          ></i>
          <i
            data-command="zoomOut"
            class="command fa fa-search-minus"
            title="缩小"
          ></i>
          <i
            data-command="zoomIn"
            class="command fa fa-search-plus"
            title="放大"
          ></i>
          <i
            data-command="clear"
            class="command fa fa-eraser"
            title="清除画布"
          ></i>
          <i
            data-command="toFront"
            class="command fa fa-arrow-up"
            title="提升层级"
          ></i>
          <i
            data-command="toBack"
            class="command fa fa-arrow-down"
            title="下降层级"
          ></i>
          <i
            data-command="selectAll"
            class="command fa fa-check-square-o"
            title="全选"
          ></i>
          <i
            data-command="copy"
            class="command fa fa-files-o"
            title="复制"
          ></i>
          <i
            data-command="paste"
            class="command fa fa-clipboard"
            title="粘贴"
          ></i>
          <i
            data-command="autoZoom"
            class="command fa fa-expand"
            title="实际大小"
          ></i>
          <i
            data-command="resetZoom"
            class="command fa fa-compress"
            title="适应页面"
          ></i>
          <i
            data-command="addGroup"
            class="command fa fa-object-group"
            title="组合"
          ></i>
          <i
            data-command="unGroup"
            class="command fa fa-object-ungroup"
            title="取消组合"
          ></i>
          <i
            data-command="multiSelect"
            class="command fa fa fa-crop"
            title="多选"
          ></i>
        </div>
      </a-col>
    </a-row>
    <!-- 元素面板 + 画布 + 属性栏 -->
    <a-row :span="24">
      <!-- 元素面板 -->
      <a-col
        :span="2"
        v-if="oprator != -1"
      >
        <div id="itempannel">
          <!-- 开始节点 -->
          <div
            id="startNode"
            class="getItem"
            data-type="node"
            data-shape="flow-capsule"
            data-size="80*40"
            data-label="开始节点"
            data-color="#FA8C16"
            data-nodeType="begin"
          >
            <img
              draggable="false"
              :src="svgUrl.startNodeSVGUrl"
              alt
              srcset
            />
          </div>
          <!-- 条件节点 -->
          <div
            id="judgeNode"
            class="getItem"
            data-type="node"
            data-shape="flow-rhombus"
            data-size="80*60"
            data-label="条件节点"
            data-color="#13C2C2"
            data-nodeType="choice"
          >
            <img
              draggable="false"
              :src="svgUrl.conditionNodeSVGUrl"
              alt="条件节点"
            />
          </div>
          <!-- 取消节点 -->
          <div
            class="getItem"
            data-type="node"
            data-shape="flow-capsule"
            data-size="80*40"
            data-label="取消节点"
            data-color="#B37FEB"
            data-nodeType="cancel"
          >
            <img
              draggable="false"
              alt="取消节点"
              :src="svgUrl.cancelNodeSVGUrl"
            />
          </div>
          <!-- 结束节点 -->
          <div
            id="endNode"
            class="getItem"
            data-type="node"
            data-shape="flow-capsule"
            data-size="80*40"
            data-label="结束节点"
            data-color="#E9967A"
            data-nodeType="end"
          >
            <img
              draggable="false"
              :src="svgUrl.endNodeSVGUrl"
              alt="结束节点"
            />
          </div>
          <!-- 拆分节点 -->
          <div
            class="getItem"
            data-type="node"
            data-size="80*40"
            data-shape="rect"
            data-label="拆分节点"
            data-color="#722ED1"
            data-nodeType="split"
          >
            <img
              draggable="false"
              :src="svgUrl.splitNodeSVGUrl"
              alt="拆分节点"
            >
          </div>
          <!-- 并行节点 -->
          <div
            class="getItem"
            data-type="node"
            data-size="80*40"
            data-label="并行节点"
            data-shape="rect"
            data-color="#8BC34A"
            data-nodeType="parallel"
          >
            <img
              draggable="false"
              :src="svgUrl.parallelNodeSVGUrl"
              alt="并行节点"
            >
          </div>
          <!-- 合并节点 -->
          <div
            id="regularNode"
            class="getItem"
            data-type="node"
            data-size="80*40"
            data-shape="rect"
            data-label="合并节点"
            data-color="#FF5722"
            data-nodeType="merge"
          >
            <img
              draggable="false"
              :src="svgUrl.mergelNodeSVGUrl"
              alt="合并节点"
              srcset
            />
          </div>
          <!-- 流程调用 -->
          <div
            class="getItem"
            data-type="node"
            data-size="80*40"
            data-shape="rect"
            data-label="流程调用"
            data-color="#009688"
            data-nodeType="embed"
          >
            <img
              draggable="false"
              :src="svgUrl.embedNodeSVGUrl"
              alt="流程调用"
            >
          </div>
          <!-- 服务调用 -->
          <div
            class="getItem"
            data-type="node"
            data-shape="rect"
            data-size="80*40"
            data-label="服务调用"
            data-color="#4169E1"
            data-nodeType="invoke"
          >
            <img
              draggable="false"
              :src="svgUrl.invokeNodeSVGUrl"
              alt="服务调用"
            >
          </div>
          <!-- 定时节点 -->
          <div
            class="getItem"
            data-type="node"
            data-size="80*40"
            data-shape="rect"
            data-label="定时节点"
            data-color="#FA8072"
            data-nodeType="delay"
          >
            <img
              draggable="false"
              :src="svgUrl.delayNodeSVGUrl"
              alt="定时节点"
            >
          </div>
          <!-- 服务节点 -->
          <div
            class="getItem"
            data-type="node"
            data-size="80*40"
            data-shape="rect"
            data-label="服务节点"
            data-color="#5bb1ff"
            data-nodeType="service"
          >
            <img
              draggable="false"
              :src="svgUrl.serviceNodeSVGUrl"
              alt="服务节点"
            >
          </div>
          <!-- 脚本节点 -->
          <div
            class="getItem"
            data-type="node"
            data-size="80*40"
            data-label="脚本节点"
            data-shape="rect"
            data-color="#ff9800"
            data-nodeType="agent"
          >
            <img
              draggable="false"
              :src="svgUrl.agentNodeSVGUrl"
              alt="脚本节点"
            >
          </div>

        </div>
      </a-col>
      <!-- 画布 -->
      <a-col :span="(oprator != -1)?16:24">
        <a-col :span="24">
          <div id="page"></div>
        </a-col>
      </a-col>
      <!-- 属性栏 -->
      <a-col
        :span="6"
        v-if="oprator != -1"
      >
        <section class="right-part">
          <div id="detailpannel">
            <!-- 节点属性栏 -->
            <div
              id="nodeAttributeBar"
              class="pannel"
              data-status="node-selected"
            >
              <a-tabs
                :activeKey="nodeActiveKey"
                @change="nodeTabChange"
                :tabBarGutter="0"
              >
                <a-tab-pane
                  key="1"
                  tab="节点属性"
                >
                  <div class="main">
                    <a-form-model
                      class="formStyle"
                      :model="nodeAttributeForm"
                      :rules="rules[0]"
                      ref="nodeRuleForm"
                      label-position="right"
                      label-width="80px"
                      layout="inline"
                    >
                      <a-form-model-item
                        label="节点名称"
                        prop="label"
                      >
                        <a-input
                          v-model="nodeAttributeForm.label"
                          @change="saveNodeAttribute"
                        ></a-input>
                      </a-form-model-item>
                      <a-form-model-item label="节点描述">
                        <a-input
                          v-model="nodeAttributeForm.description"
                          @change="saveNodeAttribute"
                        ></a-input>
                      </a-form-model-item>
                      <a-form-model-item
                        label="节点颜色"
                        style="z-index:999"
                      >
                        <colorPicker
                          v-model="nodeAttributeForm.color"
                          @change="saveNodeAttribute"
                        ></colorPicker>
                      </a-form-model-item>
                      <a-form-model-item
                        label="宽度"
                        prop="width"
                      >
                        <a-input
                          v-model="nodeAttributeForm.width"
                          @change="saveNodeAttribute"
                        ></a-input>
                      </a-form-model-item>
                      <a-form-model-item
                        label="高度"
                        prop="height"
                      >
                        <a-input
                          v-model="nodeAttributeForm.height"
                          @change="saveNodeAttribute"
                        ></a-input>
                      </a-form-model-item>
                      <a-form-model-item
                        label="会签方式"
                        prop="countersign"
                      >
                        <a-select
                          v-model="nodeAttributeForm.countersign"
                          placeholder="请选择会签方式"
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                          @change="saveNodeAttribute"
                        >
                          <a-select-option value="0">允许会签</a-select-option>
                          <a-select-option value="1">强制会签</a-select-option>
                          <a-select-option value="2">禁止会签</a-select-option>
                        </a-select>
                      </a-form-model-item>
                      <a-form-model-item
                        label="回退方式"
                        prop="backType"
                      >
                        <a-select
                          v-model="nodeAttributeForm.backType"
                          placeholder="请选择回退方式"
                          @change="saveNodeAttribute"
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                        >
                          <a-select-option value="0">不允许</a-select-option>
                          <a-select-option value="1">回退上一步</a-select-option>
                          <a-select-option value="2">回退至起点</a-select-option>
                        </a-select>
                      </a-form-model-item>
                      <a-form-model-item
                        label="进入下一步"
                        prop="handleAllowNext"
                      >
                        <a-radio-group
                          v-model="nodeAttributeForm.handleAllowNext"
                          @change="saveNodeAttribute"
                        >
                          <a-radio value="0">允许</a-radio>
                          <a-radio value="1">不允许</a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                      <a-form-model-item
                        label="允许调度"
                        prop="allowDispatch"
                      >
                        <a-radio-group
                          v-model="nodeAttributeForm.allowDispatch"
                          @change="saveNodeAttribute"
                        >
                          <a-radio value="0">是</a-radio>
                          <a-radio value="1">否</a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                      <a-form-model-item
                        label="调度到此"
                        prop="allowThis"
                      >
                        <a-radio-group
                          v-model="nodeAttributeForm.allowThis"
                          @change="saveNodeAttribute"
                        >
                          <a-radio value="0">允许</a-radio>
                          <a-radio value="1">不允许</a-radio>
                        </a-radio-group>
                      </a-form-model-item>
                      <a-form-model-item
                        label="调用流程"
                        prop="nodeTransferConfigs"
                        v-if="isEmbed"
                      >
                        <a-select
                          mode="multiple"
                          style="width: 150px"
                          v-model="nodeAttributeForm.nodeTransferConfigs"
                          showSearch
                          optionFilterProp="children"
                          placeholder="请选择流程"
                          @search="handleSearch"
                          :dropdownMatchSelectWidth="false"
                          :getPopupContainer="triggerNode => triggerNode.parentNode"
                          @change="changeNodeTransferConfigs"
                          @deselect="deselectNode"
                        >
                          <a-select-option
                            v-for="item in process"
                            :key="item.id"
                            :value="item.id"
                          >
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-form-model>
                  </div>
                </a-tab-pane>
                <a-tab-pane
                  key="2"
                  tab="人员权限"
                >
                  <a-form-model
                    class="formStyle"
                    label-position="top"
                    label-width="80px"
                    layout="inline"
                  >
                    <a-tabs
                      type="editable-card"
                      @edit="onAddTab"
                      size="small"
                      @tabClick="nodePrimissionTabChange"
                      v-model="activeKey"
                    >
                      <a-tab-pane
                        v-for="(item, index) in nodePrimissionForm"
                        :tab="'权限'+(index+1)"
                        :key="index"
                      >
                        <a-form-model-item label="办理类型">
                          <a-radio-group
                            v-model="item.dealType"
                            @change="handleChange"
                          >
                            <a-radio value="0">主办</a-radio>
                            <a-radio value="1">经办</a-radio>
                          </a-radio-group>
                        </a-form-model-item>
                        <a-input v-model="item.nodeLogoTitle" type="hidden"/>
                        <a-form-model-item label="类型">
                          <a-select
                            placeholder="请选择类型"
                            v-model="item.type"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                            @change="typeChange"
                          >
                            <a-select-option :value="0">指定职位</a-select-option>
                            <a-select-option :value="1">与申请人关系</a-select-option>
                            <a-select-option :value="2">指定权限</a-select-option>
                            <a-select-option :value="3">指定用户</a-select-option>
                            <a-select-option :value="4">指定组织</a-select-option>
                          </a-select>
                        </a-form-model-item>

                        <a-form-model-item
                          label="指定职位"
                          v-if="showType[index] == 0"
                        >
                          <a-select
                            v-model="item.post"
                            placeholder="请选择职位"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                            :allowClear="true"
                            @change="postChange"
                          >
                            <a-select-option
                              v-for="items in postList"
                              :key="items.id"
                              :value="String(items.id)"
                            >
                              {{ items.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                          label="申请人关系"
                          v-if="showType[index] == 1"
                        >
                          <a-select
                            v-model="item.realationCreateUser"
                            placeholder="与流程申请人关系"
                            :allowClear="true"
                            @change="postChange"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                          >
                            <a-select-option value="0">发起人部门主管</a-select-option>
                            <a-select-option value="1">同区域最高级</a-select-option>
                            <a-select-option value="2">所在单位最高级</a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                          label="指定权限"
                          v-if="showType[index] == 2"
                        >
                          <a-select
                            v-model="item.role"
                            placeholder="指定权限处理节点"
                            :dropdownMatchSelectWidth="false"
                            :showSearch="true"
                            :allowClear="true"
                            option-filter-prop="children"
                            @change="postChange"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                          >
                            <a-select-option
                              v-for="items in roleList"
                              :key="items.roleId"
                              :value="String(items.roleId)"
                            >
                              {{ items.roleName }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                          label="指定用户"
                          v-if="showType[index] == 3"
                        >
                          <a-select
                            v-model="item.user"
                            placeholder="指定用户处理节点"
                            :showSearch="true"
                            :allowClear="true"
                            @change="postChange"
                            option-filter-prop="children"
                            :dropdownMatchSelectWidth="false"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                          >
                            <a-select-option
                              v-for="items in userList"
                              :key="items.userId"
                              :value="String(items.userId)"
                            >
                              {{ items.nickname }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                          label="指定组织"
                          v-if="showType[index] == 4"
                        >
                          <a-tree-select
                            v-model="item.organization"
                            :showSearch="true"
                            :allowClear="true"
                            :tree-data="organList"
                            size="small"
                            :dropdownStyle="{}"
                            @change="postChange"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                            placeholder="指定组织处理节点"
                          >
                          </a-tree-select>
                        </a-form-model-item>

                      </a-tab-pane>
                    </a-tabs>
                  </a-form-model>

                  <a-form-model
                    class="formStyle"
                    label-position="top"
                    label-width="80px"
                    layout="inline"
                  >
                    <a-tabs
                      type="editable-card"
                      size="small"
                      v-model="activeKeys"
                      @tabClick="nodeReaderPrimissionTabChange"
                      @edit="onAddTabs"
                    >
                      <a-tab-pane
                        v-for="(item, index) in nodeReaderPrimissionForm"
                        :tab="'抄送'+(index+1)"
                        :key="index"
                      >
                        <a-form-model-item label="类型">
                          <a-select
                            placeholder="请选择类型"
                            v-model="item.type"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                            @change="typeChanges"
                          >
                            <a-select-option :value="0">指定职位</a-select-option>
                            <a-select-option :value="1">与申请人关系</a-select-option>
                            <a-select-option :value="2">指定权限</a-select-option>
                            <a-select-option :value="3">指定用户</a-select-option>
                            <a-select-option :value="4">指定组织</a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-input v-model="item.nodeLogoTitle" type="hidden"/>
                        <a-form-model-item
                          label="指定职位"
                          v-if="showTypes[index] == 0"
                        >
                          <a-select
                            v-model="item.post"
                            placeholder="请选择职位"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                            :allowClear="true"
                            @change="postChanges"
                          >
                            <a-select-option
                              v-for="items in postList"
                              :key="items.id"
                              :value="String(items.id)"
                            >
                              {{ items.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                          label="申请人关系"
                          v-if="showTypes[index] == 1"
                        >
                          <a-select
                            v-model="item.realationCreateUser"
                            placeholder="与流程申请人关系"
                            :allowClear="true"
                            @change="postChanges"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                          >
                            <a-select-option value="0">发起人部门主管</a-select-option>
                            <a-select-option value="1">同区域最高级</a-select-option>
                            <a-select-option value="2">所在单位最高级</a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                          label="指定权限"
                          v-if="showTypes[index] == 2"
                        >
                          <a-select
                            v-model="item.role"
                            placeholder="指定权限处理节点"
                            :dropdownMatchSelectWidth="false"
                            :showSearch="true"
                            :allowClear="true"
                            option-filter-prop="children"
                            @change="postChanges"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                          >
                            <a-select-option
                              v-for="items in roleList"
                              :key="items.roleId"
                              :value="String(items.roleId)"
                            >
                              {{ items.roleName }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                          label="指定用户"
                          v-if="showTypes[index] == 3"
                        >
                          <a-select
                            v-model="item.user"
                            placeholder="指定用户处理节点"
                            :showSearch="true"
                            :allowClear="true"
                            @change="postChanges"
                            option-filter-prop="children"
                            :dropdownMatchSelectWidth="false"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                          >
                            <a-select-option
                              v-for="items in userList"
                              :key="items.userId"
                              :value="String(items.userId)"
                            >
                              {{ items.nickname }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                          label="指定组织"
                          v-if="showTypes[index] == 4"
                        >
                          <a-tree-select
                            v-model="item.organization"
                            :showSearch="true"
                            :allowClear="true"
                            :tree-data="organList"
                            @change="postChanges"
                            size="small"
                            :dropdownStyle="{}"
                            :getPopupContainer="triggerNode => triggerNode.parentNode"
                            placeholder="指定组织处理节点"
                          >
                          </a-tree-select>
                        </a-form-model-item>
                      </a-tab-pane>
                    </a-tabs>
                  </a-form-model>

                </a-tab-pane>
              </a-tabs>
            </div>

            <!-- 边属性栏 -->
            <div
              id="edgeAttributeBar"
              class="pannel"
              data-status="edge-selected"
            >
              <div class="title">边属性</div>
              <div class="main">
                <a-form-model
                  class="formStyle"
                  :model="edgeAttributeForm"
                  :rules="rules[1]"
                  ref="edgeAttributeRuleForm"
                  label-position="top"
                  label-width="80px"
                  layout="inline"
                >
                  <a-form-model-item
                    label="边文本"
                    prop="label"
                  >
                    <a-input
                      v-model="edgeAttributeForm.label"
                      @change="saveEdgeAttribute"
                    ></a-input>
                  </a-form-model-item>
                  <a-form-model-item
                    label="描述"
                    prop="description"
                  >
                    <a-input
                      v-model="edgeAttributeForm.description"
                      @change="saveEdgeAttribute"
                    ></a-input>
                  </a-form-model-item>
                  <a-form-model-item
                    label="意见是否必填"
                    prop="opinionMustFlag"
                  >
                    <a-radio-group
                      v-model="edgeAttributeForm.opinionMustFlag"
                      @change="saveEdgeAttribute"
                    >
                      <a-radio value="0">是</a-radio>
                      <a-radio value="1">否</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                  <a-form-model-item label="默认意见">
                    <a-input
                      v-model="edgeAttributeForm.opinion"
                      @change="saveEdgeAttribute"
                    ></a-input>
                  </a-form-model-item>
                  <a-form-model-item
                    label="是否优先"
                    prop="priorityFlag"
                  >
                    <a-radio-group
                      v-model="edgeAttributeForm.priorityFlag"
                      @change="saveEdgeAttribute"
                    >
                      <a-radio value="0">是</a-radio>
                      <a-radio value="1">否</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                  <a-form-model-item
                    label="自动流转"
                    prop="sameForPrew"
                  >
                    <a-radio-group
                      v-model="edgeAttributeForm.sameForPrew"
                      @change="saveEdgeAttribute"
                    >
                      <a-radio value="0">是</a-radio>
                      <a-radio value="1">否</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                  <a-form-model-item
                    label="路由类型"
                    prop="routeType"
                  >
                    <a-select
                      v-model="edgeAttributeForm.routeType"
                      @change="saveEdgeAttribute"
                      placeholder="路由类型"
                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                    >
                      <a-select-option value="1">默认路由</a-select-option>
                      <a-select-option value="2">回退路由</a-select-option>
                      <a-select-option value="3">抄送</a-select-option>
                      <a-select-option value="4">转交</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="顺序号">
                    <a-input-number
                      v-model="edgeAttributeForm.sequenceNo"
                      @change="saveEdgeAttribute"
                    />
                  </a-form-model-item>
                  <a-form-model-item
                    label="超时自动流转"
                    prop="timeoutRoam"
                  >
                    <a-radio-group
                      v-model="edgeAttributeForm.timeoutRoam"
                      @change="saveEdgeAttribute"
                    >
                      <a-radio value="0">是</a-radio>
                      <a-radio value="1">否</a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                  <a-tabs
                    v-model="activeKeyCondit"
                    type="editable-card"
                    @edit="editCondit"
                    @tabClick="tabClickType"
                    size="small"
                    v-if="condictFlag"
                  >
                    <a-tab-pane v-for="(item,index) in nodeRouteConditionListForm" :key="index" :tab="'条件'+(index+1)">
                      <a-form-model-item label="类型">
                        <a-select style="min-width: 150px" v-model="item.type" @change="changeType">
                          <a-select-option value="1">正常条件</a-select-option>
                          <a-select-option value="2">正则表达式</a-select-option>
                        </a-select>
                      </a-form-model-item>
                      
                      <a-form-model-item :label="isNormal?'字段':'正则'">
                        <a-input
                          v-model="item.field"
                          @change="changeFields"
                        />
                      </a-form-model-item>
                      <a-form-model-item label="条件" v-if="isNormal">
                        <a-select style="min-width: 150px" v-model="item.conditions" @change="changeFields">
                          <a-select-option value="=">等于</a-select-option>
                          <a-select-option value=">">大于</a-select-option>
                          <a-select-option value="<">小于</a-select-option>
                          <a-select-option value="<>">不等于</a-select-option>
                        </a-select>
                      </a-form-model-item>
                      <a-form-model-item label="值" v-if="isNormal">
                        <a-input
                          v-model="item.conditionValue"
                          @change="changeFields"
                        />
                      </a-form-model-item>
                      <a-form-model-item label="条件相互关系" v-if="isNormal">
                        <a-select style="min-width: 150px" v-model="item.realation" @change="changeFields">
                          <a-select-option value="0">无关系</a-select-option>
                          <a-select-option value="1">或关系</a-select-option>
                          <a-select-option value="2">并且关系</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    

                    </a-tab-pane>
                  </a-tabs>

                </a-form-model>
              </div>
            </div>
            <div
              id="groupAttributeBar"
              class="pannel"
              data-status="group-selected"
            >
              <div class="title">群组属性栏</div>
            </div>
            <div
              id="canvasAttributeBar"
              class="pannel"
              data-status="canvas-selected"
            >
              <div class="title">画布属性栏</div>
              <div class="main">
                <a-form
                  label-width="70px"
                  label-position="right"
                  layout="inline"
                >
                  <a-form-item label="网格对齐">
                    <a-checkbox
                      v-model="canvasAttributeForm.grid"
                      @change="toggleGridShowStatus"
                    ></a-checkbox>
                  </a-form-item>
                </a-form>
              </div>
            </div>
            <div
              id="multiAttributeBar"
              class="pannel"
              data-status="multi-selected"
            >
              <div class="title">多选时属性栏</div>
            </div>
          </div>
          <!-- 缩略图 -->
          <div id="minimap">
            <div class="title">缩略图</div>
          </div>
        </section>
      </a-col>
    </a-row>

    <!-- 右键菜单 -->
    <section>
      <div id="contextmenu">
        <div
          data-status="node-selected"
          class="menu"
        >
          <a-button
            data-command="copy"
            class="command"
          >复制</a-button>
          <a-button
            data-command="paste"
            class="command"
          >粘贴</a-button>
          <a-button
            data-command="delete"
            class="command"
          >删除</a-button>
        </div>
        <div
          data-status="edge-selected"
          class="menu"
        >
          <a-button
            data-command="delete"
            class="command"
          >删除</a-button>
        </div>
        <div
          data-status="group-selected"
          class="menu"
        >
          <a-button
            data-command="copy"
            class="command"
          >复制</a-button>
          <a-button
            data-command="paste"
            class="command"
          >粘贴</a-button>
          <a-button
            data-command="unGroup"
            class="command"
          >取消组合</a-button>
          <a-button
            data-command="delete"
            class="command"
          >删除</a-button>
        </div>
        <div
          data-status="canvas-selected"
          class="menu"
        >
          <a-button
            data-command="undo"
            class="command"
          >撤销</a-button>
          <a-button
            data-command="redo"
            class="command disable"
          >重做</a-button>
        </div>
        <div
          data-status="multi-selected"
          class="menu"
        >
          <a-button
            data-command="copy"
            class="command"
          >复制</a-button>
          <a-button
            data-command="paste"
            class="command"
          >粘贴</a-button>
          <a-button
            data-command="addGroup"
            class="command"
          >组合</a-button>
        </div>
      </div>
    </section>

  </div>
</template>
<script>

// 字体图标
import "font-awesome/css/font-awesome.min.css";

import G6Editor from "@antv/g6-editor";
import mixin from "./mixin";
import { httpAction } from '@/api/manage'

const line = 'flow-polyline'

export default {
  name: "VueG6Editor",
  props:{
    id:{
      type: String,
      default:"",
      required: true
    },
    oprator:{ // -1查看 0添加 >0 其他编辑
      type: Number,
      default: 0,
      required: true
    },
    dataSource:{
      type: Object,
      default:()=>{},
      required: false
    },
  },
  mixins: [mixin],
  data() {
    return {
      // 节点属性表单
      nodeAttributeForm: {
        label: "",
        width: "",
        height: "",
        description: "",
        countersign: "",
        backType: "",
        allowDispatch: "",
        handleAllowNext: "",
        allowThis: "",
        color:"",
        nodePrimissionList:[],
        nodeReaderPromissionList:[],
        nodeTransferConfigs:[]
      },
      // 节点属性表单
      edgeAttributeForm: {
        label: "",
        shape:line,
        description:'',
        opinionMustFlag:'',
        opinion:'',
        priorityFlag:'',
        sameForPrew:'',
        routeType:'',
        sequenceNo:'',
        timeoutRoam:'',
        nodeRouteConditionList:[]
      },
      nodePrimissionForm:[], //每个节点人员权限
      nodeReaderPrimissionForm:[], //每个抄送人权限

      deleteIdsVo:{ //删除ID
        nodeIds:[],
        primissionIds:[],
        readPrimissionIds:[],
        roteIds:[],
        roteConditionIds:[],
        nodeTransferConfigIds:[]
      },
      showType:[],
      showTypes:[],

      roleList:[], //角色列表
      userList:[], //用户列表
      organList:[], //组织架构树
      postList:[], //职位
      activeKey:0, //默认当前位置
      activeKeys:0, //默认当前位置
      nodeActiveKey: "1", //1节点属性2人员权限
      activeKeyCondit:0, //边属性条件
      nodeRouteConditionListForm:[],
      condictFlag:false,
      isEmbed:false,
      isNormal:true,
      process:[],
      rules:[
        {
          label:{ required: true, message: '节点名称必填'},
          width:{ required: true, message: '宽度必填'},
          height:{ required: true, message: '高度必填'},
          size:{ required: true, message: '宽高必填'},
          countersign:{ required: true, message: '请选择会签方式'},
          backType:{ required: true, message: '请选择回退方式'},
          handleAllowNext:{ required: true, message: '请选择是否进入下一步'},
          allowDispatch:{ required: true, message: '请选择是否允许调度'},
          allowThis:{ required: true, message: '请选择是否调度到此'},
        },{
          label:{ required: true, message: '边文本必填'},
          opinionMustFlag:{ required: true, message: '请选择意见是否'},
          priorityFlag:{ required: true, message: '请选择是否优先'},
          sameForPrew:{ required: true, message: '请选择自动流转'},
          routeType:{ required: true, message: '请选择路由类型'},
          timeoutRoam:{ required: true, message: '强选择超时自动流转'},
        }
      ],
      // 画布属性栏表单
      canvasAttributeForm: {
        grid: true,
        cell: 20
      },
      // SVG节点图片URL地址
      svgUrl:{
        startNodeSVGUrl: require("./assets/begain.svg"),
        regularNodeSVGUrl: require("./assets/regular-node.svg"),
        conditionNodeSVGUrl: require("./assets/condition-node.svg"),
        modelNodeSVGUrl: require("./assets/model-node.svg"),
        cancelNodeSVGUrl: require("./assets/cancel-node.svg"),
        endNodeSVGUrl: require("./assets/end.svg"),
        splitNodeSVGUrl: require("./assets/split-node.svg"),
        parallelNodeSVGUrl: require("./assets/parallel-node.svg"),
        mergelNodeSVGUrl: require("./assets/merge-node.svg"),
        embedNodeSVGUrl: require("./assets/embed-node.svg"),
        invokeNodeSVGUrl: require("./assets/invoke-node.svg"),
        delayNodeSVGUrl: require("./assets/delay-node.svg"),
        serviceNodeSVGUrl: require("./assets/service-node.svg"),
        agentNodeSVGUrl: require("./assets/agent-node.svg"),
      },
      // 编辑器
      editor: null,
      saveAsImageDialogVisible: false,
      saveAsImageFormat: "jpg",
      sonNodeProcess:[], //子流程
    };
  },
  destroyed(){
    window.editor = null
    this.editor.destroy()
  },
  mounted() {
    // eslint-disable-next-line
    this.initG6Editor()
  },
  methods: {
    diffTid(id,data){
      const res = data.nodes.find(item=>item.id == id)
      if(res){
        return {flag:true,tid:res.tid}
      }else{
        return {flag:false,tid:''}
      }
    },
    // 初始化
    initG6Editor() {
      const _this = this;
      const editor = new G6Editor();
      this.editor = editor;
      G6Editor.track(false);
      const Command = G6Editor.Command;
      // 注册新命令save
      Command.registerCommand("save", {
        // 禁止保存命令进入队列
        queue: false,
        // 命令是否可用
        enable: () => {
          return true;
        },
        // 正向命令
        execute(editor) {
          const needSaveData = editor.getCurrentPage().save()
          // 判断是否存在tid
          if(needSaveData.nodes && needSaveData.nodes.length){
            needSaveData.nodes.forEach((item,index)=>{
              if(!item.tid){
                const res = _this.diffTid(item.id,_this.dataSource)
                if(res.flag){
                  needSaveData.nodes[index].tid = res.tid
                }
              }
            })
          }
          localStorage.setItem('flowData', JSON.stringify(needSaveData))
          _this.save(needSaveData)
        },
        // 反向命令
        back(editor) {
          console.log("反向命令");
          console.log(editor);
        },
        // 快捷键：Ctrl + S
        shortcutCodes: [
          ["metaKey", "s"],
          ["ctrlKey", "s"]
        ]
      });
      // 画布
      const flow = new G6Editor.Flow({
        graph: {
          container: "page"
        },
        align: {
          line: {
            // 对齐线颜色
            stroke: "#FA8C16",
            // 对齐线粗细
            lineWidth: 1
          },
          // 开启全方位对齐
          item: true,
          // 网格对齐
          grid: true
        },
        grid: {
          // 网孔尺寸
          cell: 18
        },
        shortcut: {
          // 开启自定义命令保存的快捷键
          save: true
        },
      });
      window.flow = flow;
      // 挂载以上组件到Editor
      editor.add(flow);
      // 挂载到window，方便调试
      window.editor = editor;
      // 设置边
      flow.getGraph().edge({
        shape: line
      });

      if(this.oprator != -1){
        // 元素面板栏
        const itempannel = new G6Editor.Itempannel({
          container: "itempannel"
        });
        // 工具栏
        const toolbar = new G6Editor.Toolbar({
          container: "toolbar"
        });
        // 属性栏
        const detailpannel = new G6Editor.Detailpannel({
          container: "detailpannel"
        });
        // 右键菜单
        const contextmenu = new G6Editor.Contextmenu({
          container: "contextmenu"
        });
        // 缩略图
        let minimapWidth = getComputedStyle(document.querySelector(".right-part")).width;
        minimapWidth = Number(minimapWidth.replace(/px$/, ""));
        const minimap = new G6Editor.Minimap({
          container: "minimap",
          width: minimapWidth,
          height: 200
        });
        editor.add(itempannel);
        editor.add(toolbar);
        editor.add(detailpannel);
        editor.add(contextmenu);
        editor.add(minimap);
        // 获取当前画布
        const currentPage = editor.getCurrentPage()
        currentPage.on("afterchange", (e) => {
          if (e.action === "add") {
            if (e.model.nodetype === "begin" || e.model.nodetype === "end") {
              const nodes = this.editor.getCurrentPage().getNodes();
              for (const item of nodes) {
                if (item.model.nodetype === e.model.nodetype && item.model.id !== e.model.id) {
                  this.editor.getCurrentPage().remove(e.item);
                  this.$message.warning("只能有一个开始节点或结束节点");
                }
              }
            }
          }
        })
        // 监听（选择对象后）事件
        currentPage.on("afteritemselected", (ev) => {
          const selectedItemDataModel = ev.item.model;
          // 如果选择的对象是节点
          if (ev.item.isNode) {
            let sonNodeConfigs = []
            // 流程调用
            if(selectedItemDataModel.nodetype == 'embed'){
              this.sonNodeProcess = selectedItemDataModel.nodeTransferConfigs
              this.isEmbed = true
              if(selectedItemDataModel.nodeTransferConfigs && selectedItemDataModel.nodeTransferConfigs.length){
                sonNodeConfigs = selectedItemDataModel.nodeTransferConfigs.map(item=>{
                  return item.processId
                })
                // 获取已经选中
                this.getSelectedOption(sonNodeConfigs)
              }
            }else{
              this.sonNodeProcess = []
              this.isEmbed = false
            }
            console.log(111,selectedItemDataModel,this.sonNodeProcess)
            // 切换节点人员权限跟着变化
            this.activeKey = 0 // 默认回到权限1
            this.nodeActiveKey = "1"
            if(selectedItemDataModel.nodePrimissionList){
              this.showType = selectedItemDataModel.nodePrimissionList.map(item=>{
                return item.type
              })
            }
            this.nodeAttributeForm.label = selectedItemDataModel.label
            this.nodeAttributeForm.width = selectedItemDataModel.size.split("*")[0]
            this.nodeAttributeForm.height = selectedItemDataModel.size.split("*")[1]
            this.nodeAttributeForm.description = selectedItemDataModel.description
            this.nodeAttributeForm.countersign = (selectedItemDataModel.countersign != undefined) ? selectedItemDataModel.countersign : "0"
            this.nodeAttributeForm.backType = (selectedItemDataModel.backType != undefined) ? selectedItemDataModel.backType : "0"
            this.nodeAttributeForm.allowDispatch = (selectedItemDataModel.allowDispatch != undefined) ? selectedItemDataModel.allowDispatch : "0"
            this.nodeAttributeForm.handleAllowNext = (selectedItemDataModel.handleAllowNext != undefined) ? selectedItemDataModel.handleAllowNext : "0"
            this.nodeAttributeForm.allowThis = (selectedItemDataModel.allowThis != undefined) ? selectedItemDataModel.allowThis : "0"
            this.nodeAttributeForm.color = selectedItemDataModel.color
            this.nodeAttributeForm.nodeTransferConfigs = sonNodeConfigs
            this.nodeAttributeForm.nodePrimissionList = selectedItemDataModel.nodePrimissionList || []
            this.nodePrimissionForm = selectedItemDataModel.nodePrimissionList || []
            this.nodeReaderPrimissionForm = selectedItemDataModel.nodeReaderPromissionList || []
            
            if(!selectedItemDataModel.tid){
              this.savePartNodeAttr()
            }
            this.$refs.nodeRuleForm.validate()
          }
          // 如果选择的对象是边
          if (ev.item.isEdge) {
            
            ev.item.graph.edge({
              shape: "flow-polyline-round"
            });
            this.edgeAttributeForm.label = selectedItemDataModel.label || '边'
            this.edgeAttributeForm.shape = selectedItemDataModel.shape
            this.edgeAttributeForm.description = selectedItemDataModel.description
            this.edgeAttributeForm.opinionMustFlag = (selectedItemDataModel.opinionMustFlag != undefined) ? selectedItemDataModel.opinionMustFlag : "0"
            this.edgeAttributeForm.opinion = selectedItemDataModel.opinion
            this.edgeAttributeForm.priorityFlag = (selectedItemDataModel.priorityFlag != undefined) ? selectedItemDataModel.priorityFlag : "0"
            this.edgeAttributeForm.sameForPrew = (selectedItemDataModel.sameForPrew != undefined) ? selectedItemDataModel.sameForPrew : "0"
            this.edgeAttributeForm.routeType = (selectedItemDataModel.routeType != undefined) ? selectedItemDataModel.routeType : "1"
            this.edgeAttributeForm.sequenceNo = selectedItemDataModel.sequenceNo
            this.edgeAttributeForm.timeoutRoam = (selectedItemDataModel.timeoutRoam != undefined) ? selectedItemDataModel.timeoutRoam : "0"
            this.edgeAttributeForm.nodeRouteConditionList = selectedItemDataModel.nodeRouteConditionList || []
            this.nodeRouteConditionListForm = selectedItemDataModel.nodeRouteConditionList || []
            this.saveEdgeAttribute()
            if(ev.item.dataMap[selectedItemDataModel.source].nodetype == "choice"){
              this.condictFlag = true
              this.isNormal = (this.nodeRouteConditionListForm[this.activeKeyCondit] && this.nodeRouteConditionListForm[this.activeKeyCondit].type == 1) ? true : false
            }else{
              this.condictFlag = false
            }
            this.$refs.edgeAttributeRuleForm.validate()
            
          }
        })
        // 监听（删除后）事件
        currentPage.on("afterdelete", (ev) => {
          const model = ev.items[0].model
          // 删除指定id
          if(this.hasSpecialStr(model)){
            if(ev.items[0].isNode){
              // 删除节点id
              this.deleteIdsVo.nodeIds.push(model.tid)
              // 删除节点对应的人员权限以及抄送人
              if(model.nodePrimissionList.length){
                for(let item of model.nodePrimissionList){
                  this.deleteIdsVo.primissionIds.push(item.id)
                }
              }
              if(model.nodeReaderPromissionList.length){
                for(let item of model.nodeReaderPromissionList){
                  this.deleteIdsVo.readPrimissionIds.push(item.id)
                }
              }
              // 删除相关联的连线
              for(let item of this.dataSource.edges){
                if(item.target == ev.items[0].id || item.source == ev.items[0].id){
                  this.deleteIdsVo.roteIds.push(item.id)
                }
              }
            }
            if(ev.items[0].isEdge){
              if(String(model.id).length>15){
                this.deleteIdsVo.roteIds.push(model.id)
                if(model.nodeRouteConditionList.length){
                  for(let item of model.nodeRouteConditionList){
                    if(item.hasOwnProperty('id')){
                      this.deleteIdsVo.roteConditionIds.push(item.id)
                    }
                  }
                }
              }
            }
          }
        })
      }

      if(Object.keys(this.dataSource).length){
        editor.getCurrentPage().read(this.dataSource);
      }
    },
    getProcess(name){
      let url = '/process/tprocess/page'
      if(name){
        url += '?name='+name
      }
      httpAction(url,null,'get').then(res=>{
        if(res.code == 200){
          this.process = res.data.records
        }
      })
    },
    getSelectedOption(arr){
      const url = '/process/tprocess/get/byIds?ids='+arr.join(',')
      httpAction(url,null,'get').then(res=>{
        if(res.code == 200){
          this.process = res.data
        }
      })
    },
    deselectNode(val){
      this.sonNodeProcess.forEach(item=>{
        if(item.processId == val){
          this.deleteIdsVo.nodeTransferConfigIds.push(item.id)
        }
      })
    },
    handleSearch(val){
      this.getProcess(val)
    },
    // 判断某个对象属性是否包含指定字符串 false包含
    hasSpecialStr(obj){
      const keys = Object.keys(obj)
      for(let item of keys){
        if(/v-/.test(item)){
          return false
        }
      }
      return true
    },
    // 增加tab
    onAddTab(targetKey, action){
      if(action == 'add'){
        const page = this.editor.getCurrentPage()
        // 获取所选对象
        const selectedItem = page.getSelected()[0]
        this.nodePrimissionForm.push({
          dealType:"0",
          nodeLogoTitle: selectedItem.id
        })
        this.activeKey = this.nodePrimissionForm.length-1
      }else if(action == 'remove'){
        // const length = this.nodePrimissionForm.length
        // if(length == 1){
        //   this.$message.warning('至少保留一个')
        //   return false
        // }
        // 保存删除权限
        if(this.nodePrimissionForm[targetKey].id){
          this.deleteIdsVo.primissionIds.push(this.nodePrimissionForm[targetKey].id)
        }
        // 重置到上一个tab
        if(this.activeKey >= targetKey){
          this.activeKey = (this.activeKey-1 >= 0) ? (this.activeKey-1) : 0
        }

        this.nodePrimissionForm.splice(targetKey,1)
        this.showType.splice(targetKey,1)
        console.log(this.deleteIdsVo)
      }
    },
    onAddTabs(targetKey, action){
      if(action == 'add'){
        const page = this.editor.getCurrentPage()
        // 获取所选对象
        const selectedItem = page.getSelected()[0]
        this.nodeReaderPrimissionForm.push({nodeLogoTitle: selectedItem.id})
        this.activeKeys = this.nodeReaderPrimissionForm.length-1

      }else if(action == 'remove'){
        // const length = this.nodeReaderPrimissionForm.length
        // if(length == 1){
        //   this.$message.warning('至少保留一个')
        //   return false
        // }
        if(this.nodeReaderPrimissionForm[targetKey].id){
          this.deleteIdsVo.readPrimissionIds.push(this.nodeReaderPrimissionForm[targetKey].id)
        }
        if(this.activeKeys >= targetKey){
          this.activeKeys = (this.activeKeys-1 >= 0) ? (this.activeKeys-1) : 0
        }
        this.nodeReaderPrimissionForm.splice(targetKey,1)
        this.showTypes.splice(targetKey,1)
      }
    },
    editCondit(targetKey, action){
      if(action == 'add'){
        this.nodeRouteConditionListForm.push({
          field:'',
          conditions:'',
          conditionValue:'',
          realation:'0',
          type:'1'
        })
        this.activeKeyCondit = this.nodeRouteConditionListForm.length-1
      }else if(action == 'remove'){
        // const length = this.nodeRouteConditionListForm.length
        // if(length == 1){
        //   this.$message.warning('至少保留一个')
        //   return false
        // }
        if(this.nodeRouteConditionListForm[targetKey].id){
          this.deleteIdsVo.roteConditionIds.push(this.nodeRouteConditionListForm[targetKey].id)
        }
        if(this.activeKeyCondit >= targetKey){
          this.activeKeyCondit = (this.activeKeyCondit-1 >= 0) ? (this.activeKeyCondit-1) : 0
        }
        this.nodeRouteConditionListForm.splice(targetKey,1)
        this.isNormal = (this.nodeRouteConditionListForm[this.activeKeyCondit].type == 1) ? true : false
      }
    },
    changeType(val){
      this.isNormal = (val == 1) ? true : false
      this.$set(this.nodeRouteConditionListForm,this.activeKeyCondit,{type:val})
    },
    tabClickType(val){
      this.activeKeyCondit = val
      this.isNormal = (this.nodeRouteConditionListForm[this.activeKeyCondit].type == 1) ? true : false
    },
    changeNodeTransferConfigs(){
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage()
        // 获取所选对象
        const selectedItem = page.getSelected()[0]
        const nodeTransferConfigs = this.getSaveParams(this.nodeAttributeForm.nodeTransferConfigs)
        console.log(nodeTransferConfigs,this.nodeAttributeForm.nodeTransferConfigs,this.sonNodeProcess,5656)
        page.update(selectedItem.id, {
          nodeTransferConfigs:nodeTransferConfigs
        })
      })
    },
    // 字段改变
    changeFields(){
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage()
        // 获取所选对象
        const selectedItem = page.getSelected()[0]
        page.update(selectedItem.id, {
          nodeRouteConditionList:this.nodeRouteConditionListForm
        })
      })
    },
    // 职位改变
    postChange(){
      const items = ['post','realationCreateUser','role','user','organization']
      this.remainOne(this.nodePrimissionForm[this.activeKey],items[this.showType[this.activeKey]])
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage()
        // 获取所选对象
        const selectedItem = page.getSelected()[0]
        page.update(selectedItem.id, {
          nodePrimissionList:this.nodePrimissionForm
        })
      })
    },
    postChanges(){
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage();
        // 获取所选对象
        const selectedItem = page.getSelected()[0];
        page.update(selectedItem.id, {
          nodeReaderPromissionList:this.nodeReaderPrimissionForm
        })
      })
    },
    delOtherAttr(obj,attrs,index){
      for (let item of attrs) {
        if(obj[index].hasOwnProperty(item)){
          delete obj[index][item]
        }
      }
      return obj
    },
    // 办理类型改变
    handleChange(val){
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage();
        // 获取所选对象
        const selectedItem = page.getSelected()[0];
        const nodePrimissionList = selectedItem.model.nodePrimissionList
        // nodePrimissionList[this.activeKey].dealType = val.target.value

        console.log(val,nodePrimissionList,this.nodePrimissionForm,'handleChange')

        page.update(selectedItem.id, {
          nodePrimissionList:this.nodePrimissionForm
        })
      })
    },
    remainOne(obj,str){
      for(let item of ['organization','realationCreateUser','role','user','post']){
        if(obj.hasOwnProperty(item) && item != str){
          delete obj[item]
        }
      }
      return obj
    },
    // 类型改变
    typeChange(val){
      this.$set(this.showType,this.activeKey,val)
      const _this = this
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage()
        // 获取所选对象
        const selectedItem = page.getSelected()[0]
        page.update(selectedItem.id, {
          nodePrimissionList:_this.nodePrimissionForm
        })
      })
    },
    typeChanges(val){
      this.$set(this.showTypes,this.activeKeys,val)
      const items = ['post','realationCreateUser','role','user','organization']
      const nodeReaderPromissionList = this.remainOne(this.nodeReaderPrimissionForm[this.activeKeys],items[val])
      this.editor.executeCommand(() => {
        // 获取画布
        const page = this.editor.getCurrentPage()
        // 获取所选对象
        const selectedItem = page.getSelected()[0]
        page.update(selectedItem.id, {
          nodeReaderPromissionList:nodeReaderPromissionList
        })
      })
    },
    nodePrimissionTabChange(key){
      this.activeKey = key
    },
    nodeReaderPrimissionTabChange(key){
      this.activeKeys = key
    },
    nodeTabChange(activeKey){
      this.nodeActiveKey = activeKey
      if(activeKey == 2 && this.roleList.length == 0){
        this.getRoleList()
      }
      if(activeKey == 2 && this.userList.length == 0){
        this.getUserList()
      }
      if(activeKey == 2 && this.organList.length == 0){
        this.getOrgainList()
      }
      if(activeKey == 2 && this.postList.length == 0){
        this.getPost()
      }
      if(activeKey == 2 && this.nodePrimissionForm.length){
        this.showType = this.nodePrimissionForm.map(item=>{
          return item.type
        })
      }
      if(activeKey == 2 && this.nodeReaderPrimissionForm.length){
        this.showTypes = this.nodeReaderPrimissionForm.map(item=>{
          return item.type
        })
      }
    },
    // 获取角色列表
    getRoleList(){
      httpAction('/admin/role/getHrSysRoleList',null,'get').then(res=>{
        if(res.code == 200){
          this.roleList = res.data
        }else{
          this.$message.warning(res.msg);
        }
      })
    },
    // 获取用户列表
    getUserList(){
      httpAction('/admin/user/findWxOrganUsers',null,'get').then(res=>{
        if(res.code == 200){
          this.userList = res.data
        }else{
          this.$message.warning(res.msg);
        }
      })
    },
    // 获取组织
    getOrgainList(){
      httpAction('/admin/organizationinfo/getHrOrgTree',null,'get').then(res=>{
        if(res.code == 200){
          this.organList = res.data
        }else{
          this.$message.warning(res.msg);
        }
      })
    },
    // 获取职位
    getPost(){
      httpAction('/admin/dict/getHrSysDictList',null,'get').then(res=>{
        if(res.code == 200){
          this.postList = res.data
        }else{
          this.$message.warning(res.msg);
        }
      })
    },

    // 历史数据
    readHistoryData(){
      const stringData = localStorage.getItem("flowData");
      if (stringData === "" || stringData === "{}" || stringData === null) {
        this.$message.warning("无历史数据");
        return;
      }
      const jsonData = JSON.parse(stringData);
      this.editor.getCurrentPage().read(jsonData);
    },
    // 上传数据
    readUploadData(){
      const uploadButton = document.createElement("input");
      uploadButton.setAttribute("type", "file");
      uploadButton.setAttribute("accept", ".json");
      uploadButton.addEventListener("change", () => {
        console.dir(uploadButton);
        const file = uploadButton.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
          console.log(event);
          const text = JSON.parse(event.target.result);
          console.log(text);
          this.editor.getCurrentPage().read(text);
        };
        fileReader.readAsText(file);
      });
      uploadButton.click();
    },
    // 另存为文件
    saveAsFile(){
      let jsonString = JSON.stringify(this.editor.getCurrentPage().save());
      let blob = new Blob([jsonString]);
      let blobURL = URL.createObjectURL(blob);
      let downloadLink = document.createElement("a");
      downloadLink.download = "数据.json";
      downloadLink.href = blobURL;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      URL.revokeObjectURL(blobURL);
      document.body.removeChild(downloadLink);
    },
    // 另存为图片
    openSaveAsImageDialog(){

    },
    // 开启/关闭网格对齐
    toggleGridShowStatus(e) {
      if (e.target.checked) {
        this.editor.getCurrentPage().showGrid();
      } else {
        this.editor.getCurrentPage().hideGrid();
      }
    },
    // 调用父组件保存
    save(source) {
      let res = this.validateFields(source)
      if(res.flag){
        let data = this.formatData(source)
        this.$emit('onSave', data)
      }else{
        this.$message.warning(res.msg)
      }
    },
    // 字段验证
    validateFields(fields){
      if(Object.keys(fields).length === 0){
        return { flag: true, msg: '至少保留一个节点' }
      }
      let nodeField = Object.keys(this.rules[0])
      let edgeField = Object.keys(this.rules[1])

      for(let item of fields.nodes){
        for(let items of nodeField){
          if( (items != 'width') && (items != 'height') && (item[items] == undefined || item[items] == "")){
            return {flag:false,msg:this.rules[0][items].message}
          }
          if(item.size){
            let temp = item.size.split("*")
            if(!temp[0] || !temp[1]){
              return {flag:false,msg:'节点宽高必填'}
            }
          }
        }
      }
      if(fields.edges){
        for(let item of fields.edges){
          for(let items of edgeField){
            if(item[items] == undefined || item[items] == ""){
              return {flag:false,msg:this.rules[1][items].message}
            }
          }
        }
      }
      return {flag:true}
    },
    getNodePermisionId(id,field){
      const res = this.dataSource.nodes.find(item=>item.id == id)
      if(res){
        const result = res[field].find(item=>item.nodeLogoTitle == id)
        if(result){
          return result.id
        }else{
          return undefined
        }
      }else{
        return undefined
      }
    },
    // 数据映射
    formatData(data){
      const _this = this
      let res = {
        processNodeList:[],
        nodeRouteList:[],
        processId:this.id,
        deleteIdsVo:this.deleteIdsVo
      }
      res.processNodeList = !data.nodes ? [] : data.nodes.map((item)=>{
        let nodePrimissionList = []
        let nodeReaderPromissionList = []
        if(item.nodePrimissionList){
          nodePrimissionList = item.nodePrimissionList.map(items=>{
            if(items.type != undefined){
              const res1 = _this.getNodePermisionId(items.nodeLogoTitle,'nodePrimissionList')
              console.log(res1)
              return {
                nodeLogoTitle:item.id,
                id: items.id || res1,
                logoTitle:(item.id+'1'),
                dealType:items.dealType,
                organization:items.organization || undefined,
                post:items.post || undefined,
                realationCreateUser:items.realationCreateUser || undefined,
                role:items.role || undefined,
                type:items.type,
                user:items.user || undefined,
                processId:this.id,
              }
            }else{
              return
            }
          })
        }
        if(item.nodeReaderPromissionList){
          nodeReaderPromissionList = item.nodeReaderPromissionList.map(items=>{
            if(items.type != undefined){
              const res2 = _this.getNodePermisionId(items.nodeLogoTitle,'nodeReaderPromissionList')
              return {
                nodeLogoTitle:item.id,
                logoTitle:item.id+'1',
                id: items.id || res2,
                dealType:items.dealType,
                organization:items.organization,
                post:items.post,
                realationCreateUser:items.realationCreateUser,
                role:items.role,
                type:items.type,
                user:items.user,
                processId:this.id,
              }
            }else{
              return
            }
          })
        }
        
        return {
          name:item.label,
          coordinatex:item.x,
          coordinatey:item.y,
          type:item.nodetype,
          logoTitle:item.id,
          shape:item.shape,
          size:item.size,
          id:item.tid,
          handleAllowNext:item.handleAllowNext,
          description:item.description,
          countersign:item.countersign,
          processId:this.id,
          color:item.color,
          backType:item.backType,
          allowThis:item.allowThis,
          allowDispatch:item.allowDispatch,
          nodeTransferConfigs:item.nodeTransferConfigs,
          nodePrimissionList:nodePrimissionList,
          nodeReaderPromissionList:nodeReaderPromissionList
        }
      })
      res.nodeRouteList = (data.edges) ? data.edges.map((item)=>{
        return {
          name:item.label,
          prewNode:item.source,
          preNodeAnchor:item.sourceAnchor,
          nextNode:item.target,
          nextNodeAnchor:item.targetAnchor,
          logoTitle:(String(item.id).length>15) ? item.logoTitle : item.id,
          id:(String(item.id).length>15) ? item.id : undefined,
          processId:this.id,
          description:item.description,
          opinion:item.opinion,
          opinionMustFlag:item.opinionMustFlag,
          priorityFlag:item.priorityFlag,
          routeType:item.routeType,
          sameForPrew:item.sameForPrew,
          sequenceNo:item.sequenceNo,
          shape:item.shape || line,
          timeoutRoam:item.timeoutRoam,
          nodeRouteConditionList:item.nodeRouteConditionList
        }
      }) : []
      return res
    },
  }
};
</script>

<style lang="less" scoped>
@backgroundColor: #fbfbfb;
@borderColor: #dadce0;

@itempannelAndPageBorder: 1px solid #ccc;
@pageHeight: calc(100vh - 41px - 37px);
/deep/ .ant-tabs{
  overflow: inherit;
}
.formStyle .ant-form-item {
  margin-right: 0px;
  width: 100%;
  // display:flex;
}
.formStyle {
  :global(.ant-form-item-label) {
    min-width: 80px;
  }
  :global(.ant-form-item-label label) {
    font-size: 12px !important;
  }

  :global(input) {
    width: 150px;
    font-size: 12px !important;
    height: 26px;
  }
  :global(.ant-select) {
    width: 150px;
    font-size: 12px !important;
    height: 26px;
  }
  :global(.ant-select .ant-select-selection--single) {
    height: 26px;
  }
  :global(.ant-select .ant-select-selection__rendered) {
    line-height: 26px;
  }
  :global(.ant-radio-group label) {
    font-size: 12px !important;
  }
}
.m-colorPicker .box.open {
  z-index: 999;
}

body {
  margin: 0;
  overflow: hidden;
}
.ant-form-inline .ant-form-item-with-help {
  margin-bottom: 0px;
}
#vue-g6-editor {
  header:nth-of-type(1) {
    background: @backgroundColor;
    line-height: 40px;
    padding-left: 20px;
    border-bottom: 1px solid @borderColor;
    box-sizing: border-box;
  }
  // 工具栏
  #toolbar {
    background: @backgroundColor;
    border-bottom: 1px solid @borderColor;
    padding: 4px 14px;
    i {
      font-size: 18px;
      padding: 4px;
      margin-right: 8px;
      color: #999999;
      &:hover {
        cursor: pointer;
        background-color: #eeeeee;
        color: #5cb6ff;
      }
    }
  }
  // 元素面板
  #itempannel {
    box-sizing: border-box;
    background-color: @backgroundColor;
    border-right: 1px solid @borderColor;
    height: @pageHeight;
    padding-top: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;
    .getItem {
      cursor: move;
      width: 80px;
      margin-bottom: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
      }
    }
  }
  // 主画布
  #page {
    height: @pageHeight;
    canvas {
      // 去除canvas底部间隙
      display: block;
      width: 100%;
    }
  }
  // 右侧部分（属性栏 + 缩略图）
  .right-part {
    height: @pageHeight;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  // 属性栏
  #detailpannel {
    flex-grow: 1;

    background-color: @backgroundColor;
    border-left: 1px solid @borderColor;
    overflow-y: scroll;
    #nodeAttributeBar,
    #edgeAttributeBar,
    #groupAttributeBar,
    #canvasAttributeBar,
    #multiAttributeBar {
      .title {
        height: 34px;
        line-height: 34px;
        text-align: center;
        box-sizing: border-box;
        font-weight: bold;
        font-size: 13px;
        border-width: 0 0 1px 0;
        border-style: solid;
        border-color: @borderColor;
      }
      .main {
        padding: 10px;
      }
    }
  }
  // 缩略图
  #minimap {
    background-color: @backgroundColor;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    .title {
      height: 34px;
      line-height: 34px;
      text-align: center;
      box-sizing: border-box;
      font-weight: bold;
      font-size: 13px;
      border-width: 0 0 1px 0;
      border-style: solid;
      border-color: @borderColor;
    }
  }
  // 右键菜单
  #contextmenu {
    display: none;
    .menu {
      /deep/ .ant-btn {
        width: 100%;
        display: block;
        margin-left: 0;
        border-radius: 0 !important;
        border-bottom: none;
        &:nth-last-of-type(1) {
          border-bottom: 1px solid #dcdfe6;
        }
      }
      /deep/ .ant-btn:hover {
        border-bottom: 1px solid #40a9ff;
      }
    }
  }
  // 下载图片弹窗
  .save-as-image-dialog {
    /deep/ .a-select {
      display: block;
    }
  }
}
</style>
