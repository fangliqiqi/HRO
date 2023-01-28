/**
 * 单位部门字典值替换文本通用方法
 * @param dictOptions  字典数组
 * @param text  字典值
 * @return String
 */
export function filterOrganDict(dictOptions, text) {
  let re = "";
  if (dictOptions.length > 0) {
    for (let i = 0; i < dictOptions.length; i++) {
      if (text == dictOptions[i].id) {
        re = dictOptions[i].description;
      }
    }
  }
  return re;
}
export function filterOrganDict1(dictOptions, text) {
  let re = "";
  if (dictOptions.length > 0) {
    for (let i = 0; i < dictOptions.length; i++) {
      if (text == dictOptions[i].id) {
        re = dictOptions[i].organName;
      }
    }
  }
  return re;
}

/**
 * 单位部门字典值替换文本通用方法
 * @param dictOptions  字典数组
 * @param text  字典值
 * @return String
 */
export function filterOrgan(dictOptions, text) {
  let re = "-";
  if (dictOptions.length > 0) {
    for (let i = 0; i < dictOptions.length; i++) {
      if (text == dictOptions[i].id) {
        re = dictOptions[i].organName;
      }
    }
  }
  return re;
}

/**
 * 过滤皖信用户字典数据
 * @param sysUsers
 * @param text
 */
export function filterWxSysUserDict (sysUsers, text) {
  let re = "-";
  if (sysUsers.length > 0) {
    for (let i = 0; i < sysUsers.length; i++) {
      if (Number(text) == sysUsers[i].userId) {
        re = sysUsers[i].nickname;
      }
    }
  }
  return re;
}

export function filterSysUserDict(dictOptions, text) {
  return dictOptions["" + text + ""];
}

/**
 * 客户合同字典值替换文本
 * @param dictOptions  字典数组
 * @param text  字典值
 * @return String
 */
export function filterCustomerContractDict(dictOptions, text) {
  let re = "-";
  if (dictOptions.length > 0) {
    for (let i = 0; i < dictOptions.length; i++) {
      if (text == dictOptions[i].CONTRACT_ID) {
        re = dictOptions[i].CONTRACT_NAME;
      }
    }
  }
  return re;
}

/**
 * 客户合同字典值替换文本
 * @param dictOptions  字典数组
 * @param text  字典值
 * @return String
 */
export function filterCustomerDict(dictOptions, text) {
  let re = "-";
  if (dictOptions.length > 0) {
    for (let i = 0; i < dictOptions.length; i++) {
      if (text == dictOptions[i].CUSTOMER_ID) {
        re = dictOptions[i].CUSTOMER_NAME;
      }
    }
  }
  return re;
}