import { httpAction } from '@/api/manage'

/**
 * 
 *  业务类型
 * @param id 结算主体id
 */

export async function  getBusinessType(id){
  let res =  await httpAction(`hrBase/tsettledomain/getBusinessTypeById/${id}`,'','GET')
  if(res.code==200){
    return res.data
  }
  return 
}