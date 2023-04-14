import { atom } from 'recoil'
import { DepartmentPermissionsType, DepartmentType } from './type'

export const departmentListState = atom<DepartmentType[]>({
  key: 'departmentListState',
  default: [],
})

/* Creating a state with the key `postActive` and the default value is `null`. */
export const departmentActiveState = atom<DepartmentType | null>({
  key: 'departmentActiveState',
  default: null,
})

export const departmentPermissionsState = atom<DepartmentPermissionsType[]>({
  key: 'departmentPermissionsState',
  default: [],
})

export const departmentTotalPermissionsState = atom<number>({
  key: 'departmentTotalPermissionsState',
  default: 0,
})
