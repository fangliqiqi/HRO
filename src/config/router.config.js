import { UserLayout, BlankLayout } from '@/components/layouts'
/**
 * 走菜单，走权限控制
 * @type {[null,null]}
 */
export const asyncRouterMap = []

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },
  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/pdf',
    component: BlankLayout,
    redirect: '/pdf/download',
    children: [
      {
        path: 'download',
        name: 'download',
        component: () => import('@/views/pdf/download')
      },
      {
        path: 'enginedownload',
        name: 'enginedownload',
        component: () => import('@/views/pdf/enginedownload')
      },
      {
        path: 'billingpdf',
        name: 'billingpdf',
        component: () => import('@/views/pdf/billingpdf')
      },
      {
        path: 'nopersonbillingpdf',
        name: 'nopersonbillingpdf',
        component: () => import('@/views/pdf/nopersonbillingpdf')
      },
      {
        path: 'engineBillingpdf',
        name: 'engineBillingpdf',
        component: () => import('@/views/pdf/engineBillingpdf')
      },
      {
        path: 'financialbillspdf',
        name: 'financialbillspdf',
        component: () => import('@/views/pdf/financialbillspdf')
      },
      {
        path: 'salaryprove', //工资证明
        name: 'salaryprove',
        component: () => import('@/views/pdf/salaryprove')
      },
      {
        path: 'insurancesettementdetail', //商险结算单导出
        name: 'InsuranceSettementDetail',
        component: () => import('@/views/pdf/InsuranceSettementDetailPrint')
      },
      {
        path: 'insurancescandetail', //商险扫描导出
        name: 'InsuranceScanDetail',
        component: () => import('@/views/pdf/InsuranceScanDetailPrint')
      },
      {
        path: 'insuranceforecastdetail', //商险扫描导出
        name: 'InsuranceForecastDetail',
        component: () => import('@/views/pdf/InsuranceForecastDetail')
      },
      {
        path: 'SocialApprovalSalaryDetailPrintf',
        name: 'SocialApprovalSalaryDetailPrintf',
        component: () => import('@/views/pdf/SocialApprovalSalaryDetailPrintf')
      },
      {
        path: 'FundApprovalSalaryDetailPrintf',
        name: 'FundApprovalSalaryDetailPrintf',
        component: () => import('@/views/pdf/FundApprovalSalaryDetailPrintf')
      },
      {
        path: 'salaryFail',
        name: 'salaryFail',
        component: () => import('@/views/pdf/salaryFail')
      },
      {
        path: 'billingsalarypause',
        name: 'billingsalarypause',
        component: () => import('@/views/pdf/billingsalarypause')
      },
      {
        path: 'enginebillingpause',
        name: 'enginebillingpause',
        component: () => import('@/views/pdf/enginebillingpause')
      },
      // 普通薪资暂停发批量发放
      {
        path: 'billingpausebatch',
        name: 'billingpausebatch',
        component: () => import('@/views/pdf/billingpausebatch')
      },
      // 工程薪资暂停发批量发放
      {
        path: 'enginepausebatch',
        name: 'enginepausebatch',
        component: () => import('@/views/pdf/enginepausebatch')
      },
      {
        path: 'diysalarypause',
        name: 'diysalarypause',
        component: () => import('@/views/pdf/diysalarypause')
      },
      {
        path: 'diyonepause',
        name: 'diyonepause',
        component: () => import('@/views/pdf/diyonepause')
      },
      {
        path: 'BusinessOutSroucingSettleBillPrintf',
        name: 'BusinessOutSroucingSettleBillPrintf',
        component: () => import('@/views/pdf/BusinessOutSroucingSettleBillPrintf')
      },
      {
        path: 'nopersonnelsettlementprintf',
        name: 'opersonnelSettlementPrintf',
        component: () => import('@/views/pdf/nopersonnelSettlementPrintf')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
