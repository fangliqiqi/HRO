import { getAction, deleteAction, putAction, postAction } from '@/api/manage'


//角色管理
const addRole = (params) => postAction("/sys/role/add", params);
const editRole = (params) => putAction("/sys/role/edit", params);
const checkRoleCode = (params) => getAction("/sys/role/checkRoleCode", params);
const queryall = (params) => getAction("/sys/role/queryall", params);

//区划管理
const areaTrees = (params) => getAction("/hrBase/sysarea/tree", params);
const areaMapTrees = (params) => getAction("/hrBase/sysarea/getAreaMap", params);

const areaSelectByType = (params) => getAction("/hrBase/sysarea/getAreaByType", params);

//用户管理
const addUser = (params) => postAction("/sys/user/add", params);
const editUser = (params) => putAction("/sys/user/edit", params);
const queryUserRole = (params) => getAction("/sys/user/queryUserRole", params);
const getUserList = (params) => getAction("/sys/user/list", params);
const frozenBatch = (params) => putAction("/sys/user/frozenBatch", params);
//验证用户账号是否唯一
const checkUsername = (params) => getAction("/sys/user/checkOnlyUser", params);
//改变密码
const changPassword = (params) => putAction("/sys/user/changPassword", params);
//获取对应权限的系统用户
const getPermissionUser = (params) => getAction("/admin/user/findUserBypPrmission", params);

//权限管理
const addPermission = (params) => postAction("/sys/permission/add", params);
const editPermission = (params) => putAction("/sys/permission/edit", params);
const getPermissionList = (params) => getAction("/sys/permission/list", params);
const queryTreeList = (params) => getAction("/sys/permission/queryTreeList", params);
const queryTreeListForRole = (params) => getAction("/sys/role/queryTreeList", params);
const queryListAsync = (params) => getAction("/sys/permission/queryListAsync", params);
const queryRolePermission = (params) => getAction("/sys/permission/queryRolePermission", params);
const saveRolePermission = (params) => postAction("/sys/permission/saveRolePermission", params);
const queryPermissionsByUser = (params) => getAction("/admin/menu/vue", params);
const loadAllRoleIds = (params) => getAction("/sys/permission/loadAllRoleIds", params);
const getPermissionRuleList = (params) => getAction("/sys/permission/getPermRuleListByPermId", params);
const queryPermissionRule = (params) => getAction("/sys/permission/queryPermissionRule", params);

// 部门管理
const queryDepartTreeList = (params) => getAction("/sysdepart/sysDepart/queryTreeList", params);
const queryIdTree = (params) => getAction("/sysdepart/sysDepart/queryIdTree", params);
const queryParentName = (params) => getAction("/sysdepart/sysDepart/queryParentName", params);
const searchByKeywords = (params) => getAction("/sysdepart/sysDepart/searchBy", params);
const deleteByDepartId = (params) => deleteAction("/sysdepart/sysDepart/delete", params);

//日志管理
const deleteLog = (params) => deleteAction("/sys/log/delete", params);
const deleteLogList = (params) => deleteAction("/sys/log/deleteBatch", params);

//数据字典
const addDict = (params) => postAction("/sys/dict/add", params);
const editDict = (params) => putAction("/sys/dict/edit", params);
const treeList = (params) => getAction("/sys/dict/treeList", params);
const addDictItem = (params) => postAction("/sys/dictItem/add", params);
const editDictItem = (params) => putAction("/sys/dictItem/edit", params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params) => getAction(`/admin/dict/itemType/${code}`, params);

//系统通告
const doReleaseData = (params) => getAction("/sys/annountCement/doReleaseData", params);
const doReovkeData = (params) => getAction("/sys/annountCement/doReovkeData", params);
//获取系统访问量
const getLoginfo = (params) => getAction("/admin/user/countUser", params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params) => getAction("/sys/user/queryUserByDepId", params);

// 查询用户角色表里的所有信息
const queryUserRoleMap = (params) => getAction("/sys/user/queryUserRoleMap", params);
// 重复校验
const duplicateCheck = (params) => getAction("/sys/duplicate/check", params);
// 根据权限获取结算主体和所属单位
const getSettleDomainSelectVos = (params) => getAction("/hrBase/tsettledomain/getSettleDomainSelectVosArray", params);
// 获取所有结算主体和所属单位
const getAllSettleDomainSelectVos = (params) => getAction("/hrBase/tsettledomain/selectAllSettleDomainSelectVos", params);
// 根据用户结算主体
const getSettlementAuthorityByUser = (params) => getAction("/hrBase/tsettledomain/getSettleDomainSelectVos", params);
// 获取登录用户所有员工数据的接口
const getSelectEmployeesByUser = (params) => getAction("/hrBase/temployeeinfo/getSelectEmployeesByUser", params);
// 获取单位（皖信单位）
const getOrganization = (params) => getAction("/admin/organizationinfo/getOrgForCus", params);
// 获取单位社保、公积金户
const getHouseHold = (params) => getAction("hrSocial/syshouseholdinfo/getAllHouseHoldInfo", params);
// 获取登录用户拥有结算主体权限的单位信息（包含结算主体）
const getUnitSelectVos = (params) => getAction("/hrBase/tsettledomain/getUnitSelectVos", params);

export {
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryall,
  frozenBatch,
  checkUsername,
  changPassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  queryUserByDepId,
  queryUserRoleMap,
  duplicateCheck,
  queryTreeListForRole,
  areaTrees,
  areaMapTrees,
  areaSelectByType,
  getPermissionUser,
  getSettleDomainSelectVos,
  getAllSettleDomainSelectVos,
  getSettlementAuthorityByUser,
  getSelectEmployeesByUser,
  getOrganization,
  getUnitSelectVos,
  getHouseHold,
}



