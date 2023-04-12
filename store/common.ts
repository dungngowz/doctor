import { BreadcrumbType } from '@/types'
import { atom } from 'recoil'

/* Creating a state with the key `openModalSearch` and the default value is `false` */
export const openModalSearchState = atom<boolean>({
  key: 'openModalSearch',
  default: false,
})

/* Creating a state with the key `openModalDetail` and the default value is `false` */
export const openModalDetailState = atom<boolean>({
  key: 'openModalDetail',
  default: false,
})

/* Creating a state with the key `openModalDeleteState` and the default value is `false` */
export const openModalDeleteState = atom<boolean>({
  key: 'openModalDelete',
  default: false,
})

/* Creating a state with the key `openModalDenied` and the default value is `false` */
export const openModalDeniedState = atom<boolean>({
  key: 'openModalDenied',
  default: false,
})

export const breadcrumbsState = atom<BreadcrumbType | any>({
  key: 'breadcrumbsState',
  default: [],
})

export const openSidebarState = atom<BreadcrumbType | any>({
  key: 'openSidebarState',
  default: false,
})

export const roleState = atom<'admin' | 'business' | 'accountant' | 'coordinate' | 'driver'>({
  key: 'roleState',
  default: 'admin',
})

export const canUpdateStatusState = atom<boolean>({
  key: 'canUpdateStatusState',
  default: false,
})

export const canUpdateInfoGeneralState = atom<boolean>({
  key: 'canUpdateInfoGeneralState',
  default: false,
})
